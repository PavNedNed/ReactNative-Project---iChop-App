import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { useUploadImage } from '../hooks/useUploadImage';

const TARGET_SIZE = { width: 512, height: 512 };

// Funkciya za izchakvane na opredelen broy milisekundi
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Promqna na razmerata na izobrazhenieto do 512x512 px
async function resizeImageTo512(uri, width, height) {
  const context = ImageManipulator.manipulate(uri);
  try {
    let chain = context;

    if (width && height) {
      const side = Math.min(width, height);
      const originX = Math.floor((width - side) / 2);
      const originY = Math.floor((height - side) / 2);

      chain = chain.crop({
        originX,
        originY,
        width: side,
        height: side,
      });
    }

    chain = chain.resize(TARGET_SIZE);
    const rendered = await (chain?.renderAsync ? chain : context).renderAsync();
    try {
      const saved = await rendered.saveAsync({
        compress: 0.8,
        format: SaveFormat.JPEG,
      });
      return saved.uri;
    } finally {
      rendered.release();
    }
  } finally {
    context.release();
  }
}

// Komponent za izbor na izobrazhenie
export default function ImagePickerBox({
  initialImageUrl = '',
  onImageChange,
  onUploadSuccess,
  onPendingChange,
}) {
  const normalizedInitial = initialImageUrl || '';
  const [imageUrl, setImageUrl] = useState(normalizedInitial);
  const [isBusy, setIsBusy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [previewHidden, setPreviewHidden] = useState(false);

  const prevInitialUrlRef = useRef(normalizedInitial);
  const operationRef = useRef(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { uploadImage, uploading } = useUploadImage('images');

  // Effekt za aktualizirane na komponenta pri promqna na nachalnoto izobrazhenie
  useEffect(() => {
    const nextInitial = initialImageUrl || '';
    if (prevInitialUrlRef.current === nextInitial) return;
    prevInitialUrlRef.current = nextInitial;

    if (nextInitial === '') {
      setImageUrl('');
      setIsSaved(false);
      setUploadedUrl(null);
      onPendingChange?.(false);
    } else if (nextInitial !== uploadedUrl) {
      setImageUrl(nextInitial);
      setIsSaved(false);
      onPendingChange?.(true);
    }
  }, [initialImageUrl, uploadedUrl, onPendingChange]);

  // Funkciya za aktualizirane na izobrazhenieto v komponenta
  const updateImage = (url, { markSaved = false } = {}) => {
    const normalizedUrl = url || '';
    setImageUrl(normalizedUrl);
    setIsSaved(markSaved);

    if (!normalizedUrl) {
      setUploadedUrl(null);
      onPendingChange?.(false);
      onImageChange?.('');
    } else {
      onPendingChange?.(!markSaved);
      onImageChange?.(normalizedUrl);
    }
  };

  // Funkciya za obrabotka na natiskaneto na butona za upload
  const handleUpload = async () => {
    if (!imageUrl || operationRef.current || uploading || isSaved) return;

    operationRef.current = true;
    try {
      const result = await uploadImage(imageUrl, 'photos');
      console.log('Upload result:', result);

      const publicUrl = result?.publicUrl ?? null;
      setUploadedUrl(publicUrl);
      setIsSaved(true);
      onPendingChange?.(false);
      onUploadSuccess?.(publicUrl, result);
    } catch (e) {
      console.error('Upload failed:', e?.message || e);
      Alert.alert(
        'Upload Failed',
        e?.message || 'Unable to upload the image. Please try again.'
      );
    } finally {
      operationRef.current = false;
    }
  };

  // Funkciya za pokazvane na prompt za otvarяне na nastroikite, ako dostupat do kamerata e blokiran
  const promptOpenSettings = (title, message) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };

  // Funkciya za proverka i zayavka na dostup do kamerata
  const ensureCameraPermission = async () => {
    if (permission?.granted) return true;

    const response = await requestPermission();
    if (response?.granted) return true;

    if (response && response.canAskAgain === false) {
      promptOpenSettings(
        'Camera Permission Required',
        'Camera access is disabled. Enable it in Settings to take photos.'
      );
    } else {
      Alert.alert(
        'Permission Needed',
        'Camera permission is required to capture a photo.'
      );
    }
    return false;
  };

  // Funkciya za zatvarяне na kamerata
  const closeCamera = () => {
    setCameraOpen(false);
    setCameraReady(false);
    setPreviewHidden(false);
  };

  // Funkciya za natiskane na butona za otvarяне na kamerata
  const handlePressCamera = async () => {
    if (operationRef.current || uploading || cameraOpen) return;
    operationRef.current = true;
    setIsBusy(true);

    try {
      const allowed = await ensureCameraPermission();
      if (!allowed) return;

      setPreviewHidden(true);
      await wait(300);
      console.log('1. Opening camera...');
      setCameraReady(false);
      setCameraOpen(true);
    } catch (err) {
      console.error('Camera error:', err);
      closeCamera();
      Alert.alert('Camera Error', 'Unable to open the camera. Please try again.');
    } finally {
      operationRef.current = false;
      setIsBusy(false);
    }
  };

  // Funkciya za natiskane na butona za snimane na snimka
  const handleTakePicture = async () => {
    if (!cameraRef.current || !cameraReady || operationRef.current) return;
    operationRef.current = true;
    setIsBusy(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        exif: false,
        base64: false,
        shutterSound: false,
      });

      setCameraOpen(false);
      setCameraReady(false);

      if (!photo?.uri) {
        throw new Error('Camera did not return a photo.');
      }

      await wait(300);

      console.log('3. Preparing photo:', photo.uri);
      const displayUri = await resizeImageTo512(
        photo.uri,
        photo.width,
        photo.height
      );
      console.log('4. Photo ready:', displayUri);
      updateImage(displayUri, { markSaved: false });
      setPreviewHidden(false);
    } catch (err) {
      console.error('Camera error:', err);
      closeCamera();
      Alert.alert(
        'Camera Error',
        err?.message || 'Unable to take a photo. Please try again.'
      );
    } finally {
      operationRef.current = false;
      setIsBusy(false);
    }
  };

  // Funkciya za natiskane na butona za izbor na snimka ot galeriyata
  const handlePressGallery = async () => {
    if (operationRef.current || uploading || cameraOpen) return;
    operationRef.current = true;
    setIsBusy(true);

    const previousUri = imageUrl;

    try {
      const current = await ImagePicker.getMediaLibraryPermissionsAsync();
      let status = current.status;
      let canAskAgain = current.canAskAgain;

      if (status !== 'granted') {
        if (!canAskAgain) {
          promptOpenSettings(
            'Gallery Permission Required',
            'Photo library access is disabled. Enable it in Settings to pick an image.'
          );
          return;
        }
        const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = requested.status;
        canAskAgain = requested.canAskAgain;
      }

      if (status !== 'granted') {
        if (!canAskAgain) {
          promptOpenSettings(
            'Gallery Permission Required',
            'Photo library access is disabled. Enable it in Settings to pick an image.'
          );
        } else {
          Alert.alert(
            'Permission Needed',
            'Photo library permission is required to select an image.'
          );
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        exif: false,
        base64: false,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const asset = result.assets[0];
      const displayUri = await resizeImageTo512(
        asset.uri,
        asset.width,
        asset.height
      );
      updateImage(displayUri, { markSaved: false });
    } catch (err) {
      console.error('Gallery error:', err);
      if (previousUri) setImageUrl(previousUri);
      Alert.alert('Gallery Error', 'Unable to open the gallery. Please try again.');
    } finally {
      operationRef.current = false;
      setIsBusy(false);
    }
  };

  // Funkciya za natiskane na butona za iztrivane na snimka
  const handlePressRemove = () => {
    if (!imageUrl || operationRef.current || uploading || cameraOpen) return;
    updateImage('', { markSaved: false });
    onImageChange?.('');
  };

  // Funkciya za natiskane na butona za zapazvane na snimka
  const handlePressSave = () => {
    if (!imageUrl || operationRef.current || uploading || isSaved || cameraOpen) return;
    console.log('Saving image:', imageUrl);
    handleUpload();
  };

  const hasImage = Boolean(imageUrl) && !previewHidden;
  const isLocked = isBusy || uploading;
  const isSaveDisabled = isLocked || isSaved;
  const shutterDisabled = !cameraReady || isBusy;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.outerCard}>
        <View style={[styles.innerImageBox, cameraOpen && styles.cameraBox]}>
          {cameraOpen ? (
            <CameraView
              ref={cameraRef}
              style={styles.cameraPreview}
              facing="back"
              mode="picture"
              mute
              onCameraReady={() => {
                console.log('2. Camera ready');
                setCameraReady(true);
              }}
              onMountError={(event) => {
                console.log('Camera mount error:', event?.message || event);
                closeCamera();
                Alert.alert('Camera Error', 'Unable to start the camera.');
              }}
            />
          ) : hasImage ? (
            <Image
              source={{ uri: imageUrl }}
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

          {(isBusy || uploading) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              {uploading && (
                <Text style={styles.loadingText}>Uploading...</Text>
              )}
            </View>
          )}
        </View>

        {hasImage && !cameraOpen && (
          <View style={styles.imageActionsRow}>
            <Pressable
              onPress={handlePressSave}
              disabled={isSaveDisabled}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
              style={({ pressed }) => [
                styles.saveButton,
                isSaved && styles.saveButtonSaved,
                isLocked && !isSaved && styles.buttonDisabled,
                pressed && !isSaveDisabled && styles.buttonPressed,
              ]}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isSaved ? 'checkmark-done-circle' : 'checkmark-circle-outline'}
                  size={18}
                  color="#FFFFFF"
                />
              )}
              <Text style={styles.pillButtonText}>
                {uploading ? 'SAVING...' : isSaved ? 'SAVED' : 'SAVE'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handlePressRemove}
              disabled={isLocked}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
              style={({ pressed }) => [
                styles.removeButton,
                isLocked && styles.buttonDisabled,
                pressed && !isLocked && styles.buttonPressed,
              ]}
            >
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.pillButtonText}>REMOVE</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.actionRow}>
          {cameraOpen ? (
            <>
              <Pressable
                onPress={handleTakePicture}
                disabled={shutterDisabled}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cameraButton,
                  shutterDisabled && styles.buttonDisabled,
                  pressed && !shutterDisabled && styles.buttonPressed,
                ]}
              >
                <Ionicons name="camera" size={26} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>TAKE</Text>
              </Pressable>

              <Pressable
                onPress={closeCamera}
                disabled={isBusy}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cancelButton,
                  isBusy && styles.buttonDisabled,
                  pressed && !isBusy && styles.buttonPressed,
                ]}
              >
                <Ionicons name="close" size={26} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>CANCEL</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={handlePressCamera}
                disabled={isLocked}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cameraButton,
                  isLocked && styles.buttonDisabled,
                  pressed && !isLocked && styles.buttonPressed,
                ]}
              >
                <Ionicons name="camera" size={26} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>CAMERA</Text>
              </Pressable>

              <Pressable
                onPress={handlePressGallery}
                disabled={isLocked}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.galleryButton,
                  isLocked && styles.buttonDisabled,
                  pressed && !isLocked && styles.buttonPressed,
                ]}
              >
                <View style={styles.galleryIconCircle}>
                  <Ionicons name="list" size={18} color="#008073" />
                </View>
                <Text style={styles.actionButtonText}>GALLERY</Text>
              </Pressable>
            </>
          )}
        </View>

        {isSaved && !cameraOpen && (
          <Text style={styles.savedMessageText}>Saved successfully!</Text>
        )}
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
    borderColor: '#5C1916',
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
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraBox: {
    width: '100%',
    height: 320,
    backgroundColor: '#000000',
    borderStyle: 'solid',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  imageActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E7E34',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  saveButtonSaved: {
    backgroundColor: '#9E9E9E',
    elevation: 0,
    shadowOpacity: 0,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F20D0D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  pillButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    overflow: 'hidden',
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#0038B8',
  },
  cancelButton: {
    backgroundColor: '#F20D0D',
  },
  galleryButton: {
    backgroundColor: '#008073',
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
  savedMessageText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E7E34',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});