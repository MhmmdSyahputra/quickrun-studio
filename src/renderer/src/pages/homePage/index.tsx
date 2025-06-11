import {
  Grid,
  Title,
  Text,
  Box,
  TextInput,
  ActionIcon,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Tooltip,
  SimpleGrid
} from '@mantine/core'
import { CustomScrollbar } from '@renderer/components/customScrollbar/scrollBar'
import React, { useEffect, useState } from 'react'
import { TbPlaylistAdd, TbPlus, TbEdit, TbTrash, TbCheck, TbX, TbPlayerPlay } from 'react-icons/tb'

interface CommandEntry {
  id: string
  label: string
  command: string
}

interface CommandGroup {
  id: string
  groupName: string
  entries: CommandEntry[]
}

const STORAGE_KEY = 'command-groups'

export const HomePage: React.FC = () => {
  const [groups, setGroups] = useState<CommandGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [newGroupName, setNewGroupName] = useState('')
  const [label, setLabel] = useState('')
  const [command, setCommand] = useState('')
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [tempGroupName, setTempGroupName] = useState('')
  const [tempEntry, setTempEntry] = useState<{ label: string; command: string }>({
    label: '',
    command: ''
  })
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState<string | null>(null)
  const [showDeleteEntryModal, setShowDeleteEntryModal] = useState<{
    groupId: string
    entryId: string
  } | null>(null)

  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null)
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  }, [groups])

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id)
    }
  }, [groups, selectedGroup])

  const addGroup = (): void => {
    if (!newGroupName.trim()) return
    const newGroup: CommandGroup = {
      id: Date.now().toString(),
      groupName: newGroupName.trim(),
      entries: []
    }
    setGroups([...groups, newGroup])
    setNewGroupName('')
    setSelectedGroup(newGroup.id)
  }

  const addEntry = (groupId: string): void => {
    if (!label.trim() || !command.trim()) return

    const newEntry: CommandEntry = {
      id: Date.now().toString(),
      label: label.trim(),
      command: command.trim()
    }

    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, entries: [...group.entries, newEntry] } : group
      )
    )
    setLabel('')
    setCommand('')
  }

  const confirmRemoveEntry = (groupId: string, entryId: string): void => {
    const entry = groups.find((g) => g.id === groupId)?.entries.find((e) => e.id === entryId)
    if (!entry) return
    console.log('asd')

    setShowDeleteEntryModal({ groupId, entryId })
  }

  const removeGroup = (groupId: string): void => {
    setDeletingGroupId(groupId)
    setTimeout(() => {
      setGroups(groups.filter((group) => group.id !== groupId))
      if (selectedGroup === groupId) {
        setSelectedGroup(groups.length > 1 ? groups[0].id : null)
      }
      setShowDeleteGroupModal(null)
      setDeletingGroupId(null)
    }, 300) // Durasi animasi
  }

  const removeEntry = (groupId: string, entryId: string): void => {
    setDeletingEntryId(entryId)
    setTimeout(() => {
      setGroups(
        groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                entries: group.entries.filter((e) => e.id !== entryId)
              }
            : group
        )
      )
      setShowDeleteEntryModal(null)
      setDeletingEntryId(null)
    }, 300) // Durasi animasi
  }

  const confirmRemoveGroup = (groupId: string): void => {
    setShowDeleteGroupModal(groupId)
  }

  const runGroup = (groupId: string): void => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return
    group.entries.forEach((entry) => {
      window.electron.ipcRenderer.send('run-command', entry.command)
    })
  }

  const runEntry = (command: string): void => {
    window.electron.ipcRenderer.send('run-command', command)
  }

  const startEditingGroup = (groupId: string, currentName: string): void => {
    setEditingGroupId(groupId)
    setTempGroupName(currentName)
  }

  const saveGroupName = (groupId: string): void => {
    if (!tempGroupName.trim()) return

    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, groupName: tempGroupName.trim() } : group
      )
    )
    setEditingGroupId(null)
  }

  const startEditingEntry = (entry: CommandEntry): void => {
    setEditingEntryId(entry.id)
    setTempEntry({
      label: entry.label,
      command: entry.command
    })
  }

  const saveEntry = (groupId: string, entryId: string): void => {
    if (!tempEntry.label.trim() || !tempEntry.command.trim()) return

    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              entries: group.entries.map((e) =>
                e.id === entryId
                  ? { ...e, label: tempEntry.label.trim(), command: tempEntry.command.trim() }
                  : e
              )
            }
          : group
      )
    )
    setEditingEntryId(null)
  }

  const selectedGroupData = groups.find((group) => group.id === selectedGroup)
  const groupToDelete = showDeleteGroupModal
    ? groups.find((g) => g.id === showDeleteGroupModal)
    : null

  return (
    <div style={{ padding: '1.3rem', height: 'calc(100vh - 4rem)', overflowY: 'hidden' }}>
      <Grid>
        <Grid.Col
          span={5}
          p="xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            height: 'calc(100vh - 4.5rem)'
          }}
        >
          {/* Header Section */}
          <Box mb="xl">
            <Title order={2} mb="xs">
              Command Center
            </Title>
            <Text size="sm" c="dimmed">
              Manage your project command groups and shortcuts
            </Text>
          </Box>

          {/* Add Group Form */}
          <Paper
            p="md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}
          >
            <Box mb="sm">
              <TextInput
                placeholder="Tambah Grup Baru (Contoh: Backend)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                rightSection={
                  <ActionIcon color="blue" onClick={addGroup}>
                    <TbPlaylistAdd size={16} />
                  </ActionIcon>
                }
              />
            </Box>
          </Paper>

          {/* Projects Grid */}
          <Title order={4} mb="md">
            My Projects
          </Title>
          <CustomScrollbar
            style={{ height: 'calc(90vh - 15rem)', paddingRight: 8, paddingBottom: 25 }}
          >
            {groups.length === 0 ? (
              <Paper
                p="lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}
              >
                <Text c="dimmed" size="sm">
                  No groups yet. Create your first group above.
                </Text>
              </Paper>
            ) : (
              <SimpleGrid cols={3} spacing="lg" verticalSpacing="lg">
                {groups.map((group) => (
                  <Paper
                    key={group.id}
                    p="xs"
                    style={{
                      cursor: 'pointer',
                      borderRadius: '12px',
                      border:
                        selectedGroup === group.id
                          ? '2px solid #228be6'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor:
                        selectedGroup === group.id
                          ? 'rgba(34, 139, 230, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.3s ease-out',
                      transform: deletingGroupId === group.id ? 'scale(0.9)' : 'scale(1)',
                      opacity: deletingGroupId === group.id ? 0 : 1,
                      ':hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.06)'
                      }
                    }}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    {/* Group Icon */}
                    <Box
                      bg={selectedGroup === group.id ? 'blue.7' : 'blue.6'}
                      p="md"
                      c="white"
                      h="80px"
                      style={{
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}
                    >
                      <Title order={2} style={{ textTransform: 'uppercase' }}>
                        {group.groupName.substring(0, 2)}
                      </Title>
                    </Box>

                    {/* Group Name and Actions */}
                    <Group>
                      {editingGroupId === group.id ? (
                        <TextInput
                          value={tempGroupName}
                          onChange={(e) => setTempGroupName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveGroupName(group.id)}
                          size="xs"
                          autoFocus
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <Text
                          size="sm"
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {group.groupName}
                        </Text>
                      )}

                      <Group>
                        {editingGroupId === group.id ? (
                          <>
                            <ActionIcon
                              color="green"
                              size="sm"
                              variant="light"
                              onClick={() => saveGroupName(group.id)}
                            >
                              <TbCheck size={14} />
                            </ActionIcon>
                            <ActionIcon
                              color="gray"
                              size="sm"
                              variant="light"
                              onClick={() => setEditingGroupId(null)}
                            >
                              <TbX size={14} />
                            </ActionIcon>
                          </>
                        ) : (
                          <>
                            <ActionIcon
                              color="yellow"
                              size="sm"
                              variant="subtle"
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditingGroup(group.id, group.groupName)
                              }}
                            >
                              <TbEdit size={14} />
                            </ActionIcon>
                            <ActionIcon
                              color="red"
                              size="sm"
                              variant="subtle"
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmRemoveGroup(group.id)
                              }}
                              style={{ transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              <TbTrash size={14} />
                            </ActionIcon>
                          </>
                        )}
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            )}
          </CustomScrollbar>
        </Grid.Col>

        <Grid.Col
          span={7}
          p="xl"
          style={{
            borderRadius: '16px',
            backgroundColor: 'rgba(26, 32, 44, 0.95)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 'calc(100vh - 4.5rem)'
          }}
        >
          {selectedGroupData ? (
            <>
              {/* Header with Run All button */}
              <Group mb="lg">
                <Title order={3} c="white">
                  {selectedGroupData.groupName}
                </Title>
                <Button
                  variant="light"
                  color="teal"
                  size="sm"
                  onClick={() => runGroup(selectedGroupData.id)}
                >
                  Run All
                </Button>
              </Group>

              {/* Add Command Button */}
              <Box mb="xl" style={{ textAlign: 'right' }}>
                <Button
                  leftSection={<TbPlus size={18} />}
                  variant="filled"
                  color="blue"
                  size="sm"
                  onClick={() => {
                    setLabel('')
                    setCommand('')
                    setShowAddModal(true)
                  }}
                >
                  Add Command
                </Button>
              </Box>
              <CustomScrollbar
                style={{
                  maxHeight: 'calc(100vh - 16rem)',
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingBottom: 12,
                  overflowX: 'hidden'
                }}
              >
                {/* Commands List */}
                {selectedGroupData.entries.length === 0 ? (
                  <Paper
                    p="lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}
                  >
                    <Text c="dimmed" size="sm">
                      No commands yet. Click Add Command to get started.
                    </Text>
                  </Paper>
                ) : (
                  <Stack>
                    {selectedGroupData.entries.map((entry) => (
                      <Paper
                        key={entry.id}
                        p="sm"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease-out',
                          transform: deletingEntryId === entry.id ? 'scale(0.9)' : 'scale(1)',
                          opacity: deletingEntryId === entry.id ? 0 : 1,
                          ':hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.06)'
                          }
                        }}
                      >
                        {editingEntryId === entry.id ? (
                          <Group wrap="wrap" align="flex-end">
                            <TextInput
                              placeholder="Label"
                              value={tempEntry.label}
                              onChange={(e) =>
                                setTempEntry({ ...tempEntry, label: e.target.value })
                              }
                              style={{ flex: 1, minWidth: 0 }}
                            />
                            <TextInput
                              placeholder="Command"
                              value={tempEntry.command}
                              onChange={(e) =>
                                setTempEntry({ ...tempEntry, command: e.target.value })
                              }
                              style={{ flex: 2, minWidth: 0 }}
                            />
                            <ActionIcon
                              color="teal"
                              variant="light"
                              onClick={() => saveEntry(selectedGroup!, entry.id)}
                            >
                              <TbCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                              color="gray"
                              variant="light"
                              onClick={() => setEditingEntryId(null)}
                            >
                              <TbX size={16} />
                            </ActionIcon>
                          </Group>
                        ) : (
                          <Group justify="space-between" wrap="wrap" style={{ maxWidth: '100%' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                              <Text size="md" c="white">
                                {entry.label}
                              </Text>
                              <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                                {entry.command}
                              </Text>
                            </div>
                            <Group>
                              <Tooltip label="Run" withArrow>
                                <ActionIcon
                                  color="blue"
                                  variant="light"
                                  onClick={() => runEntry(entry.command)}
                                >
                                  <TbPlayerPlay size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Edit" withArrow>
                                <ActionIcon
                                  color="yellow"
                                  variant="light"
                                  onClick={() => startEditingEntry(entry)}
                                >
                                  <TbEdit size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete" withArrow>
                                <ActionIcon
                                  color="red"
                                  variant="light"
                                  onClick={() => confirmRemoveEntry(selectedGroup!, entry.id)}
                                  style={{ transition: 'transform 0.2s' }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1.2)')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1)')
                                  }
                                >
                                  <TbTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Group>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CustomScrollbar>

              {/* Delete Group Confirmation Modal */}
              <Modal
                opened={!!showDeleteGroupModal}
                onClose={() => setShowDeleteGroupModal(null)}
                title="Delete Group"
                centered
              >
                {groupToDelete && (
                  <Stack>
                    <Text>
                      Are you sure you want to delete the group {groupToDelete.groupName}?
                    </Text>
                    <Text size="sm" c="red">
                      This will also delete all {groupToDelete.entries.length} commands in this
                      group.
                    </Text>
                    <Group mt="md" justify="flex-end">
                      <Button variant="default" onClick={() => setShowDeleteGroupModal(null)}>
                        Cancel
                      </Button>
                      <Button
                        color="red"
                        onClick={() => removeGroup(groupToDelete.id)}
                        style={{ transition: 'all 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        Delete Group
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Modal>

              {/* Modal untuk delete entry */}
              <Modal
                opened={!!showDeleteEntryModal}
                onClose={() => setShowDeleteEntryModal(null)}
                title="Delete Command"
                centered
                overlayProps={{
                  backgroundOpacity: 0.55,
                  blur: 3
                }}
              >
                {showDeleteEntryModal && (
                  <Stack>
                    <Text>Are you sure you want to delete this command?</Text>
                    <Group justify="flex-end" mt="md">
                      <Button variant="default" onClick={() => setShowDeleteEntryModal(null)}>
                        Cancel
                      </Button>
                      <Button
                        color="red"
                        onClick={() => {
                          removeEntry(showDeleteEntryModal.groupId, showDeleteEntryModal.entryId)
                        }}
                      >
                        Confirm Delete
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Modal>

              {/* Add Command Modal */}
              <Modal
                opened={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Command"
                centered
              >
                <Stack>
                  <TextInput
                    label="Label"
                    placeholder="e.g., Start Server"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    autoFocus
                  />
                  <TextInput
                    label="Command"
                    placeholder="e.g., npm run dev"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addEntry(selectedGroup!)
                        setShowAddModal(false)
                      }
                    }}
                  />
                  <Group mt="md">
                    <Button variant="default" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => {
                        addEntry(selectedGroup!)
                        setShowAddModal(false)
                      }}
                      disabled={!label.trim() || !command.trim()}
                    >
                      Add Command
                    </Button>
                  </Group>
                </Stack>
              </Modal>
            </>
          ) : (
            <Box
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text c="dimmed" size="lg">
                Select a group to view commands
              </Text>
            </Box>
          )}
        </Grid.Col>
      </Grid>
    </div>
  )
}
