import {  useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Touchable, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { COLORS } from '../variables/color';

import api from '../api/client';

export default function Login({navigation}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [hide, setHide] = useState(true);
    const [disabledLoginBtn, setdisableLoginBtn] = useState(true);

    useEffect(() => {
        if(userName !== '' && password !== ''){
            setdisableLoginBtn(false);
        }
        else {
            setdisableLoginBtn(true);
        }
    }, [userName, password]);

    function handleLogin() {
        Keyboard.dismiss();
        api.post("login", {
            username: userName,
            password: password,
        }).then((res) => {
            console.log(res.data)
            if(res.ok) {
                navigation.navigate('account');
                Alert.alert("Login Successful!");
            } else {
                Alert.alert("Login faild!");
            }
        });
    }

    return(
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            //keyboardVerticalOffset={80}
            >
            <ScrollView style={styles.container}>
                <View style={styles.flexGrow0}>
                    <View style={styles.alignCenter}>
                        <Text style={styles.text}>Log in to your account</Text>
                    </View>
                    <TextInput label="Email"
                                mode='outlined' 
                                activeOutlineColor={COLORS.primary}
                                style={styles.margin}
                                value={userName}
                                onChangeText={(userName) => {
                                    setUserName(userName);
                                }}
                    />
                    <TextInput label="Password" 
                                mode='outlined' 
                                activeOutlineColor={COLORS.primary}
                                style={styles.margin}
                                secureTextEntry={hide?true:false}
                                value={password}
                                onChangeText={(password) => {
                                    setPassword(password);
                                }}
                                right={
                                    <TextInput.Icon icon={hide ? 'eye':'eye-off'} onPress={()=>setHide(!hide)}/>
                                }
                    />
                    <TouchableOpacity style={styles.margin}>
                        <Text>
                            Forgot your password?
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.margin}>
                        <Button mode='contain'
                                buttonColor={COLORS.primary}
                                textColor={COLORS.white}
                                disabled={disabledLoginBtn}
                                onPress={handleLogin}>
                            Login
                        </Button>
                    </View>        
                    <View style={[styles.alignCenter, styles.margin]}>
                        <Text>Or login with</Text>
                    </View>
                    <View style={styles.margin}>
                        <Button mode='contain'
                                buttonColor={COLORS.black}
                                icon='apple'
                                textColor={COLORS.white}
                                >
                            Login with Apple
                        </Button>
                    </View>
                    <View style={styles.margin}>
                        <Button mode='contain'
                                buttonColor={COLORS.blueFacebook}
                                icon='facebook'
                                textColor={COLORS.white}
                                >
                            Login with Facebook
                        </Button>
                    </View>
                    <View style={styles.margin}>
                        <Button mode='contain'
                                buttonColor={COLORS.redGoogle}
                                icon='google'
                                textColor={COLORS.white}
                                >
                            Login with Google
                        </Button>
                    </View>         
                </View>    
                <View style={styles.flexEnd}>
                    <View style={styles.signUp}>
                        <Text>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Sign up')}>
                            <Text style={styles.textColor}>
                                Sign up now
                            </Text>
                        </TouchableOpacity>
                    </View>                         
                </View>
            </ScrollView>            
        </KeyboardAvoidingView>        
    );
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 10,
    },
    margin: {
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        height: 60,
        lineHeight: 60,
        fontWeight: 'bold',
    },
    alignCenter: {
        alignItems: 'center',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    signUp: {
        display: 'flex',
        flexDirection: 'row',
        alignItems:'stretch',
        justifyContent: 'center',
    },
    textColor: {
        color: COLORS.primary,
    },
    flexEnd: {
        alignItems:'stretch',
    },
  });