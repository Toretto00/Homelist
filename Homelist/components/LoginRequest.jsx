import { useState } from 'react';

import { StyleSheet, Text, View, Image } from 'react-native';

import { Button } from 'react-native-paper';

import { COLORS } from '../variables/color';

export default function LoginRequest({navigation}){
    return(
        <View style={styles.loginReuestContainer}>
            <Image style={styles.image} source={require('../assets/user-undefined.png')}/>
            <Text style={styles.text}>Currently you're not logged in</Text>
            <Text style={styles.text}>Please log in or sign up for better exprience</Text>
            <Button mode='contain' 
              buttonColor={COLORS.primary} 
              textColor={COLORS.white} 
              style={styles.button}
              onPress={() => navigation.navigate('Log in')}>
                Log in / Sign up
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    loginReuestContainer: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 128,
        width: 128,
        marginBottom: 20,
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        color: COLORS.text_gray,
    },    
    button: {
        marginTop: 20,
        fontSize: 16,
    },
});