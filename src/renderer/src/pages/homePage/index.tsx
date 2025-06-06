import React, { useEffect, useState } from 'react'
import {
  TbPlaylistAdd,
  TbPlus,
  TbEdit,
  TbTrash,
  TbCheck,
  TbX,
  TbPlayerPlay,
  TbRun,
  TbFolder,
  TbCommand
} from 'react-icons/tb'

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

  // Simpan ke localStorage setiap kali groups berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  }, [groups])

  // Tambah grup baru
  const addGroup = (): void => {
    if (!newGroupName.trim()) return
    const newGroup: CommandGroup = {
      id: Date.now().toString(),
      groupName: newGroupName.trim(),
      entries: []
    }
    setGroups([...groups, newGroup])
    setNewGroupName('')
  }

  // Tambah command ke grup
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

  // Hapus command
  const removeEntry = (groupId: string, entryId: string): void => {
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
  }

  // Hapus grup beserta command-nya
  const removeGroup = (groupId: string): void => {
    setGroups(groups.filter((group) => group.id !== groupId))
  }

  // Jalankan semua command di grup
  const runGroup = (groupId: string): void => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return
    group.entries.forEach((entry) => {
      window.electron.ipcRenderer.send('run-command', entry.command)
    })
  }

  // Jalankan satu command
  const runEntry = (command: string): void => {
    window.electron.ipcRenderer.send('run-command', command)
  }

  // Mulai edit group name
  const startEditingGroup = (groupId: string, currentName: string): void => {
    setEditingGroupId(groupId)
    setTempGroupName(currentName)
  }

  // Simpan edit group name
  const saveGroupName = (groupId: string): void => {
    if (!tempGroupName.trim()) return

    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, groupName: tempGroupName.trim() } : group
      )
    )
    setEditingGroupId(null)
  }

  // Mulai edit entry
  const startEditingEntry = (entry: CommandEntry): void => {
    setEditingEntryId(entry.id)
    setTempEntry({
      label: entry.label,
      command: entry.command
    })
  }

  // Simpan edit entry
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

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4 text-center">Project Startup Launcher</h3>

      {/* Form tambah grup */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Tambah Grup Baru (Contoh: Backend)"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGroup()}
        />
        <button className="btn btn-primary d-flex align-items-center" onClick={addGroup}>
          <TbPlaylistAdd className="me-1" /> Tambah Grup
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-center fst-italic">Belum ada grup. Silakan tambah grup dulu.</p>
      )}

      {/* List grup */}
      {groups.map((group) => (
        <div key={group.id} className="mb-4">
          {/* Header grup */}
          <div
            className="d-flex justify-content-between align-items-center p-3 bg-light rounded-top border"
            style={{ cursor: 'pointer' }}
            data-bs-toggle="collapse"
            data-bs-target={`#collapseGroup${group.id}`}
            aria-expanded="false"
            aria-controls={`collapseGroup${group.id}`}
          >
            {editingGroupId === group.id ? (
              <div className="d-flex flex-grow-1 me-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={tempGroupName}
                  onChange={(e) => setTempGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveGroupName(group.id)}
                />
                <button
                  className="btn btn-success btn-sm ms-2 d-flex align-items-center"
                  onClick={() => saveGroupName(group.id)}
                >
                  <TbCheck className="me-1" /> Simpan
                </button>
                <button
                  className="btn btn-secondary btn-sm ms-2 d-flex align-items-center"
                  onClick={() => setEditingGroupId(null)}
                >
                  <TbX className="me-1" /> Batal
                </button>
              </div>
            ) : (
              <h5 className="mb-0 flex-grow-1 d-flex align-items-center">
                <TbFolder className="me-2" /> {group.groupName}
              </h5>
            )}
            <div className="d-flex">
              {editingGroupId !== group.id && (
                <>
                  <button
                    className="btn btn-warning btn-sm me-2 d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditingGroup(group.id, group.groupName)
                    }}
                    title="Edit Grup"
                  >
                    <TbEdit />
                  </button>
                  <button
                    className="btn btn-success btn-sm me-2 d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      runGroup(group.id)
                    }}
                    title="Jalankan Semua"
                  >
                    <TbRun />
                  </button>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeGroup(group.id)
                    }}
                    title="Hapus Grup"
                  >
                    <TbTrash />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Konten grup (collapse) */}
          <div className="collapse" id={`collapseGroup${group.id}`}>
            <div className="card card-body mb-3">
              {group.entries.length === 0 ? (
                <p className="fst-italic">Belum ada command di grup ini.</p>
              ) : (
                <table className="table table-bordered table-hover mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>Label</th>
                      <th>Command</th>
                      <th style={{ width: 140 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          {editingEntryId === entry.id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={tempEntry.label}
                              onChange={(e) =>
                                setTempEntry({ ...tempEntry, label: e.target.value })
                              }
                            />
                          ) : (
                            entry.label
                          )}
                        </td>
                        <td>
                          {editingEntryId === entry.id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={tempEntry.command}
                              onChange={(e) =>
                                setTempEntry({ ...tempEntry, command: e.target.value })
                              }
                            />
                          ) : (
                            <code>{entry.command}</code>
                          )}
                        </td>
                        <td>
                          {editingEntryId === entry.id ? (
                            <div className="d-flex">
                              <button
                                className="btn btn-sm btn-success me-2 d-flex align-items-center"
                                onClick={() => saveEntry(group.id, entry.id)}
                                title="Simpan"
                              >
                                <TbCheck />
                              </button>
                              <button
                                className="btn btn-sm btn-secondary d-flex align-items-center"
                                onClick={() => setEditingEntryId(null)}
                                title="Batal"
                              >
                                <TbX />
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex">
                              <button
                                className="btn btn-sm btn-primary me-2 d-flex align-items-center"
                                onClick={() => runEntry(entry.command)}
                                title="Jalankan"
                              >
                                <TbPlayerPlay />
                              </button>
                              <button
                                className="btn btn-sm btn-warning me-2 d-flex align-items-center"
                                onClick={() => startEditingEntry(entry)}
                                title="Edit"
                              >
                                <TbEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-danger d-flex align-items-center"
                                onClick={() => removeEntry(group.id, entry.id)}
                                title="Hapus"
                              >
                                <TbTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Form tambah command baru */}
              <div className="border rounded p-3 bg-light">
                <h6 className="d-flex align-items-center">
                  <TbCommand className="me-2" /> Tambah Command Baru
                </h6>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Label command (Contoh: Backend Server)"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder='Command (Contoh: code "D:\\Project\\backend")'
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => addEntry(group.id)}
                >
                  <TbPlus className="me-1" /> Tambah Command
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
