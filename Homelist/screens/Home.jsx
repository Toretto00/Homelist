import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import {
  Button,
  Divider,
  TextInput,
  Avatar,
  ToggleButton,
  Card,
  ActivityIndicator,
  Searchbar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { decode } from "html-entities";

import { COLORS } from "../variables/color";
import Header from "../components/Header";
import api from "../api/client";
import CategoryIcon from "../components/CategoryIcon";
import { SearchBar } from "react-native-screens";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function Home({ route, navigation }) {
  const [locationData, setLocationData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [listingsData, setListingsData] = useState([]);
  const [isCheck, setIsChech] = useState("square");
  const [searchInput, setSearchInput] = useState("");
  const [initial, setInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState(() => {
    return { search: "", categories: "", locations: "" };
  });
  //const [refreshing, setRefreshing] = useState(false);

  const search_location = route?.params?.location.term_id;

  useEffect(() => {
    if (!initial) return;
    getData();
  }, [initial]);

  function getData() {
    handleLoadLocationData();
    handleLoadCategoriesData();
    handleLoadListingsData();
    if (initial) setInitial(false);
    setIsLoading(false);
  }

  function handleLoadLocationData() {
    api
      .get("locations")
      .then((res) => {
        if (res.ok) {
          setLocationData(res.data);
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  function handleLoadCategoriesData() {
    api
      .get("categories")
      .then((res) => {
        if (res.ok) {
          setCategoriesData(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!searchData) return;
    handleLoadListingsData();
  }, [searchData]);

  function handleLoadListingsData() {
    const args = { ...searchData };
    api
      .get("listings", args)
      .then((res) => {
        if (res.ok) {
          setListingsData(res.data.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!search_location) return;
    setIsLoading(true);
    setSearchData((searchData) => {
      return {
        ...searchData,
        locations: search_location,
      };
    });
  }, [search_location]);

  function handleSelectLocation() {
    navigation.navigate("Select Location", {
      data: locationData,
      type: "search",
      search_location,
    });
  }

  function handleListingDetail(listingId) {
    navigation.navigate("Listing Detail", { listingId });
  }

  function handleSelectCategory(item) {
    setIsLoading(true);
    setSearchData((searchData) => ({
      ...searchData,
      categories: item.term_id,
    }));
  }

  function handleSearch() {
    if (searchInput !== "") {
      setIsLoading(true);
      setSearchData((searchData) => ({
        ...searchData,
        search: searchInput,
      }));
    }
  }

  function handleReset() {
    setIsLoading(true);
    route.params = null;
    setSearchData((searchData) => ({
      search: "",
      categories: "",
      locations: "",
    }));
  }

  const renderCategoriesList = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.categoriesBtn}
      onPress={() => handleSelectCategory(item)}
    >
      <View style={styles.categoriesBtnImage}>
        <CategoryIcon
          iconName={item.icon.class}
          iconColor={COLORS.primary}
          iconSize={18}
        />
      </View>
      <Text style={styles.textGray}>{decode(item.name)}</Text>
    </TouchableOpacity>
  ));

  const renderItemList = useCallback(({ item }) => (
    <Card
      style={styles.cardContainer}
      onPress={() => handleListingDetail(item.listing_id)}
    >
      <Card.Cover
        source={
          item?.images?.length
            ? {
                uri: item.images[0].sizes.full.src,
              }
            : require("../assets/icon.png")
        }
      />
      <Card.Content style={styles.margin8}>
        <Button
          mode="Contained"
          textColor={COLORS.primary}
          style={{
            backgroundColor: COLORS.bg_primary,
            justifyContent: "flex-start",
            borderRadius: 4,
          }}
        >
          {decode(item.categories[0].name)}
        </Button>
      </Card.Content>
      <Card.Title
        title={decode(item.title)}
        titleNumberOfLines={2}
        titleStyle={styles.bold}
      />
      <Card.Content
        style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
      >
        <Image source={require("../assets/pin.png")} />
        <Text style={styles.textGray}>
          {item.contact.locations.map((_loc) => _loc.name).join(", ")}
        </Text>
      </Card.Content>
      <Card.Content style={{ marginTop: 4 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {decode(item.price)}$
        </Text>
      </Card.Content>
    </Card>
  ));

  const renderItemTextList = useCallback(({ item }) => (
    <Card
      style={styles.cardTextContainer}
      onPress={() => handleListingDetail(item.listing_id)}
    >
      <View style={styles.cardTextContainer}>
        <Card.Cover
          source={
            item?.images?.length
              ? {
                  uri: item.images[0].sizes.full.src,
                }
              : require("../assets/icon.png")
          }
          style={{ width: ((screenWidth - 16) / 5) * 2 }}
        />
        <View style={{ width: ((screenWidth - 16) / 5) * 3 }}>
          <Card.Content style={styles.margin8}>
            <Button
              mode="Contained"
              textColor={COLORS.primary}
              style={{
                backgroundColor: COLORS.bg_primary,
                justifyContent: "flex-start",
                borderRadius: 4,
              }}
            >
              {decode(item.categories[0].name)}
            </Button>
          </Card.Content>
          <Card.Title
            title={decode(item.title)}
            titleNumberOfLines={2}
            titleStyle={styles.bold}
          />
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Image source={require("../assets/pin.png")} />
            <Text style={styles.textGray}>
              {item.contact.locations.map((_loc) => _loc.name).join(", ")}
            </Text>
          </Card.Content>
          <Card.Content style={{ marginTop: 4, alignItems: "flex-end" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {decode(item.price)}$
            </Text>
          </Card.Content>
          <Card.Content>
            <Text style={styles.textGray} numberOfLines={2}>
              {item.custom_fields[0].options.choices
                .map((name) => name.name)
                .join("/ ")}
            </Text>
          </Card.Content>
        </View>
      </View>
    </Card>
  ));

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          size="large"
        />
      ) : (
        <>
          <View style={styles.homeAction}>
            <Button
              mode="outlined"
              compact={true}
              textColor={COLORS.black}
              buttonColor={COLORS.white}
              style={styles.locationBtn}
              onPress={() => handleSelectLocation()}
            >
              <Image source={require("../assets/pin.png")} />
              <Text>
                {searchData.locations ? route.params.location.name : "Location"}
              </Text>
            </Button>
            <Searchbar
              style={styles.searchBar}
              placeholder="Search..."
              value={searchInput}
              onChangeText={(value) => setSearchInput(value)}
              onIconPress={() => handleSearch()}
              onSubmitEditing={() => {
                handleSearch();
              }}
            />
          </View>
          <Divider />
          <View style={[styles.categoriesTitle, { height: 40 }]}>
            <Text style={styles.bold}>Top Categories</Text>
            {(searchData.search !== "" ||
              searchData.categories !== "" ||
              searchData.locations !== "") && (
              <Button
                mode="text"
                textColor={COLORS.primary}
                onPress={() => handleReset()}
              >
                Reset
              </Button>
            )}
          </View>
          <SafeAreaView style={{ height: 100 }}>
            <FlatList
              data={categoriesData}
              renderItem={renderCategoriesList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </SafeAreaView>
          <View style={styles.adsContent}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.bold}>Lastest Ads</Text>
              {searchData.categories !== "" && (
                <Text style={{ marginLeft: 4 }}>
                  (
                  {categoriesData.map((item) => {
                    if (item.term_id === searchData.categories)
                      return item.name;
                  })}
                  )
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <ToggleButton.Group
                onValueChange={(value) => setIsChech(value)}
                value={isCheck}
              >
                <ToggleButton
                  icon="square"
                  value="square"
                  iconColor={COLORS.primary}
                ></ToggleButton>
                <ToggleButton
                  icon="format-list-text"
                  value="text"
                  iconColor={COLORS.primary}
                ></ToggleButton>
              </ToggleButton.Group>
            </View>
          </View>
          {!listingsData && (
            <View
              style={[
                styles.container,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={styles.textGray}>Opps, No results found</Text>
              <Text style={styles.textGray}>Try different or more general keywords</Text>
            </View>
          )}
          {listingsData && (
            <SafeAreaView style={styles.container}>
              {isCheck === "square" ? (
                <FlatList
                  data={listingsData}
                  key={"_"}
                  horizontal={false}
                  numColumns={2}
                  renderItem={renderItemList}
                />
              ) : (
                <FlatList
                  data={listingsData}
                  key={"#"}
                  horizontal={false}
                  numColumns={1}
                  renderItem={renderItemTextList}
                />
              )}
            </SafeAreaView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  homeAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  locationBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: ((screenWidth - 24) / 8) * 2,
    height: 60,
    borderRadius: 4,
  },
  searchBar: {
    width: ((screenWidth - 24) / 8) * 6,
    height: 60,
    backgroundColor: COLORS.white,
    borderColor: COLORS.text_gray,
    borderWidth: 1,
    borderRadius: 4,
  },
  margin8: {
    marginTop: 8,
  },
  categoriesTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  categoriesBtn: {
    height: 80,
    width: 80,
    margin: 8,
    alignItems: "center",
    justifyContent: "flex-start",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: screenWidth / 2 - 16,
    margin: 8,
    backgroundColor: COLORS.white,
  },
  cardTextContainer: {
    flexDirection: "row",
    width: screenWidth - 16,
    margin: 8,
    backgroundColor: COLORS.white,
  },
});
