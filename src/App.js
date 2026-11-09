import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <NavigationContainer>
          <RootNavigator />
      </NavigationContainer>
    </>
  );
}


