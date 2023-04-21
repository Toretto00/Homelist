import { StyleSheet, View, Text } from 'react-native';

export default function SignUp() {
    return (
        <ScrollView style={styles.container}>
            <View>
                <View>            
                    <Text>First Name</Text>
                    <Text>*</Text>
                </View>
                <TextInput/>
            </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});