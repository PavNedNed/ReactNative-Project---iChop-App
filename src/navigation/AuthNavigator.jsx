import { createStackNavigator } from "@react-navigation/stack";
import { Pressable, Text, View } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default function AuthNavigator({
    navigation,
}) {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                keyboardHandlingEnabled: true,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
        </Stack.Navigator>
    );
}
