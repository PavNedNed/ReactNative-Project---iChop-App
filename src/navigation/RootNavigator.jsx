import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";

export default function RootNavigator({ onLogout }) {
    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="MainStack" component={TabsNavigator} options={{headerShown: false}} initialParams={{ onLogout }} />
        </Stack.Navigator>
    );
}
