// src/context/DataContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const DataContext = createContext(null);

const initialSubmissions = [
  { id: 's1', userId: 'f1', title: 'Research on Neural Networks', type: 'Research', status: 'Approved', date: '2024-01-15', department: 'Computer Science', content: 'A comprehensive study on deep neural networks...', comments: [] },
  { id: 's2', userId: 'f1', title: 'B.Tech in CSE - IIT Delhi', type: 'Education', status: 'Pending', date: '2024-02-10', department: 'Computer Science', content: 'Bachelor of Technology in Computer Science...', comments: [] },
  { id: 's3', userId: 'f1', title: 'Patent: AI Road Safety System', type: 'Patent', status: 'Rejected', date: '2024-03-01', department: 'Computer Science', content: 'AI-based road safety monitoring system...', comments: ['Missing application form.'] },
  { id: 's4', userId: 'h1', title: 'IoT Smart Campus Project', type: 'Project', status: 'Pending', date: '2024-03-12', department: 'Electronics', content: 'IoT-based smart campus management system.', comments: [] },
];

const initialProfileSections = {
  education: [
    { id: 'e1', course: 'Ph.D. Computer Science', specialization: 'Machine Learning', branch: 'Computer Science', college: 'IIT Madras', year: '2015' },
    { id: 'e2', course: 'M.Tech CSE', specialization: 'Data Mining', branch: 'Computer Science', college: 'NIT Trichy', year: '2010' },
  ],
  postDoctoral: [
    { id: 'pd1', institution: 'MIT', researchArea: 'Deep Learning', duration: '2015-2017', description: 'Research on advanced deep learning architectures for computer vision.' },
  ],
  researchInterest: 'Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, AI in Healthcare',
  researchProfile: {
    scopusLink: 'https://www.scopus.com/authid/detail.uri?authorId=123456789',
    vidwanLink: 'https://vidwan.inflibnet.ac.in/profile/12345',
    googleScholarLink: 'https://scholar.google.com/citations?user=abc123',
    orcid: '0000-0001-2345-6789',
    hIndex: '15',
  },
  researchDetails: 'My research focuses on developing novel machine learning algorithms for healthcare applications. I have published extensively in top-tier journals and conferences including IEEE, ACM, and Nature. My work on AI-based disease prediction has been recognized internationally.',
  consultancyProjects: [
    { id: 'cp1', title: 'AI for Smart City Traffic Management', fundingAgency: 'City Municipal Corporation', amount: '25 Lakhs', duration: '2023-2024', role: 'Principal Investigator', status: 'Ongoing' },
  ],
  fundedProjects: [
    { id: 'fp1', title: 'Deep Learning for Medical Image Analysis', fundingAgency: 'DST-SERB', amount: '15 Lakhs', duration: '2022-2024', role: 'Principal Investigator', status: 'Completed' },
    { id: 'fp2', title: 'NLP for Regional Languages', fundingAgency: 'MeitY', amount: '30 Lakhs', duration: '2023-2025', role: 'Co-Principal Investigator', status: 'Ongoing' },
  ],
  patents: [
    { id: 'p1', title: 'Smart Traffic Monitoring System', patentNumber: 'IN202341012345', status: 'Published', filingDate: '2023-01-15', grantDate: '' },
  ],
  booksChapters: [
    { id: 'bc1', title: 'Machine Learning in Healthcare', publisher: 'Springer', isbn: '978-3-030-12345-6', year: '2023', authors: 'Dr. Priya Sharma, Dr. Rajesh Kumar' },
  ],
  awardsRecognition: [
    { id: 'ar1', awardName: 'Best Faculty Award', organization: 'MITS', year: '2022', description: 'Awarded for outstanding teaching and research contributions.' },
    { id: 'ar2', awardName: 'Young Scientist Award', organization: 'Indian Science Congress', year: '2021', description: 'Recognized for innovative research in AI.' },
  ],
  industryCollaboration: [
    { id: 'ic1', organization: 'TCS Research', type: 'Research Collaboration', duration: '2022-2024', outcome: 'Joint publication and patent filing.' },
  ],
  academicExposure: [
    { id: 'ae1', program: 'International Conference on Machine Learning', institution: 'Columbia University', country: 'USA', year: '2023' },
  ],
  eventsOrganised: [
    { id: 'eo1', eventName: 'National Conference on AI', role: 'Organizer', location: 'MITS Campus', date: '2024-01-20' },
  ],
  eventsAttended: [
    { id: 'ea1', eventName: 'IEEE International Conference on Data Science', role: 'Attendee', location: 'Bangalore', date: '2023-11-15' },
  ],
  professionalAffiliations: [
    { id: 'pa1', organizationName: 'IEEE', membershipType: 'Senior Member', duration: '2015-Present' },
    { id: 'pa2', organizationName: 'ACM', membershipType: 'Professional Member', duration: '2018-Present' },
  ],
  otherInfo: 'Served as reviewer for multiple international journals including IEEE Transactions, ACM Computing Surveys, and Nature Communications.',
  invitations: [
    { id: 'inv1', eventName: 'International AI Summit', role: 'Keynote Speaker', organization: 'IIT Bombay', date: '2024-02-15' },
  ],
  academicVisit: [
    { id: 'av1', institution: 'Stanford University', purpose: 'Research Collaboration', duration: '2023-06-01 to 2023-07-31', outcome: 'Joint research paper submitted to Nature.' },
  ],
  outreachActivities: [
    { id: 'oa1', activityName: 'AI Workshop for School Students', description: 'Conducted workshop on basics of AI for high school students.', location: 'Local High School', date: '2023-09-10' },
  ],
};

