import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import PatternBackgroundWhite from '../components/PatternBackgroundWhite';

import { Host, Slider } from '@expo/ui/jetpack-compose';
import { Checkbox } from 'expo-checkbox';


export default function AddRecipeScreen({
    navigation,
    route
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [instructions, setInstructions] = useState('');
    const [sliderValue, setSliderValue] = useState(5);


    const [glutenFree, setGlutenFree] = useState(false);
    const [dairyFree, setDairyFree] = useState(false);
    const [vegan, setVegan] = useState(false);

    // console.log(sliderValue)

    const addRecipeHandler = () => {
        // Logic to add a new recipe
        console.log('Adding recipe with:', { title, description });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <PatternBackgroundWhite>

                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <Text style={styles.title}>Add a New Recipe</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Image"
                        value={image}
                        onChangeText={setImage}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Instructions"
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
                    <Host
                        matchContents={{ vertical: true }}
                        style={{ width: '100%' }}
                    >
                        <Slider
                            value={sliderValue}
                            onValueChange={(value) => setSliderValue(Math.round(value))}
                            min={1}
                            max={10}
                            steps={8}
                            colors={{
                                thumbColor: '#E85D5D',
                                activeTrackColor: '#E85D5D',
                                inactiveTrackColor: '#a0a0a0',
                                activeTickColor: '#FFFFFF',
                                inactiveTickColor: '#636363',
                            }}
                        />
                    </Host>
                    {/* Difficult slider END */}



                    <Pressable style={styles.button} onPress={addRecipeHandler}>
                        <Text style={styles.buttonText}>Add Recipe</Text>
                    </Pressable>

                </ScrollView>
            </PatternBackgroundWhite>

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
        paddingBottom: 100, // tova e vajno!
        // backgroundColor: '#fed822',
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
});
