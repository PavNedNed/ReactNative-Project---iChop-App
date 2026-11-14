
import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    Pressable,
    RefreshControl
} from "react-native";

import RecipeCard from "../components/RecipeCard";
import CategoryItemCard from "../components/CategoryItemCard";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { supabase } from "../lib/supabase";

import { useUserContext } from '../contexts/user/UserContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Get the current user from context
    const { user } = useUserContext();
    const currentUserEmail = user?.email;
    // console.log(currentUserEmail)

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
                .order('created_at', { ascending: true });

            if (error) throw error;

            setRecipes(data || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchRecipes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // console.log("mina", route.params?.shouldRefresh)
            if (currentUserEmail && route.params?.shouldRefresh) {
                fetchRecipes();

                navigation.setParams({ shouldRefresh: false });
            }
        }, [currentUserEmail, route.params?.shouldRefresh])
    );

    const recipePressHandled = (item) => {
        navigation.navigate('Details', { item, from: 'Home'});
    };

    // Loading state
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#fed822" />
                <Text style={styles.message}>Loading recipes...</Text>
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

    const reversedRecipes = [...recipes].reverse();
    const latestRecipes = reversedRecipes.slice(0, 3);

    const renderHeader = () => (
        <View>
            <View style={styles.authorLine}>
                <Text style={styles.authorText}>Welcome, {currentUserEmail}!</Text>
            </View>

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
    authorText: {
        fontSize: 16,
        color: '#972424',
        marginLeft: 8,
        fontWeight: 'bold',

    },
    authorLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fed822',
    },
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
});
