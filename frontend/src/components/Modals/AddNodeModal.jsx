import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { createNode } from '../../services/api'

export default function AddNodeModal({ onClose, onCreated }) {
  const [labels, setLabels] = useState([''])
  const [props, setProps] = useState([{ key: '', value: '' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const addLabel = () => setLabels([...labels, ''])
  const updateLabel = (i, v) => { const c = [...labels]; c[i] = v; setLabels(c) }
  const removeLabel = (i) => { if (labels.length > 1) setLabels(labels.filter((_, j) => j !== i)) }

  const addProp = () => setProps([...props, { key: '', value: '' }])
  const updateProp = (i, field, v) => { const c = [...props]; c[i][field] = v; setProps(c) }
  const removeProp = (i) => { if (props.length > 1) setProps(props.filter((_, j) => j !== i)) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validLabels = labels.map(l => l.trim()).filter(Boolean)
    if (!validLabels.length) { setError('At least one label required'); return }
    const properties = {}
    props.forEach(({ key, value }) => {
      if (key.trim()) properties[key.trim()] = value
    })
    setLoading(true)
    try {
      await createNode(validLabels, properties)
      onCreated()
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
          <h3 style={s.title}>Add Node</h3>
          <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.section}>
            <label style={s.label}>Labels</label>
            {labels.map((l, i) => (
              <div key={i} style={s.row}>
                <input style={s.input} value={l} onChange={e => updateLabel(i, e.target.value)} placeholder="e.g. Persona" />
                <button type="button" style={s.iconBtn} onClick={() => removeLabel(i)} disabled={labels.length <= 1}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={s.addBtn} onClick={addLabel}><Plus size={14} /> Label</button>
          </div>

          <div style={s.section}>
            <label style={s.label}>Properties</label>
            {props.map((p, i) => (
              <div key={i} style={s.row}>
                <input style={{ ...s.input, flex: 1 }} value={p.key} onChange={e => updateProp(i, 'key', e.target.value)} placeholder="Key" />
                <input style={{ ...s.input, flex: 1 }} value={p.value} onChange={e => updateProp(i, 'value', e.target.value)} placeholder="Value" />
                <button type="button" style={s.iconBtn} onClick={() => removeProp(i)} disabled={props.length <= 1}><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" style={s.addBtn} onClick={addProp}><Plus size={14} /> Property</button>
          </div>

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Node'}
          </button>
        </form>
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
    width: '420px', maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto',
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
  section: { marginBottom: '1rem' },
  label: {
    display: 'block', marginBottom: '0.4rem', fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)',
  },
  row: { display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' },
  input: {
    flex: 1, padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)',
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
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    background: 'none', border: '1px dashed var(--border-color)',
    color: 'var(--accent)', cursor: 'pointer', padding: '0.3rem 0.6rem',
    borderRadius: '6px', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-body)',
    marginTop: '0.2rem',
  },
  error: { color: 'var(--accent-red)', fontSize: 'var(--font-size-sm)', margin: '0.5rem 0' },
  submitBtn: {
    width: '100%', padding: '0.6rem', borderRadius: '8px', border: 'none',
    background: 'var(--accent)', color: '#fff', fontWeight: 'var(--font-weight-semibold)',
    cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-body)',
    marginTop: '0.5rem',
  },
}
