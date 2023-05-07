import { StyleSheet, View, Text } from 'react-native';

export default function MyProperties(){
    return(
        <View style={styles.container}>
            <Text>MyProperties</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
});