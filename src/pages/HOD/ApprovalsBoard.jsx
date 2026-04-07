// src/pages/HOD/ApprovalsBoard.jsx
import { useState, useEffect, memo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/useAuth';
import { Badge, Button, PageHeader, useToast } from '../../components/common/UI';
import ProfileComparisonModal from '../../components/common/ProfileComparisonModal';
import {
  CheckCircle, XCircle, Clock, Search, User, FileText,
  ChevronRight, Calendar, Handshake, Play, Tag,
  ExternalLink, X, MessageSquare,
} from 'lucide-react';
import styles from './ApprovalsBoard.module.css';

const COLUMNS = [
  { key: 'Pending',  label: 'Pending Review', icon: Clock,        color: '#D97706', bg: '#FFFBEB', borderColor: '#F59E0B' },
  { key: 'Approved', label: 'Approved',        icon: CheckCircle,  color: '#15803D', bg: '#F0FDF4', borderColor: '#22C55E' },
  { key: 'Rejected', label: 'Rejected',        icon: XCircle,      color: '#991B1B', bg: '#FEF2F2', borderColor: '#EF4444' },
];

const CONTENT_TYPES = ['Event', 'News', 'MoU', 'Trending'];

// ── Submission Card ──────────────────────────────────────────────────────────
const SubmissionCard = memo(function SubmissionCard({ sub, onClick, isDragging }) {
  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={() => onClick(sub)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardType}>{sub.type}</div>
        <Badge status={sub.status}>{sub.status}</Badge>
      </div>
      <div className={styles.cardTitle}>{sub.title}</div>
      <div className={styles.cardMeta}><User size={12} /> {sub.department}</div>
      {sub.changeDescription && (
        <div className={styles.cardChangeDesc}>
          <FileText size={12} /> {sub.changeDescription.substring(0, 50)}...
        </div>
      )}
      <div className={styles.cardFooter}>
        <span className={styles.cardDate}>{sub.date}</span>
        <ChevronRight size={14} color="var(--gray-400)" />
      </div>
    </div>
  );
});

