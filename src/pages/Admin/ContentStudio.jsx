// src/pages/Admin/ContentStudio.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import {
  Badge, Button, EmptyState, PageHeader,
  FormField, Input, SlidePanel, Modal as DialogModal, useToast,
} from '../../components/common/UI';
import ImageUploader from '../../components/common/ImageUploader';
import RichTextEditor from '../../components/common/RichTextEditor';
import EventReportForm from './EventReportForm';
import MoUReportForm from './MoUReportForm';
import NewsReportForm from './NewsReportForm';
import mouFormStyles from './MoUReportForm.module.css';
import newsFormStyles from './NewsReportForm.module.css';
import {
  Plus, Calendar, Handshake, Search, Pencil, Trash2,
  Save, X, Play, Newspaper, TrendingUp, ExternalLink,
  Tag, Eye, CheckCircle, Filter, Globe, FileText,
  AlertTriangle,
} from 'lucide-react';
import styles from './ContentStudio.module.css';
import eventFormStyles from './EventReportForm.module.css';

const TABS = ['Events', 'MoUs', 'News', 'Trending'];

const TAB_META = {
  Events:   { icon: Calendar,   color: '#DB2777', bg: '#FDF2F8', type: 'Event'    },
  MoUs:     { icon: Handshake,  color: '#0891B2', bg: '#ECFEFF', type: 'MoU'      },
  News:     { icon: Newspaper,  color: '#0F766E', bg: '#F0FDFA', type: 'News'     },
  Trending: { icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF', type: 'Trending' },
};

const STATUS_STYLE = {
  Published: { color: '#15803D', bg: '#DCFCE7', dot: '#22C55E' },
  Approved:  { color: '#15803D', bg: '#DCFCE7', dot: '#22C55E' },
  Draft:     { color: '#64748B', bg: '#F1F5F9', dot: '#94A3B8' },
  Pending:   { color: '#92400E', bg: '#FEF3C7', dot: '#F59E0B' },
};

/* ── Tag Input ─────────────────────────────────────────────────────────────── */
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); setInput(''); }
  };
  return (
    <div className={styles.tagInput}>
      <div className={styles.tagList}>
        {tags.map(t => (
          <span key={t} className={styles.tag}>
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))}><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className={styles.tagInputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Add tag and press Enter"
        />
        <button type="button" className={styles.tagAddBtn} onClick={add}>+</button>
      </div>
    </div>
  );
}

