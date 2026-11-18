import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

import UserProvider from './contexts/user/UserProvider';
import { UserContext } from './contexts/user/UserContext';

import RootNavigator from './navigation/RootNavigator';
import AuthNavigator from './navigation/AuthNavigator';

import { useState } from 'react'; // remove later

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" keyboardHandlingEnabled={true} />
        <NavigationContainer>
          <UserProvider>
            <UserContext.Consumer>
              {({ isAuthenticated }) =>
                isAuthenticated
                  ? <RootNavigator />
                  : <AuthNavigator />
              }
            </UserContext.Consumer>
          </UserProvider>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </>
  );
}


