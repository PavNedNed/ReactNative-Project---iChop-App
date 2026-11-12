import { createStackNavigator } from "@react-navigation/stack";
import { Pressable, Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";

export default function HomeNavigator({ navigation, route }) {
    const Stack = createStackNavigator();

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
                                    route.params.onLogout();
                                }}
                            >
                                <Text style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>Logout ➡</Text>
                            </Pressable>
                        </View>
                    ),
                })} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Recipe Details" }} />
        </Stack.Navigator>
    );
}
