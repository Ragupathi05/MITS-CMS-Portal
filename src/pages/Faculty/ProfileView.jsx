// src/pages/Faculty/ProfileView.jsx
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/UI';
import {
  GraduationCap, FlaskConical, Lightbulb, FolderOpen,
  Calendar, Info, BookOpen, Building2, Award,
  Briefcase, Globe, Users, FileText, Link, Target, Activity,
  ChevronDown, ChevronUp
} from 'lucide-react';
import styles from './ProfileView.module.css';

/* ── TABLE SECTION ── */
function TableSection({ title, icon: Icon, color, columns, entries = [] }) {
  const [expanded, setExpanded] = useState(true);
  if (!entries.length) return null;
  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}>
            <Icon size={18} />
          </div>
          <span>{title}</span>
          <span className={styles.entryCount}>{entries.length}</span>
        </div>
        <button className={styles.chevronBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>S.No</th>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.id}>
                    <td>{idx + 1}</td>
                    {columns.map(col => <td key={col.key}>{entry[col.key] || '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── TEXT SECTION ── */
function TextSection({ title, icon: Icon, color, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || !String(value).trim()) return null;
  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}>
            <Icon size={18} />
          </div>
          <span>{title}</span>
        </div>
        <button className={styles.chevronBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <div className={styles.textContent}>{value}</div>
        </div>
      )}
    </div>
  );
}

