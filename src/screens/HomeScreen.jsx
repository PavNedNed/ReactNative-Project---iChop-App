import { View, Text, StyleSheet, FlatList, ScrollView, Pressable } from "react-native";
import RecipeCard from "../components/RecipeCard";


import { RECIPES } from "../data/data.js";

export default function HomeScreen() {
    // console.log(RECIPES)
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Latest recipes:</Text>

            <FlatList
                data={RECIPES}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <RecipeCard item={item} featured={true} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
            />

            <Text style={styles.sectionTitle}>Categories</Text>
        </View>
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
    },
    bottomPadding: {
        height: 24,
    },
});
