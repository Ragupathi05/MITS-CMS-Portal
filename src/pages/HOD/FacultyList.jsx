// src/pages/HOD/FacultyList.jsx
import { useState, useMemo } from 'react';
import { Card, PageHeader } from '../../components/common/UI';
import { User, Mail, Building2, Search, RotateCcw, Eye } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useData } from '../../context/DataContext';
import Avatar from '../../components/common/Avatar';
import FacultyProfileModal from '../Shared/FacultyProfileModal';
import styles from './FacultyList.module.css';

const DESIGNATIONS = [
  'All',
  'Professor & HOD', 'Professor', 'Associate Professor',
  'Assistant Professor', 'Senior Lecturer', 'Lecturer',
];

export default function FacultyList() {
  const [search,      setSearch]      = useState('');
  const [deptFilter,  setDeptFilter]  = useState('All');
  const [roleFilter,  setRoleFilter]  = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const { user } = useAuth();
  const { getFacultyByDepartment, getAllFaculty, profileSections } = useData();

  const isAdmin = user?.role === 'ADMIN';

  const baseFaculty = user?.role === 'HOD'
    ? getFacultyByDepartment(user.department)
    : getAllFaculty();

  const getFacultyProfileData = (facultyId) => {
    return profileSections || {};
  };

  const departments = useMemo(() =>
    ['All', ...new Set(baseFaculty.map(f => f.department).filter(Boolean))]
  , [baseFaculty]);

  const filtered = baseFaculty.filter(f =>
    (deptFilter === 'All' || f.department === deptFilter) &&
    (roleFilter === 'All' || f.designation === roleFilter) &&
    (!search ||
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.designation?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const hasFilters = search || deptFilter !== 'All' || roleFilter !== 'All';

  const clearFilters = () => { setSearch(''); setDeptFilter('All'); setRoleFilter('All'); };

  return (
    <div className={styles.root}>
      <PageHeader
        title="Faculty List"
        subtitle="View all faculty members list and their details"
      />

      {/* FILTERS */}
      <Card style={{ padding: '12px 16px', marginBottom: 20 }}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={16} color="var(--gray-400)" />
            <input
              placeholder="Search by name, email or designation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {isAdmin && (
            <select className={styles.filterSelect} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          )}
          <select className={styles.filterSelect} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {DESIGNATIONS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Designations' : d}</option>)}
          </select>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              <RotateCcw size={13} /> Clear
            </button>
          )}
        </div>
      </Card>

      {/* GRID */}
      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <Card style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)', gridColumn: '1/-1' }}>
            No faculty members match the current filters
          </Card>
        ) : (
          filtered.map(faculty => (
            <Card key={faculty.id} className={styles.facultyCard} onClick={() => setSelectedFaculty(faculty)} style={{ cursor: 'pointer' }}>
              <div className={styles.cardHeader}>
              <Avatar name={faculty.name} avatar={faculty.avatar} size={56} />
                <div className={styles.cardInfo}>
                  <div className={styles.name}>{faculty.name}</div>
                  <div className={styles.designation}>{faculty.designation}</div>
                </div>
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                  <Mail size={14} color="var(--gray-400)" />
                  <span>{faculty.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <Building2 size={14} color="var(--gray-400)" />
                  <span>{faculty.department}</span>
                </div>
              </div>
              <div className={styles.viewProfileBtn}>
                <Eye size={14} /> View Profile
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Faculty Profile Modal */}
      {selectedFaculty && (
        <FacultyProfileModal
          faculty={selectedFaculty}
          profileSections={getFacultyProfileData(selectedFaculty.id)}
          profileStatus="Approved"
          onClose={() => setSelectedFaculty(null)}
        />
      )}
    </div>
  );
}