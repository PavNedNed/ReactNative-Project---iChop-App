
import { useState, useRef, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';

import PatternBackground from '../components/PatternBackground';
import useSupabaseAuth from '../hooks/useSupabaseAuth';

import Toast from 'react-native-toast-message';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register, loading, error, clearError } = useSupabaseAuth();

    const scrollViewRef = useRef(null);

    // Input refs
    const nameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const confirmPasswordInput = useRef(null);

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

    const registerHandler = async () => {

        const validateEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        // Validation
        if (!name.trim()) {
            return Alert.alert('Error', 'Name is required.');
        }      
        
        if (!email.trim()) {
            return Alert.alert('Error', 'Email is required.');
        } else if (!validateEmail(email)) {
            return Alert.alert(
                'Error',
                'Please enter a valid email address.'
            );
        } else {
            console.log('Email is valid:', email);
        }

        if (!password) {
            return Alert.alert('Error', 'Password is required.');
        }
        if (!confirmPassword) {
            return Alert.alert('Error', 'Confirm Password is required.');
        }

        if (password !== confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match.');
        }

        if (password.length < 6) {
            return Alert.alert(
                'Error',
                'Password must be at least 6 characters long.'
            );
        }

        // Register user
        const { data, error } = await register(
            email.trim(),
            password,
            {
                display_name: name.trim(),
            }
        );

        if (error) return;

        // Successful registration
        if (data?.user) {
            Toast.show({
                type: 'success',
                text1: 'Account created successfully!',
                topOffset: 80,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <PatternBackground>
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('../../assets/home/auth-image.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    <Text style={styles.title}>Create Account</Text>

                    {error && (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    )}

                    {/* Name */}
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                        ref={nameInput}
                        style={styles.input}
                        placeholder="Write your name"
                        placeholderTextColor="#9c8e8b"
                        value={name}
                        onChangeText={(value) => {
                            setName(value);
                            clearError();
                        }}
                        onFocus={() => handleInputFocus(nameInput.current)}
                        autoCapitalize="words"
                    />

                    {/* Email */}
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        ref={emailInput}
                        style={styles.input}
                        placeholder="Write your email"
                        placeholderTextColor="#9c8e8b"
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value);
                            clearError();
                        }}
                        onFocus={() => handleInputFocus(emailInput.current)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Password */}
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        ref={passwordInput}
                        style={styles.input}
                        placeholder="Write your password"
                        placeholderTextColor="#9c8e8b"
                        value={password}
                        onChangeText={(value) => {
                            setPassword(value);
                            clearError();
                        }}
                        onFocus={() => handleInputFocus(passwordInput.current)}
                        secureTextEntry
                    />

                    {/* Confirm Password */}
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                        ref={confirmPasswordInput}
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor="#9c8e8b"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => handleInputFocus(confirmPasswordInput.current)}
                        secureTextEntry
                    />

                    <Pressable
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={registerHandler}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Register</Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.linkButton}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            Already have an account? Login
                        </Text>
                    </Pressable>
                </ScrollView>
            </PatternBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#691c0b',
        color: '#691c0b',
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
    disabledButton: {
        opacity: 0.6,
    },
    errorText: {
        color: '#b00020',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'transparent',
    },
    linkText: {
        color: '#691c0b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    heroImage: {
        width: '100%',
        height: 200,
        marginBottom: 0,
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#691c0b',
        marginBottom: 6,
        marginLeft: 4,
    },
});
