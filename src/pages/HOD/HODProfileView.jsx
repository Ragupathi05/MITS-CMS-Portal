// src/pages/HOD/HODProfileView.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import {
  GraduationCap, FlaskConical, Lightbulb, FolderOpen,
  Calendar, Info, BookOpen, Building2, Award,
  Briefcase, Globe, Users, FileText, Link, Target, Activity,
  ChevronDown, ChevronUp, Pencil, CheckCircle,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import styles from '../Faculty/ProfileView.module.css';

/* ── reusable section components ── */
function TableSection({ title, icon: Icon, color, columns, entries = [] }) {
  const [expanded, setExpanded] = useState(true);
  if (!entries.length) return null;
  return (
    <div className={styles.section}>
      <div className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`} onClick={() => setExpanded(e => !e)}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}><Icon size={18} /></div>
          <span>{title}</span>
          <span className={styles.entryCount}>{entries.length}</span>
        </div>
        <button className={styles.chevronBtn}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>S.No</th>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
              <tbody>{entries.map((e, i) => (
                <tr key={e._id || e.id || i}><td>{i + 1}</td>{columns.map(c => <td key={c.key}>{e[c.key] || '—'}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TextSection({ title, icon: Icon, color, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || !String(value).trim()) return null;
  return (
    <div className={styles.section}>
      <div className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`} onClick={() => setExpanded(e => !e)}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}><Icon size={18} /></div>
          <span>{title}</span>
        </div>
        <button className={styles.chevronBtn}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded && <div className={styles.sectionBody}><div className={styles.textContent}>{value}</div></div>}
    </div>
  );
}

