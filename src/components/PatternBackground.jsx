import { View, Image, StyleSheet } from 'react-native';

export default function PatternBackground({ children }) {
    return (
        <View style={styles.container}>

            {/* Background */}
            <Image
                source={require('../../assets/home/pattern.png')}
                style={styles.pattern}
            />

            {/* Form and other content */}
            {children}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fed822',
    },
    pattern: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.25,
    },
});