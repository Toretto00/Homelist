import { useEffect, useState } from 'react';

import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

import { Button, Divider, TextInput } from 'react-native-paper';

import { COLORS } from '../variables/color';

export default function EditProfile({navigation}){
    const [change, setChange] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [hometown, setHometown] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if(firstname !== '' || lastname !== '' || hometown !== '' || bio !== '')
            setChange(true);
        else
            setChange(false);
    }, [firstname, lastname, hometown, bio]);

    return(
        <View style={styles.container}>
            <View style={styles.actionContainer}>
                <Button mode='text' textColor={COLORS.black} onPress={() => navigation.pop()}>Cancel</Button>
                <Button mode='text' textColor={COLORS.black} disabled={!change ? true : false}>Save</Button>
            </View>
            <Divider/>
            <ScrollView>
                <View style={styles.verticalCenter}>
                    <TouchableOpacity style={[styles.verticalCenter, styles.margin20]}>
                        <Image source={require('../assets/camera.png')}/>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </View>
                <Text>Name</Text>
                <TextInput  mode='outlined' 
                            placeholder='First name' 
                            outlineColor={COLORS.text_gray} 
                            activeOutlineColor={COLORS.primary} 
                            style={styles.backgroundTransparent}
                            value={firstname}
                            onChangeText={(value) => setFirstname(value)}
                            />
                <TextInput  mode='outlined' 
                            placeholder='Last name' 
                            outlineColor={COLORS.text_gray} 
                            activeOutlineColor={COLORS.primary} 
                            style={styles.backgroundTransparent}
                            value={lastname}
                            onChangeText={(value) => setLastname(value)}
                            />
                <Text style={styles.margintop20}>Hometown</Text>
                <TextInput  mode='outlined' 
                            placeholder='City' 
                            outlineColor={COLORS.text_gray} 
                            activeOutlineColor={COLORS.primary} 
                            style={styles.backgroundTransparent}
                            value={hometown}
                            onChangeText={(value) => setHometown(value)}
                            />
                <View style={[styles.row, styles.margintop20]}>
                    <Text>Bio</Text>
                    <Text>{bio.length}/150</Text>
                </View>
                <TextInput  mode='outlined' 
                            placeholder='150 characters' 
                            outlineColor={COLORS.text_gray} 
                            activeOutlineColor={COLORS.primary} 
                            multiline={true}
                            style={[styles.backgroundTransparent, styles.height]}
                            value={bio}
                            onChangeText={(value) => setBio(value)}
                            />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingLeft: 10,
        paddingRight: 10,
    },
    actionContainer: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    verticalCenter:{
        alignItems: 'center',
    },
    margin20: {
        margin: 20,
    },
    margintop20: {
        marginTop: 20,
    },
    backgroundTransparent: {
        backgroundColor: 'transparent',
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    height:{
        height: 120,
    },
});