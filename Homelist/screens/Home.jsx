import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Button, Divider, TextInput, Avatar, ToggleButton, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { decode }  from  "html-entities";

import { COLORS } from '../variables/color';
import Header from '../components/Header';
import api from '../api/client';
import CategoryIcon from '../components/CategoryIcon';

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

export default function Home() {
  const [isSearch, setIsSearch] = useState(false);
  const [isCheck, setIsChech] = useState('square');
  const [searchInput, setSearchInput] = useState('');
  const [listingsData, setListingsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    handleSearchInput();
  }, [searchInput]);

  useEffect(() => {
    if(!initial) return;
    handleLoadListingsData();
  }, [initial]);

  useEffect(() => {
    if(!initial) return;
    handleLoadCategoriesData();
  }, [initial]);

  function handleLoadListingsData(){
    api.get('listings').then((res) => {
      if(res.ok)
      {
        setListingsData(res.data.data);
      }
      if(initial) setInitial(false);
    }).catch((error) => {
      console.log(error);
    })
  };

  function handleLoadCategoriesData(){
    api.get('categories').then((res) => {
      if(res.ok)
      {
        setCategoriesData(res.data);
      }
    }).catch((error) => {
      console.log(error);
    })
  };

  function handleSearchInput(){
    if(searchInput !== '')
      setIsSearch(true);
    else
      setIsSearch(false);
  };

  const renderCategoriesList = useCallback(
    ({item}) => (
      <TouchableOpacity style={styles.categoriesBtn}>
        <TouchableOpacity style={styles.categoriesBtnImage}>
          {/* <Image style={styles.image} source={require('../assets/apartment.png')}/> */}
          <CategoryIcon iconName={item.icon.class} iconColor={COLORS.primary} iconSize={18}/>
        </TouchableOpacity>
        <Text style={styles.textGray}>{decode(item.name)}</Text>
      </TouchableOpacity>
    )
  );

  const renderItemList = useCallback(
    ({item}) => (
      <Card style={styles.cardContainer}>
        <Card.Cover source={item?.images?.length
                  ? {
                      uri: item.images[0].sizes.full.src,
                    }
                  : require('../assets/icon.png')}/>
        <Card.Content style={styles.margin8}>
          <Button mode='Contained'
                  textColor={COLORS.primary}
                  style={{backgroundColor: COLORS.bg_primary, justifyContent: 'flex-start', borderRadius: 4}}>
            {decode(item.categories[0].name)}
          </Button>
        </Card.Content>
        <Card.Title title={decode(item.title)}
                    titleNumberOfLines={2}
                    titleStyle={styles.bold}
        />
        <Card.Content style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <Image source={require('../assets/pin.png')}/>
          <Text style={styles.textGray}>{item.contact.locations.map((_loc)=>_loc.name).join(", ")}</Text>
        </Card.Content>
        <Card.Content style={{marginTop: 4}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>{decode(item.price)}$</Text>
        </Card.Content>
      </Card>
  ));

  const renderItemTextList = useCallback(
    ({item}) => (
      <Card style={styles.cardTextContainer} onPress={() => console.log(item.custom_fields[0].options.choices.map((name)=>name.name).join('/'))}>
        <View style={styles.cardTextContainer}>
          <Card.Cover source={item?.images?.length
                    ? {
                        uri: item.images[0].sizes.full.src,
                      }
                    : require('../assets/icon.png')}
                      style={{width: (screenWidth - 16) / 5 * 2}}
                    />
          <View style={{width: (screenWidth - 16) / 5 * 3}}>
            <Card.Content style={styles.margin8}>
              <Button mode='Contained'
                      textColor={COLORS.primary}
                      style={{backgroundColor: COLORS.bg_primary, justifyContent: 'flex-start', borderRadius: 4}}>
                {decode(item.categories[0].name)}
              </Button>
            </Card.Content>
            <Card.Title title={decode(item.title)}
                        titleNumberOfLines={2}
                        titleStyle={styles.bold}
            />
            <Card.Content style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
              <Image source={require('../assets/pin.png')}/>
              <Text style={styles.textGray}>{item.contact.locations.map((_loc)=>_loc.name).join(", ")}</Text>
            </Card.Content>
            <Card.Content style={{marginTop: 4, alignItems: 'flex-end'}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>{decode(item.price)}$</Text>
            </Card.Content>
            <Card.Content>
              <Text style={styles.textGray} numberOfLines={2}>{item.custom_fields[0].options.choices.map((name)=>name.name).join('/ ')}</Text>
            </Card.Content>
          </View>
        </View>        
      </Card>
  ));

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.homeAction}>
        <Button mode='outlined'
                textColor={COLORS.black}
                style={styles.locationBtn}>
          <Image source={require('../assets/pin.png')}/>
          <Text>Location</Text>
        </Button>
        <TextInput mode='outlined'
                    placeholder='Search...'
                    activeOutlineColor={COLORS.primary}
                    left={<TextInput.Icon icon={() => <Icon name='magnify' color={COLORS.primary} size={24} style={styles.margin8}/>}/>}
                    right={isSearch ? <TextInput.Icon icon={() => <Icon name='close' color={COLORS.primary} size={24} style={styles.margin8}/>} onPress={() => setSearchInput('')}/> : <></>}
                    style={[styles.transparentColor, styles.searchInput]}
                    value={searchInput}
                    onChangeText={(value) => {setSearchInput(value)}}
        />
      </View>
      <Divider/>
      <View style={styles.categoriesTitle}>
        <Text style={styles.bold}>Top Categories</Text>
        <Button mode='text'
                textColor={COLORS.primary}>
          See all
        </Button>
      </View>
      <SafeAreaView style={{height: 100,}}>
        <FlatList data={categoriesData} 
                  renderItem={renderCategoriesList} 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}/>
      </SafeAreaView>
      <View style={styles.adsContent}>
        <Text style={styles.bold}>Lastest Ads</Text>
        <View style={{flexDirection:'row',}}>
          <ToggleButton.Group onValueChange={(value) => setIsChech(value)}
                              value={isCheck}>
            <ToggleButton icon='square' value='square' iconColor={COLORS.primary}></ToggleButton>
            <ToggleButton icon='format-list-text' value='text' iconColor={COLORS.primary}></ToggleButton>
          </ToggleButton.Group>
        </View>
      </View>
      <SafeAreaView style={styles.container}>        
        {isCheck === 'square' ? 
          <FlatList data={listingsData}
                    key={'_'}
                    horizontal={false}
                    numColumns={2}
                    renderItem={ renderItemList }/> : 
          <FlatList data={listingsData}
                    key={'#'}
                    horizontal={false}
                    numColumns={1}
                    renderItem={ renderItemTextList }/>}
      </SafeAreaView>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeAction: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 8,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 2,
    marginRight: 8,
  },
  searchInput: {
    height: 46,
    width: 260,
    justifyContent: 'flex-end',
  },
  transparentColor:{
    backgroundColor: COLORS.transparent,
    height: 60,
  },
  margin8: {
    marginTop: 8,
  },
  categoriesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  categoriesBtn: {
    height: 80,
    width: 80,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoriesBtnImage: {
    padding: 16,
    borderRadius: 40,
    backgroundColor: COLORS.bg_primary,
  },
  image: {
    height: 20,
    width: 20,
  },
  textGray: {
    color: COLORS.text_gray,
  },
  adsContent: {
    padding: 8,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: screenWidth / 2 - 16,
    margin: 8,
    backgroundColor: COLORS.white,
  },
  cardTextContainer: {
    flexDirection: 'row',
    width: screenWidth - 16,
    margin: 8,
    backgroundColor: COLORS.white,
  }
});