function KeyValueSection({ title, icon: Icon, color, fields, value }) {
  const [expanded, setExpanded] = useState(true);
  if (!value || typeof value !== 'object') return null;
  if (!fields.some(f => value[f.key])) return null;
  return (
    <div className={styles.section}>
      <div className={`${styles.sectionHeader} ${expanded ? styles.sectionHeaderOpen : ''}`} onClick={() => setExpanded(e => !e)}>
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ background: color + '18', color }}><Icon size={18} /></div>
          <span>{title}</span>
        </div>
        <button className={styles.chevronBtn}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded && (
        <div className={styles.sectionBody}>
          <div className={styles.keyValueDisplay}>
            {fields.map(field => value[field.key] && (
              <div key={field.key} className={styles.keyValueRow}>
                <span className={styles.keyLabel}>{field.label}</span>
                <span className={styles.keyValue}>
                  {field.key.includes('Link')
                    ? <a href={value[field.key]} target="_blank" rel="noopener noreferrer" className={styles.link}><Link size={13} /> {value[field.key]}</a>
                    : value[field.key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── column configs ── */
const EDUCATION_COLS         = [{key:'course',label:'Course / Degree'},{key:'specialization',label:'Specialization'},{key:'branch',label:'Branch'},{key:'college',label:'College / University'},{key:'year',label:'Year'}];
const POST_DOCTORAL_COLS     = [{key:'institution',label:'Institution'},{key:'researchArea',label:'Research Area'},{key:'duration',label:'Duration'},{key:'description',label:'Description'}];
const CONSULTANCY_COLS       = [{key:'title',label:'Project Title'},{key:'fundingAgency',label:'Funding Agency'},{key:'amount',label:'Amount'},{key:'duration',label:'Duration'},{key:'role',label:'Role'},{key:'status',label:'Status'}];
const FUNDED_COLS            = [{key:'title',label:'Project Title'},{key:'fundingAgency',label:'Funding Agency'},{key:'amount',label:'Amount'},{key:'duration',label:'Duration'},{key:'role',label:'Role'},{key:'status',label:'Status'}];
const PATENTS_COLS           = [{key:'title',label:'Title'},{key:'patentNumber',label:'Patent No.'},{key:'status',label:'Status'},{key:'filingDate',label:'Filing Date'},{key:'grantDate',label:'Grant Date'}];
const BOOKS_COLS             = [{key:'title',label:'Title'},{key:'publisher',label:'Publisher'},{key:'isbn',label:'ISBN'},{key:'year',label:'Year'},{key:'authors',label:'Authors'}];
const AWARDS_COLS            = [{key:'awardName',label:'Award Name'},{key:'organization',label:'Organization'},{key:'year',label:'Year'},{key:'description',label:'Description'}];
const INDUSTRY_COLS          = [{key:'organization',label:'Organization'},{key:'type',label:'Type'},{key:'duration',label:'Duration'},{key:'outcome',label:'Outcome'}];
const ACADEMIC_EXPOSURE_COLS = [{key:'program',label:'Program'},{key:'institution',label:'Institution'},{key:'country',label:'Country'},{key:'year',label:'Year'}];
const EVENTS_ORG_COLS        = [{key:'eventName',label:'Event Name'},{key:'role',label:'Role'},{key:'location',label:'Location'},{key:'date',label:'Date'}];
const EVENTS_ATT_COLS        = [{key:'eventName',label:'Event Name'},{key:'role',label:'Role'},{key:'location',label:'Location'},{key:'date',label:'Date'}];
const AFFILIATIONS_COLS      = [{key:'organizationName',label:'Organization'},{key:'membershipType',label:'Membership Type'},{key:'duration',label:'Duration'}];
const INVITATIONS_COLS       = [{key:'eventName',label:'Event Name'},{key:'role',label:'Role'},{key:'organization',label:'Organization'},{key:'date',label:'Date'}];
const ACADEMIC_VISIT_COLS    = [{key:'institution',label:'Institution'},{key:'purpose',label:'Purpose'},{key:'duration',label:'Duration'},{key:'outcome',label:'Outcome'}];
const OUTREACH_COLS          = [{key:'activityName',label:'Activity Name'},{key:'description',label:'Description'},{key:'location',label:'Location'},{key:'date',label:'Date'}];
const RESEARCH_PROFILE_FIELDS= [{key:'scopusLink',label:'Scopus'},{key:'vidwanLink',label:'Vidwan'},{key:'googleScholarLink',label:'Google Scholar'},{key:'orcid',label:'ORCID'},{key:'hIndex',label:'h-index'}];

export default function HODProfileView() {
  const { user } = useAuth();
  const { profileSections } = useData();
  const navigate = useNavigate();

  // HOD saves directly as Approved — profileSections IS the approved data
  const p = profileSections;

  const hasSections = [
    p.education, p.postDoctoral, p.consultancyProjects, p.fundedProjects,
    p.patents, p.booksChapters, p.awardsRecognition, p.industryCollaboration,
    p.academicExposure, p.eventsOrganised, p.eventsAttended,
    p.professionalAffiliations, p.invitations, p.academicVisit, p.outreachActivities,
  ].some(arr => arr?.length > 0) ||
  p.researchInterest || p.researchDetails || p.otherInfo ||
  Object.values(p.researchProfile || {}).some(Boolean);

  return (
    <div className={styles.root}>

      {/* HERO */}
      <div className={styles.profileHero}>
        <div className={styles.heroBanner} />
        <div className={styles.heroBody}>
          <div className={styles.avatarCircle}>
            {user.avatar
              ? <img src={user.avatar} alt="" className={styles.avatarImg} />
              : <Avatar name={user.name} size={88} />
            }
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{user.name}</div>
            {user.designation && <div className={styles.profileDesignation}>{user.designation}</div>}
            {user.department  && <div className={styles.profileDept}>{user.department} Department</div>}
            {user.email       && <div className={styles.profileDept}>{user.email}</div>}
            {user.qualification && <div className={styles.profileDept}>{user.qualification}</div>}
            <div className={styles.profileMeta}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.8rem', fontWeight:600, color:'#15803D', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:20, padding:'3px 10px' }}>
                <CheckCircle size={12} /> HOD — No approval required
              </span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.btnEdit} onClick={() => navigate('/profile')}>
              <Pencil size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!hasSections && (
        <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, color: 'var(--gray-400)' }}>
          <FileText size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: '0.95rem', marginBottom: 16 }}>No profile data yet. Go to Edit Profile to add your details.</p>
          <button className={styles.btnSubmit} onClick={() => navigate('/profile')}>
            <Pencil size={14} /> Edit Profile
          </button>
        </div>
      )}

      {/* SECTIONS */}
      {hasSections && (
        <div className={styles.sections}>
          <TableSection title="Education"                  icon={GraduationCap} color="#1E3A8A" columns={EDUCATION_COLS}         entries={p.education} />
          <TableSection title="Post Doctoral Experience"   icon={FlaskConical}  color="#7C3AED" columns={POST_DOCTORAL_COLS}     entries={p.postDoctoral} />
          <TextSection  title="Research Interest"          icon={Target}        color="#059669" value={p.researchInterest} />
          <KeyValueSection title="Research Profile"        icon={Link}          color="#D97706" fields={RESEARCH_PROFILE_FIELDS} value={p.researchProfile} />
          <TextSection  title="Research Details"           icon={FileText}      color="#0891B2" value={p.researchDetails} />
          <TableSection title="Consultancy Projects"       icon={Briefcase}     color="#B45309" columns={CONSULTANCY_COLS}       entries={p.consultancyProjects} />
          <TableSection title="Funded Projects"            icon={FolderOpen}    color="#DC2626" columns={FUNDED_COLS}            entries={p.fundedProjects} />
          <TableSection title="Patents"                    icon={Lightbulb}     color="#4F46E5" columns={PATENTS_COLS}           entries={p.patents} />
          <TableSection title="Books / Chapters Published" icon={BookOpen}      color="#0D9488" columns={BOOKS_COLS}             entries={p.booksChapters} />
          <TableSection title="Awards & Recognition"       icon={Award}         color="#EA580C" columns={AWARDS_COLS}            entries={p.awardsRecognition} />
          <TableSection title="Industry Collaboration"     icon={Building2}     color="#2563EB" columns={INDUSTRY_COLS}          entries={p.industryCollaboration} />
          <TableSection title="Academic Exposure"          icon={Globe}         color="#7C3AED" columns={ACADEMIC_EXPOSURE_COLS} entries={p.academicExposure} />
          <TableSection title="Events Organised"           icon={Calendar}      color="#059669" columns={EVENTS_ORG_COLS}        entries={p.eventsOrganised} />
          <TableSection title="Events Attended"            icon={Users}         color="#0891B2" columns={EVENTS_ATT_COLS}        entries={p.eventsAttended} />
          <TableSection title="Professional Affiliations"  icon={Users}         color="#4F46E5" columns={AFFILIATIONS_COLS}      entries={p.professionalAffiliations} />
          <TableSection title="Invitations"                icon={Calendar}      color="#DC2626" columns={INVITATIONS_COLS}       entries={p.invitations} />
          <TableSection title="Academic Visit"             icon={Globe}         color="#B45309" columns={ACADEMIC_VISIT_COLS}    entries={p.academicVisit} />
          <TableSection title="Outreach Activities"        icon={Activity}      color="#0D9488" columns={OUTREACH_COLS}          entries={p.outreachActivities} />
          <TextSection  title="Other Information"          icon={Info}          color="#6366F1" value={p.otherInfo} />
        </div>
      )}
    </div>
  );
}
