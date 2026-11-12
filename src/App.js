import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './navigation/RootNavigator';
import AuthNavigator from './navigation/AuthNavigator';

import { useState } from 'react'; // remove later

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual authentication logic later

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => setIsAuthenticated(false);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" keyboardHandlingEnabled={true} />
      <NavigationContainer>
          {isAuthenticated
              ? <RootNavigator onLogout={handleLogout} />
              : <AuthNavigator onLogin={handleLogin} />
          }
          
      </NavigationContainer>
    </>
  );
}


