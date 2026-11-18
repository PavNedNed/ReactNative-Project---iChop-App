import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";

const Stack = createStackNavigator();

// Leave option to add more independent screens in the future

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MainStack" component={TabsNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}
