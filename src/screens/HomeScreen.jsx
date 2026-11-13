import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Image } from "react-native";
import RecipeCard from "../components/RecipeCard";
import CategoryItemCard from "../components/CategoryItemCard";


import { RECIPES } from "../data/data.js";
import { Link } from "@react-navigation/native";

import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";

import { supabase } from "../lib/supabase";

export default function HomeScreen() {
    const navigation = useNavigation();

    // State for Supabase data, loading, and errors
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch recipes from Supabase on mount
    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('recipes').select('*');
                
                if (error) throw error;
                setRecipes(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipes();
    }, []);

    const reversedRecipes = [...recipes].reverse();
    const latestRecipes = reversedRecipes.slice(0, 3);

    const recipePressHandled = (item) => {
        navigation.navigate('Details', { item });
    };

    const renderHeader = () => (
        <View>
            <Image
                source={require('../../assets/home/home-image.jpg')}
                style={styles.heroImage}
                resizeMode="cover"
            />

            <Text style={styles.sectionTitle}>
                Check out the latest recipes:
            </Text>

            <FlatList
                data={latestRecipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RecipeCard
                        item={item}
                        featured={true}
                        onPress={() => recipePressHandled(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
            />

            <Text style={styles.sectionTitle2}>All recipes</Text>
        </View>
    );
    
    return (
        <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CategoryItemCard
                    onPress={() => recipePressHandled(item)}
                    {...item}
                />
            )}
            ListHeaderComponent={renderHeader}
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
    heroImage: {
        width: '100%',
        height: 400,
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
        backgroundColor: '#fed822',
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
