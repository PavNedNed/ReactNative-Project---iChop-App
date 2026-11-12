import { createStackNavigator } from "@react-navigation/stack";
import { Pressable, Text, View } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default function AuthNavigator({
    navigation,
    onLogin
}) {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} initialParams={{ onLogin }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} initialParams={{ onLogin }} />
        </Stack.Navigator>
    );
}