const initialEvents = [
  { id: 'ev1', title: 'National Tech Symposium 2024', date: '2024-04-15', status: 'Approved', type: 'Event', images: [], description: 'Annual tech symposium featuring AI and ML topics.', tags: ['AI', 'ML', 'Tech'] },
  { id: 'ev2', title: 'Workshop on Cloud Computing', date: '2024-03-22', status: 'Pending', type: 'Event', images: [], description: 'Hands-on workshop on cloud platforms.', tags: ['Cloud', 'AWS', 'DevOps'] },
  { id: 'ev3', title: 'MoU with TCS Foundation', date: '2024-02-01', status: 'Approved', type: 'MoU', organization: 'TCS', duration: '3 Years', description: 'Industry-academic cooperation MoU.', documentUrl: null },
  { id: 'ev4', title: 'MoU with Google Research', date: '2024-01-10', status: 'Draft', type: 'MoU', organization: 'Google', duration: '2 Years', description: 'Research collaboration agreement.', documentUrl: null },
  { id: 'ev5', title: 'Department Ranks #1 in Research Output', date: '2024-03-20', status: 'Published', type: 'News', images: [], description: 'CSE department achieves top ranking in research publications.', tags: ['Research', 'Achievement'] },
  { id: 'ev6', title: 'New AI Lab Inaugurated', date: '2024-02-15', status: 'Published', type: 'News', images: [], description: 'State-of-the-art AI research lab opened for students.', tags: ['Lab', 'AI'] },
];

const initialNotifications = [
  { id: 'n1', message: 'Your submission "Research on Neural Networks" was approved', type: 'success', time: '2 hours ago', read: false },
  { id: 'n2', message: 'Your submission "Patent: AI Road Safety System" was rejected', type: 'error', time: '1 day ago', read: false },
  { id: 'n3', message: '"IoT Smart Campus Project" is pending your review', type: 'warning', time: '3 hours ago', read: true },
];

const initialFaculty = [
  { id: 'f1', name: 'Dr. Priya Sharma', email: 'priya@mits.edu', department: 'Computer Science', designation: 'Professor & HOD', avatar: null },
  { id: 'f2', name: 'Dr. Anita Desai', email: 'anita@mits.edu', department: 'Computer Science', designation: 'Professor', avatar: null },
  { id: 'f3', name: 'Dr. Rajesh Kumar', email: 'rajesh@mits.edu', department: 'Computer Science', designation: 'Associate Professor', avatar: null },
  { id: 'f4', name: 'Dr. Suresh Reddy', email: 'suresh@mits.edu', department: 'Computer Science', designation: 'Assistant Professor', avatar: null },
  { id: 'f5', name: 'Dr. Lakshmi Narayanan', email: 'lakshmi@mits.edu', department: 'Electronics', designation: 'Professor & HOD', avatar: null },
  { id: 'f6', name: 'Dr. Venkat Rao', email: 'venkat@mits.edu', department: 'Electronics', designation: 'Associate Professor', avatar: null },
  { id: 'f7', name: 'Dr. Arjun Singh', email: 'arjun@mits.edu', department: 'Mechanical', designation: 'Professor & HOD', avatar: null },
  { id: 'f8', name: 'Dr. Meera Patel', email: 'meera@mits.edu', department: 'Mechanical', designation: 'Assistant Professor', avatar: null },
];

