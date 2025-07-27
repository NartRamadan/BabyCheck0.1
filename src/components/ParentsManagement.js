import React, { useState } from 'react';

const ParentsManagement = ({ babies, onBack, onNavigate }) => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  
  // Form states
  const [newParent, setNewParent] = useState({
    name: '',
    parentCode: '',
    email: '',
    phone: ''
  });
  
  const [newChild, setNewChild] = useState({
    name: '',
    age: '',
    parentId: ''
  });

  // Mock parents data - in real app this would come from database
  const parents = [
    {
      id: 1,
      parentCode: 'PARENT001',
      name: 'הורה של נועה',
      childName: 'נועה',
      childId: 1,
      status: 'active'
    },
    {
      id: 2,
      parentCode: 'PARENT002',
      name: 'הורה של אריאל',
      childName: 'אריאל',
      childId: 2,
      status: 'active'
    },
    {
      id: 3,
      parentCode: 'PARENT003',
      name: 'הורה של תמר',
      childName: 'תמר',
      childId: 3,
      status: 'active'
    },
    {
      id: 4,
      parentCode: 'PARENT004',
      name: 'הורה של יונתן',
      childName: 'יונתן',
      childId: 4,
      status: 'active'
    }
  ];

  const getChildStatus = (childId) => {
    const baby = babies.find(b => b.id === childId);
    if (!baby) return { percentage: 0, status: 'לא נמצא' };
    
    const activities = baby.activities;
    const totalActivities = Object.keys(activities).length;
    const completedActivities = Object.values(activities).filter(Boolean).length;
    const percentage = Math.round((completedActivities / totalActivities) * 100);
    
    let status = '';
    if (percentage === 100) status = '✨ יום מושלם!';
    else if (percentage >= 75) status = '😊 יום טוב';
    else if (percentage >= 50) status = '🌟 בתהליך';
    else if (percentage > 0) status = '🌱 התחלנו';
    else status = '💤 עוד לא התחלנו';
    
    return { percentage, status };
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 75) return '#68D391';
    if (percentage >= 50) return '#F6E05E';
    if (percentage > 0) return '#FBB6CE';
    return '#E2E8F0';
  };

  const handleParentClick = (parent) => {
    setSelectedParent(parent);
    setShowAssignModal(true);
  };

  const handleAssignChild = (parentId, childId) => {
    // TODO: Update parent-child assignment in database
    console.log(`Assigning child ${childId} to parent ${parentId}`);
    setShowAssignModal(false);
    setSelectedParent(null);
  };

  const handleAddParent = () => {
    // TODO: Add new parent to database
    console.log('Adding new parent:', newParent);
    setShowAddParentModal(false);
    setNewParent({ name: '', parentCode: '', email: '', phone: '' });
  };

  const handleAddChild = () => {
    // TODO: Add new child to database
    console.log('Adding new child:', newChild);
    setShowAddChildModal(false);
    setNewChild({ name: '', age: '', parentId: '' });
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'parent') {
      setNewParent(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'child') {
      setNewChild(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="parents-management">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה לדשבורד
      </button>
      
      <div className="management-header">
        <h1 className="management-title">ניהול הורים וילדים 👨‍👩‍👧‍👦</h1>
        <p className="management-subtitle">צפייה בסטטוס הילדים לפי הורים</p>
        
        <div className="management-actions">
          <button className="btn btn-primary" onClick={() => setShowAddParentModal(true)}>
            ➕ הוסף הורה חדש
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAddChildModal(true)}>
            👶 הוסף ילד חדש
          </button>
        </div>
      </div>

      <div className="parents-grid">
        {parents.map(parent => {
          const childStatus = getChildStatus(parent.childId);
          const statusColor = getStatusColor(childStatus.percentage);
          
          return (
            <div 
              key={parent.id}
              className="parent-card"
              onClick={() => handleParentClick(parent)}
            >
              <div className="parent-header">
                <div className="parent-avatar">
                  {parent.name.charAt(0)}
                </div>
                <div className="parent-info">
                  <h3 className="parent-name">{parent.name}</h3>
                  <p className="parent-code">{parent.parentCode}</p>
                </div>
              </div>
              
              <div className="child-section">
                <div className="child-info">
                  <span className="child-icon">👶</span>
                  <span className="child-name">{parent.childName}</span>
                </div>
                
                <div className="child-status" style={{ color: statusColor }}>
                  {childStatus.status}
                </div>
                
                <div className="child-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{
                        width: `${childStatus.percentage}%`,
                        backgroundColor: statusColor
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {childStatus.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="parent-actions">
                <button className="btn btn-small">ערוך</button>
                <button className="btn btn-small btn-secondary">הפרד</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedParent && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>הקצאת ילד להורה</h3>
            <p>הורה: {selectedParent.name}</p>
            <p>ילד נוכחי: {selectedParent.childName}</p>
            
            <div className="available-babies">
              <h4>תינוקות זמינים:</h4>
              {babies.map(baby => (
                <button
                  key={baby.id}
                  className={`btn ${selectedParent.childId === baby.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleAssignChild(selectedParent.id, baby.id)}
                >
                  {baby.name}
                </button>
              ))}
            </div>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setShowAssignModal(false)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddParentModal && (
        <div className="modal-overlay" onClick={() => setShowAddParentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>➕ הוסף הורה חדש</h3>
            
            <div className="form-group">
              <label>שם ההורה</label>
              <input
                type="text"
                className="form-input"
                value={newParent.name}
                onChange={(e) => handleInputChange('parent', 'name', e.target.value)}
                placeholder="הכנס שם ההורה"
              />
            </div>
            
            <div className="form-group">
              <label>קוד הורה</label>
              <input
                type="text"
                className="form-input"
                value={newParent.parentCode}
                onChange={(e) => handleInputChange('parent', 'parentCode', e.target.value)}
                placeholder="לדוגמה: PARENT005"
              />
            </div>
            
            <div className="form-group">
              <label>אימייל</label>
              <input
                type="email"
                className="form-input"
                value={newParent.email}
                onChange={(e) => handleInputChange('parent', 'email', e.target.value)}
                placeholder="הכנס כתובת אימייל"
              />
            </div>
            
            <div className="form-group">
              <label>טלפון</label>
              <input
                type="tel"
                className="form-input"
                value={newParent.phone}
                onChange={(e) => handleInputChange('parent', 'phone', e.target.value)}
                placeholder="הכנס מספר טלפון"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddParent}
                disabled={!newParent.name || !newParent.parentCode}
              >
                הוסף הורה
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddParentModal(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="modal-overlay" onClick={() => setShowAddChildModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>👶 הוסף ילד חדש</h3>
            
            <div className="form-group">
              <label>שם הילד</label>
              <input
                type="text"
                className="form-input"
                value={newChild.name}
                onChange={(e) => handleInputChange('child', 'name', e.target.value)}
                placeholder="הכנס שם הילד"
              />
            </div>
            
            <div className="form-group">
              <label>גיל (בחודשים)</label>
              <input
                type="number"
                className="form-input"
                value={newChild.age}
                onChange={(e) => handleInputChange('child', 'age', e.target.value)}
                placeholder="הכנס גיל בחודשים"
                min="0"
                max="36"
              />
            </div>
            
            <div className="form-group">
              <label>הורה אחראי</label>
              <select
                className="form-input"
                value={newChild.parentId}
                onChange={(e) => handleInputChange('child', 'parentId', e.target.value)}
              >
                <option value="">בחר הורה</option>
                {parents.map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} ({parent.parentCode})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddChild}
                disabled={!newChild.name || !newChild.age || !newChild.parentId}
              >
                הוסף ילד
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddChildModal(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsManagement; 