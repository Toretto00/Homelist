import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

import { COLORS } from '../variables/color';
import { Divider } from 'react-native-paper';

export default function AccountSetting({navigation}){
    return(
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.actionBtn}>
                <Text>Email</Text>
                <Text style={styles.orange}>phanchibao007@gmail.com</Text>
            </TouchableOpacity>
            <Divider/>
            <TouchableOpacity style={styles.actionBtn}>
                <Text>Mobile Phonenumber</Text>
                <Text style={styles.orange}>Add</Text>
            </TouchableOpacity>
            <Divider/>
            <TouchableOpacity style={styles.actionBtn}>
                <Text>Date of Birth</Text>
                <Text style={styles.orange}>02/07/2002</Text>
            </TouchableOpacity>
            <View style={styles.space}/>
            <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.red}>Log Out</Text>
                <Image source={require('../assets/log-out.png')}/>
            </TouchableOpacity> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: COLORS.white,
    },
    actionBtn: {
        height: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
    },
    image: {
      height: 24,
      width: 24,
    },
    space: {
        height: 60,
        backgroundColor: 'transparent',
    },
    red: {
        color: COLORS.redGoogle,
    },
    orange: {
        color: COLORS.orange,
    },
  });