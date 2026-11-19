import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Toast from 'react-native-toast-message';

import UserProvider from './contexts/user/UserProvider';
import { UserContext } from './contexts/user/UserContext';

import RootNavigator from './navigation/RootNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" keyboardHandlingEnabled={true} />
      <NavigationContainer>
        <UserProvider>
          <UserContext.Consumer>
            {({ isAuthenticated, authLoading }) => {
              if (authLoading) {
                return (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fed822" />
                  </View>
                );
              }

              return isAuthenticated
                ? <RootNavigator />
                : <AuthNavigator />;
            }}
          </UserContext.Consumer>
        </UserProvider>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}