// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Eye, EyeOff, LogIn, Users, Shield, GraduationCap, AlertCircle } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const doLogin = (role) => {
    setLoading(true);
    setSelectedRole(role);
    setTimeout(() => {
      const demoUsers = {
        faculty: { id: 'f1', name: 'Dr. Priya Sharma', email: 'priya@mits.edu', role: 'FACULTY', department: 'Computer Science' },
        hod: { id: 'h1', name: 'Prof. R. Kumar', email: 'kumar@mits.edu', role: 'HOD', department: 'Computer Science' },
        admin: { id: 'a1', name: 'Admin Meera Nair', email: 'meera@mits.edu', role: 'ADMIN', department: 'Administration' },
      };
      login(demoUsers[role]);
      navigate('/dashboard');
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const demoCredentials = {
        'faculty@mits.edu': { id: 'f1', name: 'Dr. Priya Sharma', email: 'faculty@mits.edu', role: 'FACULTY', department: 'Computer Science' },
        'hod@mits.edu': { id: 'h1', name: 'Prof. R. Kumar', email: 'hod@mits.edu', role: 'HOD', department: 'Computer Science' },
        'admin@mits.edu': { id: 'a1', name: 'Admin Meera Nair', email: 'admin@mits.edu', role: 'ADMIN', department: 'Administration' },
      };
      const user = demoCredentials[email];
      if (user && password === 'demo123') {
        login(user);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try demo credentials below.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className={styles.root}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoBox}>
            <div className={styles.logoCircle}>M</div>
          </div>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.collegeName}>Madanapalle Institute of Technology & Science</h1>
          <p className={styles.collegeSubtitle}>Department Content Management System</p>
        </div>
        <div className={styles.headerRight} />
      </header>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          {/* LEFT: Role Selection */}
          <div className={styles.roleSection}>
            <h2 className={styles.sectionTitle}>Select Login Type</h2>
            <p className={styles.sectionDesc}>Choose your role to access the portal</p>
            
            <div className={styles.roleButtons}>
              <button 
                className={`${styles.roleBtn} ${selectedRole === 'faculty' ? styles.roleBtnActive : ''}`}
                onClick={() => doLogin('faculty')}
                disabled={loading}
              >
                <div className={styles.roleIcon}>
                  <GraduationCap size={24} />
                </div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleName}>Faculty Login</div>
                  <div className={styles.roleDesc}>Access your profile and submissions</div>
                </div>
              </button>

              <button 
                className={`${styles.roleBtn} ${selectedRole === 'hod' ? styles.roleBtnActive : ''}`}
                onClick={() => doLogin('hod')}
                disabled={loading}
              >
                <div className={styles.roleIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleName}>HOD Login</div>
                  <div className={styles.roleDesc}>Review and approve faculty submissions</div>
                </div>
              </button>

              <button 
                className={`${styles.roleBtn} ${selectedRole === 'admin' ? styles.roleBtnActive : ''}`}
                onClick={() => doLogin('admin')}
                disabled={loading}
              >
                <div className={styles.roleIcon}>
                  <Shield size={24} />
                </div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleName}>Admin Login</div>
                  <div className={styles.roleDesc}>Manage events, MoUs, and content</div>
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT: Login Form */}
          <div className={styles.formSection}>
            <div className={styles.formBox}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSubtitle}>Enter your credentials to continue</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="you@mits.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.inputWrap}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className={styles.input}
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={styles.errorMsg}>
                    <AlertCircle size={14} />{error}
                  </div>
                )}

                <button type="submit" className={styles.loginBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : <LogIn size={16} />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className={styles.demoInfo}>
                <div className={styles.demoLabel}>Demo Credentials</div>
                <div className={styles.demoList}>
                  <div className={styles.demoItem}>
                    <span className={styles.demoRole}>Faculty:</span>
                    <span className={styles.demoCred}>faculty@mits.edu / demo123</span>
                  </div>
                  <div className={styles.demoItem}>
                    <span className={styles.demoRole}>HOD:</span>
                    <span className={styles.demoCred}>hod@mits.edu / demo123</span>
                  </div>
                  <div className={styles.demoItem}>
                    <span className={styles.demoRole}>Admin:</span>
                    <span className={styles.demoCred}>admin@mits.edu / demo123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2024 Madanapalle Institute of Technology & Science. All rights reserved.</p>
      </footer>
    </div>
  );
}
