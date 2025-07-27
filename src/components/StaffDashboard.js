import React from 'react';

const StaffDashboard = ({ currentUser, onNavigate, onBack }) => {
  const dashboardOptions = [
    {
      id: 'parents-management',
      title: 'ניהול הורים וילדים',
      subtitle: 'צפייה בסטטוס הילדים לפי הורים',
      icon: '👨‍👩‍👧‍👦',
      color: '#FBB6CE',
      description: 'ניהול הקשר בין הורים לילדים וצפייה בסטטוס'
    },
    {
      id: 'babies-activities',
      title: 'ניהול תינוקות ופעילויות',
      subtitle: 'עדכון פעילויות יומיות לתינוקות',
      icon: '👶',
      color: '#A7F3D0',
      description: 'עדכון פעילויות יומיות וציוד אישי'
    }
  ];

  const handleOptionClick = (optionId) => {
    if (optionId === 'parents-management') {
      onNavigate('parents-management');
    } else if (optionId === 'babies-activities') {
      onNavigate('circles');
    }
  };

  return (
    <div className="staff-dashboard">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה להתחברות
      </button>
      
      <div className="dashboard-header">
        <h1 className="dashboard-title">שלום {currentUser.username}! 👋</h1>
        <p className="dashboard-subtitle">בחר את האפשרות הרצויה</p>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#6B7280', 
          marginTop: '10px' 
        }}>
          {new Date().toLocaleString('he-IL')}
        </div>
      </div>

      <div className="dashboard-options">
        {dashboardOptions.map(option => (
          <div 
            key={option.id}
            className="dashboard-circle"
            onClick={() => handleOptionClick(option.id)}
            style={{ borderColor: option.color }}
          >
            <div className="circle-icon" style={{ backgroundColor: option.color }}>
              {option.icon}
            </div>
            
            <div className="circle-content">
              <h3 className="circle-title">{option.title}</h3>
              <p className="circle-subtitle">{option.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h4>📊 סטטיסטיקות יומיות</h4>
          <p>4 תינוקות במעון</p>
          <p>4 משפחות רשומות</p>
          <p>פעילויות מתעדכנות בזמן אמת</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 