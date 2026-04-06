import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { Card, PageHeader, Badge, Button, FormField, Input, SlidePanel, Modal } from '../../components/common/UI';
import ImageUploader from '../../components/common/ImageUploader';
import { Plus, Search, Pencil, Trash2, Calendar, ExternalLink, Play, X } from 'lucide-react';
import styles from './Trending.module.css';

const emptyTrending = { title: '', reelUrl: '', date: '', coverImage: null, department: '' };

function TrendingCard({ item, onEdit, onDelete, canEdit }) {
  return (
    <Card className={styles.trendingCard}>
      <div className={styles.cardImageWrap}>
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.title} className={styles.cardImage} />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <Play size={48} color="var(--gray-300)" />
          </div>
        )}
        <div className={styles.cardOverlay}>
          <a href={item.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.playButton}>
            <Play size={24} />
          </a>
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <div className={styles.cardMeta}>
          <Calendar size={14} />
          <span>{item.date}</span>
        </div>
        <div className={styles.cardMeta}>
          <ExternalLink size={14} />
          <a href={item.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.reelLink}>
            View Reel
          </a>
        </div>
        {canEdit && (
          <div className={styles.cardActions}>
            <Button variant="ghost" size="sm" icon={Pencil} onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(item.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function TrendingForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
    }, 400);
  };

  return (
    <div>
      <FormField label="Title">
        <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter trending content title..." />
      </FormField>

      <FormField label="Reel URL (Instagram / YouTube Shorts)">
        <Input value={form.reelUrl} onChange={e => set('reelUrl', e.target.value)} placeholder="https://www.instagram.com/reel/..." />
      </FormField>

      <FormField label="Date">
        <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
      </FormField>

      <FormField label="Cover Image (Portrait 9:16 ratio recommended)">
        <div className={styles.imageUploadSection}>
          <ImageUploader
            images={form.coverImage ? [{ id: 'cover', url: form.coverImage }] : []}
            onChange={imgs => set('coverImage', imgs[0]?.url || null)}
            multiple={false}
          />
          <div className={styles.imageHint}>
            <p>Recommended: 1080x1920 pixels (9:16 portrait ratio)</p>
            <p>This image will be displayed as a vertical card thumbnail</p>
          </div>
        </div>
      </FormField>

      {form.coverImage && (
        <FormField label="Preview">
          <div className={styles.previewContainer}>
            <div className={styles.previewCard}>
              <img src={form.coverImage} alt="Preview" className={styles.previewImage} />
              <div className={styles.previewOverlay}>
                <Play size={32} color="white" />
              </div>
              <div className={styles.previewTitle}>{form.title || 'Title'}</div>
            </div>
          </div>
        </FormField>
      )}

      <div className={styles.formActions}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.title || !form.reelUrl}>
          {saving ? 'Saving...' : 'Save Trending'}
        </Button>
      </div>
    </div>
  );
}

export default function Trending() {
  const { user } = useAuth();
  const { trending, addTrending, updateTrending, deleteTrending } = useData();
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const canEdit = user?.role === 'HOD' || user?.role === 'ADMIN';

  const filtered = trending.filter(t =>
    (!search || t.title.toLowerCase().includes(search.toLowerCase())) &&
    (user?.role === 'ADMIN' || t.department === user?.department)
  );

  const handleSave = (data) => {
    if (panel === 'new') {
      addTrending({ ...data, department: user?.department });
    } else {
      updateTrending(panel.id, data);
    }
    setPanel(null);
  };

  const confirmDelete = () => {
    deleteTrending(deleteId);
    setDeleteId(null);
  };

  return (
    <div className={styles.root}>
      <PageHeader
        title="Trending Content"
        subtitle="Manage Instagram Reels and Shorts style content"
      />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--gray-400)" />
          <input
            type="text"
            placeholder="Search trending content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {canEdit && (
          <Button icon={Plus} onClick={() => setPanel('new')}>
            Add Trending
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className={styles.emptyState}>
          <Play size={48} color="var(--gray-300)" />
          <h3>No trending content yet</h3>
          <p>Add your first trending reel or short video</p>
          {canEdit && (
            <Button icon={Plus} onClick={() => setPanel('new')}>
              Add Trending
            </Button>
          )}
        </Card>
      ) : (
        <div className={styles.trendingGrid}>
          {filtered.map(item => (
            <TrendingCard
              key={item.id}
              item={item}
              onEdit={setPanel}
              onDelete={setDeleteId}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {panel && (
        <SlidePanel
          title={panel === 'new' ? 'Add Trending Content' : 'Edit Trending Content'}
          onClose={() => setPanel(null)}
        >
          <TrendingForm
            initial={panel === 'new' ? emptyTrending : panel}
            onSave={handleSave}
            onClose={() => setPanel(null)}
          />
        </SlidePanel>
      )}

      {deleteId && (
        <Modal
          title="Confirm Delete"
          onClose={() => setDeleteId(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </>
          }
        >
          <p>Are you sure you want to delete this trending content? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
