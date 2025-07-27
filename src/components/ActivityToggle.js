import React from 'react';

const ActivityToggle = ({ activity, isCompleted, onToggle, disabled }) => {
  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isCompleted);
    }
  };

  return (
    <div className={`activity-toggle ${isCompleted ? 'completed' : ''}`}>
      <div className="activity-info">
        <span className="activity-icon">{activity.icon}</span>
        <span className="activity-name">{activity.name}</span>
      </div>
      
      <div 
        className={`toggle-switch ${isCompleted ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <div className="toggle-slider"></div>
      </div>
    </div>
  );
};

export default ActivityToggle;
