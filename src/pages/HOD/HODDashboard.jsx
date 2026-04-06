import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/UI';
import {
  Users, BookOpen, Calendar, Award, Building2, GraduationCap,
  Zap, Target, Handshake, Newspaper, Sparkles, Play,
  TrendingUp, CheckCircle, Clock, ChevronRight,
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import styles from './HODDashboard.module.css';

const DEPT = {
  name: 'Computer Science & Engineering',
  overview: 'The Department of Computer Science & Engineering at MITS is committed to excellence in education, research, and innovation — preparing students for successful careers in the rapidly evolving field of computer science.',
  vision: 'To be a center of excellence in computer science education and research, producing globally competent professionals who contribute to technological advancement and societal development.',
  mission: 'To provide quality education through innovative teaching methods, promote research and development, and foster industry-academia collaboration for the holistic development of students.',
  totalStudents: '1200+',
  totalFaculty: '45',
  labs: '12',
};

const DESIGNATION_ORDER = [
  'Professor & HOD', 'Professor', 'Associate Professor',
  'Assistant Professor', 'Senior Lecturer', 'Lecturer',
];

const DESIG_STYLE = {
  'Professor & HOD':    { color: '#7C3AED', bg: '#F5F3FF' },
  'Professor':          { color: '#1E3A8A', bg: '#EFF6FF' },
  'Associate Professor':{ color: '#0369A1', bg: '#E0F2FE' },
  'Assistant Professor':{ color: '#059669', bg: '#ECFDF5' },
  'Senior Lecturer':    { color: '#D97706', bg: '#FFFBEB' },
  'Lecturer':           { color: '#64748B', bg: '#F1F5F9' },
};


function SectionHead({ icon: Icon, title, sub }) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionIconWrap}><Icon size={18} /></div>
      <div>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {sub && <p className={styles.sectionSub}>{sub}</p>}
      </div>
    </div>
  );
}

function ContentCard({ item, fallbackIcon: FallbackIcon }) {
  return (
    <div className={styles.contentCard}>
      <div className={styles.contentThumb}>
        {item.images?.[0]?.url
          ? <img src={item.images[0].url} alt={item.title} />
          : <div className={styles.contentThumbFallback}><FallbackIcon size={26} color="#94a3b8" /></div>
        }
      </div>
      <div className={styles.contentBody}>
        <h4 className={styles.contentTitle}>{item.title}</h4>
        <div className={styles.contentMeta}>
          <Calendar size={12} />
          <span>{item.date}</span>
          <Badge status={item.status}>{item.status}</Badge>
        </div>
      </div>
    </div>
  );
}

