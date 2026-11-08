import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";

export default function HomeNavigator({ navigation }) {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menu" }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Recipe Details" }} />
        </Stack.Navigator>
    );
}
