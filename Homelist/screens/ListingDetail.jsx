import { useCallback, useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { decode } from "html-entities";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  Button,
  IconButton,
  Card,
  ActivityIndicator,
} from "react-native-paper";

import { ImageSlider } from "react-native-image-slider-banner";

import { COLORS } from "../variables/color";
import api from "../api/client";
import CategoryIcon from "../components/CategoryIcon";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function ListingDetail({ route, navigation }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listingData, setListingData] = useState();
  const [initial, setInitial] = useState(true);

  const listImages = [];
  const amenities = [];
  const customField = [];

  useEffect(() => {
    handleLoadListingData();
  }, []);

  useEffect(() => {
    handleLoadImages();
  });

  useEffect(() => {
    getCustomField();
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  function handleLoadListingData() {
    api.get(`/listings/${route.params.listingId}`).then((res) => {
      if (res.ok) {
        setListingData(res.data);
      }
    });
  }

  function handleLoadImages() {
    listingData?.images?.map((image) => {
      listImages.push({ img: image.sizes.full.src });
    });
  }

  const getLocation = (contact) => {
    const address = [];
    if (contact?.locations[0]) address.push(contact.locations[0].name);
    return address.join(", ");
  };

  function getCustomField() {
    if (listingData?.custom_fields) {
      listingData.custom_fields.map((item1) => {
        if (item1.label !== "Amenities" && item1.value) {
          customField.push(item1);
        }
      });
    }
    return customField;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          size="large"
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <IconButton
              icon="arrow-left"
              containerColor={COLORS.white}
              onPress={() => navigation.pop()}
            />
            <View style={{ flexDirection: "row" }}>
              <IconButton icon="share-variant" containerColor={COLORS.white} />
              <IconButton
                icon={isFavorite ? "cards-heart" : "cards-heart-outline"}
                containerColor={COLORS.white}
                onPress={() => setIsFavorite(!isFavorite)}
              />
            </View>
          </View>
          <ScrollView>
            <ImageSlider data={listImages} autoPlay={true} timer={1000} />
            <Text style={styles.listingTitle}>{listingData?.title}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 8 }}
            >
              <Image source={require("../assets/pin.png")} />
              <Text style={[styles.textGray, { marginLeft: 10 }]}>
                {getLocation(listingData?.contact)}
              </Text>
            </View>
            <Text style={styles.priceText}>${listingData?.price}</Text>
            <Text style={[styles.priceType, styles.textGray]}>
              {listingData?.price_type}
            </Text>
            <Card mode="outlined" style={{ margin: 8 , backgroundColor: COLORS.white}}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    //margin: 8,
                  }}
                >
                  {getCustomField().map((field) => (
                    <View key={decode(field.id)}>
                      <View style={styles.categoriesBtn}>
                        <View style={styles.categoriesBtnImage}>
                          <CategoryIcon
                            iconName={
                              field.icon.trim().includes("flaticon-")
                                ? field.icon.trim().slice(9)
                                : field.icon
                            }
                            iconColor={COLORS.primary}
                            iconSize={18}
                          />
                        </View>
                        <Text style={{ fontWeight: "bold" }}>
                          {decode(field.label)}
                        </Text>
                        <Text style={styles.textGray}>
                          {decode(field.value)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Text style={{ fontWeight: "bold", fontSize: 16, margin: 8 }}>
              {listingData?.custom_fields[0].label}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                margin: 8,
              }}
            >
              {listingData?.custom_fields[0].options.choices.map((item) => (
                <View key={item.id}>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        width: (screenWidth - 16) / 2,
                        alignItems: "center",
                      },
                    ]}
                  >
                    <FontAwesome name="check" color={COLORS.primary} />
                    <Text style={[styles.textGray, { marginLeft: 4 }]}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16, margin: 8 }}>
              Description
            </Text>
            <Card style={{backgroundColor: COLORS.bg_light}}>
              <Card.Content>
                {!isExpand ? (
                  <Text>{listingData?.description.slice(0, 100)}...</Text>
                ) : (
                  <Text>{listingData?.description}</Text>
                )}
                <Button
                  mode="text"
                  textColor={COLORS.primary}
                  onPress={() => setIsExpand(!isExpand)}
                >
                  {!isExpand ? "Show more" : "Show less"}
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
          <View style={{ flexDirection: "row" }}>
            <Button
              mode="contained-tonal"
              icon="phone"
              style={{ width: screenWidth / 3 }}
            >
              Call
            </Button>
            <Button
              mode="contained-tonal"
              icon="email"
              style={{ width: screenWidth / 3 }}
            >
              Email
            </Button>
            <Button
              mode="contained-tonal"
              icon="chat"
              style={{ width: screenWidth / 3 }}
            >
              Chat
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    height: 100,
    backgroundColor: COLORS.primary,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  listingTitle: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 8,
  },
  priceText: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 8,
  },
  priceType: {
    margin: 8,
  },
  textGray: {
    color: COLORS.text_gray,
  },
  categoriesBtn: {
    height: 80,
    width: (screenWidth - 32 * 4) / 4,
    margin: 8,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  categoriesBtnImage: {
    padding: 16,
    borderRadius: 40,
    backgroundColor: COLORS.bg_primary,
  },
});
