// src/components/Layout/Layout.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, CheckSquare, Send, Users,
  LogOut, Bell, ChevronDown, Briefcase, Home, Menu,
  CheckCircle2, XCircle, Clock, Info, AlertTriangle,
  Trash2, CheckCheck, Inbox,
} from 'lucide-react';
import mitsLogo from '../../assets/MITS name.jpg';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import Avatar from '../common/Avatar';
import styles from './Layout.module.css';

const SIDEBAR_FULL      = 260;
const SIDEBAR_COLLAPSED = 70;

const NAV_LINKS = {
  FACULTY: [
    { label: 'Home',           icon: Home,          to: '/dashboard'    },
    { label: 'Edit Profile',   icon: User,          to: '/profile'      },
    { label: 'My Submissions', icon: Send,          to: '/submissions'  },
  ],
  HOD: [
    { label: 'Home',           icon: Home,          to: '/hod-dashboard' },
    { label: 'My Profile',     icon: User,          to: '/dashboard'     },
    { label: 'Approvals',      icon: CheckSquare,   to: '/approvals'     },
    { label: 'Faculty List',   icon: Users,         to: '/faculty-list'  },
    { label: 'Content Studio', icon: Briefcase,     to: '/content'       },
  ],
  ADMIN: [
    { label: 'Control Panel',  icon: LayoutDashboard, to: '/dashboard'    },
    { label: 'Content Studio', icon: Briefcase,       to: '/content'      },
    { label: 'Faculty List',   icon: Users,           to: '/faculty-list' },
    { label: 'Approvals',      icon: CheckSquare,     to: '/approvals'    },
    { label: 'Submissions',    icon: Send,            to: '/submissions'  },
  ],
};

