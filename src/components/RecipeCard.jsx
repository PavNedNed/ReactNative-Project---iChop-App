import { Pressable, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";
import useSupabaseTable from "../hooks/useSupabaseTable"; // Import your hook if fetching inside

const screenWidth = Dimensions.get('window').width;

export default function RecipeCard({ item, featured, onPress }) {
  // OPTION B1: If you fetch all likes inside the card (or pass all likes array as a prop like `allLikes={likesData}`):
  // Let's assume you pass `allLikes` or fetch them:
  const { data: allLikes } = useSupabaseTable('likes', { immediate: true });

  // Calculate the live count for this specific recipe id
  const liveLikesCount = allLikes ? allLikes.filter(like => like.recipe_id === item.id).length : (item.likes || 0);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        featured && styles.cardFeatured,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.thumbnail, featured && styles.thumbnailFeatured]}
      />

      <View style={styles.content}>
        <Text style={[styles.title, featured && styles.titleFeatured]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.description, featured && styles.descriptionFeatured]}
          numberOfLines={featured ? 3 : 2}
        >
          {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
        </Text>
        
        {/* Likes Row UI */}
        <View style={styles.likesRow}>
          <Ionicons name="heart" size={featured ? 16 : 14} color="#E85D5D" />
          <Text style={[styles.likes, featured && styles.likesFeatured]}>
            {liveLikesCount}
          </Text>
        </View>
      </View>

      <View style={[styles.arrowWrap, featured && styles.arrowWrapFeatured]}>
        <Ionicons name="chevron-forward" size={featured ? 22 : 20} color="#9AA3B2" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    // marginBottom: 16,
    overflow: "hidden",
    width: screenWidth - 40,
  },
  cardFeatured: {
    marginHorizontal: 16,
  },
  cardPressed: {
    opacity: 0.75,
  },
  thumbnail: {
    width: "100%",
    height: 150,
  },
  thumbnailFeatured: {
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleFeatured: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  descriptionFeatured: {
    fontSize: 16,
  },
  likesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  likesFeatured: {
    fontSize: 16,
  },
  arrowWrap: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  arrowWrapFeatured: {
    transform: [{ translateY: -14 }],
  },
});