import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function ImagePickerBox({
  imageUri, // Pass your dynamic image URI here
  onPressCamera,
  onPressGallery,
  onPressRemove,
}) {
  return (
    <View style={styles.screenContainer}>
      {/* Outer Dashed Container */}
      <View style={styles.outerCard}>
        
        {/* Inner Square Container (Image / Placeholder) */}
        <View style={styles.innerImageBox}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.selectedImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialCommunityIcons
                name="image-off-outline"
                size={110}
                color="#9E9E9E"
              />
              <Text style={styles.placeholderText}>NO IMAGE AVAILABLE</Text>
            </View>
          )}
        </View>

        {/* Red REMOVE Pill Button */}
        <Pressable
          onPress={onPressRemove}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.removeButtonText}>REMOVE</Text>
        </Pressable>

        {/* Bottom Action Buttons Row */}
        <View style={styles.actionRow}>
          {/* CAMERA Button */}
          <Pressable
            onPress={onPressCamera}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
            style={({ pressed }) => [
              styles.actionButton,
              styles.cameraButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="camera" size={26} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>CAMERA</Text>
          </Pressable>

          {/* GALLERY Button */}
          <Pressable
            onPress={onPressGallery}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
            style={({ pressed }) => [
              styles.actionButton,
              styles.galleryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.galleryIconCircle}>
              <Ionicons name="list" size={18} color="#008073" />
            </View>
            <Text style={styles.actionButtonText}>GALLERY</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  outerCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#F3F3F3',
    borderWidth: 2,
    borderColor: '#5C1916', // Dark maroon dashed border
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  innerImageBox: {
    width: 215,
    height: 215,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#5C1916',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures dynamic images stay inside rounded corners
    marginBottom: 20,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    backgroundColor: '#F20D0D',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden', // Keeps Android ripple inside rounded corners
    elevation: 2, // Subtle shadow on Android
    shadowColor: '#000', // Subtle shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 3.5,
    borderColor: '#1E1E1E',
    overflow: 'hidden', // Keeps Android ripple inside rounded corners
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#0038B8', // Deep royal blue
  },
  galleryButton: {
    backgroundColor: '#008073', // Teal green
  },
  galleryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});