import { StyleSheet, View, ScrollView, Image, Text, Alert } from "react-native";
import Button from "../components/Button";

import { Host, HorizontalDivider } from "@expo/ui/jetpack-compose";

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

    const { data, remove, loading } = useSupabaseTable('recipes');
    const { refreshRecipes } = useUserContext();

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
                            Alert.alert('Success', 'Recipe deleted successfully!');

                            // navigation.getParent()?.setParams({ shouldRefresh: true });
                            // navigation.goBack();

                            // navigation.navigate({
                            //     name: from,
                            //     params: { shouldRefresh: true },
                            //     merge: true,
                            // });
                            
                            // After successful CRUD
                            refreshRecipes();
                            navigation.goBack();
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {item.imageUrl && (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.content}>
                    <Text style={styles.name}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>

                    <Text style={styles.ingredients}>Instructions: {item.ingredients}</Text>
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
                        <Text style={styles.levelNumberLabel}>
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


                    <Text style={styles.likes}>Likes: {item.likes}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={[styles.footerButtons, { paddingBottom: 16 }]}>
                    <Button
                        title="Like recipe"
                        variant="outline"
                        style={styles.editButton}
                    />
                </View>
                <View style={styles.footerButtons}>

                    <Button
                        title="Edit"
                        style={styles.editButton}
                    />
                    <Button
                        onPress={() => handleDelete()}
                        title="Delete"
                        variant="secondary"
                        style={[styles.viewDeleteButton, { borderColor: 'red', borderWidth: 1, fontColor: 'red' }]}
                    />

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ingredients: {
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
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
    },
    qtySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qtyLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
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