export default function HODDashboard() {
  const { user } = useAuth();
  const { submissions, getPublicEvents, getPublicTrending, getPublicFaculty } = useData();

  const deptSubs    = submissions.filter(s => s.department === user?.department);
  const pending     = deptSubs.filter(s => s.status === 'Pending').length;
  const approved    = deptSubs.filter(s => s.status === 'Approved').length;
  const rejected    = deptSubs.filter(s => s.status === 'Rejected').length;
  const total       = deptSubs.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // PUBLIC ONLY — only Approved/Published content shown on department dashboard
  const deptTrending = getPublicTrending(user?.department)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const publicEvents = getPublicEvents(user?.department);
  const newsItems    = publicEvents.filter(e => e.type === 'News').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const eventItems   = publicEvents.filter(e => e.type === 'Event').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const mouItems     = publicEvents.filter(e => e.type === 'MoU').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const activeMoUs   = mouItems.length;

  const deptFaculty = getPublicFaculty(user?.department)
    .sort((a, b) => {
      const ai = DESIGNATION_ORDER.indexOf(a.designation);
      const bi = DESIGNATION_ORDER.indexOf(b.designation);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const STATS = [
    { icon: Users,         label: 'Total Faculty',   value: deptFaculty.length || DEPT.totalFaculty, color: '#7C3AED', bg: '#F5F3FF' },
    { icon: GraduationCap, label: 'Total Students',  value: DEPT.totalStudents,  color: '#0369A1', bg: '#E0F2FE' },
    { icon: BookOpen,      label: 'Events Published', value: eventItems.length,  color: '#D97706', bg: '#FFFBEB' },
    { icon: Award,         label: 'Active MoUs',      value: activeMoUs,         color: '#059669', bg: '#ECFDF5' },
  ];

  return (
    <div className={styles.root}>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroBubble1} />
        <div className={styles.heroBubble2} />
        <div className={styles.heroPattern} />
        <div className={styles.heroInner}>

          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <TrendingUp size={12} />
              <span>Department Dashboard</span>
            </div>
            <h1 className={styles.deptName}>{DEPT.name}</h1>
            <p className={styles.deptOverview}>{DEPT.overview}</p>
            <div className={styles.heroChips}>
              {[
                { icon: Users,         label: `${DEPT.totalFaculty} Faculty` },
                { icon: GraduationCap, label: `${DEPT.totalStudents} Students` },
                { icon: Building2,     label: `${DEPT.labs} Labs` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className={styles.heroChip}>
                  <Icon size={14} /> {label}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.hodRow}>
              <Avatar name={user?.name} size={62} />
              <div className={styles.hodMeta}>
                <span className={styles.hodRole}>Head of Department</span>
                <h2 className={styles.hodName}>{user?.name}</h2>
                <span className={styles.hodActiveBadge}>
                  <span className={styles.activePulse} />Active
                </span>
              </div>
            </div>
            <div className={styles.heroCardDivider} />
            <div className={styles.quickStats}>
              <div className={styles.quickStat}>
                <div className={styles.quickStatIcon} style={{ background: '#FFFBEB' }}>
                  <Clock size={14} color="#D97706" />
                </div>
                <div className={styles.quickStatVal} style={{ color: '#D97706' }}>{pending}</div>
                <div className={styles.quickStatLbl}>Pending</div>
              </div>
              <div className={styles.quickStatDivider} />
              <div className={styles.quickStat}>
                <div className={styles.quickStatIcon} style={{ background: '#F0FDF4' }}>
                  <CheckCircle size={14} color="#15803D" />
                </div>
                <div className={styles.quickStatVal} style={{ color: '#15803D' }}>{approved}</div>
                <div className={styles.quickStatLbl}>Approved</div>
              </div>
              <div className={styles.quickStatDivider} />
              <div className={styles.quickStat}>
                <div className={styles.quickStatIcon} style={{ background: '#EFF6FF' }}>
                  <TrendingUp size={14} color="#1E3A8A" />
                </div>
                <div className={styles.quickStatVal} style={{ color: '#1E3A8A' }}>{approvalRate}%</div>
                <div className={styles.quickStatLbl}>Rate</div>
              </div>
            </div>
          </div>

        </div>
        <div className={styles.heroWave} />
      </div>

      {/* ── MAIN ── */}
      <div className={styles.main}>

        {/* STAT CARDS */}
        <div className={styles.statsGrid}>
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={styles.statCard}>
              <div className={styles.statAccent} style={{ background: color }} />
              <div className={styles.statIconWrap} style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div className={styles.statBody}>
                <div className={styles.statValue} style={{ color }}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
              <ChevronRight size={16} className={styles.statArrow} color={color} />
            </div>
          ))}
        </div>

        {/* VISION & MISSION */}
        <div className={styles.vmGrid}>
          {[
            { icon: Target, label: 'Vision',  text: DEPT.vision,   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            { icon: Zap,    label: 'Mission', text: DEPT.mission,  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
          ].map(({ icon: Icon, label, text, color, bg, border }) => (
            <div key={label} className={styles.vmCard} style={{ borderColor: border }}>
              <div className={styles.vmIconWrap} style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <h3 className={styles.vmTitle} style={{ color }}>{label}</h3>
              <p className={styles.vmText}>{text}</p>
            </div>
          ))}
        </div>

        {/* FACULTY OVERVIEW */}
        {deptFaculty.length > 0 && (
          <div className={styles.section}>
            <SectionHead icon={Users} title="Faculty Overview" sub={`${deptFaculty.length} members · sorted by academic hierarchy`} />
            <div className={styles.facultyGrid}>
              {deptFaculty.map(f => {
                const ds = DESIG_STYLE[f.designation] || { color: '#64748B', bg: '#F1F5F9' };
                return (
                  <div key={f.id} className={styles.facultyCard}>
                    <div className={styles.facultyAvatarWrap}>
                      <Avatar name={f.name} size={52} />
                    </div>
                    <h4 className={styles.facultyName}>{f.name}</h4>
                    <span className={styles.facultyDesig} style={{ color: ds.color, background: ds.bg }}>
                      {f.designation}
                    </span>
                    {f.email && <p className={styles.facultySpec}>{f.email}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRENDING */}
        {deptTrending.length > 0 && (
          <div className={styles.section}>
            <SectionHead icon={Sparkles} title="Trending" sub="Latest reels and shorts from the department" />
            <div className={styles.trendingGrid}>
              {deptTrending.map(item => (
                <a key={item.id} href={item.reelUrl} target="_blank" rel="noopener noreferrer" className={styles.trendingCard}>
                  <div className={styles.trendingThumb}>
                    {item.coverImage
                      ? <img src={item.coverImage} alt={item.title} />
                      : <div className={styles.trendingPlaceholder}><Play size={28} color="white" /></div>
                    }
                    <div className={styles.trendingOverlay}>
                      <div className={styles.trendingPlayBtn}><Play size={16} /></div>
                    </div>
                    <div className={styles.trendingBadge}><Sparkles size={10} /> Trending</div>
                  </div>
                  <div className={styles.trendingInfo}>
                    <p className={styles.trendingTitle}>{item.title}</p>
                    {item.date && <span className={styles.trendingDate}>{item.date}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* NEWS */}
        {newsItems.length > 0 && (
          <div className={styles.section}>
            <SectionHead icon={Newspaper} title="Latest News" sub={`${newsItems.length} recent announcements`} />
            <div className={styles.contentGrid}>
              {newsItems.map(item => <ContentCard key={item.id} item={item} fallbackIcon={Newspaper} />)}
            </div>
          </div>
        )}

        {/* EVENTS */}
        {eventItems.length > 0 && (
          <div className={styles.section}>
            <SectionHead icon={Calendar} title="Events & Announcements" sub={`${eventItems.length} published events`} />
            <div className={styles.contentGrid}>
              {eventItems.map(item => <ContentCard key={item.id} item={item} fallbackIcon={Calendar} />)}
            </div>
          </div>
        )}

        {/* MoUs */}
        {mouItems.length > 0 && (
          <div className={styles.section}>
            <SectionHead icon={Handshake} title="MoUs & Collaborations" sub={`${activeMoUs} active partnership${activeMoUs !== 1 ? 's' : ''}`} />
            <div className={styles.mouGrid}>
              {mouItems.map(mou => (
                <div key={mou.id} className={styles.mouCard}>
                  <div className={styles.mouTop}>
                    <div className={styles.mouIconWrap}><Handshake size={18} color="#0891B2" /></div>
                    <Badge status={mou.status}>{mou.status}</Badge>
                  </div>
                  <h4 className={styles.mouTitle}>{mou.organization || mou.title}</h4>
                  {mou.description && <p className={styles.mouDesc}>{mou.description}</p>}
                  <div className={styles.mouFooter}>
                    <Calendar size={12} />
                    <span>{mou.date}</span>
                    {mou.duration && <><span>·</span><span>{mou.duration}</span></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
