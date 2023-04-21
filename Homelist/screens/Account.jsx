import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '../variables/color';

export default function Account({navigation}) {
  return (
    <View style={styles.container}>
        <Text>Account</Text>
        <Button mode='contain' 
                buttonColor={COLORS.primary} 
                textColor={COLORS.white} 
                onPress={() => navigation.navigate('Log in')}>
          Login
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});