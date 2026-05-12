import { useState } from 'react'
import { X, Edit3, Trash2 } from 'lucide-react'
import { updateNode, deleteNode } from '../../services/api'

export default function NodeDetailModal({ node, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [props, setProps] = useState(
    Object.entries(node.properties || {}).map(([k, v]) => ({ key: k, value: String(v) }))
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateProp = (i, field, v) => {
    const c = [...props]; c[i][field] = v; setProps(c)
  }
  const addProp = () => setProps([...props, { key: '', value: '' }])
  const removeProp = (i) => setProps(props.filter((_, j) => j !== i))

  const handleUpdate = async () => {
    setError('')
    const properties = {}
    props.forEach(({ key, value }) => {
      if (key.trim()) properties[key.trim()] = value
    })
    setLoading(true)
    try {
      await updateNode(node.id, properties)
      onUpdated()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this node and all its relationships?')) return
    setLoading(true)
    try {
      await deleteNode(node.id)
      onDeleted()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title}>Node Details</h3>
          <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={s.field}>
          <span style={s.fieldLabel}>ID</span>
          <span style={s.fieldValue}>{node.id}</span>
        </div>

        <div style={s.field}>
          <span style={s.fieldLabel}>Labels</span>
          <div style={s.labels}>
            {(node.labels || [node.label]).map((l, i) => (
              <span key={i} style={s.badge}>{l}</span>
            ))}
          </div>
        </div>

        <div style={s.field}>
          <span style={s.fieldLabel}>Name</span>
          <span style={s.fieldValue}>{node.name}</span>
        </div>

        <div style={s.sectionTitle}>Properties</div>

        {editing ? (
          <div>
            {props.map((p, i) => (
              <div key={i} style={s.row}>
                <input style={{ ...s.input, flex: 1 }} value={p.key} onChange={e => updateProp(i, 'key', e.target.value)} placeholder="Key" />
                <input style={{ ...s.input, flex: 1 }} value={p.value} onChange={e => updateProp(i, 'value', e.target.value)} placeholder="Value" />
                <button type="button" style={s.iconBtn} onClick={() => removeProp(i)}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={s.addBtn} onClick={addProp}>+ Add Property</button>
          </div>
        ) : (
          <div style={s.propList}>
            {Object.keys(node.properties || {}).length === 0 ? (
              <p style={s.empty}>No properties</p>
            ) : (
              Object.entries(node.properties || {}).map(([k, v]) => (
                <div key={k} style={s.propRow}>
                  <span style={s.propKey}>{k}</span>
                  <span style={s.propVal}>{String(v)}</span>
                </div>
              ))
            )}
          </div>
        )}

        {error && <p style={s.error}>{error}</p>}

        <div style={s.actions}>
          {editing ? (
            <>
              <button style={s.saveBtn} onClick={handleUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button style={s.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button style={s.editBtn} onClick={() => setEditing(true)}><Edit3 size={14} /> Edit</button>
              <button style={s.deleteBtn} onClick={handleDelete} disabled={loading}>
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1.5rem',
    width: '460px', maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto',
    border: '1px solid var(--border-color)',
    fontFamily: 'var(--font-body)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--text-primary)', fontFamily: 'var(--font-title)',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text-secondary)', padding: '4px', borderRadius: '4px',
  },
  field: { marginBottom: '0.6rem' },
  fieldLabel: {
    display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)',
    marginBottom: '0.15rem', fontWeight: 'var(--font-weight-medium)',
  },
  fieldValue: {
    fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)',
    wordBreak: 'break-all', fontFamily: 'var(--font-mono)',
  },
  labels: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' },
  badge: {
    padding: '0.2rem 0.5rem', borderRadius: '12px',
    background: 'rgba(0,229,255,0.1)', color: 'var(--accent)',
    fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-mono)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--text-primary)', margin: '1rem 0 0.5rem',
    paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)',
  },
  propList: { marginBottom: '0.5rem' },
  propRow: {
    display: 'flex', gap: '0.5rem', padding: '0.3rem 0',
    borderBottom: '1px solid var(--border-light)',
  },
  propKey: {
    flex: '0 0 40%', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-weight-medium)',
  },
  propVal: {
    flex: 1, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)', wordBreak: 'break-all',
  },
  row: { display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' },
  input: {
    padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--accent-red)', padding: '4px', borderRadius: '4px',
    display: 'flex',
  },
  addBtn: {
    background: 'none', border: '1px dashed var(--border-color)',
    color: 'var(--accent)', cursor: 'pointer', padding: '0.25rem 0.5rem',
    borderRadius: '6px', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-body)',
    marginTop: '0.25rem',
  },
  empty: {
    fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontStyle: 'italic',
  },
  error: { color: 'var(--accent-red)', fontSize: 'var(--font-size-sm)', margin: '0.5rem 0' },
  actions: {
    display: 'flex', gap: '0.5rem', marginTop: '1rem',
    paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)',
  },
  editBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.45rem 0.8rem', borderRadius: '8px', border: 'none',
    background: 'var(--accent)', color: '#fff', cursor: 'pointer',
    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-body)',
  },
  deleteBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.45rem 0.8rem', borderRadius: '8px', border: 'none',
    background: 'var(--accent-red)', color: '#fff', cursor: 'pointer',
    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-body)',
  },
  saveBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.45rem 0.8rem', borderRadius: '8px', border: 'none',
    background: 'var(--accent-tertiary)', color: '#fff', cursor: 'pointer',
    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-body)',
  },
  cancelBtn: {
    padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)',
    background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-body)',
  },
}
