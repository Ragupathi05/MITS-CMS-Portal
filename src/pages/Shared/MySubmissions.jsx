// src/pages/Shared/MySubmissions.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { Badge, Button, PageHeader, useToast } from '../../components/common/UI';
import ProfileComparisonModal from '../../components/common/ProfileComparisonModal';
import {
  FileText, Search, RotateCcw, Eye, CheckCircle2, Clock, XCircle,
  Layers, FlaskConical, Lightbulb, GraduationCap, Trophy, FolderKanban,
  CalendarDays, Handshake, UserCircle, RefreshCw, UserCheck,
  CheckCircle, XCircle as XCircleIcon, PenLine, Tag, Calendar,
  Building2, MessageSquare, X, ExternalLink, Play, Image,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MySubmissions.module.css';

// ── Constants ────────────────────────────────────────────────────────────────

const TYPE_META = {
  Research:    { icon: FlaskConical,  color: '#7C3AED', bg: '#F5F3FF' },
  Patent:      { icon: Lightbulb,     color: '#D97706', bg: '#FFFBEB' },
  Education:   { icon: GraduationCap, color: '#0369A1', bg: '#E0F2FE' },
  Achievement: { icon: Trophy,        color: '#B45309', bg: '#FEF3C7' },
  Project:     { icon: FolderKanban,  color: '#059669', bg: '#ECFDF5' },
  Event:       { icon: CalendarDays,  color: '#DB2777', bg: '#FDF2F8' },
  MoU:         { icon: Handshake,     color: '#0891B2', bg: '#ECFEFF' },
  Profile:     { icon: UserCircle,    color: '#4F46E5', bg: '#EEF2FF' },
  Trending:    { icon: Play,          color: '#7C3AED', bg: '#F5F3FF' },
  News:        { icon: PenLine,       color: '#0F766E', bg: '#F0FDFA' },
};

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Draft'];

const STATUS_META = {
  All:      { color: '#1E3A8A', bg: '#EFF6FF', icon: Layers },
  Approved: { color: '#15803D', bg: '#F0FDF4', icon: CheckCircle2 },
  Pending:  { color: '#92400E', bg: '#FFFBEB', icon: Clock },
  Rejected: { color: '#991B1B', bg: '#FEF2F2', icon: XCircle },
  Draft:    { color: '#475569', bg: '#F8FAFC', icon: PenLine },
};

// ── Content Preview Modal ────────────────────────────────────────────────────

function ContentModal({ sub, onClose, onApprove, onReject, showActions }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(null);
  const d = sub.contentData;
  const isPending = sub.status === 'Pending';
  const meta = TYPE_META[sub.type] || { icon: FileText, color: '#64748B', bg: '#F1F5F9' };
  const TypeIcon = meta.icon;

  const handleAction = (action) => {
    setLoading(action);
    setTimeout(() => {
      if (action === 'approve') onApprove(sub.id, comment);
      else onReject(sub.id, comment);
      setLoading(null);
      onClose();
    }, 350);
  };

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalTypeBadge} style={{ background: meta.bg, color: meta.color }}>
              <TypeIcon size={14} /> {sub.type}
            </div>
            <h2 className={styles.modalTitle}>{sub.title}</h2>
            <div className={styles.modalMeta}>
              <span><Building2 size={12} /> {sub.department}</span>
              <span><Calendar size={12} /> {sub.submittedDate || sub.date}</span>
              {sub.submittedBy && <span><UserCheck size={12} /> {sub.submittedBy}</span>}
              <Badge status={sub.status}>{sub.status}</Badge>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>

        {/* Change description */}
        {sub.changeDescription && (
          <div className={styles.modalChangeNote}>
            <PenLine size={13} />
            <span>{sub.changeDescription}</span>
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {d ? (
            <div className={styles.contentPreview}>
              {/* Hero image */}
              {d.images?.length > 0 && (
                <img src={d.images[0].url} alt={d.title} className={styles.previewHero} />
              )}
              {/* Trending reel card */}
              {sub.type === 'Trending' && (
                <div className={styles.previewTrendingWrap}>
                  <div className={styles.previewTrendingCard}>
                    {d.coverImage
                      ? <img src={d.coverImage} alt={d.title} className={styles.previewTrendingImg} />
                      : <div className={styles.previewTrendingPlaceholder}><Play size={32} color="white" /></div>
                    }
                    <div className={styles.previewTrendingOverlay}><Play size={24} color="white" /></div>
                    <div className={styles.previewTrendingInfo}>
                      <strong>{d.title}</strong>
                      <span>{d.date}</span>
                    </div>
                  </div>
                  {d.reelUrl && (
                    <a href={d.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.reelLink}>
                      <ExternalLink size={13} /> Open Reel
                    </a>
                  )}
                </div>
              )}

              {sub.type !== 'Trending' && (
                <>
                  <h3 className={styles.previewTitle}>{d.title}</h3>
                  <div className={styles.previewMetaRow}>
                    {d.date         && <span><Calendar  size={12} /> {d.date}</span>}
                    {d.organization && <span><Handshake size={12} /> {d.organization}{d.duration ? ` · ${d.duration}` : ''}</span>}
                  </div>
                  {d.tags?.length > 0 && (
                    <div className={styles.previewTags}>
                      {d.tags.map(t => (
                        <span key={t} className={styles.previewTag}><Tag size={10} />{t}</span>
                      ))}
                    </div>
                  )}
                  {d.description && (
                    <div
                      className={styles.previewDesc}
                      dangerouslySetInnerHTML={{ __html: d.description }}
                    />
                  )}
                  {d.images?.length > 1 && (
                    <div className={styles.previewGallery}>
                      {d.images.slice(1).map((img, i) => (
                        <img key={i} src={img.url} alt="" className={styles.previewGalleryImg} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className={styles.noContent}>
              <Image size={32} color="var(--gray-300)" />
              <span>No content preview available</span>
            </div>
          )}

          {/* Previous comments */}
          {sub.comments?.length > 0 && (
            <div className={styles.modalComments}>
              <div className={styles.modalCommentsLabel}><MessageSquare size={13} /> Comments</div>
              {sub.comments.map((c, i) => (
                <div key={i} className={styles.modalCommentItem}><MessageSquare size={12} /><span>{c}</span></div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && isPending && (
          <div className={styles.modalActions}>
            <textarea
              className={styles.modalCommentBox}
              rows={2}
              placeholder="Add a comment (optional)…"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className={styles.modalActionBtns}>
              <Button variant="danger"  loading={loading === 'reject'}  disabled={!!loading} onClick={() => handleAction('reject')}>
                <XCircleIcon size={14} /> Reject
              </Button>
              <Button variant="success" loading={loading === 'approve'} disabled={!!loading} onClick={() => handleAction('approve')}>
                <CheckCircle size={14} /> Approve
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Admin inline approve/reject ──────────────────────────────────────────────

function AdminActions({ sub, onApprove, onReject }) {
  const [open, setOpen]       = useState(false);
  const [action, setAction]   = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (sub.status !== 'Pending') return <span className={styles.reviewedBy}>—</span>;

  if (open) return (
    <div className={styles.inlineAction}>
      <input
        className={styles.inlineInput}
        placeholder={action === 'reject' ? 'Reason (required)…' : 'Comment (optional)…'}
        value={comment}
        onChange={e => setComment(e.target.value)}
        autoFocus
      />
      <div className={styles.inlineActionBtns}>
        <button className={styles.inlineBtnCancel} onClick={() => { setOpen(false); setComment(''); }}>
          Cancel
        </button>
        <button
          className={action === 'approve' ? styles.inlineBtnApprove : styles.inlineBtnReject}
          disabled={loading || (action === 'reject' && !comment.trim())}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              action === 'approve' ? onApprove(sub.id, comment) : onReject(sub.id, comment);
              setOpen(false); setComment(''); setLoading(false);
            }, 350);
          }}
        >
          {loading ? '…' : action === 'approve' ? 'Confirm' : 'Confirm'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.adminActionBtns}>
      <button className={styles.approveBtn} onClick={() => { setAction('approve'); setOpen(true); }}>
        <CheckCircle size={11} /> Approve
      </button>
      <button className={styles.rejectBtn} onClick={() => { setAction('reject'); setOpen(true); }}>
        <XCircleIcon size={11} /> Reject
      </button>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function MySubmissions() {
  const { user }    = useAuth();
  const { submissions, getSubmissionsByDepartment, updateSubmissionStatus } = useData();
  const navigate    = useNavigate();
  const toast       = useToast();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter,   setTypeFilter]   = useState('All');
  const [deptFilter,   setDeptFilter]   = useState('All');
  const [preview,      setPreview]      = useState(null);

  const isAdmin  = user.role === 'ADMIN';
  const isHOD    = user.role === 'HOD';

  // Sync preview with latest submission data so status updates reflect immediately
  useEffect(() => {
    if (!preview) return;
    const updated = submissions.find(s => s.id === preview.id);
    if (updated) setPreview(updated);
  }, [submissions]);

  const base = useMemo(() => {
    if (isAdmin)  return submissions;
    if (isHOD)    return getSubmissionsByDepartment(user.department);
    return submissions.filter(s => s.userId === (user.id || 'f1'));
  }, [submissions, user, isAdmin, isHOD]);

  const departments = useMemo(() =>
    ['All', ...new Set(base.map(s => s.department).filter(Boolean))],
    [base]
  );

  const types = useMemo(() =>
    ['All', ...new Set(base.map(s => s.type).filter(Boolean))],
    [base]
  );

  // Counts per status (unaffected by current filter — always from base)
  const counts = useMemo(() => ({
    All:      base.length,
    Approved: base.filter(s => s.status === 'Approved').length,
    Pending:  base.filter(s => s.status === 'Pending').length,
    Rejected: base.filter(s => s.status === 'Rejected').length,
    Draft:    base.filter(s => s.status === 'Draft').length,
  }), [base]);

  const filtered = useMemo(() => base.filter(s => {
    const q = search.toLowerCase();
    return (
      (statusFilter === 'All' || s.status === statusFilter) &&
      (typeFilter   === 'All' || s.type   === typeFilter)   &&
      (deptFilter   === 'All' || s.department === deptFilter) &&
      (!q || s.title?.toLowerCase().includes(q) || s.type?.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q))
    );
  }), [base, search, statusFilter, typeFilter, deptFilter]);

  const hasFilters = search || statusFilter !== 'All' || typeFilter !== 'All' || deptFilter !== 'All';

  const handleApprove = (id, comment) => {
    updateSubmissionStatus(id, 'Approved', comment, user?.name);
    toast('Submission approved', 'success');
  };
  const handleReject = (id, comment) => {
    updateSubmissionStatus(id, 'Rejected', comment, user?.name);
    toast('Submission rejected', 'warning');
  };

  const isContentType = (type) => ['Event', 'News', 'MoU', 'Trending'].includes(type);

  const openPreview = (sub) => setPreview(sub);

  return (
    <div className={styles.root}>
      <PageHeader
        title={isAdmin ? 'All Submissions' : isHOD ? 'Department Submissions' : 'My Submissions'}
        subtitle={
          isAdmin   ? 'Monitor all faculty submissions — review, approve or reject' :
          isHOD     ? 'Track and review submissions from your department' :
                      'Track the status of everything you have submitted'
        }
      />

      {/* ── Summary strip ── */}
      <div className={styles.summaryStrip}>
        {STATUS_FILTERS.map(s => {
          const m = STATUS_META[s];
          const SIcon = m.icon;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              className={`${styles.summaryCard} ${active ? styles.summaryCardActive : ''}`}
              style={active ? { '--sc': m.color, '--sb': m.bg } : {}}
              onClick={() => setStatusFilter(s)}
            >
              <div className={styles.summaryIcon} style={{ background: active ? m.bg : 'var(--gray-100)' }}>
                <SIcon size={16} color={active ? m.color : 'var(--gray-400)'} />
              </div>
              <div className={styles.summaryText}>
                <span className={styles.summaryCount} style={active ? { color: m.color } : {}}>
                  {counts[s]}
                </span>
                <span className={styles.summaryLabel}>{s === 'All' ? 'Total' : s}</span>
              </div>
              {active && <span className={styles.summaryDot} style={{ background: m.color }} />}
            </button>
          );
        })}
      </div>

      {/* ── Table card ── */}
      <div className={styles.tableCard}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.searchBox}>
              <Search size={14} color="var(--gray-400)" />
              <input
                placeholder="Search title, type, department…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearBtn} onClick={() => setSearch('')}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          <div className={styles.toolbarRight}>
            <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>
            {(isAdmin || isHOD) && (
              <select className={styles.filterSelect} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
              </select>
            )}
            {hasFilters && (
              <Button variant="ghost" size="sm" icon={RotateCcw}
                onClick={() => { setSearch(''); setStatusFilter('All'); setTypeFilter('All'); setDeptFilter('All'); }}>
                Clear
              </Button>
            )}
            <span className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FileText size={32} color="var(--gray-300)" />
            </div>
            <p className={styles.emptyTitle}>No submissions found</p>
            <p className={styles.emptySubtitle}>
              {hasFilters ? 'Try adjusting your search or filters.' : 'Nothing has been submitted yet.'}
            </p>
            {hasFilters && (
              <Button variant="secondary" size="sm" icon={RotateCcw}
                onClick={() => { setSearch(''); setStatusFilter('All'); setTypeFilter('All'); setDeptFilter('All'); }}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thNum}>#</th>
                  <th>Submission</th>
                  <th>Type</th>
                  <th>Department</th>
                  {(isAdmin || isHOD) && <th>Submitted By</th>}
                  <th>Status</th>
                  <th>Date</th>
                  <th>Reviewed By</th>
                  {(isAdmin || isHOD) && <th>Actions</th>}
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, idx) => {
                  const meta    = TYPE_META[sub.type] || { icon: FileText, color: '#64748B', bg: '#F1F5F9' };
                  const TypeIcon = meta.icon;
                  return (
                    <tr key={sub.id} className={styles.row}>
                      <td className={styles.tdNum}>{idx + 1}</td>

                      {/* Title cell */}
                      <td className={styles.tdTitle}>
                        <div className={styles.titleMain}>{sub.title}</div>
                        {sub.changeDescription && (
                          <div className={styles.titleSub}>
                            <PenLine size={10} />
                            {sub.changeDescription.substring(0, 60)}{sub.changeDescription.length > 60 ? '…' : ''}
                          </div>
                        )}
                        {sub.comments?.length > 0 && (
                          <div className={styles.titleSub}>
                            <MessageSquare size={10} />
                            {sub.comments[sub.comments.length - 1]}
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td>
                        <span className={styles.typePill} style={{ background: meta.bg, color: meta.color }}>
                          <TypeIcon size={11} /> {sub.type}
                        </span>
                      </td>

                      {/* Department */}
                      <td className={styles.tdSecondary}>{sub.department || '—'}</td>

                      {/* Submitted by (admin/hod) */}
                      {(isAdmin || isHOD) && (
                        <td className={styles.tdSecondary}>{sub.submittedBy || '—'}</td>
                      )}

                      {/* Status */}
                      <td><Badge status={sub.status}>{sub.status}</Badge></td>

                      {/* Date */}
                      <td className={styles.tdDate}>{sub.submittedDate || sub.date || '—'}</td>

                      {/* Reviewed by */}
                      <td className={styles.tdDate}>
                        {sub.reviewedBy
                          ? <span className={styles.reviewedBy}><UserCheck size={11} /> {sub.reviewedBy}</span>
                          : <span className={styles.tdMuted}>—</span>
                        }
                      </td>

                      {/* Admin actions */}
                      {(isAdmin || isHOD) && (
                        <td>
                          <AdminActions sub={sub} onApprove={handleApprove} onReject={handleReject} />
                        </td>
                      )}

                      {/* View */}
                      <td>
                        <div className={styles.viewCell}>
                          <button className={styles.viewBtn} onClick={() => openPreview(sub)}>
                            <Eye size={13} /> View
                          </button>
                          {!isAdmin && !isHOD && sub.status === 'Rejected' && sub.type === 'Profile' && !sub.superseded && (
                            <button className={styles.resubmitBtn} onClick={() => navigate('/profile')}>
                              <RefreshCw size={11} /> Resubmit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Preview modal ── */}
      {preview && (
        isContentType(preview.type) ? (
          <ContentModal
            sub={preview}
            onClose={() => setPreview(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            showActions={isAdmin || isHOD}
          />
        ) : (
          <ProfileComparisonModal
            isOpen={!!preview}
            onClose={() => setPreview(null)}
            submission={preview}
            showActions={(isAdmin || isHOD) && preview?.status === 'Pending'}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )
      )}
    </div>
  );
}
