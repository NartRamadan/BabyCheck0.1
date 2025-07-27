import React, { useState } from 'react';

const EquipmentList = ({ equipment, onAdd, onRemove, disabled }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !disabled) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div>
      <div className="equipment-list">
        {equipment.map((item, index) => (
          <div key={index} className="equipment-item">
            <span>{item}</span>
            {!disabled && (
              <button
                className="equipment-remove"
                onClick={() => onRemove(index)}
                title="הסר פריט"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {equipment.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#9CA3AF',
          padding: '20px',
          fontStyle: 'italic'
        }}>
          אין ציוד רשום
        </div>
      )}

      {!disabled && (
        <div className="equipment-add">
          <input
            type="text"
            className="equipment-input"
            placeholder="הוסף פריט חדש..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn btn-add"
            onClick={handleAdd}
            disabled={!newItem.trim()}
          >
            הוסף
          </button>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
