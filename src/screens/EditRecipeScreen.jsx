
import { useState, useCallback, useRef, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';

import { useUserContext } from '../contexts/user/UserContext';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';

import useSupabaseTable from '../hooks/useSupabaseTable';
import ImagePickerBoxEdit from '../components/CameraInputSquareEdit';

export default function EditRecipeScreen({ navigation, route }) {
    console.log('EditRecipeScreen route params:', route.params);

    const [title, setTitle] = useState(route.params?.recipe?.title || '');
    const [description, setDescription] = useState(route.params?.recipe?.description || '');
    const [image, setImage] = useState(route.params?.recipe?.imageUrl || '');
    const [hasUnsavedImage, setHasUnsavedImage] = useState(false);
    const [pickerKey, setPickerKey] = useState(0);
    const [instructions, setInstructions] = useState('');
    const [sliderValue, setSliderValue] = useState(5);

    const [glutenFree, setGlutenFree] = useState(false);
    const [dairyFree, setDairyFree] = useState(false);
    const [vegan, setVegan] = useState(false);

    const { user, refreshRecipes } = useUserContext();

    const {
        create,
        loading,
        error
    } = useSupabaseTable('recipes', {
        immediate: false
    });

    // Refs for scrolling
    const scrollViewRef = useRef(null);

    const titleInput = useRef(null);
    const descriptionInput = useRef(null);
    const instructionsInput = useRef(null);

    // Keep reference to the currently focused input
    const focusedInput = useRef(null);

    // Scroll to the focused input after keyboard opens
    const scrollToFocusedInput = () => {
        const input = focusedInput.current;

        if (!input || !scrollViewRef.current) return;

        requestAnimationFrame(() => {
            input.measureLayout(
                scrollViewRef.current,
                (x, y) => {
                    scrollViewRef.current?.scrollTo({
                        y: Math.max(0, y - 30),
                        animated: true,
                    });
                },
                () => {
                    console.log('Could not measure input position');
                }
            );
        });
    };

    // Listen for keyboard opening
    useEffect(() => {
        const subscription = Keyboard.addListener(
            'keyboardDidShow',
            scrollToFocusedInput
        );

        return () => subscription.remove();
    }, []);

    // Remember focused input
    const handleInputFocus = (inputRef) => {
        focusedInput.current = inputRef;
    };

    // Image picker handlers
    const handleImageChange = useCallback((url) => {
        if (!url) {
            // setImage('');
            setImage(route.params?.recipe?.imageUrl || '');
        }
    }, []);

    const handleUploadSuccess = useCallback((publicUrl) => {
        if (publicUrl) {
            setImage(publicUrl);
        }
    }, []);

    const handlePendingChange = useCallback((isPending) => {
        setHasUnsavedImage(isPending);

        if (isPending) {
            // setImage('');
            setImage(route.params?.recipe?.imageUrl || '');
        }
    }, []);

    // Add recipe handler
    const EditRecipeHandler = async () => {
        console.log('Editing recipe...');

        if (!title.trim() || !description.trim() || !instructions.trim()) {
            return Alert.alert(
                'Error',
                'Please fill in title, description, and instructions'
            );
        }

        if (title.trim().length < 3) {
            return Alert.alert(
                'Error',
                'Recipe title must be at least 3 characters long.'
            );
        }

        if (description.trim().length < 10) {
            return Alert.alert(
                'Error',
                'Description must be at least 10 characters long.'
            );
        }

        if (instructions.trim().length < 10) {
            return Alert.alert(
                'Error',
                'Instructions must be at least 10 characters long.'
            );
        }

        if (hasUnsavedImage) {
            Alert.alert(
                'Save Image First',
                'Please tap SAVE on your photo to upload it before adding the recipe.'
            );
            return;
        }

        const newRecipe = {
            title: title.trim(),
            description: description.trim(),
            imageUrl: image,
            instructions: instructions.trim(),
            level: Number(sliderValue),
            types: {
                glutenFree,
                dairyFree,
                vegan
            },
            author_email: user?.user_metadata?.email,
        };

        console.log('Editing recipe with:', newRecipe);

        const result = await create(newRecipe);

        if (result) {
            resetForm();

            refreshRecipes();

            navigation.navigate('MyRecipes', {
                screen: 'My Recipes'
            });
        }
    };

    // Reset form
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setImage('');
        setHasUnsavedImage(false);
        setPickerKey((prev) => prev + 1);
        setInstructions('');

        setSliderValue(5);

        setGlutenFree(false);
        setDairyFree(false);
        setVegan(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Edit Recipe</Text>

                    <ImagePickerBoxEdit
                        key={pickerKey}
                        initialImageUrl={image}
                        onImageChange={handleImageChange}
                        onUploadSuccess={handleUploadSuccess}
                        onPendingChange={handlePendingChange}
                    />

                    <Text style={styles.inputLabel}>Title</Text>

                    <TextInput
                        ref={titleInput}
                        style={styles.input}
                        placeholder="Enter recipe title"
                        value={title}
                        onChangeText={setTitle}
                        onFocus={() => handleInputFocus(titleInput.current)}
                        autoCapitalize="none"
                    />

                    <Text style={styles.inputLabel}>Description</Text>

                    <TextInput
                        ref={descriptionInput}
                        style={styles.input}
                        placeholder="Enter recipe description"
                        value={description}
                        onChangeText={setDescription}
                        onFocus={() => handleInputFocus(descriptionInput.current)}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.inputLabel}>Instructions</Text>

                    <TextInput
                        ref={instructionsInput}
                        style={styles.input}
                        placeholder="Enter preparation instructions"
                        value={instructions}
                        onChangeText={setInstructions}
                        onFocus={() => handleInputFocus(instructionsInput.current)}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.checkboxContainer}>
                        <Text style={[styles.label, { paddingBottom: 10 }]}>
                            More information
                        </Text>

                        <View style={styles.checkboxSection}>
                            <Checkbox
                                style={styles.checkbox}
                                value={glutenFree}
                                onValueChange={setGlutenFree}
                                color={glutenFree ? '#E85D5D' : undefined}
                            />
                            <Text style={styles.paragraph}>Gluten Free</Text>
                        </View>

                        <View style={styles.checkboxSection}>
                            <Checkbox
                                style={styles.checkbox}
                                value={dairyFree}
                                onValueChange={setDairyFree}
                                color={dairyFree ? '#E85D5D' : undefined}
                            />
                            <Text style={styles.paragraph}>Dairy Free</Text>
                        </View>

                        <View style={styles.checkboxSection}>
                            <Checkbox
                                style={styles.checkbox}
                                value={vegan}
                                onValueChange={setVegan}
                                color={vegan ? '#E85D5D' : undefined}
                            />
                            <Text style={styles.paragraph}>Vegan</Text>
                        </View>
                    </View>

                    {/* Difficulty slider START */}
                    <View style={styles.header}>
                        <Text style={styles.label}>
                            Difficulty of preparation
                        </Text>
                        <Text style={styles.value}>
                            {sliderValue}/10
                        </Text>
                    </View>

                    <Slider
                        style={styles.slider}
                        value={sliderValue}
                        onValueChange={(value) => setSliderValue(Math.round(value))}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        minimumTrackTintColor="#E85D5D"
                        maximumTrackTintColor="#a0a0a0"
                        thumbTintColor="#E85D5D"
                    />
                    {/* Difficulty slider END */}

                    {loading && (
                        <ActivityIndicator size="large" />
                    )}

                    {error && (
                        <Text style={{ color: 'red' }}>
                            {error}
                        </Text>
                    )}

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            loading && styles.buttonDisabled,
                            pressed && !loading && styles.buttonPressed,
                        ]}
                        android_ripple={{
                            color: 'rgba(255, 255, 255, 0.25)',
                            borderless: false
                        }}
                        onPress={EditRecipeHandler}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Updating...' : 'Edit Recipe'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#000',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#691c0b',
    },
    button: {
        backgroundColor: '#691c0b',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        overflow: 'hidden',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#691c0b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    heroImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    checkbox: {
        width: 40,
        height: 40,
        borderRadius: 5,
        borderWidth: 4,
        borderColor: '#E85D5D',
    },
    paragraph: {
        fontSize: 20,
        color: '#691C0B',
        fontWeight: '500',
    },
    checkboxSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#691c0b',
        marginBottom: 6,
        marginLeft: 4,
    },
});
