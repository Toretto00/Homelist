import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});