// Icon + color per notification type
const NOTIF_META = {
  success: { icon: CheckCircle2, color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
  error:   { icon: XCircle,      color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  warning: { icon: AlertTriangle,color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  info:    { icon: Info,         color: '#0369A1', bg: '#EFF6FF', border: '#BFDBFE' },
};

function timeLabel(time) {
  if (!time || time === 'just now') return 'just now';
  return time;
}



// ── Notification Dropdown ────────────────────────────────────────────────────
function NotifDropdown({ notifications, unreadCount, onMarkAll, onMarkOne, onClear, onClose }) {
  return (
    <div className={styles.notifDropdown}>
      {/* Header */}
      <div className={styles.notifHeader}>
        <div className={styles.notifHeaderLeft}>
          <Bell size={15} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className={styles.notifUnreadBadge}>{unreadCount} new</span>
          )}
        </div>
        <div className={styles.notifHeaderActions}>
          {unreadCount > 0 && (
            <button className={styles.notifActionBtn} onClick={onMarkAll} title="Mark all read">
              <CheckCheck size={13} /> All read
            </button>
          )}
          {notifications.length > 0 && (
            <button className={`${styles.notifActionBtn} ${styles.notifActionBtnDanger}`} onClick={onClear} title="Clear all">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className={styles.notifList}>
        {notifications.length === 0 ? (
          <div className={styles.notifEmpty}>
            <Inbox size={28} color="var(--gray-300)" />
            <span>You're all caught up!</span>
          </div>
        ) : (
          notifications.map(n => {
            const meta = NOTIF_META[n.type] || NOTIF_META.info;
            const NIcon = meta.icon;
            return (
              <div
                key={n.id}
                className={`${styles.notifItem} ${!n.read ? styles.notifItemUnread : ''}`}
                onClick={() => { onMarkOne(n.id); }}
              >
                {/* Unread stripe */}
                {!n.read && <div className={styles.notifUnreadStripe} style={{ background: meta.color }} />}

                {/* Icon */}
                <div className={styles.notifIcon} style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                  <NIcon size={14} color={meta.color} />
                </div>

                {/* Content */}
                <div className={styles.notifContent}>
                  <p className={styles.notifMessage}>{n.message}</p>
                  <span className={styles.notifTime}>{timeLabel(n.time)}</span>
                </div>

                {/* Unread dot */}
                {!n.read && <div className={styles.notifDot} style={{ background: meta.color }} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main Layout ──────────────────────────────────────────────────────────────
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { notifications, markAllRead, markOneRead, clearAllNotifications, unreadCount } = useData();
  const navigate = useNavigate();

  const [sidebarMode, setSidebarMode] = useState('full');
  const [isMobile,    setIsMobile]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const profileRef = useRef();
  const notifRef   = useRef();

  const isDragging      = useRef(false);
  const dragStartX      = useRef(0);
  const dragStartWidth  = useRef(0);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_FULL);

  const links      = NAV_LINKS[user?.role] || [];
  const isCollapsed = sidebarMode === 'collapsed';
  const isHidden    = sidebarMode === 'hidden';
  const effectiveWidth = isHidden ? 0 : isCollapsed ? SIDEBAR_COLLAPSED : sidebarWidth;

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setSidebarMode(mobile ? 'hidden' : 'full');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const onDragStart = useCallback((e) => {
    isDragging.current    = true;
    dragStartX.current    = e.clientX;
    dragStartWidth.current = sidebarWidth;
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta    = e.clientX - dragStartX.current;
      const newWidth = Math.min(360, Math.max(180, dragStartWidth.current + delta));
      if (newWidth < 120) setSidebarMode('collapsed');
      else { setSidebarMode('full'); setSidebarWidth(newWidth); }
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarMode(m => m === 'hidden' ? 'full' : 'hidden');
    } else {
      setSidebarMode(m => m === 'full' ? 'collapsed' : 'full');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleMarkAll = () => { markAllRead(); };
  const handleMarkOne = (id) => { markOneRead(id); };
  const handleClear   = () => { clearAllNotifications(); };

  return (
    <div className={styles.wrapper}>
      {/* ── SIDEBAR ── */}
      <aside
        className={styles.sidebar}
        style={{
          width:     isHidden ? 0 : isCollapsed ? SIDEBAR_COLLAPSED : sidebarWidth,
          transform: isHidden ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div className={styles.sidebarBrand}>
          <div className={styles.brandLogo}>
            <div className={styles.logoCircle}>M</div>
            {!isCollapsed && (
              <div>
                <div className={styles.brandName}>MITS</div>
                <div className={styles.brandSub}>Department CMS</div>
              </div>
            )}
          </div>
        </div>

        <nav className={styles.nav}>
          {!isCollapsed && <div className={styles.navLabel}>Navigation</div>}
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''} ${isCollapsed ? styles.navItemCollapsed : ''}`
              }
              title={isCollapsed ? link.label : ''}
            >
              <link.icon size={18} />
              {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
          <div className={styles.navDivider} />
          <button
            className={`${styles.navItem} ${isCollapsed ? styles.navItemCollapsed : ''}`}
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>

        <div className={`${styles.sidebarFooter} ${isCollapsed ? styles.sidebarFooterCollapsed : ''}`}>
          <div className={`${styles.userCard} ${isCollapsed ? styles.userCardCollapsed : ''}`}>
            <Avatar name={user?.name} avatar={user?.avatar} size={36} />
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div className={styles.userName}>{user?.name}</div>
                <div className={styles.userRole}>{user?.role}</div>
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && !isMobile && (
          <div className={styles.dragHandle} onMouseDown={onDragStart} title="Drag to resize" />
        )}
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      {isMobile && !isHidden && (
        <div className={styles.overlay} onClick={() => setSidebarMode('hidden')} />
      )}

      {/* ── TOPBAR ── */}
      <div className={styles.topbarWrap} style={{ left: isMobile ? 0 : effectiveWidth }}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <Menu size={20} />
          </button>

          <div className={styles.topbarLogo}>
            <img src={mitsLogo} alt="MITS" className={styles.topbarLogoImg} />
          </div>

          <div className={styles.topbarActions}>
            {/* ── NOTIFICATIONS ── */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className={`${styles.iconBtn} ${notifOpen ? styles.iconBtnActive : ''}`}
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
                aria-label="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className={styles.badge}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotifDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAll={handleMarkAll}
                  onMarkOne={handleMarkOne}
                  onClear={handleClear}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* ── PROFILE ── */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div
                className={`${styles.profilePill} ${profileOpen ? styles.profilePillActive : ''}`}
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              >
                <Avatar name={user?.name} avatar={user?.avatar} size={30} />
                <span className={styles.profilePillName}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--gray-400)" className={profileOpen ? styles.chevronOpen : ''} />
              </div>

              {profileOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownUserName}>{user?.name}</div>
                    <div className={styles.dropdownUserEmail}>{user?.email}</div>
                    <span className={styles.dropdownRoleBadge}>{user?.role}</span>
                  </div>
                  <div className={styles.dropdownItem} onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                    <User size={15} /> My Profile
                  </div>
                  {user?.role !== 'HOD' && (
                    <div className={styles.dropdownItem} onClick={() => { navigate('/submissions'); setProfileOpen(false); }}>
                      <FileText size={15} /> {user?.role === 'ADMIN' ? 'Submissions' : 'My Submissions'}
                    </div>
                  )}
                  <div className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* ── MAIN ── */}
      <main className={styles.main} style={{ marginLeft: isMobile ? 0 : effectiveWidth }}>
        {children}
      </main>
    </div>
  );
}
