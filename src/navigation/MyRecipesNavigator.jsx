import { createStackNavigator } from "@react-navigation/stack";
import { useUserContext } from "../contexts/user/UserContext";
import EditRecipeScreen from "../screens/EditRecipeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import MyRecipesScreen from "../screens/MyRecipesScreen";

const Stack = createStackNavigator();

export default function MyRecipesNavigator({ navigation, route }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="My Recipes" component={MyRecipesScreen} options={{ title: "My Recipes" }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Recipe Details" }} />
            <Stack.Screen name="Edit Recipe" component={EditRecipeScreen} options={{ title: "Edit Recipe" }} />
        </Stack.Navigator>
    );
}
