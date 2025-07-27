import React from 'react';

const BabyCircles = ({ babies, onBabySelect, onBack, userType, currentUser }) => {
  const getGreeting = () => {
    if (userType === 'staff') {
      return `שלום ${currentUser.username}! 👋`;
    } else {
      return `שלום הורה של ${currentUser.childName}! 💕`;
    }
  };

  const getSubtitle = () => {
    if (userType === 'staff') {
      return `מעקב אחר ${babies.length} תינוקות במעון`;
    } else {
      return 'לחץ על התינוק שלך לצפייה במידע';
    }
  };

  // Calculate completion percentage for each baby
  const getCompletionPercentage = (baby) => {
    const activities = baby.activities;
    const totalActivities = Object.keys(activities).length;
    const completedActivities = Object.values(activities).filter(Boolean).length;
    return Math.round((completedActivities / totalActivities) * 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 75) return '#68D391';
    if (percentage >= 50) return '#F6E05E';
    if (percentage > 0) return '#FBB6CE';
    return '#E2E8F0';
  };

  const getStatusText = (percentage) => {
    if (percentage === 100) return '✨';
    if (percentage >= 75) return '😊';
    if (percentage >= 50) return '🌟';
    if (percentage > 0) return '🌱';
    return '💤';
  };

  // Get baby's initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="baby-circles">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה להתחברות
      </button>
      
      <div className="circles-header">
        <h1 className="circles-title">{getGreeting()}</h1>
        <p className="circles-subtitle">{getSubtitle()}</p>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#6B7280', 
          marginTop: '10px' 
        }}>
          עדכון אחרון: {new Date().toLocaleString('he-IL')}
        </div>
      </div>

      <div className="circles-container">
        {babies.map(baby => {
          const completionPercentage = getCompletionPercentage(baby);
          const statusColor = getStatusColor(completionPercentage);
          const statusText = getStatusText(completionPercentage);
          
          return (
            <div 
              key={baby.id} 
              className="baby-circle"
              onClick={() => onBabySelect(baby)}
            >
              <div className="circle-avatar">
                {getInitials(baby.name)}
              </div>
              
              <div className="circle-content">
                <h3 className="circle-name">{baby.name}</h3>
                
                <div className="circle-status" style={{ color: statusColor }}>
                  {statusText}
                </div>
                
                <div className="circle-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{
                        width: `${completionPercentage}%`,
                        backgroundColor: statusColor
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {completionPercentage}%
                  </span>
                </div>
                
                <div className="circle-time">
                  עדכון: {new Date(baby.lastUpdated).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {babies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6B7280',
          fontSize: '1.1rem'
        }}>
          אין תינוקות זמינים לצפייה
        </div>
      )}
    </div>
  );
};

export default BabyCircles; 