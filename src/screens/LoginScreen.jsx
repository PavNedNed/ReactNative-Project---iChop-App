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
import PatternBackground from '../components/PatternBackground';

import { useUserContext } from '../contexts/user/UserContext';

export default function LoginScreen({
    navigation,
    route

}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login }  = useUserContext();

    const loginHandler = () => {
        // console.log('Login handler called with:', { email, password });

        // Dummy data for user IDs based on email
        let id = "c4d1a6f8-3e72-49b5-8a0c-2f6d9e1b4a37";

        if(email === "pavel@abv.bg") {
            id = "7f3a2c91-8d64-4b21-a5e7-1c9f0b6d2a43";
        } else if(email === "mitko@abv.bg") {
            id = "2b8e5d74-1a93-46c0-9f52-6d3a8b1e7c25";
        } else {
            id = "c4d1a6f8-3e72-49b5-8a0c-2f6d9e1b4a37";
        }

        login(email, password, id);
    }

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

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <Pressable style={styles.button} onPress={loginHandler}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.linkText}>Don't have an account? Register</Text>
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
});
