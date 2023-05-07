import { StyleSheet, View, Text, Image} from 'react-native';

import {COLORS} from '../variables/color';

export default function Header(){
    return (
        <View style={styles.container}>
            <Image style={styles.headerLogo} source={require('../assets/logo_header.png')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        display:'flex',
        alignItems:'center',
        justifyContent: 'flex-end',
        backgroundColor: COLORS.primary,
    },
    headerLogo:{
        height: 50,
        width: 200,
        marginBottom: 10,
    },
})