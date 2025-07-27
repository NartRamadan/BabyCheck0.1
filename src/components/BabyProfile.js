import React, { useState } from 'react';
import ActivityToggle from './ActivityToggle';
import EquipmentList from './EquipmentList';

const BabyProfile = ({ 
  baby, 
  userType, 
  onBack, 
  onUpdateActivity, 
  onAddEquipment, 
  onRemoveEquipment 
}) => {
  const [successMessage, setSuccessMessage] = useState('');

  const activities = [
    { key: 'morningMeal', name: 'ארוחת בוקר', icon: '🥄' },
    { key: 'firstDiaper', name: 'החלפת חיתול (1)', icon: '🍼' },
    { key: 'morningSleep', name: 'שנת בוקר', icon: '🌙' },
    { key: 'lunchMeal', name: 'ארוחת צהריים', icon: '🍽️' },
    { key: 'secondDiaper', name: 'החלפת חיתול (2)', icon: '🍼' },
    { key: 'afternoonSleep', name: 'שנת צהריים', icon: '🌙' }
  ];

  const handleActivityChange = (activityKey, value) => {
    if (userType === 'staff') {
      onUpdateActivity(baby.id, activityKey, value);
      setSuccessMessage('✨ כל הכבוד! עדכנת את המידע בהצלחה');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEquipmentAdd = (item) => {
    if (userType === 'staff') {
      onAddEquipment(baby.id, item);
      setSuccessMessage('🎒 הוספת פריט בהצלחה!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEquipmentRemove = (index) => {
    if (userType === 'staff') {
      onRemoveEquipment(baby.id, index);
      setSuccessMessage('🗑️ הפריט הוסר בהצלחה');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Get baby's initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="baby-profile">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה לרשימת התינוקות
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(baby.name)}
        </div>
        <h1 className="profile-name">{baby.name}</h1>
        <p className="profile-time">
          {new Date().toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} | {new Date().toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        {userType === 'parent' && (
          <div style={{
            background: '#E6FFFA',
            color: '#234E52',
            padding: '10px 15px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            marginTop: '15px'
          }}>
            👀 מצב צפייה בלבד - המידע מתעדכן אוטומטית
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Activities Section */}
      <div className="activities-section">
        <h2 className="section-title">📋 פעילויות יומיות</h2>
        <div className="activities-grid">
          {activities.map(activity => (
            <ActivityToggle
              key={activity.key}
              activity={activity}
              isCompleted={baby.activities[activity.key]}
              onToggle={(value) => handleActivityChange(activity.key, value)}
              disabled={userType === 'parent'}
            />
          ))}
        </div>
      </div>

      {/* Equipment Section */}
      <div className="equipment-section">
        <h2 className="section-title">🎒 ציוד שהביא איתו</h2>
        <EquipmentList
          equipment={baby.equipment}
          onAdd={handleEquipmentAdd}
          onRemove={handleEquipmentRemove}
          disabled={userType === 'parent'}
        />
      </div>

      {/* Last Updated Info */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#6B7280',
        fontSize: '0.9rem',
        background: 'white',
        borderRadius: '15px',
        marginTop: '20px'
      }}>
        📅 עדכון אחרון: {new Date(baby.lastUpdated).toLocaleString('he-IL')}
      </div>
    </div>
  );
};

export default BabyProfile;
