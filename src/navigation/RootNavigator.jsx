import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";

export default function RootNavigator() {
    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="MainStack" component={TabsNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
