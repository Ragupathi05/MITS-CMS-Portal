// src/components/common/ProfileComparisonModal.jsx
import { useState } from 'react';
import { X, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Badge, Button } from './UI';
import styles from './ProfileComparisonModal.module.css';

const SECTION_CONFIG = {
  education: {
    label: 'Education',
    columns: ['course', 'specialization', 'branch', 'college', 'year'],
    columnLabels: ['Course / Degree', 'Specialization', 'Branch', 'College / University', 'Year of Passing']
  },
  postDoctoral: {
    label: 'Post Doctoral Experience',
    columns: ['institution', 'researchArea', 'duration', 'description'],
    columnLabels: ['Institution', 'Research Area', 'Duration', 'Description']
  },
  consultancyProjects: {
    label: 'Consultancy Projects',
    columns: ['title', 'fundingAgency', 'amount', 'duration', 'role', 'status'],
    columnLabels: ['Project Title', 'Funding Agency', 'Amount', 'Duration', 'Role', 'Status']
  },
  fundedProjects: {
    label: 'Funded Projects',
    columns: ['title', 'fundingAgency', 'amount', 'duration', 'role', 'status'],
    columnLabels: ['Project Title', 'Funding Agency', 'Amount', 'Duration', 'Role', 'Status']
  },
  patents: {
    label: 'Patents',
    columns: ['title', 'patentNumber', 'status', 'filingDate', 'grantDate'],
    columnLabels: ['Title', 'Patent Number', 'Status', 'Filing Date', 'Grant Date']
  },
  booksChapters: {
    label: 'Books / Chapters Published',
    columns: ['title', 'publisher', 'isbn', 'year', 'authors'],
    columnLabels: ['Title', 'Publisher', 'ISBN', 'Year', 'Authors']
  },
  awardsRecognition: {
    label: 'Awards & Recognition',
    columns: ['awardName', 'organization', 'year', 'description'],
    columnLabels: ['Award Name', 'Organization', 'Year', 'Description']
  },
  industryCollaboration: {
    label: 'Industry Collaboration',
    columns: ['organization', 'type', 'duration', 'outcome'],
    columnLabels: ['Organization', 'Type', 'Duration', 'Outcome']
  },
  academicExposure: {
    label: 'Academic Exposure',
    columns: ['program', 'institution', 'country', 'year'],
    columnLabels: ['Program', 'Institution', 'Country', 'Year']
  },
  eventsOrganised: {
    label: 'Events Organised',
    columns: ['eventName', 'role', 'location', 'date'],
    columnLabels: ['Event Name', 'Role', 'Location', 'Date']
  },
  eventsAttended: {
    label: 'Events Attended',
    columns: ['eventName', 'role', 'location', 'date'],
    columnLabels: ['Event Name', 'Role', 'Location', 'Date']
  },
  professionalAffiliations: {
    label: 'Professional Affiliations',
    columns: ['organizationName', 'membershipType', 'duration'],
    columnLabels: ['Organization Name', 'Membership Type', 'Duration']
  },
  invitations: {
    label: 'Invitations',
    columns: ['eventName', 'role', 'organization', 'date'],
    columnLabels: ['Event Name', 'Role', 'Organization', 'Date']
  },
  academicVisit: {
    label: 'Academic Visit',
    columns: ['institution', 'purpose', 'duration', 'outcome'],
    columnLabels: ['Institution', 'Purpose', 'Duration', 'Outcome']
  },
  outreachActivities: {
    label: 'Outreach Activities',
    columns: ['activityName', 'description', 'location', 'date'],
    columnLabels: ['Activity Name', 'Description', 'Location', 'Date']
  }
};

const TEXT_SECTIONS = ['researchInterest', 'researchDetails', 'otherInfo'];

const KEY_VALUE_SECTIONS = {
  researchProfile: {
    label: 'Research Profile',
    fields: ['scopusLink', 'vidwanLink', 'googleScholarLink', 'orcid', 'hIndex'],
    fieldLabels: ['Scopus Link', 'Vidwan Link', 'Google Scholar Link', 'ORCID', 'h-index']
  }
};

// Safely get an array from a diff field — handles both [] and {new:[]} shapes
function safeArr(val) {
  if (Array.isArray(val)) return val;
  if (val && Array.isArray(val.new)) return val.new;
  return [];
}

