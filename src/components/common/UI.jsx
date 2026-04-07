// src/components/common/UI.jsx
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Common.module.css';

// ===== TOAST =====
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles['toast_' + t.type]}`}>
            {t.type === 'success' && <CheckCircle size={15} />}
            {t.type === 'error'   && <AlertCircle size={15} />}
            {t.type === 'warning' && <AlertTriangle size={15} />}
            {t.type === 'info'    && <Info size={15} />}
            <span>{t.message}</span>
            <button className={styles.toastClose} onClick={() => dismiss(t.id)}><X size={13} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ===== SPINNER =====
export function Spinner({ size = 16 }) {
  return <span className={styles.spinner} style={{ width: size, height: size }} />;
}

// ===== BUTTON =====
export function Button({ variant = 'primary', size = '', icon: Icon, loading = false, children, className = '', ...props }) {
  const variantClass = {
    primary: styles.btnPrimary,
    secondary: styles.btnSecondary,
    success: styles.btnSuccess,
    danger: styles.btnDanger,
    ghost: styles.btnGhost,
  }[variant] || styles.btnPrimary;

  const sizeClass = { sm: styles.btnSm, xs: styles.btnXs, lg: styles.btnLg, icon: styles.btnIcon }[size] || '';

  const iconSize = size === 'sm' || size === 'xs' ? 14 : 16;
  return (
    <button className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading
        ? <span className={styles.spinner} style={{ width: iconSize - 1, height: iconSize - 1 }} />
        : Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
}

// ===== BADGE =====
export function Badge({ status, children }) {
  const cls = {
    Approved: styles.badgeApproved,
    Approved_: styles.badgeApproved,
    Pending: styles.badgePending,
    Rejected: styles.badgeRejected,
    Draft: styles.badgeDraft,
    Published: styles.badgeApproved,
  }[status] || styles.badgeDraft;

  const dot = { Approved: '#15803D', Pending: '#92400E', Rejected: '#991B1B', Draft: '#64748B', Published: '#15803D' }[status] || '#64748B';

  return (
    <span className={`${styles.badge} ${cls}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />
      {children || status}
    </span>
  );
}

// ===== MODAL =====
export function Modal({ title, children, footer, onClose, size }) {
  const maxWidths = { lg: 820, xl: 1100, full: '95vw' };
  const maxHeights = { lg: '75vh', xl: '85vh', full: '95vh' };
  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: maxWidths[size] || 560 }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalBody} style={{ maxHeight: maxHeights[size] || '88vh', overflowY: 'auto' }}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}

// ===== SLIDE PANEL =====
export function SlidePanel({ title, children, footer, onClose, size }) {
  return (
    <>
      <div className={styles.panelBackdrop} onClick={onClose} />
      <aside className={`${styles.panel} ${size === 'lg' ? styles.panelLg : ''}`}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.panelBody}>{children}</div>
        {footer && <div className={styles.panelFooter}>{footer}</div>}
      </aside>
    </>
  );
}

// ===== FORM FIELD =====
export function FormField({ label, children }) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return <input className={`${styles.input} ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${styles.input} ${styles.textarea} ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return <select className={`${styles.input} ${styles.select} ${className}`} {...props}>{children}</select>;
}

// ===== EMPTY STATE =====
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{Icon && <Icon size={32} />}</div>
      <div className={styles.emptyText}>{title}</div>
      <div className={styles.emptySubText}>{subtitle || 'No data available. Click + Add to start.'}</div>
      {action}
    </div>
  );
}

// ===== SKELETON =====
export function Skeleton({ height = 20, width = '100%', count = 1, gap = 10 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={styles.skeleton} style={{ height, width }} />
      ))}
    </div>
  );
}

// ===== PAGE HEADER =====
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

// ===== CARD =====
export function Card({ children, hover, style, className = '', onClick, onDoubleClick }) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.cardHover : ''} ${className}`}
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
}

// ===== STAT CARD =====
export function StatCard({ label, value, icon: Icon, color = '#1E3A8A', bg = '#EFF6FF' }) {
  return (
    <div className={styles.statCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className={styles.statValue} style={{ color }}>{value}</div>
          <div className={styles.statLabel}>{label}</div>
        </div>
        {Icon && (
          <div className={styles.statIcon} style={{ background: bg }}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}

// ===== PROGRESS BAR =====
export function ProgressBar({ value, max = 100, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${pct}%`, ...(color ? { background: color } : {}) }} />
    </div>
  );
}
