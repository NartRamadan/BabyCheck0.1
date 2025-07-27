import React from 'react';

const LoginScreen = ({ onLogin }) => {
  return (
    <div className="login-screen">
      <h1 className="login-title">BabyCheck</h1>
      <p className="login-subtitle">מערכת מעקב תינוקות במעון יום</p>
      
      <div className="login-buttons">
        <button 
          className="btn btn-primary login-btn"
          onClick={() => onLogin('staff')}
        >
          <span className="login-icon">👩‍🏫</span>
          כניסת צוות המעון
        </button>
        
        <button 
          className="btn btn-secondary login-btn"
          onClick={() => onLogin('parent')}
        >
          <span className="login-icon">👨‍👩‍👧‍👦</span>
          כניסת הורים
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
