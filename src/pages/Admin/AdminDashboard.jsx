// src/pages/Admin/AdminDashboard.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/UI';
import {
  Users, FileText, CheckCircle, XCircle, Clock, TrendingUp,
  Shield, Building2, UserPlus, Settings, Activity, BarChart3,
  ChevronRight, AlertTriangle, Eye, Pencil, Trash2, X, Save,
  GraduationCap, BookOpen, Award,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import styles from './AdminDashboard.module.css';

/* ── helpers ── */
function StatCard({ label, value, icon: Icon, color, bg, sub, showBar, barValue }) {
  return (
    <div className={styles.statCard} style={{ borderTop: `3px solid ${color}` }}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrap} style={{ background: bg }}>
          <Icon size={20} color={color} />
        </div>
        <div className={styles.statValue} style={{ color }}>{value}</div>
      </div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
      {showBar && (
        <div className={styles.statBarWrap}>
          <div className={styles.statBar}>
            <div className={styles.statBarFill} style={{ width: `${barValue ?? 0}%`, background: color }} />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHead({ icon: Icon, title, sub, action }) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionHeadLeft}>
        <div className={styles.sectionIconWrap}><Icon size={16} /></div>
        <div>
          <h3 className={styles.sectionTitle}>{title}</h3>
          {sub && <p className={styles.sectionSub}>{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ── User Edit Modal ── */
function UserModal({ user: editUser, onSave, onClose }) {
  const [form, setForm] = useState({
    name:        editUser?.name        || '',
    email:       editUser?.email       || '',
    role:        editUser?.role        || 'FACULTY',
    department:  editUser?.department  || '',
    designation: editUser?.designation || '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{editUser ? 'Edit User' : 'Add New User'}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={styles.modalBody}>
          {[
            { label: 'Full Name',    key: 'name',        type: 'text',  placeholder: 'Dr. Full Name' },
            { label: 'Email',        key: 'email',       type: 'email', placeholder: 'name@mits.edu' },
            { label: 'Department',   key: 'department',  type: 'text',  placeholder: 'Computer Science' },
            { label: 'Designation',  key: 'designation', type: 'text',  placeholder: 'Assistant Professor' },
          ].map(f => (
            <div key={f.key} className={styles.formRow}>
              <label className={styles.formLabel}>{f.label}</label>
              <input className={styles.formInput} type={f.type} value={form[f.key]}
                onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
            </div>
          ))}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Role</label>
            <select className={styles.formInput} value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="FACULTY">Faculty</option>
              <option value="HOD">HOD</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={() => onSave({ ...editUser, ...form })}>
            <Save size={14} /> {editUser ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Override Modal ── */
function OverrideModal({ submission, onApprove, onReject, onClose }) {
  const [comment, setComment] = useState('');
  return (
    <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Admin Override — {submission.title}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.overrideWarn}>
            <AlertTriangle size={14} />
            <span>You are using admin override. This bypasses the normal HOD approval workflow.</span>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Override Reason *</label>
            <textarea className={`${styles.formInput} ${styles.formTextarea}`}
              value={comment} onChange={e => setComment(e.target.value)}
              placeholder="State the reason for this override..." rows={3} />
          </div>
          <div className={styles.overrideMeta}>
            <span><strong>Type:</strong> {submission.type}</span>
            <span><strong>Dept:</strong> {submission.department}</span>
            <span><strong>Status:</strong> {submission.status}</span>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnDanger} disabled={!comment.trim()} onClick={() => { onReject(submission._id || submission.id, `[ADMIN OVERRIDE] ${comment}`); onClose(); }}>
            <XCircle size={14} /> Force Reject
          </button>
          <button className={styles.btnSuccess} disabled={!comment.trim()} onClick={() => { onApprove(submission._id || submission.id, `[ADMIN OVERRIDE] ${comment}`); onClose(); }}>
            <CheckCircle size={14} /> Force Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AdminDashboard() {
  const { user } = useAuth();
  const { submissions, faculty, addFaculty, updateFaculty, removeFaculty, updateSubmissionStatus, events, trending } = useData();

  const [userSearch,    setUserSearch]    = useState('');
  const [deptFilter,    setDeptFilter]    = useState('');
  const [roleFilter,    setRoleFilter]    = useState('');
  const [editUser,      setEditUser]      = useState(null);  // null | 'new' | user obj
  const [deleteUser,    setDeleteUser]    = useState(null);
  const [overrideSub,   setOverrideSub]   = useState(null);
  const [activeSection, setActiveSection] = useState('overview'); // overview | users | submissions | activity

  /* ── analytics ── */
  const totalUsers       = faculty.length;
  const totalSubmissions = submissions.length;
  const approved         = submissions.filter(s => s.status === 'Approved').length;
  const pending          = submissions.filter(s => s.status === 'Pending').length;
  const rejected         = submissions.filter(s => s.status === 'Rejected').length;
  const approvalRate     = totalSubmissions > 0 ? Math.round((approved / totalSubmissions) * 100) : 0;

  const departments = useMemo(() => [...new Set(faculty.map(f => f.department).filter(Boolean))], [faculty]);

  /* ── filtered users ── */
  const filteredUsers = useMemo(() => faculty.filter(f =>
    (!userSearch   || f.name.toLowerCase().includes(userSearch.toLowerCase()) || f.email?.toLowerCase().includes(userSearch.toLowerCase())) &&
    (!deptFilter   || f.department === deptFilter) &&
    (!roleFilter   || f.role === roleFilter)
  ), [faculty, userSearch, deptFilter, roleFilter]);

  /* ── recent activity log ── */
  const activityLog = useMemo(() =>
    [...submissions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
  , [submissions]);

  /* ── dept stats ── */
  const deptStats = useMemo(() => departments.map(dept => ({
    dept,
    faculty:     faculty.filter(f => f.department === dept).length,
    submissions: submissions.filter(s => s.department === dept).length,
    pending:     submissions.filter(s => s.department === dept && s.status === 'Pending').length,
    approved:    submissions.filter(s => s.department === dept && s.status === 'Approved').length,
  })), [departments, faculty, submissions]);

  /* ── user actions ── */
  const handleSaveUser = async (data) => {
    if (editUser === 'new') {
      await addFaculty({ ...data, avatar: null });
    } else {
      await updateFaculty(data._id, data);
    }
    setEditUser(null);
  };

  const handleDeleteUser = async (id) => {
    await removeFaculty(id);
    setDeleteUser(null);
  };

  const handleOverrideApprove = (id, comment) => updateSubmissionStatus(id, 'Approved', comment, user?.name);
  const handleOverrideReject  = (id, comment) => updateSubmissionStatus(id, 'Rejected', comment, user?.name);

  const SECTIONS = [
    { key: 'overview',    label: 'Overview',       icon: BarChart3 },
    { key: 'users',       label: 'User Management', icon: Users },
    { key: 'submissions', label: 'All Submissions', icon: FileText },
    { key: 'activity',    label: 'Activity Log',    icon: Activity },
  ];

  return (
    <div className={styles.root}>

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.adminBadge}><Shield size={13} /> Admin Control Panel</div>
          <h1 className={styles.pageTitle}>System Dashboard</h1>
          <p className={styles.pageSub}>Full system visibility and control across all departments</p>
        </div>
        <div className={styles.pageHeaderRight}>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>{user?.name}</span>
            <span className={styles.adminRole}>System Administrator</span>
          </div>
        </div>
      </div>

      {/* ── SECTION TABS ── */}
      <div className={styles.sectionTabs}>
        {SECTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.key}
              className={`${styles.sectionTab} ${activeSection === s.key ? styles.sectionTabActive : ''}`}
              onClick={() => setActiveSection(s.key)}>
              <Icon size={15} /> {s.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════
          OVERVIEW
      ══════════════════════════════════════ */}
      {activeSection === 'overview' && (
        <div className={styles.section}>

          {/* KPI cards */}
          <div className={styles.statsGrid}>
            <StatCard label="Total Users"       value={totalUsers}          icon={Users}       color="#1E3A8A" bg="#EFF6FF" sub={`${departments.length} departments`} />
            <StatCard label="Total Submissions" value={totalSubmissions}    icon={FileText}    color="#7C3AED" bg="#F5F3FF" sub="All time" />
            <StatCard label="Pending Review"    value={pending}             icon={Clock}       color="#D97706" bg="#FFFBEB" sub="Awaiting HOD action" />
            <StatCard label="Approved"          value={approved}            icon={CheckCircle} color="#15803D" bg="#F0FDF4" sub={`${totalSubmissions > 0 ? Math.round((approved/totalSubmissions)*100) : 0}% of total`} />
            <StatCard label="Rejected"          value={rejected}            icon={XCircle}     color="#DC2626" bg="#FEF2F2" sub={`${totalSubmissions > 0 ? Math.round((rejected/totalSubmissions)*100) : 0}% of total`} />
            <StatCard label="Approval Rate"     value={`${approvalRate}%`}  icon={TrendingUp}  color="#0891B2" bg="#ECFEFF" sub={`${approved} of ${totalSubmissions}`} showBar barValue={approvalRate} />
          </div>

          {/* Department breakdown */}
          <div className={styles.card}>
            <SectionHead icon={Building2} title="Department Overview" sub="Submissions and faculty per department" />
            <div className={styles.deptTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Faculty</th>
                    <th>Total Submissions</th>
                    <th>Pending</th>
                    <th>Approved</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map(d => (
                    <tr key={d.dept}>
                      <td><strong>{d.dept}</strong></td>
                      <td>{d.faculty}</td>
                      <td>{d.submissions}</td>
                      <td>
                        {d.pending > 0
                          ? <span className={styles.pendingChip}>{d.pending}</span>
                          : <span className={styles.zeroChip}>0</span>}
                      </td>
                      <td>{d.approved}</td>
                      <td>
                        <div className={styles.rateWrap}>
                          <div className={styles.rateBar}>
                            <div className={styles.rateFill}
                              style={{ width: `${d.submissions > 0 ? Math.round((d.approved / d.submissions) * 100) : 0}%` }} />
                          </div>
                          <span>{d.submissions > 0 ? Math.round((d.approved / d.submissions) * 100) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {deptStats.length === 0 && (
                    <tr><td colSpan={6} className={styles.emptyRow}>No department data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content summary */}
          <div className={styles.twoCol}>
            <div className={styles.card}>
              <SectionHead icon={BookOpen} title="Content Summary" sub="Across all departments" />
              <div className={styles.contentSummary}>
                {[
                  { label: 'Events',   value: events.filter(e => e.type === 'Event').length,   color: '#DB2777' },
                  { label: 'News',     value: events.filter(e => e.type === 'News').length,    color: '#0891B2' },
                  { label: 'MoUs',     value: events.filter(e => e.type === 'MoU').length,     color: '#059669' },
                  { label: 'Trending', value: trending.length,                                  color: '#7C3AED' },
                  { label: 'Published',value: [...events, ...trending].filter(i => i.status === 'Published' || i.status === 'Approved').length, color: '#15803D' },
                  { label: 'Drafts',   value: [...events, ...trending].filter(i => i.status === 'Draft').length, color: '#64748B' },
                ].map(item => (
                  <div key={item.label} className={styles.contentSummaryRow}>
                    <span className={styles.contentSummaryDot} style={{ background: item.color }} />
                    <span className={styles.contentSummaryLabel}>{item.label}</span>
                    <span className={styles.contentSummaryValue} style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <SectionHead icon={AlertTriangle} title="Pending Override Requests"
                sub="Submissions that may need admin intervention" />
              <div className={styles.overrideList}>
                {submissions.filter(s => s.status === 'Pending').slice(0, 5).map(sub => (
                  <div key={sub.id} className={styles.overrideItem}>
                    <div className={styles.overrideItemLeft}>
                      <span className={styles.overrideType}>{sub.type}</span>
                      <span className={styles.overrideTitle}>{sub.title}</span>
                      <span className={styles.overrideDept}>{sub.department}</span>
                    </div>
                    <button className={styles.overrideBtn} onClick={() => setOverrideSub(sub)}>
                      <Shield size={12} /> Override
                    </button>
                  </div>
                ))}
                {submissions.filter(s => s.status === 'Pending').length === 0 && (
                  <div className={styles.emptySmall}><CheckCircle size={20} color="#BBF7D0" /><span>No pending items</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          USER MANAGEMENT
      ══════════════════════════════════════ */}
      {activeSection === 'users' && (
        <div className={styles.section}>
          <div className={styles.card}>
            <SectionHead icon={Users} title="User Management"
              sub={`${filteredUsers.length} of ${totalUsers} users`}
              action={
                <button className={styles.btnPrimary} onClick={() => setEditUser('new')}>
                  <UserPlus size={14} /> Add User
                </button>
              }
            />

            {/* Filters */}
            <div className={styles.userFilters}>
              <div className={styles.searchBox}>
                <Users size={14} color="var(--gray-400)" />
                <input placeholder="Search by name or email..."
                  value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>
              <select className={styles.filterSelect} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className={styles.filterSelect} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="FACULTY">Faculty</option>
                <option value="HOD">HOD</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className={styles.userTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Role</th>
                    <th>Submissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((f, i) => {
                    const userSubs = submissions.filter(s => s.userId === (f._id || f.id));
                    return (
                      <tr key={f.id} className={styles.tableRow}>
                        <td className={styles.tdIndex}>{i + 1}</td>
                        <td>
                          <div className={styles.userCell}>
                            <Avatar name={f.name} avatar={f.avatar} size={32} />
                            <span className={styles.userName}>{f.name}</span>
                          </div>
                        </td>
                        <td className={styles.tdMuted}>{f.email || '—'}</td>
                        <td className={styles.tdMuted}>{f.department || '—'}</td>
                        <td className={styles.tdMuted}>{f.designation || '—'}</td>
                        <td>
                          <span className={`${styles.roleChip} ${styles['role' + (f.role || 'FACULTY')]}`}>
                            {f.role || 'FACULTY'}
                          </span>
                        </td>
                        <td className={styles.tdCenter}>{userSubs.length}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className={styles.actionBtn} onClick={() => setEditUser(f)} title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                              onClick={() => setDeleteUser(f)} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={8} className={styles.emptyRow}>No users match the current filters</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ALL SUBMISSIONS
      ══════════════════════════════════════ */}
      {activeSection === 'submissions' && (
        <div className={styles.section}>
          <div className={styles.card}>
            <SectionHead icon={FileText} title="All Submissions"
              sub="System-wide view across all departments and users" />
            <div className={styles.submissionsTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Department</th>
                    <th>Submitted By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Reviewed By</th>
                    <th>Override</th>
                  </tr>
                </thead>
                <tbody>
                  {[...submissions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((sub, i) => (
                    <tr key={sub.id} className={styles.tableRow}>
                      <td className={styles.tdIndex}>{i + 1}</td>
                      <td>
                        <div className={styles.subTitle}>{sub.title}</div>
                        {sub.changeDescription && (
                          <div className={styles.subDesc}>{sub.changeDescription.substring(0, 50)}…</div>
                        )}
                      </td>
                      <td><span className={styles.typeChip}>{sub.type}</span></td>
                      <td className={styles.tdMuted}>{sub.department}</td>
                      <td className={styles.tdMuted}>{sub.submittedBy || '—'}</td>
                      <td className={styles.tdMuted}>{sub.date}</td>
                      <td><Badge status={sub.status}>{sub.status}</Badge></td>
                      <td className={styles.tdMuted}>{sub.reviewedBy || '—'}</td>
                      <td>
                        {sub.status === 'Pending' && (
                          <button className={styles.overrideBtnSm} onClick={() => setOverrideSub(sub)}>
                            <Shield size={11} /> Override
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr><td colSpan={9} className={styles.emptyRow}>No submissions found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ACTIVITY LOG
      ══════════════════════════════════════ */}
      {activeSection === 'activity' && (
        <div className={styles.section}>
          <div className={styles.card}>
            <SectionHead icon={Activity} title="Activity Log"
              sub="Recent system-wide submission activity" />
            <div className={styles.activityLog}>
              {activityLog.map((sub, i) => {
                const cfg = {
                  Approved: { color: '#15803D', bg: '#F0FDF4', icon: CheckCircle },
                  Rejected: { color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
                  Pending:  { color: '#D97706', bg: '#FFFBEB', icon: Clock },
                  Draft:    { color: '#64748B', bg: '#F1F5F9', icon: FileText },
                }[sub.status] || { color: '#64748B', bg: '#F1F5F9', icon: FileText };
                const Icon = cfg.icon;
                return (
                  <div key={sub.id} className={styles.activityItem}>
                    <div className={styles.activityIconWrap} style={{ background: cfg.bg }}>
                      <Icon size={14} color={cfg.color} />
                    </div>
                    <div className={styles.activityBody}>
                      <div className={styles.activityTitle}>{sub.title}</div>
                      <div className={styles.activityMeta}>
                        <span>{sub.type}</span>
                        <span className={styles.activityDot} />
                        <span>{sub.department}</span>
                        {sub.submittedBy && <><span className={styles.activityDot} /><span>by {sub.submittedBy}</span></>}
                        {sub.reviewedBy  && <><span className={styles.activityDot} /><span>reviewed by {sub.reviewedBy}</span></>}
                      </div>
                    </div>
                    <div className={styles.activityRight}>
                      <Badge status={sub.status}>{sub.status}</Badge>
                      <span className={styles.activityDate}>{sub.date}</span>
                    </div>
                  </div>
                );
              })}
              {activityLog.length === 0 && (
                <div className={styles.emptySmall}><Activity size={24} color="#CBD5E1" /><span>No activity yet</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {(editUser !== null) && (
        <UserModal
          user={editUser === 'new' ? null : editUser}
          onSave={handleSaveUser}
          onClose={() => setEditUser(null)}
        />
      )}

      {deleteUser && (
        <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setDeleteUser(null)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Remove User</h3>
              <button className={styles.modalClose} onClick={() => setDeleteUser(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{deleteUser.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setDeleteUser(null)}>Cancel</button>
              <button className={styles.btnDanger} onClick={() => handleDeleteUser(deleteUser._id || deleteUser.id)}>
                <Trash2 size={14} /> Remove User
              </button>
            </div>
          </div>
        </div>
      )}

      {overrideSub && (
        <OverrideModal
          submission={overrideSub}
          onApprove={handleOverrideApprove}
          onReject={handleOverrideReject}
          onClose={() => setOverrideSub(null)}
        />
      )}
    </div>
  );
}