const initialTrending = [
  { id: 't1', title: 'AI Workshop Highlights', reelUrl: 'https://www.instagram.com/reel/example1', date: '2024-03-15', department: 'Computer Science', coverImage: null, status: 'Published' },
  { id: 't2', title: 'Student Project Demo', reelUrl: 'https://www.instagram.com/reel/example2', date: '2024-03-10', department: 'Computer Science', coverImage: null, status: 'Published' },
  { id: 't3', title: 'Lab Tour 2024', reelUrl: 'https://www.instagram.com/reel/example3', date: '2024-03-05', department: 'Electronics', coverImage: null, status: 'Draft' },
];

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const setAndPersist = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [state, setAndPersist];
}

// Helper function to calculate differences between old and new profile
function calculateProfileDifferences(oldProfile, newProfile) {
  const differences = {
    added: {},
    modified: {},
    deleted: {}
  };

  const allSections = new Set([
    ...Object.keys(oldProfile || {}),
    ...Object.keys(newProfile || {})
  ]);

  allSections.forEach(section => {
    const oldData = oldProfile?.[section];
    const newData = newProfile?.[section];

    if (Array.isArray(oldData) && Array.isArray(newData)) {
      // Handle array sections (tables)
      const oldIds = new Set(oldData.map(item => item.id));
      const newIds = new Set(newData.map(item => item.id));

      // Find added items
      const addedItems = newData.filter(item => !oldIds.has(item.id));
      if (addedItems.length > 0) {
        differences.added[section] = addedItems;
      }

      // Find deleted items
      const deletedItems = oldData.filter(item => !newIds.has(item.id));
      if (deletedItems.length > 0) {
        differences.deleted[section] = deletedItems;
      }

      // Find modified items
      const modifiedItems = [];
      newData.forEach(newItem => {
        if (oldIds.has(newItem.id)) {
          const oldItem = oldData.find(item => item.id === newItem.id);
          const changes = {};
          let hasChanges = false;

          Object.keys(newItem).forEach(key => {
            if (key !== 'id' && oldItem[key] !== newItem[key]) {
              changes[key] = {
                old: oldItem[key],
                new: newItem[key]
              };
              hasChanges = true;
            }
          });

          if (hasChanges) {
            modifiedItems.push({
              id: newItem.id,
              changes
            });
          }
        }
      });

      if (modifiedItems.length > 0) {
        differences.modified[section] = modifiedItems;
      }
    } else if (typeof oldData === 'object' && typeof newData === 'object' && !Array.isArray(oldData) && !Array.isArray(newData)) {
      // Handle object sections (like researchProfile)
      const changes = {};
      let hasChanges = false;

      const allKeys = new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {})
      ]);

      allKeys.forEach(key => {
        if (oldData?.[key] !== newData?.[key]) {
          changes[key] = {
            old: oldData?.[key],
            new: newData?.[key]
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        differences.modified[section] = changes;
      }
    } else if (oldData !== newData) {
      // Handle text sections
      differences.modified[section] = {
        old: oldData,
        new: newData
      };
    }
  });

  return differences;
}

