
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    RefreshControl
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import CategoryItemCard from "../components/CategoryItemCard";

import { useUserContext } from '../contexts/user/UserContext';

import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../lib/supabase";

export default function MyRecipesScreen() {
    const navigation = useNavigation();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Get the current user from context
    const { user } = useUserContext();
    const currentUserId = user?.id;

    // Fetch recipes from Supabase
    async function fetchRecipes(isRefreshing = false) {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', currentUserId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRecipes(data || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (currentUserId) {
                fetchRecipes();
            }
        }, [currentUserId])
    );

    const recipePressHandled = (item) => {
        navigation.navigate('Details', { item });
    };

    // Loading state
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#fed822" />
                <Text style={styles.message}>Loading your recipes...</Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>
                    Something went wrong!
                </Text>

                <Text style={styles.message}>
                    {error}
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={fetchRecipes}
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            </View>
        );
    }

    // Success state
    return (
        <FlatList
            style={styles.list}
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CategoryItemCard
                    onPress={() => recipePressHandled(item)}
                    {...item}
                />
            )}
            ListEmptyComponent={
                <Text style={styles.emptyText}>
                    You haven't added any recipes yet.
                </Text>
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchRecipes(true)}
                    colors={['#d32f2f']}
                    tintColor="#d32f2f"
                />
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        paddingBottom: 16,
        flexGrow: 1,
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 24,
    },

    message: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },

    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 8,
    },

    retryButton: {
        backgroundColor: '#fed822',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginTop: 20,
    },

    retryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
    },
    list: {
        paddingTop: 16,
    },
});
