import { useState } from 'react';
const blank = { title: '', description: '', category: 'General', priority: 'Normal', expiryDate: '', isPinned: false };
export default function NoticeForm({ initial = blank, onSave, onCancel }) {
  const [form, setForm] = useState({ ...blank, ...initial, expiryDate: initial.expiryDate ? initial.expiryDate.slice(0, 10) : '' });
  const change = e => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return <form onSubmit={e => { e.preventDefault(); onSave({ ...form, expiryDate: form.expiryDate || null }); }}>
    <div className="mb-3"><label className="form-label">Notice title</label><input className="form-control" name="title" value={form.title} onChange={change} required maxLength="140" /></div>
    <div className="mb-3"><label className="form-label">Details</label><textarea className="form-control" name="description" rows="5" value={form.description} onChange={change} required /></div>
    <div className="row"><div className="col-md-4 mb-3"><label className="form-label">Category</label><select className="form-select" name="category" value={form.category} onChange={change}>{['Academic','Exam','Event','Holiday','General'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="col-md-4 mb-3"><label className="form-label">Priority</label><select className="form-select" name="priority" value={form.priority} onChange={change}>{['Low','Normal','High'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="col-md-4 mb-3"><label className="form-label">Expires (optional)</label><input className="form-control" type="date" name="expiryDate" value={form.expiryDate} onChange={change}/></div></div>
    <label className="form-check mb-4"><input className="form-check-input" type="checkbox" name="isPinned" checked={form.isPinned} onChange={change}/><span className="form-check-label">Pin to the top of the board</span></label>
    <div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-dark">Save notice</button></div>
  </form>;
}
