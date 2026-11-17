import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";

const Stack = createStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MainStack" component={TabsNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
