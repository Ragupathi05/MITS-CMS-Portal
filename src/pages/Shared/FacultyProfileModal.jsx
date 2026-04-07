// src/pages/Shared/FacultyProfileModal.jsx
import { useState } from 'react';
import { X, Mail, Building2, Calendar, Award, GraduationCap, 
  FlaskConical, Lightbulb, FolderOpen, BookOpen, Briefcase, Globe,
  Users, FileText, Link, Target, Activity, Info, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/common/UI';
import styles from './FacultyProfileModal.module.css';

function formatName(name) {
  return name || 'Unknown';
}

function TableSection({ title, icon: Icon, color, columns, entries = [] }) {
  const [expanded, setExpanded] = useState(true);
  if (!entries || entries.length === 0) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon} style={{ background: color + '20', color }}>
            <Icon size={14} />
          </span>
          <span>{title}</span>
          <span className={styles.entryBadge}>{entries.length}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>#</th>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.id || idx}>
                  <td className={styles.sno}>{idx + 1}</td>
                  {columns.map(col => <td key={col.key}>{entry[col.key] || '-'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TextDisplay({ title, icon: Icon, color, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || !String(value).trim()) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon} style={{ background: color + '20', color }}>
            <Icon size={14} />
          </span>
          <span>{title}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && <div className={styles.textBody}>{value}</div>}
    </div>
  );
}

function KeyValueDisplay({ title, icon: Icon, color, fields, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || typeof value !== 'object') return null;
  const filledFields = fields?.filter(f => value[f.key]) || [];
  if (filledFields.length === 0) return null;
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon} style={{ background: color + '20', color }}>
            <Icon size={14} />
          </span>
          <span>{title}</span>
        </div>
        <span className={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className={styles.keyValueBody}>
          {filledFields.map(field => (
            <div key={field.key} className={styles.kvRow}>
              <span className={styles.kvLabel}>{field.label}</span>
              <span className={styles.kvValue}>
                {field.key.includes('Link') && value[field.key] ? (
                  <a href={value[field.key]} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <ExternalLink size={11} /> {value[field.key]}
                  </a>
                ) : value[field.key]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const COLS = {
  education: [
    { key: 'course', label: 'Degree' }, { key: 'specialization', label: 'Specialization' },
    { key: 'college', label: 'College' }, { key: 'year', label: 'Year' }
  ],
  postDoctoral: [
    { key: 'institution', label: 'Institution' }, { key: 'researchArea', label: 'Research Area' },
    { key: 'duration', label: 'Duration' }
  ],
  consultancyProjects: [
    { key: 'title', label: 'Project' }, { key: 'fundingAgency', label: 'Funding' },
    { key: 'amount', label: 'Amount' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }
  ],
  fundedProjects: [
    { key: 'title', label: 'Project' }, { key: 'fundingAgency', label: 'Funding' },
    { key: 'amount', label: 'Amount' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }
  ],
  patents: [
    { key: 'title', label: 'Title' }, { key: 'patentNumber', label: 'Patent No.' },
    { key: 'status', label: 'Status' }
  ],
  booksChapters: [
    { key: 'title', label: 'Title' }, { key: 'publisher', label: 'Publisher' },
    { key: 'year', label: 'Year' }
  ],
  awardsRecognition: [
    { key: 'awardName', label: 'Award' }, { key: 'organization', label: 'Organization' },
    { key: 'year', label: 'Year' }
  ],
  industryCollaboration: [
    { key: 'organization', label: 'Organization' }, { key: 'type', label: 'Type' },
    { key: 'duration', label: 'Duration' }
  ],
  academicExposure: [
    { key: 'program', label: 'Program' }, { key: 'institution', label: 'Institution' },
    { key: 'country', label: 'Country' }, { key: 'year', label: 'Year' }
  ],
  eventsOrganised: [
    { key: 'eventName', label: 'Event' }, { key: 'role', label: 'Role' },
    { key: 'date', label: 'Date' }
  ],
  eventsAttended: [
    { key: 'eventName', label: 'Event' }, { key: 'role', label: 'Role' },
    { key: 'date', label: 'Date' }
  ],
  professionalAffiliations: [
    { key: 'organizationName', label: 'Organization' },
    { key: 'membershipType', label: 'Type' }, { key: 'duration', label: 'Duration' }
  ],
  invitations: [
    { key: 'eventName', label: 'Event' }, { key: 'role', label: 'Role' },
    { key: 'date', label: 'Date' }
  ],
  academicVisit: [
    { key: 'institution', label: 'Institution' }, { key: 'purpose', label: 'Purpose' },
    { key: 'duration', label: 'Duration' }
  ],
  outreachActivities: [
    { key: 'activityName', label: 'Activity' }, { key: 'date', label: 'Date' }
  ],
};

const RESEARCH_FIELDS = [
  { key: 'scopusLink', label: 'Scopus' }, { key: 'vidwanLink', label: 'Vidwan' },
  { key: 'googleScholarLink', label: 'Google Scholar' }, { key: 'orcid', label: 'ORCID' },
  { key: 'hIndex', label: 'h-index' },
];

export default function FacultyProfileModal({ faculty, profileSections, profileStatus, onClose }) {
  if (!faculty) return null;
  
  const initials = formatName(faculty.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const isApproved = profileStatus === 'Approved';

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Faculty Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.body}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarBox}>
              {faculty.avatar ? (
                <img src={faculty.avatar} alt="" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarInit}>{initials}</span>
              )}
            </div>
            <div className={styles.profileDetails}>
              <h3 className={styles.facultyName}>{faculty.name}</h3>
              <p className={styles.designation}>{faculty.designation}</p>
              <div className={styles.metaRow}>
                <span><Building2 size={13} /> {faculty.department}</span>
                {faculty.email && <span><Mail size={13} /> {faculty.email}</span>}
              </div>
              <Badge status={profileStatus}>{profileStatus || 'Draft'}</Badge>
            </div>
          </div>

          {!isApproved && (
            <div className={styles.notice}>
              This profile is {profileStatus?.toLowerCase() || 'not filled'} yet.
            </div>
          )}

          {/* Profile Sections */}
          {isApproved && profileSections && (
            <div className={styles.sectionsList}>
              <TableSection title="Education" icon={GraduationCap} color="#1E3A8A" columns={COLS.education} entries={profileSections.education} />
              <TableSection title="Post Doctoral" icon={FlaskConical} color="#7C3AED" columns={COLS.postDoctoral} entries={profileSections.postDoctoral} />
              <TextDisplay title="Research Interest" icon={Target} color="#059669" value={profileSections.researchInterest} />
              <KeyValueDisplay title="Research Profile" icon={Link} color="#D97706" fields={RESEARCH_FIELDS} value={profileSections.researchProfile} />
              <TextDisplay title="Research Details" icon={FileText} color="#0891B2" value={profileSections.researchDetails} />
              <TableSection title="Consultancy Projects" icon={Briefcase} color="#B45309" columns={COLS.consultancyProjects} entries={profileSections.consultancyProjects} />
              <TableSection title="Funded Projects" icon={FolderOpen} color="#DC2626" columns={COLS.fundedProjects} entries={profileSections.fundedProjects} />
              <TableSection title="Patents" icon={Lightbulb} color="#4F46E5" columns={COLS.patents} entries={profileSections.patents} />
              <TableSection title="Books/Chapters" icon={BookOpen} color="#0D9488" columns={COLS.booksChapters} entries={profileSections.booksChapters} />
              <TableSection title="Awards" icon={Award} color="#EA580C" columns={COLS.awardsRecognition} entries={profileSections.awardsRecognition} />
              <TableSection title="Industry Collaboration" icon={Briefcase} color="#2563EB" columns={COLS.industryCollaboration} entries={profileSections.industryCollaboration} />
              <TableSection title="Academic Exposure" icon={Globe} color="#7C3AED" columns={COLS.academicExposure} entries={profileSections.academicExposure} />
              <TableSection title="Events Organised" icon={Calendar} color="#059669" columns={COLS.eventsOrganised} entries={profileSections.eventsOrganised} />
              <TableSection title="Events Attended" icon={Users} color="#0891B2" columns={COLS.eventsAttended} entries={profileSections.eventsAttended} />
              <TableSection title="Professional Affiliations" icon={Users} color="#4F46E5" columns={COLS.professionalAffiliations} entries={profileSections.professionalAffiliations} />
              <TableSection title="Invitations" icon={Calendar} color="#DC2626" columns={COLS.invitations} entries={profileSections.invitations} />
              <TableSection title="Academic Visits" icon={Globe} color="#B45309" columns={COLS.academicVisit} entries={profileSections.academicVisit} />
              <TableSection title="Outreach Activities" icon={Activity} color="#0D9488" columns={COLS.outreachActivities} entries={profileSections.outreachActivities} />
              <TextDisplay title="Other Information" icon={Info} color="#6366F1" value={profileSections.otherInfo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}