
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
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';

import PatternBackground from '../components/PatternBackground';
import useSupabaseAuth from '../hooks/useSupabaseAuth';

export default function LoginScreen({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, loading, error, clearError } = useSupabaseAuth();

    const loginHandler = async () => {
        // Validation
        if (!email.trim() || !password) {
            return Alert.alert('Error', 'Please fill in all fields.');
        }

        // Login user
        const { data, error } = await login(
            email.trim(),
            password
        );

        if (error) {
            return;
        }

        if (data?.user) {
            Alert.alert('Success', 'Logged in successfully!');
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
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('../../assets/home/auth-image.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    <Text style={styles.title}>Login to continue</Text>

                    {/* Supabase error */}
                    {error && (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    )}

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

                    <Pressable
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={loginHandler}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Register')}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account? Register
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
        marginBottom: 10,
    },
});