/* ── Content Form ──────────────────────────────────────────────────────────── */
function ContentForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const isEvent    = form.type === 'Event';
  const isNews     = form.type === 'News';
  const isMou      = form.type === 'MoU';
  const isTrending = form.type === 'Trending';

  // Use new EventReportForm for Events
  if (isEvent) {
    return (
      <div className={eventFormStyles.eventFormContainer}>
        <EventReportForm initial={initial} onSave={onSave} onClose={onClose} saving={saving} />
      </div>
    );
  }

  // Use new MoUReportForm for MoUs
  if (isMou) {
    return (
      <div className={mouFormStyles.mouFormContainer}>
        <MoUReportForm initial={initial} onSave={onSave} onClose={onClose} saving={saving} />
      </div>
    );
  }

  // Use new NewsReportForm for News
  if (isNews) {
    return (
      <div className={newsFormStyles.newsFormContainer}>
        <NewsReportForm initial={initial} onSave={onSave} onClose={onClose} saving={saving} />
      </div>
    );
  }

  const canPublish = form.title?.trim() && (isTrending ? !!form.reelUrl?.trim() : true);

  return (
    <div className={styles.formWrap}>
      <FormField label="Title *">
        <Input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder={
            isNews ? 'News headline…' :
            isMou  ? 'MoU title…' :
            isTrending ? 'Trending content title…' : 'Event title…'
          }
        />
      </FormField>

      {(isEvent || isNews) && (
        <FormField label="Date">
          <Input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} />
        </FormField>
      )}

      {isMou && (
        <>
          <FormField label="Partner Organization *">
            <Input value={form.organization || ''} onChange={e => set('organization', e.target.value)} placeholder="Organization name…" />
          </FormField>
          <FormField label="Duration">
            <Input value={form.duration || ''} onChange={e => set('duration', e.target.value)} placeholder="e.g. 3 Years (2024–2027)" />
          </FormField>
        </>
      )}

      {isTrending && (
        <>
          <FormField label="Reel URL (Instagram / YouTube Shorts) *">
            <Input value={form.reelUrl || ''} onChange={e => set('reelUrl', e.target.value)} placeholder="https://www.instagram.com/reel/…" />
          </FormField>
          <FormField label="Date">
            <Input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} />
          </FormField>
        </>
      )}

      {!isTrending && (
        <FormField label="Description / Content">
          <RichTextEditor value={form.description || ''} onChange={v => set('description', v)} placeholder="Write a detailed description…" />
        </FormField>
      )}

      {(isEvent || isNews) && (
        <FormField label="Tags">
          <TagInput tags={form.tags || []} onChange={v => set('tags', v)} />
        </FormField>
      )}

      {!isTrending && (
        <FormField label={isMou ? 'Document / Images' : isNews ? 'News Images' : 'Event Images'}>
          <ImageUploader images={form.images || []} onChange={imgs => set('images', imgs)} multiple />
        </FormField>
      )}

      {isTrending && (
        <>
          <FormField label="Cover Image (Portrait 9:16 — e.g. 1080×1920)">
            <div className={styles.imageUploadSection}>
              <ImageUploader
                images={form.coverImage ? [{ id: 'cover', url: form.coverImage }] : []}
                onChange={imgs => set('coverImage', imgs[0]?.url || null)}
                multiple={false}
              />
              <div className={styles.imageHint}>
                <p>⚠ Must be portrait (9:16). Example: 1080×1920px</p>
              </div>
            </div>
          </FormField>
          {form.coverImage && (
            <FormField label="Preview">
              <div className={styles.previewContainer}>
                <div className={styles.previewCard}>
                  <img src={form.coverImage} alt="Preview" className={styles.previewImage} />
                  <div className={styles.previewOverlay}><Play size={32} color="white" /></div>
                  <div className={styles.previewTitle}>{form.title || 'Title'}</div>
                </div>
              </div>
            </FormField>
          )}
        </>
      )}

      <div className={styles.formActions}>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          variant="secondary"
          icon={Save}
          loading={saving === 'draft'}
          disabled={!!saving || !form.title?.trim()}
          onClick={() => onSave({ ...form, status: 'Draft' })}
        >
          Save Draft
        </Button>
        <Button
          icon={CheckCircle}
          loading={saving === 'publish'}
          disabled={!!saving || !canPublish}
          onClick={() => onSave({ ...form, status: 'Published' })}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}