/* ── KEY-VALUE SECTION ── */
function KeyValueSection({ title, icon: Icon, color, fields, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || typeof value !== 'object') return null;
  if (!fields.some(f => value[f.key])) return null;
  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}>
            <Icon size={18} />
          </div>
          <span>{title}</span>
        </div>
        <button className={styles.chevronBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <div className={styles.keyValueDisplay}>
            {fields.map(field => value[field.key] && (
              <div key={field.key} className={styles.keyValueRow}>
                <span className={styles.keyLabel}>{field.label}</span>
                <span className={styles.keyValue}>
                  {field.key.includes('Link') ? (
                    <a href={value[field.key]} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <Link size={13} /> {value[field.key]}
                    </a>
                  ) : value[field.key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── COLUMN CONFIGS ── */
const EDUCATION_COLS = [
  { key: 'course', label: 'Course / Degree' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'branch', label: 'Branch' },
  { key: 'college', label: 'College / University' },
  { key: 'year', label: 'Year' },
];
const POST_DOCTORAL_COLS = [
  { key: 'institution', label: 'Institution' },
  { key: 'researchArea', label: 'Research Area' },
  { key: 'duration', label: 'Duration' },
  { key: 'description', label: 'Description' },
];
const CONSULTANCY_COLS = [
  { key: 'title', label: 'Project Title' },
  { key: 'fundingAgency', label: 'Funding Agency' },
  { key: 'amount', label: 'Amount' },
  { key: 'duration', label: 'Duration' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];
const FUNDED_COLS = [
  { key: 'title', label: 'Project Title' },
  { key: 'fundingAgency', label: 'Funding Agency' },
  { key: 'amount', label: 'Amount' },
  { key: 'duration', label: 'Duration' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];
const PATENTS_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'patentNumber', label: 'Patent No.' },
  { key: 'status', label: 'Status' },
  { key: 'filingDate', label: 'Filing Date' },
  { key: 'grantDate', label: 'Grant Date' },
];
const BOOKS_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'year', label: 'Year' },
  { key: 'authors', label: 'Authors' },
];
const AWARDS_COLS = [
  { key: 'awardName', label: 'Award Name' },
  { key: 'organization', label: 'Organization' },
  { key: 'year', label: 'Year' },
  { key: 'description', label: 'Description' },
];
const INDUSTRY_COLS = [
  { key: 'organization', label: 'Organization' },
  { key: 'type', label: 'Type' },
  { key: 'duration', label: 'Duration' },
  { key: 'outcome', label: 'Outcome' },
];
const ACADEMIC_EXPOSURE_COLS = [
  { key: 'program', label: 'Program' },
  { key: 'institution', label: 'Institution' },
  { key: 'country', label: 'Country' },
  { key: 'year', label: 'Year' },
];
const EVENTS_ORG_COLS = [
  { key: 'eventName', label: 'Event Name' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
];
const EVENTS_ATT_COLS = [
  { key: 'eventName', label: 'Event Name' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
];
const AFFILIATIONS_COLS = [
  { key: 'organizationName', label: 'Organization' },
  { key: 'membershipType', label: 'Membership Type' },
  { key: 'duration', label: 'Duration' },
];
const INVITATIONS_COLS = [
  { key: 'eventName', label: 'Event Name' },
  { key: 'role', label: 'Role' },
  { key: 'organization', label: 'Organization' },
  { key: 'date', label: 'Date' },
];
const ACADEMIC_VISIT_COLS = [
  { key: 'institution', label: 'Institution' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'duration', label: 'Duration' },
  { key: 'outcome', label: 'Outcome' },
];
const OUTREACH_COLS = [
  { key: 'activityName', label: 'Activity Name' },
  { key: 'description', label: 'Description' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
];
const RESEARCH_PROFILE_FIELDS = [
  { key: 'scopusLink', label: 'Scopus' },
  { key: 'vidwanLink', label: 'Vidwan' },
  { key: 'googleScholarLink', label: 'Google Scholar' },
  { key: 'orcid', label: 'ORCID' },
  { key: 'hIndex', label: 'h-index' },
];

/* ── MAIN PROFILE VIEW ── */
export default function ProfileView() {
  const { user } = useAuth();
  const { profileSections, profileStatus } = useData();

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // PUBLIC VIEW: only show profile when Approved.
  // If Pending or Draft, show a notice instead of unverified data.
  const isPubliclyVisible = profileStatus === 'Approved';
  const isPending         = profileStatus === 'Pending';

  return (
    <div className={styles.root}>
      {/* PROFILE HERO CARD */}
      <div className={styles.profileHero}>
        <div className={styles.heroBanner} />
        <div className={styles.heroBody}>
          <div className={styles.avatarCircle}>
            {user.avatar
              ? <img src={user.avatar} alt="" className={styles.avatarImg} />
              : <span className={styles.avatarInitials}>{initials}</span>
            }
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{user.name}</div>
            {user.designation && <div className={styles.profileDesignation}>{user.designation}</div>}
            <div className={styles.profileDept}>{user.department} Department</div>
            <div className={styles.profileMeta}>
              <Badge status={profileStatus}>{profileStatus}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* PENDING NOTICE */}
      {isPending && (
        <div className={styles.pendingNotice}>
          <span className={styles.pendingNoticeIcon}>⏳</span>
          <span>Profile update is <strong>pending HOD approval</strong>. The sections below show your last approved data.</span>
        </div>
      )}

      {/* DRAFT NOTICE */}
      {profileStatus === 'Draft' && (
        <div className={styles.draftNotice}>
          <span className={styles.draftNoticeIcon}>📝</span>
          <span>Your profile is in <strong>Draft</strong> state and not yet publicly visible. Submit for approval to publish.</span>
        </div>
      )}

      {/* SECTIONS — only shown when Approved */}
      {isPubliclyVisible && (
        <div className={styles.sections}>
          <TableSection title="Education" icon={GraduationCap} color="#1E3A8A" columns={EDUCATION_COLS} entries={profileSections.education} />
          <TableSection title="Post Doctoral Experience" icon={FlaskConical} color="#7C3AED" columns={POST_DOCTORAL_COLS} entries={profileSections.postDoctoral} />
          <TextSection title="Research Interest" icon={Target} color="#059669" value={profileSections.researchInterest} />
          <KeyValueSection title="Research Profile" icon={Link} color="#D97706" fields={RESEARCH_PROFILE_FIELDS} value={profileSections.researchProfile} />
          <TextSection title="Research Details" icon={FileText} color="#0891B2" value={profileSections.researchDetails} />
          <TableSection title="Consultancy Projects" icon={Briefcase} color="#B45309" columns={CONSULTANCY_COLS} entries={profileSections.consultancyProjects} />
          <TableSection title="Funded Projects" icon={FolderOpen} color="#DC2626" columns={FUNDED_COLS} entries={profileSections.fundedProjects} />
          <TableSection title="Patents" icon={Lightbulb} color="#4F46E5" columns={PATENTS_COLS} entries={profileSections.patents} />
          <TableSection title="Books / Chapters Published" icon={BookOpen} color="#0D9488" columns={BOOKS_COLS} entries={profileSections.booksChapters} />
          <TableSection title="Awards & Recognition" icon={Award} color="#EA580C" columns={AWARDS_COLS} entries={profileSections.awardsRecognition} />
          <TableSection title="Industry Collaboration" icon={Building2} color="#2563EB" columns={INDUSTRY_COLS} entries={profileSections.industryCollaboration} />
          <TableSection title="Academic Exposure" icon={Globe} color="#7C3AED" columns={ACADEMIC_EXPOSURE_COLS} entries={profileSections.academicExposure} />
          <TableSection title="Events Organised" icon={Calendar} color="#059669" columns={EVENTS_ORG_COLS} entries={profileSections.eventsOrganised} />
          <TableSection title="Events Attended" icon={Users} color="#0891B2" columns={EVENTS_ATT_COLS} entries={profileSections.eventsAttended} />
          <TableSection title="Professional Affiliations" icon={Users} color="#4F46E5" columns={AFFILIATIONS_COLS} entries={profileSections.professionalAffiliations} />
          <TableSection title="Invitations" icon={Calendar} color="#DC2626" columns={INVITATIONS_COLS} entries={profileSections.invitations} />
          <TableSection title="Academic Visit" icon={Globe} color="#B45309" columns={ACADEMIC_VISIT_COLS} entries={profileSections.academicVisit} />
          <TableSection title="Outreach Activities" icon={Activity} color="#0D9488" columns={OUTREACH_COLS} entries={profileSections.outreachActivities} />
          <TextSection title="Other Information" icon={Info} color="#6366F1" value={profileSections.otherInfo} />
        </div>
      )}
    </div>
  );
}
