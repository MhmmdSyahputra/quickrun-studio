import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      runCommand: (command: string) => void
      onUUIDResponse: (callback: (data: string) => void) => void
    }
  }
}
