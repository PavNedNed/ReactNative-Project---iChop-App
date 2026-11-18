
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    ActivityIndicator
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

    const registerHandler = async () => {
        // Validation
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            return Alert.alert('Error', 'Please fill in all fields.');
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

        if (error) {
            return;
        }

        // Successful registration                     
        if (data?.user) {
            Toast.show({
                type: 'success',
                text1: 'Account created successfully!',
                topOffset: 80,
            }); 
            // Alert.alert('Success', 'Account created successfully!');
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
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('../../assets/home/auth-image.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    <Text style={styles.title}>Create Account</Text>

                    {/* Supabase error */}
                    {error && (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={(value) => {
                            setName(value);
                            clearError();
                        }}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value);
                            clearError();
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(value) => {
                            setPassword(value);
                            clearError();
                        }}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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
        paddingBottom: 50,
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
});
