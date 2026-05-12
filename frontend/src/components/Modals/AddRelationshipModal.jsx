import { useState } from 'react'
import { X, Plus, Trash2, Link2 } from 'lucide-react'
import { createRelationship } from '../../services/api'

const validRelations = {
  DESARROLLA: 'Persona → Microservicio | Servicio | Interfaz',
  COLABORA_CON: 'Persona ⇄ Persona',
  SOLICITA: 'Interfaz → Servicio',
  REDIRECCIONA: 'Servicio → Microservicio | Servicio',
  ENVIA_DATOS: 'Servicio → Microservicio',
  VALIDA: 'Microservicio → BaseDatos',
  GUARDA: 'Microservicio → BaseDatos',
  CRUD: 'Microservicio → BaseDatos',
  ALMACENA: 'Microservicio → BaseDatos',
  PERSISTE: 'Microservicio → BaseDatos',
  SINCRONIZA: 'Microservicio ⇄ Microservicio',
  VALIDA_VEHICULO: 'Microservicio → Microservicio',
  RESPONDE_A: 'Microservicio → Servicio',
  CONECTA: 'Dispositivo → Servidor',
  HOSTEA: 'Servidor → Microservicio | Servicio',
  USA: 'Entidad → Interfaz',
  MUESTRA_RESULTADOS: 'Interfaz → Entidad',
}

export default function AddRelationshipModal({ graphData, onClose, onCreated }) {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [type, setType] = useState('')
  const [customType, setCustomType] = useState('')
  const [props, setProps] = useState([{ key: '', value: '' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const addProp = () => setProps([...props, { key: '', value: '' }])
  const updateProp = (i, field, v) => { const c = [...props]; c[i][field] = v; setProps(c) }
  const removeProp = (i) => { if (props.length > 1) setProps(props.filter((_, j) => j !== i)) }

  const nodes = graphData.nodes || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!source) { setError('Select source node'); return }
    if (!target) { setError('Select target node'); return }
    if (source === target) { setError('Source and target must be different'); return }
    const relType = type || customType.trim()
    if (!relType) { setError('Select or type a relationship type'); return }
    const properties = {}
    props.forEach(({ key, value }) => {
      if (key.trim()) properties[key.trim()] = value
    })
    setLoading(true)
    try {
      await createRelationship(source, target, relType, properties)
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
          <h3 style={s.title}><Link2 size={16} /> Add Relationship</h3>
          <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.section}>
            <label style={s.label}>Source Node</label>
            <select style={s.select} value={source} onChange={e => setSource(e.target.value)}>
              <option value="">-- Select --</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.label})</option>
              ))}
            </select>
          </div>

          <div style={s.section}>
            <label style={s.label}>Target Node</label>
            <select style={s.select} value={target} onChange={e => setTarget(e.target.value)}>
              <option value="">-- Select --</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.label})</option>
              ))}
            </select>
          </div>

          <div style={s.section}>
            <label style={s.label}>Relationship Type</label>
            <select style={{ ...s.select, marginBottom: '0.3rem' }} value={type} onChange={e => { setType(e.target.value); if (e.target.value) setCustomType('') }}>
              <option value="">-- Select preset --</option>
              {Object.keys(validRelations).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input style={s.input} value={customType} onChange={e => { setCustomType(e.target.value); if (e.target.value) setType('') }} placeholder="Or type custom type..." />
            {type && (
              <p style={s.hint}>{validRelations[type]}</p>
            )}
          </div>

          <div style={s.section}>
            <label style={s.label}>Properties (optional)</label>
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
            {loading ? 'Creating...' : 'Create Relationship'}
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
    width: '480px', maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto',
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
    display: 'flex', alignItems: 'center', gap: '0.4rem',
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
  select: {
    width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  input: {
    width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-body)',
    outline: 'none', boxSizing: 'border-box',
  },
  hint: {
    margin: '0.3rem 0 0', fontSize: 'var(--font-size-xs)',
    color: 'var(--accent)', fontStyle: 'italic',
  },
  row: { display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' },
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
