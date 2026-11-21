import { StyleSheet, View, ScrollView, Image, Text, Alert } from "react-native";
import Button from "../components/Button";

import { Host, HorizontalDivider } from "@expo/ui/jetpack-compose";
import Toast from 'react-native-toast-message';

import useSupabaseTable from "../hooks/useSupabaseTable";
import { useUserContext } from '../contexts/user/UserContext';

export default function DetailsScreen({
    route,
    navigation,
}) {
    const { item, from } = route.params;

    const glutenFree = item.types?.glutenFree;
    const dairyFree = item.types?.dairyFree;
    const vegan = item.types?.vegan;

    // Supabase hook for recipes (for deletion)
    const { remove, loading: recipeLoading } = useSupabaseTable('recipes');

    // Supabase hook for likes table
    const {
        data: likesData,
        create: createLike,
        remove: removeLike,
        loading: likesLoading
    } = useSupabaseTable('likes', { immediate: true, selectQuery: '*' });

    const { user, isAuthenticated, refreshRecipes } = useUserContext();

    // 1. Check if the current user is the owner of this recipe
    const isOwner = isAuthenticated && user?.id === item.user_id;

    // Check if the current user has liked this recipe
    const userLike = likesData.find(
        like => like.recipe_id === item.id && like.user_id === user?.id
    );
    const isLiked = !!userLike;

    // Calculate total likes for this recipe from the fetched table data
    const totalLikes = likesData.filter(like => like.recipe_id === item.id).length;

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            Alert.alert('Authentication required', 'You must be logged in to like recipes.');
            return;
        }

        if (isLiked) {
            const success = await removeLike('id', userLike.id);
            if (success) {
                Toast.show({
                    type: 'success',
                    text1: 'Unliked recipe',
                    topOffset: 80,
                });
            }
        } else {
            const result = await createLike({
                recipe_id: item.id,
                user_id: user.id
            });
            if (result) {
                Toast.show({
                    type: 'success',
                    text1: 'Recipe liked!',
                    topOffset: 80,
                });
            }
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete recipe',
            'Are you sure you want to delete this recipe?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await remove('id', item.id);

                        if (success) {
                            Toast.show({
                                type: 'success',
                                text1: 'Recipe deleted successfully!',
                                topOffset: 80,
                            });

                            refreshRecipes();
                            navigation.goBack();
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const getLevelColor = (level) => {
        if (level <= 3) return '#1e8327'; // Green
        if (level <= 7) return '#d4ac0d'; // Yellow/Amber
        return '#FF3B30';                 // Red
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Image
                    source={
                        item.imageUrl
                            ? { uri: item.imageUrl }
                            : require("../../assets/home/no_image.jpg")
                    }
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.content}>
                    <Text style={styles.name}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <Text style={styles.instructions}>Instructions:</Text>
                    <Text style={styles.description}>{item.instructions}</Text>


                    {glutenFree && <Text style={styles.dietaryLabel}>✓ Gluten Free</Text>}
                    {dairyFree && <Text style={styles.dietaryLabel}>✓ Dairy Free</Text>}
                    {vegan && <Text style={styles.dietaryLabel}>✓ Vegan</Text>}


                    <Host>
                        <HorizontalDivider
                            thickness={5}
                            color="#e9e7e7"
                        />
                    </Host>
                    <View style={styles.levelSection}>
                        <Text style={styles.levelTextLabel}>
                            Difficulty of preparation:
                        </Text>
                        <Text style={[styles.levelNumberLabel, { color: getLevelColor(item.level) }]}>
                            {item.level}/10
                        </Text>
                    </View>
                    <Host>
                        <HorizontalDivider
                            thickness={5}
                            color="#ccc8c8"
                            paddingTop={16}
                        />
                    </Host>

                    <Text style={styles.description}>Created by: {item.author_email}</Text>
                    <Text style={styles.likes}>❤️ Likes: {totalLikes}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {/* 2. Show Like button ONLY if logged in AND NOT the owner */}
                {isAuthenticated && !isOwner && (
                    <View style={[styles.footerButtons, { paddingBottom: 16 }]}>
                        <Button
                            title={likesLoading ? "Loading..." : (isLiked ? "❤️ Liked" : "🤍 Like recipe")}
                            variant="outline"
                            style={styles.editButton}
                            onPress={handleToggleLike}
                            disabled={likesLoading}
                        />
                    </View>
                )}

                {/* 3. Show Edit and Delete buttons ONLY if the user is the owner */}
                {isOwner && (
                    <View style={styles.footerButtons}>
                        <Button
                            title="Edit"
                            style={styles.editButton}
                            onPress={() => {
                                // Add navigation to Edit screen
                            }}
                        />
                        <Button
                            onPress={handleDelete}
                            title={recipeLoading ? "Deleting..." : "Delete"}
                            variant="secondary"
                            style={[styles.viewDeleteButton, { borderColor: 'red', borderWidth: 1 }]}
                            disabled={recipeLoading}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    instructions: {
        fontSize: 20,
        color: '#666',
        lineHeight: 22,
        marginBottom: 8,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 8,
    },
    likes: {
        fontSize: 16,
        color: '#691c0b',
        fontWeight: '600',
        marginTop: 8,
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        flex: 2,
    },
    viewDeleteButton: {
        flex: 1,
    },
    dietaryLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e8327',
        marginBottom: 8,
    },
    levelTextLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6b6b6b',
    },
    levelNumberLabel: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FF3B30',
        paddingLeft: 8,
    },
    levelSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});