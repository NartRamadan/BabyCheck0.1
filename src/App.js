import React, { useState, useReducer } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Authentication from './components/Authentication';
import StaffDashboard from './components/StaffDashboard';
import ParentsManagement from './components/ParentsManagement';
import BabyCircles from './components/BabyCircles';
import BabyProfile from './components/BabyProfile';

// Initial state for babies
const initialBabies = [
  {
    id: 1,
    name: 'נועה',
    parentCode: 'PARENT001',
    activities: {
      morningMeal: false,
      firstDiaper: false,
      morningSleep: false,
      lunchMeal: false,
      secondDiaper: false,
      afternoonSleep: false
    },
    equipment: ['בקבוק', 'שמיכה'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: 'אריאל',
    parentCode: 'PARENT002',
    activities: {
      morningMeal: true,
      firstDiaper: true,
      morningSleep: false,
      lunchMeal: false,
      secondDiaper: false,
      afternoonSleep: false
    },
    equipment: ['מוצץ', 'צעצוע'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    name: 'תמר',
    parentCode: 'PARENT003',
    activities: {
      morningMeal: false,
      firstDiaper: false,
      morningSleep: false,
      lunchMeal: false,
      secondDiaper: false,
      afternoonSleep: false
    },
    equipment: ['בקבוק', 'חיתולים'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    name: 'יונתן',
    parentCode: 'PARENT004',
    activities: {
      morningMeal: true,
      firstDiaper: false,
      morningSleep: true,
      lunchMeal: false,
      secondDiaper: false,
      afternoonSleep: false
    },
    equipment: ['שמיכה', 'ספר'],
    lastUpdated: new Date().toISOString()
  }
];

// Initial state for parents
const initialParents = [
  {
    id: 1,
    name: 'שרה כהן',
    parentCode: 'PARENT001',
    email: 'sara@example.com',
    phone: '050-1234567'
  },
  {
    id: 2,
    name: 'דני לוי',
    parentCode: 'PARENT002',
    email: 'danny@example.com',
    phone: '052-7654321'
  },
  {
    id: 3,
    name: 'מירי אברהם',
    parentCode: 'PARENT003',
    email: 'miri@example.com',
    phone: '053-9876543'
  },
  {
    id: 4,
    name: 'רון גולן',
    parentCode: 'PARENT004',
    email: 'ron@example.com',
    phone: '054-1357924'
  }
];

// Reducer for managing babies state
// Reducer for managing state
function dataReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        babies: state.babies.map(baby =>
          baby.id === action.babyId
            ? {
                ...baby,
                activities: {
                  ...baby.activities,
                  [action.activity]: action.value
                },
                lastUpdated: new Date().toISOString()
              }
            : baby
        )
      };
    case 'ADD_EQUIPMENT':
      return {
        ...state,
        babies: state.babies.map(baby =>
          baby.id === action.babyId
            ? {
                ...baby,
                equipment: [...baby.equipment, action.item],
                lastUpdated: new Date().toISOString()
              }
            : baby
        )
      };
    case 'REMOVE_EQUIPMENT':
      return {
        ...state,
        babies: state.babies.map(baby =>
          baby.id === action.babyId
            ? {
                ...baby,
                equipment: baby.equipment.filter((_, index) => index !== action.index),
                lastUpdated: new Date().toISOString()
              }
            : baby
        )
      };
    case 'ADD_PARENT':
      return {
        ...state,
        parents: [...state.parents, action.parent]
      };
    case 'UPDATE_PARENT':
      return {
        ...state,
        parents: state.parents.map(parent =>
          parent.id === action.parentId ? { ...parent, ...action.updates } : parent
        )
      };
    case 'ADD_BABY':
      return {
        ...state,
        babies: [...state.babies, action.baby]
      };
    case 'UPDATE_BABY_PARENT':
      return {
        ...state,
        babies: state.babies.map(baby =>
          baby.id === action.babyId
            ? { ...baby, parentCode: action.parentCode, lastUpdated: new Date().toISOString() }
            : baby
        )
      };
    default:
      return state;
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, auth, circles, profile
  const [userType, setUserType] = useState(null); // 'staff' or 'parent'
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [babies, dispatch] = useReducer(babiesReducer, initialBabies);

  const handleLogin = (type) => {
    setUserType(type);
    setCurrentScreen('auth');
  };

  const handleAuthentication = (user) => {
    setCurrentUser(user);
    if (userType === 'staff') {
      setCurrentScreen('staff-dashboard');
    } else {
      // להורים - ישירות לפרופיל של הילד שלהם
      const baby = babies.find(b => b.parentCode === user.parentCode);
      setSelectedBaby(baby);
      setCurrentScreen('profile');
    }
  };

  const handleBabySelect = (baby) => {
    setSelectedBaby(baby);
    setCurrentScreen('profile');
  };

  const handleStaffNavigation = (screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (currentScreen === 'profile') {
      if (userType === 'staff') {
        setCurrentScreen('circles');
      } else {
        setCurrentScreen('login');
        setUserType(null);
        setCurrentUser(null);
      }
      setSelectedBaby(null);
    } else if (currentScreen === 'circles') {
      setCurrentScreen('staff-dashboard');
    } else if (currentScreen === 'parents-management') {
      setCurrentScreen('staff-dashboard');
    } else if (currentScreen === 'staff-dashboard') {
      setCurrentScreen('login');
      setUserType(null);
      setCurrentUser(null);
    } else if (currentScreen === 'auth') {
      setCurrentScreen('login');
      setUserType(null);
      setCurrentUser(null);
    }
  };

  const updateBabyActivity = (babyId, activity, value) => {
    dispatch({
      type: 'UPDATE_ACTIVITY',
      babyId,
      activity,
      value
    });
  };

  const addEquipment = (babyId, item) => {
    dispatch({
      type: 'ADD_EQUIPMENT',
      babyId,
      item
    });
  };

  const removeEquipment = (babyId, index) => {
    dispatch({
      type: 'REMOVE_EQUIPMENT',
      babyId,
      index
    });
  };

  // Filter babies based on user type
  const getVisibleBabies = () => {
    if (userType === 'staff') {
      return babies;
    } else if (userType === 'parent' && currentUser) {
      return babies.filter(baby => baby.parentCode === currentUser.parentCode);
    }
    return [];
  };

  return (
    <div className="App">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {currentScreen === 'auth' && (
        <Authentication 
          userType={userType} 
          onAuthentication={handleAuthentication}
          onBack={handleBack}
        />
      )}
      
      {currentScreen === 'staff-dashboard' && (
        <StaffDashboard 
          currentUser={currentUser}
          onNavigate={handleStaffNavigation}
          onBack={handleBack}
        />
      )}
      
      {currentScreen === 'parents-management' && (
        <ParentsManagement 
          babies={babies}
          onBack={handleBack}
          onNavigate={handleStaffNavigation}
        />
      )}
      
      {currentScreen === 'circles' && (
        <BabyCircles 
          babies={getVisibleBabies()}
          onBabySelect={handleBabySelect}
          onBack={handleBack}
          userType={userType}
          currentUser={currentUser}
        />
      )}
      
      {currentScreen === 'profile' && selectedBaby && (
        <BabyProfile 
          baby={babies.find(b => b.id === selectedBaby.id)}
          userType={userType}
          onBack={handleBack}
          onUpdateActivity={updateBabyActivity}
          onAddEquipment={addEquipment}
          onRemoveEquipment={removeEquipment}
        />
      )}
    </div>
  );
}

export default App;
