// src/pages/Reports.jsx
import { useData } from '../context/DataContext';
import { PageHeader, Card, StatCard } from '../components/common/UI';
import { BarChart2, TrendingUp, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import styles from './Reports.module.css';

const COLORS = ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

function HorizontalBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.barRow}>
      <div className={styles.barLabel}>{label}</div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className={styles.barValue}>{value}</div>
    </div>
  );
}

export default function Reports() {
  const { submissions, events } = useData();

  const byType = submissions.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1; return acc;
  }, {});

  const byDept = submissions.reduce((acc, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1; return acc;
  }, {});

  const maxType = Math.max(...Object.values(byType), 1);
  const maxDept = Math.max(...Object.values(byDept), 1);

  return (
    <div className={styles.root}>
      <PageHeader title="Reports & Analytics" subtitle="Overview of CMS activity and submission statistics" />

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Submissions" value={submissions.length} icon={FileText} color="var(--primary)" bg="var(--primary-bg)" />
        <StatCard label="Approved" value={submissions.filter(s => s.status === 'Approved').length} icon={CheckCircle} color="#15803D" bg="var(--success-bg)" />
        <StatCard label="Pending" value={submissions.filter(s => s.status === 'Pending').length} icon={Clock} color="#92400E" bg="var(--warning-bg)" />
        <StatCard label="Rejected" value={submissions.filter(s => s.status === 'Rejected').length} icon={XCircle} color="#991B1B" bg="var(--error-bg)" />
        <StatCard label="Total Events" value={events.filter(e => e.type === 'Event').length} icon={BarChart2} color="#7C3AED" bg="#F5F3FF" />
        <StatCard label="Total MoUs" value={events.filter(e => e.type === 'MoU').length} icon={TrendingUp} color="#0891B2" bg="#F0FDFA" />
      </div>

      <div className={styles.grid}>
        {/* BY TYPE */}
        <Card style={{ padding: 24 }}>
          <div className={styles.chartTitle}>Submissions by Content Type</div>
          <div className={styles.chartBody}>
            {Object.entries(byType).length === 0 ? (
              <div className={styles.noData}>No data available</div>
            ) : Object.entries(byType).map(([type, count], i) => (
              <HorizontalBar key={type} label={type} value={count} max={maxType} color={COLORS[i % COLORS.length]} />
            ))}
          </div>
        </Card>

        {/* BY DEPARTMENT */}
        <Card style={{ padding: 24 }}>
          <div className={styles.chartTitle}>Submissions by Department</div>
          <div className={styles.chartBody}>
            {Object.entries(byDept).length === 0 ? (
              <div className={styles.noData}>No data available</div>
            ) : Object.entries(byDept).map(([dept, count], i) => (
              <HorizontalBar key={dept} label={dept} value={count} max={maxDept} color={COLORS[(i + 2) % COLORS.length]} />
            ))}
          </div>
        </Card>

        {/* APPROVAL RATE */}
        <Card style={{ padding: 24 }}>
          <div className={styles.chartTitle}>Approval Rate Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            {[
              { status: 'Approved', color: 'var(--success)' },
              { status: 'Pending', color: 'var(--warning)' },
              { status: 'Rejected', color: 'var(--error)' },
            ].map(({ status, color }) => {
              const count = submissions.filter(s => s.status === status).length;
              const pct = submissions.length ? Math.round((count / submissions.length) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 5 }}>
                    <span>{status}</span><span>{pct}%</span>
                  </div>
                  <div style={{ height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* EVENTS BY STATUS */}
        <Card style={{ padding: 24 }}>
          <div className={styles.chartTitle}>Events & MoUs by Status</div>
          <div className={styles.chartBody}>
            {['Approved', 'Pending', 'Draft'].map((s, i) => (
              <HorizontalBar
                key={s}
                label={s}
                value={events.filter(e => e.status === s).length}
                max={Math.max(events.length, 1)}
                color={COLORS[i]}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
