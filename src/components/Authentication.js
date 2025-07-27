import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

// Mock user database with hashed passwords
const STAFF_USERS = [
  {
    id: 1,
    username: 'מנהלת',
    passwordHash: CryptoJS.SHA256('123456' + 'salt123').toString(),
    role: 'manager'
  },
  {
    id: 2,
    username: 'גננת1',
    passwordHash: CryptoJS.SHA256('password' + 'salt123').toString(),
    role: 'caregiver'
  }
];

const PARENT_USERS = [
  {
    id: 1,
    parentCode: 'PARENT001',
    password: '1',
    childName: 'נועה'
  },
  {
    id: 2,
    parentCode: 'PARENT002',
    password: '1',
    childName: 'אריאל'
  },
  {
    id: 3,
    parentCode: 'PARENT003',
    password: '1',
    childName: 'תמר'
  },
  {
    id: 4,
    parentCode: 'PARENT004',
    password: '1',
    childName: 'יונתן'
  }
];

const Authentication = ({ userType, onAuthentication, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    parentCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const hashPassword = (password) => {
    return CryptoJS.SHA256(password + 'salt123').toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Debug logging
    console.log('Attempting login with:', {
      userType,
      formData,
      parentCode: formData.parentCode,
      password: formData.password
    });

    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (userType === 'staff') {
        const hashedPassword = hashPassword(formData.password);
        const user = STAFF_USERS.find(
          u => u.username === formData.username && u.passwordHash === hashedPassword
        );

        if (user) {
          onAuthentication({
            id: user.id,
            username: user.username,
            role: user.role,
            type: 'staff'
          });
        } else {
          setError('שם משתמש או סיסמה שגויים');
        }
      } else if (userType === 'parent') {
        // Clean whitespace from input
        const cleanParentCode = formData.parentCode.trim();
        const cleanPassword = formData.password.trim();
        
        console.log('Trying to login as parent with:', {
          parentCode: cleanParentCode,
          password: cleanPassword
        });
        
        const user = PARENT_USERS.find(
          u => u.parentCode === cleanParentCode && u.password === cleanPassword
        );

        console.log('Found user:', user);
        console.log('Available users:', PARENT_USERS);
        console.log('Available users details:', PARENT_USERS.map(u => ({
          parentCode: u.parentCode,
          password: u.password,
          childName: u.childName
        })));
        console.log('Comparing:', {
          inputParentCode: cleanParentCode,
          inputPassword: cleanPassword,
          userParentCode: user?.parentCode,
          userPassword: user?.password
        });

        if (user) {
          onAuthentication({
            id: user.id,
            parentCode: user.parentCode,
            childName: user.childName,
            type: 'parent'
          });
        } else {
          setError('קוד הורה או סיסמה שגויים');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('שגיאה במערכת, נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה
      </button>
      
      <h2 className="auth-title">
        {userType === 'staff' ? 'כניסת צוות המעון' : 'כניסת הורים'}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        {userType === 'staff' ? (
          <>
            <div className="form-group">
              <label className="form-label">שם משתמש</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="הכנס שם משתמש"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">סיסמה</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="הכנס סיסמה"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">קוד הורה</label>
              <input
                type="text"
                name="parentCode"
                className="form-input"
                value={formData.parentCode}
                onChange={handleInputChange}
                placeholder="הכנס קוד הורה (לדוגמה: PARENT001)"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">סיסמה</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="הכנס סיסמה"
                required
              />
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </button>
      </form>

      {/* Demo credentials info */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#F7FAFC', 
        borderRadius: '10px',
        fontSize: '0.9rem',
        color: '#6B7280'
      }}>
        <strong>פרטי התחברות לדמו:</strong><br/>
        {userType === 'staff' ? (
          <>
            צוות: מנהלת / 123456<br/>
            צוות: גננת1 / password
          </>
        ) : (
          <>
            הורה: PARENT001 / 1<br/>
            הורה: PARENT002 / 1<br/>
            הורה: PARENT003 / 1<br/>
            הורה: PARENT004 / 1
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;
