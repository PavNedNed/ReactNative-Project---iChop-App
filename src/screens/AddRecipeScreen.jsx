import { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';

import { useUserContext } from '../contexts/user/UserContext';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'expo-checkbox';

import useSupabaseTable from '../hooks/useSupabaseTable';
import ImagePickerBox from '../components/CameraInputSquare';

export default function AddRecipeScreen({
    navigation,
    route
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
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

    const handleImageChange = useCallback((url) => {
        if (!url) {
            setImage('');
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
            setImage('');
        }
    }, []);

    const addRecipeHandler = async () => {
        console.log('Adding recipe...');

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

        console.log('Adding recipe with:', newRecipe);

        const result = await create(newRecipe);
        
        if (result) {
            resetForm();
        
            refreshRecipes();
        
            navigation.navigate('MyRecipes', {
                screen: 'My Recipes'
            });
        }
    };

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
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Add a New Recipe</Text>

                    <ImagePickerBox
                        key={pickerKey}
                        initialImageUrl=""
                        onImageChange={handleImageChange}
                        onUploadSuccess={handleUploadSuccess}
                        onPendingChange={handlePendingChange}
                    />

                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipe title"
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize="none"
                    />

                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipe description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.inputLabel}>Instructions</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter preparation instructions"
                        value={instructions}
                        onChangeText={setInstructions}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.checkboxContainer}>
                        <Text style={[styles.label, { paddingBottom: 10 }]}>More information</Text>
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

                    {/* Difficult slider START */}
                    <View style={styles.header}>
                        <Text style={styles.label}>Difficulty of preparation</Text>
                        <Text style={styles.value}>{sliderValue}/10</Text>
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
                    {/* Difficult slider END */}

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
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.25)', borderless: false }}
                        onPress={addRecipeHandler}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Add Recipe'}</Text>
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