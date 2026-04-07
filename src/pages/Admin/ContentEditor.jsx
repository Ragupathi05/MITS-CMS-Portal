// src/pages/Admin/ContentEditor.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/UI';
import EventReportForm from './EventReportForm';
import MoUReportForm from './MoUReportForm';
import NewsReportForm from './NewsReportForm';
import ContentTrendingForm from './ContentTrendingForm';
import { ArrowLeft, Calendar, Handshake, Newspaper, TrendingUp } from 'lucide-react';
import styles from './ContentEditor.module.css';

const TYPE_LABELS = {
  Event:    'Event Report',
  MoU:      'MoU Report',
  News:     'News Article',
  Trending: 'Trending Content',
};

const TYPE_OPTIONS = [
  { type: 'Event',    icon: Calendar,   color: '#DB2777', bg: '#FDF2F8', desc: 'Workshops, seminars, conferences, FDPs' },
  { type: 'MoU',      icon: Handshake,  color: '#0891B2', bg: '#ECFEFF', desc: 'Industry & academic partnerships' },
  { type: 'News',     icon: Newspaper,  color: '#0F766E', bg: '#F0FDFA', desc: 'Announcements, achievements, highlights' },
  { type: 'Trending', icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF', desc: 'Instagram reels & YouTube shorts' },
];

function TypePicker({ onSelect }) {
  return (
    <div className={styles.typePicker}>
      <h2 className={styles.typePickerTitle}>What would you like to create?</h2>
      <p className={styles.typePickerSub}>Choose a content type to get started</p>
      <div className={styles.typeGrid}>
        {TYPE_OPTIONS.map(({ type, icon: Icon, color, bg, desc }) => (
          <button key={type} className={styles.typeCard} onClick={() => onSelect(type)}>
            <div className={styles.typeCardIcon} style={{ background: bg, color }}>
              <Icon size={28} />
            </div>
            <div className={styles.typeCardLabel}>{TYPE_LABELS[type]}</div>
            <div className={styles.typeCardDesc}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ContentEditor() {
  const { user } = useAuth();
  const { events, trending, addEvent, updateEvent, addTrending, updateTrending } = useData();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const type   = searchParams.get('type');   // Event | MoU | News | Trending | null
  const itemId = searchParams.get('id');     // present when editing

  const [saving, setSaving] = useState(null);

  // Find existing item if editing
  const existing = itemId && type
    ? (type === 'Trending'
        ? trending.find(t => (t._id || t.id) === itemId)
        : events.find(e => (e._id || e.id) === itemId))
    : null;

  const initial = existing
    ? { ...existing }
    : { type, status: 'Draft', department: user?.department };

  const handleSave = async (data) => {
    const isDraft = data.status === 'Draft';
    setSaving(isDraft ? 'draft' : 'publish');
    try {
      const finalStatus = isDraft
        ? 'Draft'
        : type === 'Trending' ? 'Published' : 'Approved';

      const saveData = { ...data, status: finalStatus, department: user?.department };

      if (type === 'Trending') {
        if (itemId) await updateTrending(itemId, saveData);
        else        await addTrending(saveData);
      } else {
        if (itemId) await updateEvent(itemId, saveData);
        else        await addEvent(saveData);
      }
      toast(
        itemId
          ? `${TYPE_LABELS[type]} updated successfully`
          : `${TYPE_LABELS[type]} ${isDraft ? 'saved as draft' : 'published successfully'}`,
        isDraft ? 'info' : 'success'
      );
      navigate('/content');
    } catch (e) {
      toast('Failed to save. Please try again.', 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleClose = () => navigate('/content');

  // No type selected yet — show picker
  if (!type) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleClose}>
            <ArrowLeft size={16} /> Back to Content Studio
          </button>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>New Content</h1>
            <p className={styles.subtitle}>Select a content type to create</p>
          </div>
        </div>
        <TypePicker onSelect={t => setSearchParams({ type: t })} />
      </div>
    );
  }

  const formProps = { initial, onSave: handleSave, onClose: handleClose, saving };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => itemId ? handleClose() : setSearchParams({})}>
          <ArrowLeft size={16} /> {itemId ? 'Back to Content Studio' : 'Back'}
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {itemId ? `Edit ${TYPE_LABELS[type]}` : `New ${TYPE_LABELS[type]}`}
          </h1>
          <p className={styles.subtitle}>
            {itemId ? 'Update the details below and submit.' : 'Fill in the details below and submit.'}
          </p>
        </div>
      </div>

      <div className={styles.formWrap}>
        {type === 'Event'    && <EventReportForm    {...formProps} />}
        {type === 'MoU'      && <MoUReportForm      {...formProps} />}
        {type === 'News'     && <NewsReportForm      {...formProps} />}
        {type === 'Trending' && <ContentTrendingForm {...formProps} />}
      </div>
    </div>
  );
}