/* ── View Modal ────────────────────────────────────────────────────────────── */
function ViewModal({ item, onClose, onEdit }) {
  if (!item) return null;
  const isTrending = item.type === 'Trending';
  const tabKey = { Event: 'Events', MoU: 'MoUs', News: 'News', Trending: 'Trending' }[item.type];
  const meta = TAB_META[tabKey] || TAB_META.Events;

  return (
    <div className={styles.viewBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.viewModal}>
        <div className={styles.viewHeader}>
          <div className={styles.viewHeaderLeft}>
            <span className={styles.viewTypePill} style={{ background: meta.bg, color: meta.color }}>
              <meta.icon size={12} /> {item.type}
            </span>
            <StatusPill status={item.status} />
          </div>
          <div className={styles.viewHeaderRight}>
            <button className={styles.viewActionBtn} onClick={() => { onClose(); onEdit(item); }} title="Edit">
              <Pencil size={14} />
            </button>
            <button className={styles.viewClose} onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className={styles.viewBody}>
          {isTrending ? (
            <div className={styles.viewTrendingWrap}>
              <div className={styles.viewTrendingCard}>
                {item.coverImage
                  ? <img src={item.coverImage} alt={item.title} className={styles.viewTrendingImg} />
                  : <div className={styles.viewTrendingPlaceholder}><Play size={48} color="white" /></div>}
                <div className={styles.viewTrendingOverlay}><Play size={40} color="white" /></div>
                <div className={styles.viewTrendingInfo}>
                  <h2>{item.title}</h2>
                  <p>{item.date}</p>
                </div>
              </div>
              {item.reelUrl && (
                <a href={item.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.viewReelBtn}>
                  <ExternalLink size={15} /> Open Reel
                </a>
              )}
            </div>
          ) : (
            <>
              {item.images?.length > 0 && (
                <div className={styles.viewImgWrap}>
                  <img src={item.images[0].url} alt={item.title} className={styles.viewImg} />
                </div>
              )}
              <h1 className={styles.viewTitle}>{item.title}</h1>
              <div className={styles.viewMeta}>
                {item.date         && <span><Calendar  size={13} /> {item.date}</span>}
                {item.organization && <span><Handshake size={13} /> {item.organization}{item.duration ? ` · ${item.duration}` : ''}</span>}
                {item.department   && <span><Globe     size={13} /> {item.department}</span>}
              </div>
              {item.tags?.length > 0 && (
                <div className={styles.viewTags}>
                  {item.tags.map(t => <span key={t} className={styles.viewTag}><Tag size={11} />{t}</span>)}
                </div>
              )}
              {item.description && (
                <div className={styles.viewDescription} dangerouslySetInnerHTML={{ __html: item.description }} />
              )}
              {item.images?.length > 1 && (
                <div className={styles.viewGallery}>
                  <div className={styles.viewGalleryLabel}>Gallery ({item.images.length})</div>
                  <div className={styles.viewGalleryGrid}>
                    {item.images.map((img, i) => (
                      <img key={i} src={img.url} alt="" className={styles.viewGalleryImg} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Status Pill ───────────────────────────────────────────────────────────── */
function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Draft;
  return (
    <span className={styles.statusPill} style={{ background: s.bg, color: s.color }}>
      <span className={styles.statusDot} style={{ background: s.dot }} />
      {status}
    </span>
  );
}

/* ── Content Card ──────────────────────────────────────────────────────────── */
function ContentCard({ item, onEdit, onDelete, onView, tabMeta }) {
  const isTrending = item.type === 'Trending';
  const isPublished = item.status === 'Published' || item.status === 'Approved';

  return (
    <div className={`${styles.contentCard} ${isPublished ? styles.contentCardPublished : ''}`}>
      {/* Thumbnail */}
      <div
        className={`${styles.cardThumb} ${isTrending ? styles.cardThumbTrending : ''}`}
        onClick={() => onView(item)}
      >
        {item.images?.[0]?.url ? (
          <img src={item.images[0].url} alt="" className={styles.cardThumbImg} />
        ) : item.coverImage ? (
          <img src={item.coverImage} alt="" className={styles.cardThumbImg} style={{ objectPosition: 'top' }} />
        ) : (
          <div className={styles.cardThumbPlaceholder} style={{ background: tabMeta.bg }}>
            <tabMeta.icon size={32} color={tabMeta.color} style={{ opacity: 0.5 }} />
          </div>
        )}
        <div className={styles.cardThumbOverlay}>
          <button className={styles.cardViewBtn}><Eye size={14} /> Preview</button>
        </div>
        {/* Published indicator stripe */}
        {isPublished && <div className={styles.cardPublishedStripe} />}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardTopRow}>
          <StatusPill status={item.status} />
          {item.date && <span className={styles.cardDate}><Calendar size={11} />{item.date}</span>}
        </div>

        <h3 className={styles.cardTitle}>{item.title}</h3>

        {item.organization && (
          <div className={styles.cardOrg}><Handshake size={11} />{item.organization}{item.duration ? ` · ${item.duration}` : ''}</div>
        )}
        {item.reelUrl && (
          <a href={item.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.cardReelLink}>
            <ExternalLink size={11} /> View Reel
          </a>
        )}

        {item.tags?.length > 0 && (
          <div className={styles.cardTags}>
            {item.tags.slice(0, 3).map(t => (
              <span key={t} className={styles.tagPill}><Tag size={9} />{t}</span>
            ))}
            {item.tags.length > 3 && <span className={styles.tagMore}>+{item.tags.length - 3}</span>}
          </div>
        )}

        <div className={styles.cardActions}>
          <button className={styles.cardActionBtn} onClick={() => onView(item)} title="Preview">
            <Eye size={14} />
          </button>
          <button className={`${styles.cardActionBtn} ${styles.cardActionEdit}`} onClick={() => onEdit(item)} title="Edit">
            <Pencil size={14} />
          </button>
          <button className={`${styles.cardActionBtn} ${styles.cardActionDelete}`} onClick={() => onDelete(item)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ────────────────────────────────────────────────────────── */
function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div className={styles.confirmOverlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.confirmBox}>
        <div className={styles.confirmIcon}><AlertTriangle size={26} color="#DC2626" /></div>
        <h3 className={styles.confirmTitle}>Delete this item?</h3>
        <p className={styles.confirmSub}>
          <strong>"{item.title}"</strong> will be permanently removed. This cannot be undone.
        </p>
        <div className={styles.confirmActions}>
          <button className={styles.confirmCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmDelete} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────────── */
export default function ContentStudio() {
  const { user } = useAuth();
  const {
    events, addEvent, updateEvent, deleteEvent,
    trending, addTrending, updateTrending, deleteTrending,
    faculty,
  } = useData();
  const toast = useToast();

  const [activeTab,    setActiveTab]    = useState('Events');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter,   setDeptFilter]   = useState('All');
  const [panel,        setPanel]        = useState(null);   // null | 'new' | item
  const [saving,       setSaving]       = useState(null);   // null | 'draft' | 'publish'
  const [deleteTarget, setDeleteTarget] = useState(null);   // item | null
  const [viewItem,     setViewItem]     = useState(null);

  const isAdmin       = user?.role === 'ADMIN';
  const isTrendingTab = activeTab === 'Trending';
  const tabMeta       = TAB_META[activeTab];

  const departments = useMemo(
    () => ['All', ...new Set(faculty.map(f => f.department).filter(Boolean))],
    [faculty]
  );

  // Raw items for active tab
  const allItems = useMemo(() => {
    const base = isTrendingTab
      ? trending.filter(t => isAdmin || t.department === user?.department)
      : events.filter(e => e.type === tabMeta.type);
    return base;
  }, [activeTab, events, trending, isAdmin, user?.department]);

  // Filtered items
  const items = useMemo(() => allItems.filter(item =>
    (statusFilter === 'All' || item.status === statusFilter) &&
    (deptFilter   === 'All' || item.department === deptFilter) &&
    (!search || item.title?.toLowerCase().includes(search.toLowerCase()) ||
                item.organization?.toLowerCase().includes(search.toLowerCase()))
  ), [allItems, statusFilter, deptFilter, search]);

  // Tab counts (unfiltered)
  const tabCounts = useMemo(() => ({
    Events:   events.filter(e => e.type === 'Event').length,
    MoUs:     events.filter(e => e.type === 'MoU').length,
    News:     events.filter(e => e.type === 'News').length,
    Trending: trending.length,
  }), [events, trending]);

  const getEmpty = () => {
    const base = { status: 'Draft', department: user?.department };
    if (activeTab === 'Events')   return { ...base, type: 'Event',    title: '', date: '',         description: '', images: [], tags: [] };
    if (activeTab === 'MoUs')     return { ...base, type: 'MoU',      title: '', organization: '', duration: '',    description: '', images: [] };
    if (activeTab === 'News')     return { ...base, type: 'News',     title: '', date: '',         description: '', images: [], tags: [] };
    return                               { ...base, type: 'Trending', title: '', reelUrl: '',      date: '',        coverImage: null };
  };

  const handleSave = (data) => {
    const isNew    = panel === 'new';
    const isDraft  = data.status === 'Draft';
    setSaving(isDraft ? 'draft' : 'publish');

    setTimeout(() => {
      if (isTrendingTab) {
        if (isNew) addTrending({ ...data, department: user?.department });
        else       updateTrending(panel.id, data);
      } else {
        if (isNew) addEvent({ ...data, department: user?.department });
        else       updateEvent(panel.id, data);
      }
      setSaving(null);
      setPanel(null);
      toast(
        isNew
          ? `${tabMeta.type} ${isDraft ? 'saved as draft' : 'published'} successfully`
          : `${tabMeta.type} updated`,
        isDraft ? 'info' : 'success'
      );
    }, 400);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (isTrendingTab) deleteTrending(deleteTarget.id);
    else               deleteEvent(deleteTarget.id);
    // close view modal if it was showing the deleted item
    if (viewItem?.id === deleteTarget.id) setViewItem(null);
    setDeleteTarget(null);
    toast('Item deleted', 'warning');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setStatusFilter('All');
    setDeptFilter('All');
    setPanel(null);
  };

  const newLabel = activeTab === 'MoUs' ? 'New MoU' : `New ${activeTab.replace(/s$/, '')}`;

  return (
    <div className={styles.root}>
      <PageHeader
        title="Content Studio"
        subtitle="Create, manage and publish events, MoUs, news and trending content"
        actions={
          <Button icon={Plus} onClick={() => setPanel('new')}>
            {newLabel}
          </Button>
        }
      />

      {/* ── TABS ── */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          {TABS.map(tab => {
            const m = TAB_META[tab];
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                className={`${styles.tabBtn} ${active ? styles.tabBtnActive : ''}`}
                style={active ? { '--tc': m.color, '--tb': m.bg } : {}}
                onClick={() => switchTab(tab)}
              >
                <m.icon size={15} />
                <span>{tab}</span>
                <span className={styles.tabCount} style={active ? { background: m.bg, color: m.color } : {}}>
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={14} color="var(--gray-400)" />
            <input
              placeholder={`Search ${activeTab}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={12} /></button>
            )}
          </div>

          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
          </select>

          {isAdmin && (
            <select className={styles.filterSelect} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        <span className={styles.statsBarCount}>
          <span style={{ color: tabMeta.color, fontWeight: 800 }}>{items.length}</span>
          {' '}of {allItems.length} {activeTab.toLowerCase()}
        </span>
        <span className={styles.statsBarPublished}>
          <span className={styles.statsDot} style={{ background: '#22C55E' }} />
          {allItems.filter(i => i.status === 'Published' || i.status === 'Approved').length} published
        </span>
        <span className={styles.statsBarDraft}>
          <span className={styles.statsDot} style={{ background: '#94A3B8' }} />
          {allItems.filter(i => i.status === 'Draft').length} drafts
        </span>
      </div>

      {/* ── GRID ── */}
      {items.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState
            icon={tabMeta.icon}
            title={`No ${activeTab} found`}
            subtitle={search || statusFilter !== 'All' ? 'Try adjusting your filters.' : `Click "${newLabel}" to create your first ${activeTab.toLowerCase().replace(/s$/, '')}.`}
            action={
              !search && statusFilter === 'All' && (
                <Button icon={Plus} onClick={() => setPanel('new')}>{newLabel}</Button>
              )
            }
          />
        </div>
      ) : (
        <div className={`${styles.grid} ${isTrendingTab ? styles.trendingGrid : ''}`}>
          {items.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              tabMeta={tabMeta}
              onEdit={setPanel}
              onDelete={setDeleteTarget}
              onView={setViewItem}
            />
          ))}
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewItem && (
        <ViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onEdit={(item) => { setViewItem(null); setPanel(item); }}
        />
      )}

      {/* ── MODAL FOR EVENTS ── */}
      {panel && activeTab === 'Events' && (
        <DialogModal
          title={`${panel === 'new' ? 'Create' : 'Edit'} Event Report`}
          onClose={() => setPanel(null)}
          size="xl"
        >
          <div className={styles.eventFormContainer} style={{ maxHeight: '85vh', overflow: 'auto' }}>
            <ContentForm
              initial={panel === 'new' ? getEmpty() : { ...panel }}
              onSave={handleSave}
              onClose={() => setPanel(null)}
              saving={saving}
            />
          </div>
        </DialogModal>
      )}

      {/* ── MODAL FOR MOUs ── */}
      {panel && activeTab === 'MoUs' && (
        <DialogModal
          title={`${panel === 'new' ? 'Create' : 'Edit'} MoU Report`}
          onClose={() => setPanel(null)}
          size="xl"
        >
          <div className={styles.mouFormContainer} style={{ maxHeight: '85vh', overflow: 'auto' }}>
            <ContentForm
              initial={panel === 'new' ? getEmpty() : { ...panel }}
              onSave={handleSave}
              onClose={() => setPanel(null)}
              saving={saving}
            />
          </div>
        </DialogModal>
      )}

      {/* ── MODAL FOR NEWS ── */}
      {panel && activeTab === 'News' && (
        <DialogModal
          title={`${panel === 'new' ? 'Create' : 'Edit'} News`}
          onClose={() => setPanel(null)}
          size="xl"
        >
          <div className={styles.newsFormContainer} style={{ maxHeight: '85vh', overflow: 'auto' }}>
            <ContentForm
              initial={panel === 'new' ? getEmpty() : { ...panel }}
              onSave={handleSave}
              onClose={() => setPanel(null)}
              saving={saving}
            />
          </div>
        </DialogModal>
      )}

      {/* ── MODAL FOR TRENDING ── */}
      {panel && activeTab === 'Trending' && (
        <DialogModal
          title={`${panel === 'new' ? 'Create' : 'Edit'} Trending Content`}
          onClose={() => setPanel(null)}
          size="xl"
        >
          <ContentForm
            initial={panel === 'new' ? getEmpty() : { ...panel }}
            onSave={handleSave}
            onClose={() => setPanel(null)}
            saving={saving}
          />
        </DialogModal>
      )}

      {/* ── SLIDE PANEL FOR OTHERS ── */}
      {panel && !['Events', 'MoUs', 'News', 'Trending'].includes(activeTab) && (
        <SlidePanel
          title={`${panel === 'new' ? 'New' : 'Edit'} ${activeTab.replace(/s$/, '')}`}
          onClose={() => setPanel(null)}
          size="lg"
        >
          <ContentForm
            initial={panel === 'new' ? getEmpty() : { ...panel }}
            onSave={handleSave}
            onClose={() => setPanel(null)}
            saving={saving}
          />
        </SlidePanel>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
