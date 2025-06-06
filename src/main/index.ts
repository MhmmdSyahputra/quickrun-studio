import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1007,
    minHeight: 641,
    show: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // sperti ini pemanggilannya di main process
  ipcMain.on('run-command', (_event, command: string) => {
    // if (!command.startsWith('code ')) return // misalnya hanya izinkan command vscode
    const script = spawn(command, { shell: true })
    console.log('asd')

    script.stdout.on('data', (data) => console.log(data.toString()))
    script.stderr.on('data', (err) => console.error(err.toString()))
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle window actions
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(false)
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
      mainWindow.setFullScreen(true)
    }
  }
})

// Event dari tombol "Cek Update"
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates()
})

// Konfigurasi auto update
autoUpdater.autoDownload = false

autoUpdater.on('update-available', () => {
  dialog
    .showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update tersedia',
      message: 'Versi baru tersedia. Mau download sekarang?',
      buttons: ['Ya', 'Nanti']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
})

autoUpdater.on('update-downloaded', () => {
  dialog
    .showMessageBox(mainWindow, {
      title: 'Update Siap',
      message: 'Update telah diunduh. Aplikasi akan restart untuk update.'
    })
    .then(() => {
      autoUpdater.quitAndInstall()
    })
})

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
