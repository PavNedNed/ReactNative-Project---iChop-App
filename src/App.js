import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  
  const isAuthenticated = false; // Replace with actual authentication logic later

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <NavigationContainer>
          {isAuthenticated
              ? <RootNavigator />
              : <AuthNavigator />
          }
          
      </NavigationContainer>
    </>
  );
}


