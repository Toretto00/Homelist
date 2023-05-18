import { ScrollView, StyleSheet, View, Text, Touchable, TouchableOpacity, Alert, Keyboard } from 'react-native';

import { Button, Checkbox, TextInput } from 'react-native-paper';

import { COLORS } from '../variables/color';
import { useEffect, useState } from 'react';
import api from '../api/client';

export default function SignUp({navigation}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [checkTerm, setCheckTerm] = useState(false);
    const [disabledSignUpBtn, setDisableSignUpBtn] = useState(true);

    const values = {
        first_name: firstName,
        last_name: lastName,
        username: userName,
        phone: phoneNumber,
        email: email,
        password: password,
    }

    function handleReadTerm() {
        Alert.alert('Read term!')
    }

    function handleSignUp () {
        Keyboard.dismiss();
        api.post("signup", values).then((res) => {
            if(res.ok) {
                Alert.alert('Sign up successful!');
                navigation.navigate('Log in');
            } else {
                if(res.problem === "TIMEOUT_ERROR") {
                    Alert.alert("Time out error!");
                }
                else {
                    Alert.alert(res?.data?.error_message[0]);
                }                
            }
        });
    }

    useEffect(() => {
        if(firstName !== '' && lastName !== '' && userName !== '' && email !== '' && phoneNumber !== '' && password !== '' && checkTerm)
        {
            values.first_name = firstName;
            values.last_name = lastName;
            values.username = userName;
            values.phone = phoneNumber;
            values.email = email;
            values.password = password;
            setDisableSignUpBtn(false);
        }
        else {
            setDisableSignUpBtn(true);
        }
    },[firstName, lastName, userName, email, phoneNumber, password, checkTerm]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.rowFlexDirection}>
                <View style={[styles.flex1, styles.margin]}>
                    <View style={styles.rowFlexDirection}>            
                        <Text style={styles.title}>First Name</Text>
                        <Text style={styles.requireColor}>*</Text>
                    </View>
                    <TextInput
                        mode='outlined'
                        placeholder='First Name'
                        activeOutlineColor={COLORS.primary}
                        style={styles.backgroundTransparent}
                        value={firstName}
                        onChangeText={(firstName) => setFirstName(firstName)}
                    />
                </View>
                <View style={[styles.flex1, styles.margin]}>
                    <View style={styles.rowFlexDirection}>            
                        <Text style={styles.title}>Last Name</Text>
                        <Text style={styles.requireColor}>*</Text>
                    </View>
                    <TextInput
                        mode='outlined'
                        placeholder='Last Name'
                        activeOutlineColor={COLORS.primary}
                        style={styles.backgroundTransparent}
                        value={lastName}
                        onChangeText={(lastName) => setLastName(lastName)}
                    />
                </View>
            </View>
            <View style={styles.margin}>
                <View style={styles.rowFlexDirection}>            
                    <Text style={styles.title}>Username</Text>
                    <Text style={styles.requireColor}>*</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='Username'
                    activeOutlineColor={COLORS.primary}
                    style={styles.backgroundTransparent}
                    value={userName}
                    onChangeText={(userName) => setUserName(userName)}
                />
            </View>
            <View style={styles.margin}>
                <View style={styles.rowFlexDirection}>            
                    <Text style={styles.title}>Email</Text>
                    <Text style={styles.requireColor}>*</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='Email'
                    activeOutlineColor={COLORS.primary}
                    style={styles.backgroundTransparent}
                    value={email}
                    keyboardType='email-address'
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.margin}>
                <View style={styles.rowFlexDirection}>            
                    <Text style={styles.title}>Phone Number</Text>
                    <Text style={styles.requireColor}>*</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='(+84) 123 456 789'
                    activeOutlineColor={COLORS.primary}
                    style={styles.backgroundTransparent}
                    value={phoneNumber}
                    keyboardType='phone-pad'
                    onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                />
            </View>            
            <View style={styles.margin}>
                <View style={styles.rowFlexDirection}>            
                    <Text style={styles.title}>Password</Text>
                    <Text style={styles.requireColor}>*</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='Password'
                    activeOutlineColor={COLORS.primary}
                    style={styles.backgroundTransparent}
                    value={password}
                    secureTextEntry={hidePassword?true:false}
                    onChangeText={(password) => setPassword(password)}
                    right={
                        <TextInput.Icon icon={hidePassword ? 'eye':'eye-off'} onPress={()=>{setHidePassword(!hidePassword)}}/>
                    }
                />
            </View>
            <View style={[styles.rowFlexDirection, styles.termContainer]}>
                <Checkbox.Android status={ checkTerm ? 'checked' : 'unchecked'}
                    onPress={() => setCheckTerm(!checkTerm)}
                    color={COLORS.primary}
                />
                <View style={styles.termTextContainer}>
                    <Text>
                        I have read and agree to the website 
                        <Text> </Text>
                        <Text style={styles.termColor}
                            onPress={handleReadTerm}>
                                Term and Conditions
                        </Text>     
                    </Text>   
                </View>                        
            </View>
            <Button mode='contained'
                    buttonColor={COLORS.primary}
                    textColor={COLORS.white}
                    disabled={disabledSignUpBtn}
                    onPress={handleSignUp}
            >
                Sign Up
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 4,
    },
    backgroundTransparent: {
        backgroundColor: COLORS.transparent,
    },
    flex1: {
        flex: 1,
    },
    margin: {
        margin:6,
    },
    rowFlexDirection: {
        display:'flex',
        flexDirection: 'row',
    },
    title: {
        marginRight: 6,
    },
    requireColor: {
        color: COLORS.redRequire,
    },
    termContainer: {
        margin: 10,
    },
    termColor: {
        color: COLORS.orange,
    },
    termTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrap: {
        flexWrap: 'wrap',
    },
});