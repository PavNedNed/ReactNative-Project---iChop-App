import { View, Text, StyleSheet, FlatList, ScrollView, Pressable } from "react-native";
import RecipeCard from "../components/RecipeCard";
import CategoryItemCard from "../components/CategoryItemCard";


import { RECIPES } from "../data/data.js";
import { Link } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();
    
    const reversedRecipes = [...RECIPES].reverse();
    const latestRecipes = reversedRecipes.slice(0, 3);
    const allRecipes = RECIPES;

    // console.log(allRecipes)

    const recipePressHandled = (item) => {
        navigation.navigate('Details', { item });
    };
    
    return (
        <ScrollView style={styles.container}>

                <Text style={styles.sectionTitle}>Latest recipes:</Text>

                <FlatList
                    data={latestRecipes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <RecipeCard item={item} featured={true} onPress={() => navigation.navigate('Details', { item })} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredList}
                />


            <View style={styles.yellow}>
                <Text style={styles.sectionTitle2}>All recipes</Text>
                {allRecipes.map((item) => <CategoryItemCard key={item.id} onPress={() => recipePressHandled(item)}  {...item}/>)}
            </View>


        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 24,
        paddingTop: 16,
        paddingBottom: 28,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    infoDot: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.6,
        marginHorizontal: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    section: {
        padding: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 16,
        paddingTop: 16,
    },
    featuredList: {
        paddingRight: 16,
        marginBottom: 16,
        
    },
    bottomPadding: {
        height: 24,
    },
    yellow: {
        backgroundColor: '#F4BE38',
        paddingTop: 16,
        paddingBottom: 6,
    },
    sectionTitle2: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 16,
        paddingTop: 6,
    },
});