function TableSection({ sectionKey, data, differences }) {
  const config = SECTION_CONFIG[sectionKey];
  if (!config) return null;

  const entries = Array.isArray(data) ? data : [];
  if (entries.length === 0) return null;

  const addedIds = new Set(safeArr(differences?.added?.[sectionKey]).map(i => i._id || i.id));
  const modifiedItems = Array.isArray(differences?.modified?.[sectionKey])
    ? differences.modified[sectionKey]
    : [];
  const modifiedIds = new Set(modifiedItems.map(i => i._id || i.id));
  const deletedItems = safeArr(differences?.deleted?.[sectionKey]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{config.label}</span>
        <span className={styles.entryCount}>{entries.length}</span>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                {config.columnLabels.map((label, idx) => <th key={idx}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const key = entry._id || entry.id || idx;
                const isAdded = addedIds.has(key);
                const isModified = modifiedIds.has(key);
                const modifiedFields = modifiedItems.find(i => (i._id || i.id) === key)?.changes || {};
                const rowClass = isAdded ? styles.rowAdded : isModified ? styles.rowModified : '';
                return (
                  <tr key={key} className={rowClass}>
                    <td>{idx + 1}</td>
                    {config.columns.map((col, colIdx) => (
                      <td key={colIdx} className={modifiedFields[col] ? styles.cellModified : ''}>
                        {entry[col] || '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {deletedItems.map((entry, idx) => (
                <tr key={`del-${idx}`} className={styles.rowDeleted}>
                  <td>-</td>
                  {config.columns.map((col, colIdx) => (
                    <td key={colIdx}>{entry[col] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TextSection({ sectionKey, data }) {
  const labels = {
    researchInterest: 'Research Interest',
    researchDetails: 'Research Details',
    otherInfo: 'Other Information'
  };
  if (!data) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{labels[sectionKey] || sectionKey}</span>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.textContent}>{data}</div>
      </div>
    </div>
  );
}

function KeyValueSection({ sectionKey, data }) {
  const config = KEY_VALUE_SECTIONS[sectionKey];
  if (!config || !data) return null;
  const hasAny = config.fields.some(f => data[f]);
  if (!hasAny) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{config.label}</span>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.keyValueDisplay}>
          {config.fields.map((field, idx) => {
            const value = data[field];
            if (!value) return null;
            return (
              <div key={field} className={styles.keyValueRow}>
                <span className={styles.keyLabel}>{config.fieldLabels[idx]}</span>
                <span className={styles.keyValue}>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProfileComparisonModal({
  isOpen, onClose, submission, onApprove, onReject, showActions = false
}) {
  const [comment, setComment] = useState('');

  if (!isOpen || !submission) return null;

  const { title, status, date, department, changeDescription, updatedProfile, differences, comments = [] } = submission;

  const handleApprove = () => {
    if (onApprove) { onApprove(submission._id || submission.id, comment); setComment(''); onClose(); }
  };
  const handleReject = () => {
    if (onReject) { onReject(submission._id || submission.id, comment); setComment(''); onClose(); }
  };

  const textItems   = TEXT_SECTIONS.filter(s => updatedProfile?.[s]);
  const kvItems     = Object.keys(KEY_VALUE_SECTIONS).filter(s => updatedProfile?.[s] && Object.values(updatedProfile[s]).some(Boolean));
  const tableItems  = Object.keys(SECTION_CONFIG).filter(s => Array.isArray(updatedProfile?.[s]) && updatedProfile[s].length > 0);
  const hasContent  = textItems.length || kvItems.length || tableItems.length;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <div className={styles.headerMeta}>
              <Badge status={status}>{status}</Badge>
              <span className={styles.metaItem}>{date}</span>
              <span className={styles.metaItem}>{department}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        {changeDescription && (
          <div className={styles.changeDescription}>
            <div className={styles.changeDescriptionLabel}>Change Description:</div>
            <div className={styles.changeDescriptionText}>{changeDescription}</div>
          </div>
        )}

        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.legendBox} style={{ background: '#dcfce7' }} /><span>Added</span></div>
          <div className={styles.legendItem}><span className={styles.legendBox} style={{ background: '#fef9c3' }} /><span>Modified</span></div>
          <div className={styles.legendItem}><span className={styles.legendBox} style={{ background: '#fee2e2' }} /><span>Deleted</span></div>
        </div>

        <div className={styles.modalBody}>
          {!hasContent ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>
              No profile sections updated yet.
            </div>
          ) : (
            <>
              {textItems.map(s => <TextSection key={s} sectionKey={s} data={updatedProfile[s]} differences={differences} />)}
              {kvItems.map(s => <KeyValueSection key={s} sectionKey={s} data={updatedProfile[s]} differences={differences} />)}
              {tableItems.map(s => <TableSection key={s} sectionKey={s} data={updatedProfile[s]} differences={differences} />)}
            </>
          )}
        </div>

        {comments.length > 0 && (
          <div className={styles.commentsSection}>
            <div className={styles.commentsLabel}>Previous Comments:</div>
            {comments.map((c, idx) => (
              <div key={idx} className={styles.commentItem}><MessageSquare size={14} /><span>{c}</span></div>
            ))}
          </div>
        )}

        {showActions && status === 'Pending' && (
          <div className={styles.actionsSection}>
            <div className={styles.commentInput}>
              <label className={styles.commentLabel}>Add Comment (optional):</label>
              <textarea
                className={styles.commentTextarea}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Enter reason for approval or rejection..."
                rows={3}
              />
            </div>
            <div className={styles.actionButtons}>
              <Button variant="success" icon={CheckCircle} onClick={handleApprove}>Approve</Button>
              <Button variant="danger"  icon={XCircle}     onClick={handleReject}>Reject</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
