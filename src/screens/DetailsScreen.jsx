import { StyleSheet, View, ScrollView, Image, Text } from "react-native";
import Button from "../components/Button";


export default function DetailsScreen({
    route,
    navigation,
}) {
    const item = route.params.item;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.content}>
                    <Text style={styles.name}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
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
        color: '#007AFF',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
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
});
