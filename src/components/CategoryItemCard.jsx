import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function CategoryItemCard({
    title,
    description,
    image,
    likes,
    onPress,
}) {
    return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.container,
                    styles.containerHorizontal,
                    { marginLeft: 12, marginRight: 12 },
                    {
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                ]}
            >
                <Image source={{ uri: image }} style={[styles.image, styles.imageHorizontal]} />
                <View style={[styles.content, styles.contentHorizontal]}>
                    <Text style={styles.title}>{title}</Text>
                    {/* <Text style={styles.subtitle}>{description}</Text> */}
                    <Text style={styles.subtitle}>{description.length > 40 ? `${description.slice(0, 40)}...` : description}</Text>
                </View>
                <View style={styles.rightAction}>
                    <View style={styles.addButton}>
                        <Text style={styles.addButtonText}>More</Text>
                    </View>

                </View>
            </Pressable>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    containerHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 140,
    },
    imageHorizontal: {
        width: 80,
        height: 80,
        borderRadius: 8,
        margin: 12,
    },
    content: {
        padding: 12,
    },
    contentHorizontal: {
        flex: 1,
        paddingLeft: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007AFF',
    },
    rightAction: {
        paddingRight: 12,
    },
    addButton: {
        backgroundColor: '#fcd91f',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 14,
    },
    cardPressed: {
        opacity: 0.75,
    },
});
