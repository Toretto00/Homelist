import { StyleSheet, View, Text } from 'react-native';

export default function AccountSetting(){
    return(
        <View style={styles.container}>
            <Text>AccountSetting</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
});