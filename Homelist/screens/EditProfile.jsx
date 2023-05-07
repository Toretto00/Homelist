import { StyleSheet, View, Text } from 'react-native';

export default function EditProfile(){
    return(
        <View style={styles.container}>
            <Text>Edit</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
});