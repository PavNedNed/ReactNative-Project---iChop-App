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
// import { useUserContext } from '../contexts/user/UserContext';

export default function LoginScreen({
    navigation,
    route

}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const { login }  = useUserContext();

    const loginHandler = () => {
        console.log('Login handler called with:', { email, password });

        route.params.onLogin();
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
