import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

const ToastContext = createContext(() => {});
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const remove = useCallback(id => setItems(current => current.filter(item => item.id !== id)), []);
  const push = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setItems(current => [...current, { id, message, type }]);
    window.setTimeout(() => remove(id), 4200);
  }, [remove]);
  const value = useMemo(() => push, [push]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite" aria-atomic="false">{items.map(item => <div key={item.id} className={`toast-message toast-${item.type}`} role="status">{item.type === 'error' ? <CircleAlert size={17}/> : item.type === 'info' ? <Info size={17}/> : <CheckCircle2 size={17}/>}<span>{item.message}</span><button aria-label="Dismiss" onClick={() => remove(item.id)}><X size={15}/></button></div>)}</div></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
