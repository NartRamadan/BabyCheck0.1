import React, { useState } from 'react';

const ParentsManagement = ({ 
  babies, 
  parents, 
  onBack, 
  onNavigate,
  onAddParent,
  onUpdateParent,
  onAddBaby,
  onUpdateBabyParent
}) => {
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
    parentCode: ''
  });

  // Get parent-child relationships
  const getParentChildData = () => {
    return parents.map(parent => {
      const child = babies.find(baby => baby.parentCode === parent.parentCode);
      return {
        ...parent,
        child: child || null
      };
    });
  };

  // Get babies without parents
  const getUnassignedBabies = () => {
    const assignedParentCodes = parents.map(p => p.parentCode);
    return babies.filter(baby => !assignedParentCodes.includes(baby.parentCode));
  };

  const getChildStatus = (child) => {
    if (!child) return { percentage: 0, status: 'לא שויך תינוק' };
    
    const activities = child.activities;
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

  const handleAssignChild = (parentCode, babyId) => {
    // עדכן את התינוק עם קוד ההורה החדש
    onUpdateBabyParent(babyId, parentCode);
    setShowAssignModal(false);
    setSelectedParent(null);
  };

  const handleUnassignChild = (babyId) => {
    // הסר את הקוד של ההורה מהתינוק
    onUpdateBabyParent(babyId, '');
    setShowAssignModal(false);
    setSelectedParent(null);
  };

  const handleAddParent = () => {
    if (!newParent.name || !newParent.parentCode) return;
    
    // בדוק שקוד ההורה לא קיים כבר
    const existingParent = parents.find(p => p.parentCode === newParent.parentCode);
    if (existingParent) {
      alert('קוד הורה זה כבר קיים במערכת');
      return;
    }

    onAddParent(newParent);
    setShowAddParentModal(false);
    setNewParent({ name: '', parentCode: '', email: '', phone: '' });
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.parentCode) return;

    onAddBaby({
      name: newChild.name,
      parentCode: newChild.parentCode,
      age: newChild.age
    });
    setShowAddChildModal(false);
    setNewChild({ name: '', age: '', parentCode: '' });
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'parent') {
      setNewParent(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'child') {
      setNewChild(prev => ({ ...prev, [field]: value }));
    }
  };

  const parentChildData = getParentChildData();
  const unassignedBabies = getUnassignedBabies();

  return (
    <div className="parents-management">
      <button className="btn btn-back" onClick={onBack}>
        ← חזרה לדשבורד
      </button>
      
      <div className="management-header">
        <h1 className="management-title">ניהול הורים וילדים 👨‍👩‍👧‍👦</h1>
        <p className="management-subtitle">חיבור הורים לתינוקות ומעקב אחר סטטוס</p>
        
        <div className="management-actions">
          <button className="btn btn-primary" onClick={() => setShowAddParentModal(true)}>
            ➕ הוסף הורה חדש
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAddChildModal(true)}>
            👶 הוסף ילד חדש
          </button>
        </div>
      </div>

      {/* Unassigned Babies Alert */}
      {unassignedBabies.length > 0 && (
        <div style={{
          background: '#FED7D7',
          border: '2px solid #FC8181',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <strong>⚠️ תינוקות ללא הורה משויך:</strong>
          <div style={{ marginTop: '10px' }}>
            {unassignedBabies.map(baby => (
              <span key={baby.id} style={{
                background: 'white',
                padding: '5px 10px',
                borderRadius: '10px',
                margin: '5px',
                display: 'inline-block'
              }}>
                {baby.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="parents-grid">
        {parentChildData.map(parent => {
          const childStatus = getChildStatus(parent.child);
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
                  {parent.email && (
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      📧 {parent.email}
                    </p>
                  )}
                  {parent.phone && (
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      📱 {parent.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="child-section">
                {parent.child ? (
                  <>
                    <div className="child-info">
                      <span className="child-icon">👶</span>
                      <span className="child-name">{parent.child.name}</span>
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
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: '#FEF5E7',
                    borderRadius: '10px',
                    color: '#D69E2E'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔗</div>
                    <div>לא שויך תינוק</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                      לחץ לשיוך
                    </div>
                  </div>
                )}
              </div>
              
              <div className="parent-actions">
                <button className="btn btn-small" onClick={(e) => {
                  e.stopPropagation();
                  handleParentClick(parent);
                }}>
                  {parent.child ? 'שנה שיוך' : 'שייך תינוק'}
                </button>
                {parent.child && (
                  <button 
                    className="btn btn-small btn-secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnassignChild(parent.child.id);
                    }}
                  >
                    הפרד
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedParent && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>שיוך תינוק להורה</h3>
            <p><strong>הורה:</strong> {selectedParent.name}</p>
            <p><strong>קוד הורה:</strong> {selectedParent.parentCode}</p>
            
            {selectedParent.child && (
              <div style={{
                background: '#E6FFFA',
                padding: '10px',
                borderRadius: '10px',
                margin: '10px 0'
              }}>
                <p><strong>תינוק נוכחי:</strong> {selectedParent.child.name}</p>
              </div>
            )}
            
            <div className="available-babies">
              <h4>תינוקות זמינים לשיוך:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {babies.map(baby => (
                  <button
                    key={baby.id}
                    className={`btn ${selectedParent.child?.id === baby.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleAssignChild(selectedParent.parentCode, baby.id)}
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    {baby.name}
                    {baby.parentCode && baby.parentCode !== selectedParent.parentCode && (
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        <br />(שויך ל-{baby.parentCode})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAssignModal(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddParentModal && (
        <div className="modal-overlay" onClick={() => setShowAddParentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>➕ הוסף הורה חדש</h3>
            
            <div className="form-group">
              <label>שם ההורה *</label>
              <input
                type="text"
                className="form-input"
                value={newParent.name}
                onChange={(e) => handleInputChange('parent', 'name', e.target.value)}
                placeholder="הכנס שם ההורה"
              />
            </div>
            
            <div className="form-group">
              <label>קוד הורה *</label>
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
              <label>שם הילד *</label>
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
                value={newChild.parentCode}
                onChange={(e) => handleInputChange('child', 'parentCode', e.target.value)}
              >
                <option value="">בחר הורה</option>
                {parents.map(parent => (
                  <option key={parent.id} value={parent.parentCode}>
                    {parent.name} ({parent.parentCode})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleAddChild}
                disabled={!newChild.name || !newChild.parentCode}
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