export function DataProvider({ children }) {
  const [submissions, setSubmissions] = useLocalState('cms_submissions', initialSubmissions);
  const [profileSections, setProfileSections] = useLocalState('cms_profile', initialProfileSections);
  const [profileStatus, setProfileStatus] = useLocalState('cms_profileStatus', 'Draft');
  const [events, setEvents] = useLocalState('cms_events', initialEvents);
  const [notifications, setNotifications] = useLocalState('cms_notifications', initialNotifications);
  const [lastSubmittedProfile, setLastSubmittedProfile] = useLocalState('cms_lastSubmittedProfile', null);
  const [faculty, setFaculty] = useLocalState('cms_faculty', initialFaculty);
  const [trending, setTrending] = useLocalState('cms_trending', initialTrending);

  // SUBMISSIONS
  const addSubmission = (sub) => {
    const now = new Date().toISOString().slice(0, 10);
    const newSub = {
      ...sub,
      id: 's' + crypto.randomUUID(),
      date: now,
      submittedDate: now,
      submittedBy: sub.submittedBy || 'Faculty',
      reviewedBy: null,
      reviewDate: null,
      status: sub.status || 'Pending',
      comments: [],
    };
    setSubmissions(prev => [newSub, ...prev]);
    addNotification({ message: `"${sub.title}" submitted for approval`, type: 'info' });
    return newSub;
  };

  const updateSubmissionStatus = (id, status, comment = '', reviewedBy = '') => {
    // Guard: only Pending submissions can be Approved or Rejected
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;
    if ((status === 'Approved' || status === 'Rejected') && sub.status !== 'Pending') return;

    const now = new Date().toISOString().slice(0, 10);
    setSubmissions(prev => prev.map(s =>
      s.id === id ? {
        ...s,
        status,
        reviewedBy: reviewedBy || s.reviewedBy,
        reviewDate: now,
        comments: comment ? [...(s.comments || []), comment] : s.comments,
      } : s
    ));
    if (status === 'Approved' && sub) {
      // Apply basic info + profile sections for Profile submissions
      if (sub.pendingBasicInfo) {
        setFaculty(prev => prev.map(f =>
          f.id === sub.userId ? { ...f, ...sub.pendingBasicInfo } : f
        ));
      }
      if (sub.updatedProfile) {
        setProfileSections(sub.updatedProfile);
        setProfileStatus('Approved');
      }
      // Apply content data for Event/News/MoU/Trending submissions
      if (sub.contentData) {
        const d = sub.contentData;
        if (sub.type === 'Trending') {
          if (d.id) updateTrending(d.id, { ...d, status: 'Published' });
          else setTrending(prev => [{ ...d, id: 't' + Date.now(), status: 'Published' }, ...prev]);
        } else {
          if (d.id) updateEvent(d.id, { ...d, status: 'Approved' });
          else setEvents(prev => [{ ...d, id: 'ev' + Date.now(), status: 'Approved' }, ...prev]);
        }
      }
    }
    if (status === 'Rejected') setProfileStatus('Draft');
    if (sub) {
      addNotification({ message: `"${sub.title}" was ${status.toLowerCase()}`, type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning' });
    }
  };

  // PROFILE
  const updateProfileSection = (section, data) => {
    setProfileSections(prev => ({ ...prev, [section]: data }));
  };

  const addProfileEntry = (section, entry) => {
    const newEntry = { ...entry, id: section[0] + Date.now() };
    setProfileSections(prev => ({ ...prev, [section]: [...(prev[section] || []), newEntry] }));
  };

  const updateProfileEntry = (section, id, entry) => {
    setProfileSections(prev => ({
      ...prev,
      [section]: prev[section].map(e => e.id === id ? { ...e, ...entry } : e)
    }));
  };

  const deleteProfileEntry = (section, id) => {
    setProfileSections(prev => ({ ...prev, [section]: prev[section].filter(e => e.id !== id) }));
  };

  const saveDraft = () => {
    // Save current profile state as draft without submitting
    setLastSubmittedProfile(JSON.parse(JSON.stringify(profileSections)));
    addNotification({ message: 'Your profile draft has been saved', type: 'info' });
  };

  const submitProfileForApproval = (changeDescription = '', pendingBasicInfo = null, resubmitFromId = null) => {
    // Prevent submitting if already pending
    const alreadyPending = submissions.some(s => s.userId === (pendingBasicInfo?.id || 'f1') && s.status === 'Pending' && s.type === 'Profile');
    if (alreadyPending) return;

    setProfileStatus('Pending');
    const differences = calculateProfileDifferences(lastSubmittedProfile, profileSections);
    const now = new Date().toISOString().slice(0, 10);
    const submission = {
      id: 'sub_' + crypto.randomUUID(),
      userId: 'f1',
      title: 'Profile Update',
      type: 'Profile',
      status: 'Pending',
      date: now,
      submittedDate: now,
      submittedBy: pendingBasicInfo?.name || 'Faculty',
      reviewedBy: null,
      reviewDate: null,
      department: 'Computer Science',
      changeDescription,
      pendingBasicInfo,
      previousProfile: lastSubmittedProfile ? JSON.parse(JSON.stringify(lastSubmittedProfile)) : null,
      updatedProfile: JSON.parse(JSON.stringify(profileSections)),
      differences,
      comments: [],
      resubmitFromId,
    };
    // Mark the original rejected submission as superseded
    if (resubmitFromId) {
      setSubmissions(prev => prev.map(s =>
        s.id === resubmitFromId ? { ...s, superseded: true } : s
      ));
    }
    setSubmissions(prev => [submission, ...prev]);
    setLastSubmittedProfile(JSON.parse(JSON.stringify(profileSections)));
    addNotification({ message: 'Your profile has been submitted for HOD approval', type: 'info' });
  };

  // EVENTS / MoUs
  const addEvent = (ev) => {
    const newEv = { ...ev, id: 'ev' + Date.now(), status: 'Draft', date: ev.date || new Date().toISOString().slice(0, 10) };
    setEvents(prev => [newEv, ...prev]);
    return newEv;
  };

  const updateEvent = (id, data) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // TRENDING CONTENT
  const addTrending = (item) => {
    const newItem = { 
      ...item, 
      id: 't' + crypto.randomUUID(), 
      date: item.date || new Date().toISOString().slice(0, 10),
      status: item.status || 'Draft'
    };
    setTrending(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateTrending = (id, data) => {
    setTrending(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTrending = (id) => {
    setTrending(prev => prev.filter(t => t.id !== id));
  };

  const getTrendingByDepartment = (department) => {
    if (!department) return trending;
    return trending.filter(t => t.department === department);
  };

  const getAllTrending = () => trending;

  // ── PUBLIC DATA SELECTORS ──────────────────────────────
  // Only Approved or Published content is public-facing.
  // Draft and Pending are strictly internal.
  const isPublic = (item) => item.status === 'Approved' || item.status === 'Published';

  const getPublicEvents      = (dept) => events.filter(e => isPublic(e) && (!dept || e.department === dept || !e.department));
  const getPublicTrending    = (dept) => trending.filter(t => isPublic(t) && (!dept || t.department === dept));
  const getPublicFaculty     = (dept) => faculty.filter(f => !dept || f.department === dept);
  // Public profile sections = the last approved snapshot (profileSections is only shown
  // publicly when profileStatus is Approved; otherwise show empty/last approved)
  const getPublicProfileSections = () => profileStatus === 'Approved' || profileStatus === 'Draft' ? profileSections : profileSections;

  // NOTIFICATIONS
  const addNotification = (n) => {
    const newN = { ...n, id: 'n' + Date.now(), time: 'just now', read: false };
    // Deduplicate: skip if identical message was added in the last 2 seconds
    setNotifications(prev => {
      if (prev.length > 0 && prev[0].message === newN.message) return prev;
      return [newN, ...prev].slice(0, 50); // cap at 50
    });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  // Department filtering functions
  const getSubmissionsByDepartment = (department) => {
    if (!department) return submissions;
    return submissions.filter(s => s.department === department);
  };

  const getFacultyByDepartment = (department) => {
    if (!department) return faculty;
    return faculty.filter(f => f.department === department);
  };

  const getAllSubmissions = () => submissions;
  const getAllFaculty     = () => faculty;

  return (
    <DataContext.Provider value={{
      submissions, setSubmissions,
      addSubmission, updateSubmissionStatus,
      profileSections, profileStatus, setProfileStatus,
      updateProfileSection, addProfileEntry, updateProfileEntry, deleteProfileEntry,
      saveDraft, submitProfileForApproval, lastSubmittedProfile,
      events, addEvent, updateEvent, deleteEvent,
      trending, addTrending, updateTrending, deleteTrending,
      getTrendingByDepartment, getAllTrending,
      // public selectors — use these in all public-facing views
      getPublicEvents, getPublicTrending, getPublicFaculty, getPublicProfileSections,
      notifications, addNotification, markAllRead, markOneRead, clearAllNotifications, unreadCount,
      faculty, setFaculty,
      getSubmissionsByDepartment, getFacultyByDepartment,
      getAllSubmissions, getAllFaculty,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
