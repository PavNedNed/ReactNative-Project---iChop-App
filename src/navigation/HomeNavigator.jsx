import { createStackNavigator } from "@react-navigation/stack";
import { Pressable, Text, View, Alert } from "react-native";
import { useUserContext } from "../contexts/user/UserContext";
import useSupabaseAuth from "../hooks/useSupabaseAuth";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import EditRecipeScreen from "../screens/EditRecipeScreen";

const Stack = createStackNavigator();
    
export default function HomeNavigator({ navigation, route }) {

    const { logout, loading, error } = useSupabaseAuth();

    const logoutHandler = async () => {
        const { error } = await logout();

        if (error) {
            Alert.alert("Logout failed", error.message);
        }
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                    title: "Menu",
                    headerRight: () => (
                        <View style={{ marginRight: 15 }}>
                            <Pressable
                                style={{
                                    backgroundColor: "#fcd91f",
                                    padding: 8,
                                    borderRadius: 8,
                                    
                                }}
                                onPress={() => {
                                    logoutHandler();
                                }}
                            >
                                <Text style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>Logout ➡</Text>
                            </Pressable>
                        </View>
                    ),
                })} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Recipe Details" }} />
            <Stack.Screen name="Edit Recipe" component={EditRecipeScreen} options={{ title: "Edit Recipe" }} />
        </Stack.Navigator>
    );
}