// ── Content Preview ──────────────────────────────────────────────────────────
function ContentPreview({ data }) {
  if (!data) return <div style={{ color: 'var(--gray-400)', padding: 20 }}>No content data available.</div>;

  if (data.type === 'Trending') {
    return (
      <div className={styles.contentPreview}>
        <div className={styles.previewTrendingWrap}>
          <div className={styles.previewTrendingCard}>
            {data.coverImage
              ? <img src={data.coverImage} alt={data.title} className={styles.previewTrendingImg} />
              : <div className={styles.previewTrendingPlaceholder}><Play size={40} color="white" /></div>
            }
            <div className={styles.previewTrendingOverlay}><Play size={36} color="white" /></div>
            <div className={styles.previewTrendingInfo}>
              <h3>{data.title}</h3>
              <p>{data.date}</p>
            </div>
          </div>
          {data.reelUrl && (
            <a href={data.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.previewReelBtn}>
              <ExternalLink size={14} /> Open Reel
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentPreview}>
      {data.images?.length > 0 && (
        <div className={styles.previewImgWrap}>
          <img src={data.images[0].url} alt={data.title} className={styles.previewImg} />
        </div>
      )}
      <h2 className={styles.previewTitle}>{data.title}</h2>
      <div className={styles.previewMeta}>
        {data.date         && <span><Calendar  size={13} /> {data.date}</span>}
        {data.organization && <span><Handshake size={13} /> {data.organization}{data.duration ? ` · ${data.duration}` : ''}</span>}
      </div>
      {data.tags?.length > 0 && (
        <div className={styles.previewTags}>
          {data.tags.map(t => <span key={t} className={styles.previewTag}><Tag size={11} />{t}</span>)}
        </div>
      )}
      {data.description && (
        <div className={styles.previewDescription} dangerouslySetInnerHTML={{ __html: data.description }} />
      )}
      {data.images?.length > 1 && (
        <div className={styles.previewGallery}>
          {data.images.slice(1).map((img, i) => (
            <img key={i} src={img.url} alt="" className={styles.previewGalleryImg} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Content Detail Panel ─────────────────────────────────────────────────────
function ContentDetailPanel({ sub, onClose, onApprove, onReject, loading }) {
  const [comment, setComment] = useState('');
  const [confirm, setConfirm] = useState(null); // 'approve' | 'reject'
  const isPending = sub.status === 'Pending';

  useEffect(() => { setComment(''); setConfirm(null); }, [sub.id]);

  const handleConfirm = () => {
    const subId = sub._id || sub.id;
    if (confirm === 'approve') onApprove(subId, comment);
    else onReject(subId, comment);
    setConfirm(null);
  };

  return (
    <div className={styles.detailPanel}>
      {/* Confirm overlay */}
      {confirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>
              {confirm === 'approve' ? 'Approve Submission?' : 'Reject Submission?'}
            </div>
            <div className={styles.confirmSub}>
              <strong>"{sub.title}"</strong>
              {comment && <span className={styles.confirmComment}>Comment: "{comment}"</span>}
            </div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`${styles.confirmOk} ${confirm === 'approve' ? styles.confirmOkApprove : styles.confirmOkReject}`}
                onClick={handleConfirm}
              >
                {confirm === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.detailHeader}>
        <div>
          <div className={styles.detailTitle}>{sub.title}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <Badge status={sub.status}>{sub.status}</Badge>
            <span className={styles.cardType}>{sub.type}</span>
          </div>
        </div>
        <button className={styles.closeDetailBtn} onClick={onClose}><X size={16} /></button>
      </div>

      <div className={styles.detailBody}>
        <div className={styles.previewMeta} style={{ marginBottom: 16 }}>
          <div className={styles.previewMetaItem}><span>Department</span><strong>{sub.department}</strong></div>
          <div className={styles.previewMetaItem}><span>Submitted</span><strong>{sub.date}</strong></div>
        </div>

        <div className={styles.previewLabel}>Preview (as users see it)</div>
        <ContentPreview data={sub.contentData} />

        {sub.comments?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className={styles.previewLabel}><MessageSquare size={12} /> Previous Comments</div>
            {sub.comments.map((c, i) => (
              <div key={i} className={styles.prevComment}><MessageSquare size={12} /><span>{c}</span></div>
            ))}
          </div>
        )}
      </div>

      {isPending && (
        <div className={styles.actionPanel}>
          <textarea
            className={styles.commentBox}
            rows={2}
            placeholder="Add a comment (optional)..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Button variant="danger" style={{ flex: 1 }} loading={loading === 'reject'} disabled={!!loading} onClick={() => setConfirm('reject')}>
              <XCircle size={15} /> Reject
            </Button>
            <Button variant="success" style={{ flex: 1 }} loading={loading === 'approve'} disabled={!!loading} onClick={() => setConfirm('approve')}>
              <CheckCircle size={15} /> Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Board ───────────────────────────────────────────────────────────────
export default function ApprovalsBoard() {
  const { submissions, updateSubmissionStatus, getSubmissionsByDepartment } = useData();
  const { user } = useAuth();
  const toast = useToast();

  const [selectedSub, setSelectedSub]     = useState(null);
  const [search, setSearch]               = useState('');
  const [filterType, setFilterType]       = useState('');
  const [dragId, setDragId]               = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const base = user?.role === 'HOD'
    ? getSubmissionsByDepartment(user.department)
    : submissions;

  const types = [...new Set(base.map(s => s.type))];

  const filtered = base.filter(s =>
    (!search     || s.title.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || s.type === filterType)
  );

  // Keep selectedSub in sync with latest data
  useEffect(() => {
    if (!selectedSub) return;
    const updated = submissions.find(s => (s._id || s.id) === (selectedSub._id || selectedSub.id));
    if (updated) setSelectedSub(updated);
  }, [submissions]);

  const handleApprove = async (id, comment) => {
    setActionLoading('approve');
    try {
      await updateSubmissionStatus(id, 'Approved', comment, user?.name || 'HOD');
      toast('Submission approved successfully', 'success');
    } catch (e) {
      toast('Failed to approve submission', 'error');
    } finally {
      setActionLoading(null);
      setSelectedSub(null);
    }
  };

  const handleReject = async (id, comment) => {
    setActionLoading('reject');
    try {
      await updateSubmissionStatus(id, 'Rejected', comment, user?.name || 'HOD');
      toast('Submission rejected', 'warning');
    } catch (e) {
      toast('Failed to reject submission', 'error');
    } finally {
      setActionLoading(null);
      setSelectedSub(null);
    }
  };

  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragEnd   = () => setDragId(null);

  const onDrop = (e, status) => {
    e.preventDefault();
    if (!dragId) return;
    const sub = submissions.find(s => (s._id || s.id) === dragId);
    if (sub && sub.status !== status) {
      updateSubmissionStatus(dragId, status, '', user?.name || 'HOD');
      toast(`Moved to ${status}`, status === 'Approved' ? 'success' : status === 'Rejected' ? 'warning' : 'info');
    }
    setDragId(null);
  };

  const isContentSub = (sub) => CONTENT_TYPES.includes(sub?.type);

  return (
    <div className={styles.root}>
      <PageHeader title="Approvals Board" subtitle="Review, approve, or reject submissions" />

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--gray-400)" />
          <input type="text" placeholder="Search submissions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.filterSelect} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className={styles.boardLayout}>
        <div className={styles.kanban}>
          {COLUMNS.map(col => {
            const colSubs = filtered.filter(s => s.status === col.key);
            const ColIcon = col.icon;
            return (
              <div
                key={col.key}
                className={styles.column}
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDrop(e, col.key)}
                style={{ borderTop: `3px solid ${col.borderColor}` }}
              >
                <div className={styles.colHeader} style={{ background: col.bg }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ColIcon size={16} color={col.color} />
                    <span style={{ fontWeight: 700, color: col.color }}>{col.label}</span>
                  </div>
                  <span className={styles.colCount} style={{ background: col.color + '22', color: col.color }}>{colSubs.length}</span>
                </div>
                <div className={styles.colBody}>
                  {colSubs.length === 0 ? (
                    <div className={styles.emptyCol}>
                      <ColIcon size={24} color={col.color} style={{ opacity: 0.3 }} />
                      <span>No items</span>
                    </div>
                  ) : colSubs.map(sub => (
                    <div key={sub._id || sub.id} draggable onDragStart={e => onDragStart(e, sub._id || sub.id)} onDragEnd={onDragEnd}>
                      <SubmissionCard sub={sub} onClick={setSelectedSub} isDragging={dragId === (sub._id || sub.id)} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedSub && isContentSub(selectedSub) && (
          <ContentDetailPanel
            sub={selectedSub}
            onClose={() => setSelectedSub(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={actionLoading}
          />
        )}
      </div>

      {/* Profile modal rendered OUTSIDE boardLayout so it overlays correctly */}
      {selectedSub && !isContentSub(selectedSub) && (
        <ProfileComparisonModal
          isOpen={true}
          onClose={() => setSelectedSub(null)}
          submission={selectedSub}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={true}
        />
      )}
    </div>
  );
}
