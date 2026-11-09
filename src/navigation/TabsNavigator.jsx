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
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="My Recipes"
                component={InfoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="fast-food" color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="Add Recipe"
                component={InfoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
                }}
            />
        </Tabs.Navigator>
    );
}
