import React, { useEffect, useState } from 'react' // tambahkan useEffect, useState
import { Box, Button, Divider, Flex, Group, Modal, Progress, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaMinus, FaXmark } from 'react-icons/fa6'
import { BiWindows } from 'react-icons/bi'
import classes from './titleBar.module.css'
import { TbCloudDownload } from 'react-icons/tb'

export const Titlebar: React.FC = () => {
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false)
  const [openedProgress, setOpenedProgress] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleMinimize = (): void => window.electron.ipcRenderer.send('window:minimize')
  const handleMaximize = (): void => window.electron.ipcRenderer.send('window:maximize')
  const handleClose = (): void => {
    openConfirm()
  }
  const confirmClose = (): void => {
    window.electron.ipcRenderer.send('window:close')
    closeConfirm()
  }

  // Listen for download progress from main process
  useEffect(() => {
    const handleProgress = (_event: unknown, percent: number): void => {
      setDownloadProgress(percent)
      setOpenedProgress(true)
      if (percent >= 100) {
        setTimeout(() => setOpenedProgress(false), 2000)
      }
    }

    window.electron.ipcRenderer.on('update:download-progress', handleProgress)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('update:download-progress')
    }
  }, [])

  return (
    <Box bg="blue.8" className={classes.header}>
      <header>
        <Flex justify="space-between" py={5} align="center" h="100%">
          <Group>
            <Text color="white" size="sm" ps={10}>
              Quickrun Studio
            </Text>
            <Button
              onClick={() => window.electron.ipcRenderer.send('check-for-updates')}
              className={classes.buttons}
              leftSection={<TbCloudDownload />}
              size="compact-sm"
              me={20}
            >
              <Text fz={'sm'} fw={500}>
                Update
              </Text>
            </Button>
          </Group>
          <Flex className={classes.buttons}>
            <Button onClick={handleMinimize} variant="filled" c="white" bg="blue.8" bd={0}>
              <FaMinus />
            </Button>
            <Button onClick={handleMaximize} variant="filled" c="white" bg="blue.8" bd={0}>
              <BiWindows />
            </Button>
            <Button onClick={handleClose} variant="filled" c="white" bg="blue.8" bd={0}>
              <FaXmark />
            </Button>
          </Flex>
        </Flex>
      </header>

      {/* Modal Konfirmasi Close */}
      <Modal opened={openedConfirm} onClose={closeConfirm} title="Konfirmasi Keluar">
        <Text>Apakah kamu ingin keluar aplikasi?</Text>
        <Divider my="md" />
        <Flex justify="flex-end" gap="md">
          <Button variant="default" onClick={closeConfirm}>
            Tidak
          </Button>
          <Button color="red" onClick={confirmClose}>
            Ya
          </Button>
        </Flex>
      </Modal>

      {/* Modal Progress Update */}
      <Modal opened={openedProgress} onClose={() => setOpenedProgress(false)} title="Mengunduh Pembaruan..." centered>
        <Text mb="sm">Update sedang diunduh...</Text>
        <Progress value={downloadProgress} striped animated />
        <Text mt="sm" size="sm">
          {downloadProgress.toFixed(1)}%
        </Text>
      </Modal>
    </Box>
  )
}
