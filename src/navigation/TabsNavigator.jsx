import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddRecipeScreen from "../screens/AddRecipeScreen";
import HomeNavigator from "./HomeNavigator";
import { Ionicons } from "@expo/vector-icons";
import MyRecipesNavigator from "./MyRecipesNavigator";

export default function TabsNavigator({ route }) {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator>
            <Tabs.Screen
                name="HomeTab"
                component={HomeNavigator}
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarActiveTintColor: '#E85D5D',
                    tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" color={color} size={size} 
                    />,
                }}
            />

            <Tabs.Screen
                name="MyRecipes"
                component={MyRecipesNavigator}
                options={{
                    title: 'My Recipes',
                    headerShown: false,
                    tabBarActiveTintColor: '#E85D5D',
                    tabBarIcon: ({ color, size }) => <Ionicons name="fast-food" color={color} size={size} />,
                }}
            />

            <Tabs.Screen
                name="Add Recipe"
                component={AddRecipeScreen}
                options={{
                    tabBarActiveTintColor: '#E85D5D',
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
                }}
            />
        </Tabs.Navigator>
    );
}
