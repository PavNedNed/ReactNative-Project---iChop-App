import { View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CategoryItemCard from "../components/CategoryItemCard";

import { RECIPES } from "../data/data.js";
import { StyleSheet } from "react-native";

import { useUserContext } from '../contexts/user/UserContext';

export default function MyRecipesScreen() {
    const navigation = useNavigation();
    
    const recipePressHandled = (item) => {
        navigation.navigate('Details', { item });
    };

    // Get the current user from the context
    const { user }  = useUserContext();
    const currentUserId = user.id;

    // Filter recipes by the current user
    const myRecipes = RECIPES.filter(recipe => recipe.userId === currentUserId);
    console.log(myRecipes);



    // console.log(RECIPES);

    return (
        <FlatList
            data={myRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CategoryItemCard
                    onPress={() => recipePressHandled(item)}
                    {...item}
                />
            )}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        paddingBottom: 16,
    },
});