import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';

import { Button } from 'react-native-paper';

import Header from '../components/Header';

import { COLORS } from '../variables/color';

export default function Search() {
  const DATA = [
    {
      id: 1,
      title: 'Apartment',
      image:  '../assets/apartment.png',
    },
    {
      id: 2,
      title: 'Commercial',
      image:  '../assets/apartment.png',
    },
    {
      id: 3,
      title: 'Office',
      image:  '../assets/apartment.png',
    },
    {
      id: 4,
      title: 'Restaurant',
      image:  '../assets/apartment.png',
    },
    {
      id: 5,
      title: 'Studio Home',
      image:  '../assets/apartment.png',
    },
    {
      id: 6,
      title: 'Villa',
      image:  '../assets/apartment.png',
    },
  ];

  const CategorieBtn = ({image}) => {
    <TouchableOpacity style={styles.categorieBtn}>
      {/* <Image/> */}
      <Text>{image}</Text>
    </TouchableOpacity>
  };

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.padding10}>
        <Button mode='outlined'
                textColor={COLORS.black}
                style={styles.locationBtn}>
          <Image source={require('../assets/pin.png')}/>
          <Text>Location</Text>
        </Button>
        <Text style={styles.textBold}>All Categories</Text>
        <FlatList data={DATA}
                  renderItem={({item}) => <CategorieBtn image={item.image}/>}
                  keyExtractor={item =>  item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  padding10: {
    padding: 10,
  },
  locationBtn: {
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  textBold: {
    fontWeight: 'bold',
  },
  categorieBtn: {
    height: 60,
  },
});