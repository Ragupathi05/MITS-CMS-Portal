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

function TableSection({ sectionKey, data, differences }) {
  const config = SECTION_CONFIG[sectionKey];
  if (!config) return null;

  const entries = data || [];
  const addedIds = new Set((differences?.added?.[sectionKey] || []).map(item => item.id));
  const modifiedItems = differences?.modified?.[sectionKey] || [];
  const modifiedIds = new Set(modifiedItems.map(item => item.id));
  const deletedItems = differences?.deleted?.[sectionKey] || [];

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
                {config.columnLabels.map((label, idx) => (
                  <th key={idx}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const isAdded = addedIds.has(entry.id);
                const isModified = modifiedIds.has(entry.id);
                const modifiedFields = modifiedItems.find(item => item.id === entry.id)?.changes || {};

                let rowClass = '';
                if (isAdded) rowClass = styles.rowAdded;
                else if (isModified) rowClass = styles.rowModified;

                return (
                  <tr key={entry.id} className={rowClass}>
                    <td>{idx + 1}</td>
                    {config.columns.map((col, colIdx) => {
                      const isFieldModified = modifiedFields[col];
                      const cellClass = isFieldModified ? styles.cellModified : '';
                      return (
                        <td key={colIdx} className={cellClass}>
                          {entry[col] || '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {deletedItems.map((entry, idx) => (
                <tr key={`deleted-${idx}`} className={styles.rowDeleted}>
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

function TextSection({ sectionKey, data, differences }) {
  const labels = {
    researchInterest: 'Research Interest',
    researchDetails: 'Research Details',
    otherInfo: 'Other Information'
  };

  const label = labels[sectionKey] || sectionKey;
  const isModified = differences?.modified?.[sectionKey];
  const sectionClass = isModified ? styles.sectionModified : '';

  if (!data) return null;

  return (
    <div className={`${styles.section} ${sectionClass}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{label}</span>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.textContent}>{data}</div>
      </div>
    </div>
  );
}

function KeyValueSection({ sectionKey, data, differences }) {
  const config = KEY_VALUE_SECTIONS[sectionKey];
  if (!config || !data) return null;

  const modifiedFields = differences?.modified?.[sectionKey] || {};

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
            const isModified = modifiedFields[field];
            const rowClass = isModified ? styles.rowModified : '';
            return (
              <div key={field} className={`${styles.keyValueRow} ${rowClass}`}>
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
  isOpen,
  onClose,
  submission,
  onApprove,
  onReject,
  showActions = false
}) {
  const [comment, setComment] = useState('');

  if (!isOpen || !submission) return null;

  const {
    title,
    status,
    date,
    department,
    changeDescription,
    updatedProfile,
    differences,
    comments = []
  } = submission;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(submission.id, comment);
      setComment('');
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(submission.id, comment);
      setComment('');
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <div className={styles.headerMeta}>
              <Badge status={status}>{status}</Badge>
              <span className={styles.metaItem}>{date}</span>
              <span className={styles.metaItem}>{department}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* CHANGE DESCRIPTION */}
        {changeDescription && (
          <div className={styles.changeDescription}>
            <div className={styles.changeDescriptionLabel}>Change Description:</div>
            <div className={styles.changeDescriptionText}>{changeDescription}</div>
          </div>
        )}

        {/* LEGEND */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendBox} style={{ background: '#fef9c3' }}></span>
            <span>Modified</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendBox} style={{ background: '#dcfce7' }}></span>
            <span>Added</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendBox} style={{ background: '#fee2e2' }}></span>
            <span>Deleted</span>
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className={styles.modalBody}>
          {TEXT_SECTIONS.map(section => (
            <TextSection
              key={section}
              sectionKey={section}
              data={updatedProfile?.[section]}
              differences={differences}
            />
          ))}
          {Object.keys(KEY_VALUE_SECTIONS).map(section => (
            <KeyValueSection
              key={section}
              sectionKey={section}
              data={updatedProfile?.[section]}
              differences={differences}
            />
          ))}
          {Object.keys(SECTION_CONFIG).map(section => (
            <TableSection
              key={section}
              sectionKey={section}
              data={updatedProfile?.[section]}
              differences={differences}
            />
          ))}
        </div>

        {/* COMMENTS */}
        {comments.length > 0 && (
          <div className={styles.commentsSection}>
            <div className={styles.commentsLabel}>Previous Comments:</div>
            {comments.map((c, idx) => (
              <div key={idx} className={styles.commentItem}>
                <MessageSquare size={14} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        {showActions && status === 'Pending' && (
          <div className={styles.actionsSection}>
            <div className={styles.commentInput}>
              <label className={styles.commentLabel}>Add Comment (optional):</label>
              <textarea
                className={styles.commentTextarea}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
