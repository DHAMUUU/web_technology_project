import { AlertTriangle } from 'lucide-react';
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy = false, onCancel, onConfirm }) {
  if (!open) return null;
  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onCancel(); }}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message"><span className="dialog-icon"><AlertTriangle size={20}/></span><h2 id="confirm-title">{title}</h2><p id="confirm-message">{message}</p><div className="dialog-actions"><button className="button button-quiet" onClick={onCancel} disabled={busy}>Cancel</button><button className="button button-danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button></div></section></div>;
}
