import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InfoScreen from "../screens/InfoScreen";
import HomeNavigator from "./HomeNavigator";
import { Ionicons } from "@expo/vector-icons";

export default function TabsNavigator() {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator>
            <Tabs.Screen
                name="HomeTab"
                component={HomeNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="Info"
                component={InfoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} />,
                }}
            />
        </Tabs.Navigator>
    );
}
