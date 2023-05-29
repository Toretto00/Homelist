import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateValue } from "../StateProvider";

import Header from "../components/Header";
import LoginRequest from "../components/LoginRequest";
import Apologize from "../components/Apologize";
import { COLORS } from "../variables/color";
import api, {
  setAuthToken,
  setMultipartHeader,
  removeMultipartHeader,
  removeAuthToken,
} from "../api/client";
import {
  RadioButton,
  ActivityIndicator,
  Button,
  Divider,
  TextInput,
  SegmentedButtons,
  Checkbox,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Picker } from "@react-native-picker/picker";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function AdNew({ navigation, route }) {
  const [{ user, auth_token }, dispatch] = useStateValue();
  const [initial, setInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState();
  const [listingFormData, setListingFormData] = useState({});
  const [checked, setChecked] = useState(true);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [contact, setContact] = useState({
    zipcode: "",
    address: "",
    phone: "",
    whatsapp_number: "",
    website: "",
    email: "",
    name: "",
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [categoriesChecked, setCategoriesChecked] = useState("");
  const [parking, setParking] = useState("yes");
  const [numberOfBedroom, setNumberOfBedroom] = useState("1");
  const [numberOfBath, setNumberOfBath] = useState("1");
  const [priceUnit, setPriceUnit] = useState("");
  const [readTNC, setReadTNC] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);

  const nearbyPlaces = [
    "Real Estate",
    "Home Services",
    "Education",
    "Health & Medical",
    "Restaurants",
  ];

  useEffect(() => {
    handleLoadCategories();
    handleLoadLocations();
    handleLoadFormData();
    getUserData();
  }, [user]);

  const getUserData = () => {
    if(user)
      setContact({
        ...contact,
        name: user.username
          ? user.username
          : [user.first_name, user.last_name].join(" "),
        phone: user.phone,
        email: user.email,
      });
  };

  useEffect(() => {
    if (
      selectedAmenities !== [] &&
      categoriesChecked !== "" &&
      listingFormData.title !== "" &&
      listingFormData.price !== "" &&
      readTNC !== false
    ) {
      setDisableSubmitBtn(false);
    } else setDisableSubmitBtn(true);
  }, [selectedAmenities, listingFormData, categoriesChecked, readTNC]);

  const handleLoadFormData = () => {
    setAuthToken(auth_token);
    api
      .get("listing/form", { category_id: 112 })
      .then((res) => {
        if (res.ok) {
          setFormData(res.data);
          let tempListingFormData = {};
          tempListingFormData.pricing_type = "price";
          tempListingFormData.price_type = "fixed";
          tempListingFormData.price_units = "year";
          setListingFormData(tempListingFormData);
          removeAuthToken();
          setIsLoading(false);
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const handleLoadCategories = () => {
    api
      .get("categories")
      .then((res) => {
        if (res.ok) {
          setCategories(res.data);
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const handleLoadLocations = () => {
    api
      .get("locations")
      .then((res) => {
        if (res.ok) {
          setLocations(res.data);
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const handleSelectLocation = () => {
    navigation.navigate("Select Location", { data: locations, type: "adnew" });
  };

  const handleAllRequireSelected = () => {};

  const handleListingFormSubmit = () => {
    const data = {
      ["custom_fields"]: {
        ["_field_4323"]: "apartment",
        ["_field_4322"]: parking,
        ["_field_4316"]: numberOfBedroom,
        ["_field_4321"]: numberOfBath,
        //["_field_4317"]: listingFormData.sqft,
        ["_field_4692"]: "rent",
        ["_field_4693"]: route?.params?.location.name,
        ["_field_4694"]: listingFormData.buildYear,
        ["_field_4216"]: selectedAmenities,
      },
      //...listingFormData,
      ["category_id"]: categoriesChecked,
      ["locations"]: [route?.params?.location.term_id],
      ["title"]: listingFormData.title,
      ["pricing_type"]: listingFormData.pricing_type,
      ["price_type"]: listingFormData.price_type,
      ["price"]: listingFormData.price,
      ["price_unit"]: listingFormData.price_units,
      //["description"]: listingFormData.description,
      ...contact,
      //["agree"]: 1,
      // ["gallery"]: imageObjects,
      // ["panorama_img"]: panoramaObject,
      // ["floor_plans"]: floorPlanInfos,
      ["listing_type"]: "rent",
      ["hide_map"]: 1,
      // ...markerPosition,
      // ["social_profiles"]: { ...socialProfiles },
      // ["active_bhs"]: bHActive ? 1 : 0,
      // ["active_special_bhs"]: defaultSBH.length ? 1 : 0,
      // bhs: defaultBH,
      // special_bhs: defaultSBH,
    };

    setAuthToken(auth_token);

    api.post("listing/form", data).then((res) => {
      if (res.ok) {
        Alert.alert("OK");
        removeAuthToken();
      } else {
        removeAuthToken();
        Alert.alert(res.error_message);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      {!user ? (
        <LoginRequest navigation={navigation} />
      ) : (
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              margin: 8,
            }}
          >
            <Text style={styles.title}>AdNew Form</Text>
          </View>

          {/* Select type of category */}
          <Text style={[styles.titleText, { marginLeft: 8 }]}>
            Categories<Text style={{ color: COLORS.redGoogle }}> *</Text>
          </Text>
          <View style={styles.categoriesContainer}>
            {categories?.map((item) => (
              <Button
                key={item.term_id}
                mode={
                  item.term_id === categoriesChecked ? "contained" : "outlined"
                }
                textColor={
                  item.term_id === categoriesChecked
                    ? COLORS.white
                    : COLORS.black
                }
                buttonColor={
                  item.term_id === categoriesChecked && COLORS.primary
                }
                style={styles.categoriesBtn}
                onPress={() => {
                  setCategoriesChecked(item.term_id);
                }}
              >
                {item.name}
              </Button>
            ))}
          </View>

          {/* Select Location */}
          <Text style={[styles.titleText, { marginLeft: 8 }]}>
            Location<Text style={{ color: COLORS.redGoogle }}> *</Text>
          </Text>
          <Button
            mode="contained"
            buttonColor={COLORS.primary}
            style={styles.btn}
            onPress={() => handleSelectLocation()}
          >
            {route?.params?.location ? route.params.location.name : "Location"}
          </Button>

          {/* Insert image section */}
          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 8 }}
          >
            <Image source={require("../assets/picture.png")} />
            <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16 }}>
              Images
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.bg_primary,
              padding: 8,
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
              You can upload up to 6 images.
            </Text>
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
              Long press to drag and sort images.
            </Text>
          </View>
          <Button
            mode="contained"
            buttonColor={COLORS.primary}
            style={styles.btn}
            disabled={true}
          >
            Add Photos
          </Button>
          <Divider />

          {/* Product information section */}
          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 8 }}
          >
            <Image source={require("../assets/box.png")} />
            <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16 }}>
              Product Information
            </Text>
          </View>
          <View style={{ margin: 8 }}>
            {/* Title */}
            <Text style={styles.titleText}>
              Title<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <TextInput
              mode="outlined"
              activeOutlineColor={COLORS.primary}
              placeholder="Title"
              value={listingFormData.title}
              onChangeText={(value) => {
                setListingFormData({
                  ...listingFormData,
                  title: value,
                });
              }}
              contentStyle={{ backgroundColor: COLORS.white, margin: 4 }}
            />

            {/* Select pricing */}
            <Text style={styles.titleText}>
              Pricing<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <SegmentedButtons
              value={listingFormData.pricing_type}
              onValueChange={(value) => {
                setListingFormData({
                  ...listingFormData,
                  pricing_type: value,
                });
              }}
              buttons={[
                {
                  value: "price",
                  label: "Price",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.pricing_type === "price"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
                {
                  value: "range",
                  label: "Price Range",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.pricing_type === "range"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
                {
                  value: "disabled",
                  label: "Disabled",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.pricing_type === "disabled"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
              ]}
            />

            {/* Select price type */}
            <Text style={styles.titleText}>
              Price Type<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <SegmentedButtons
              value={listingFormData.price_type}
              onValueChange={(value) => {
                setListingFormData({
                  ...listingFormData,
                  price_type: value,
                });
              }}
              buttons={[
                {
                  value: "fixed",
                  label: "Fixed",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.price_type === "fixed"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
                {
                  value: "negotiable",
                  label: "Negotiable",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.price_type === "negotiable"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
                {
                  value: "on_call",
                  label: "On Call",
                  checkedColor: COLORS.white,
                  style: {
                    backgroundColor:
                      listingFormData.price_type === "on_call"
                        ? COLORS.primary
                        : COLORS.white,
                  },
                },
              ]}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Price unit */}
              <View style={{ width: (screenWidth - 24) / 2 }}>
                <Text style={styles.titleText}>
                  Price Unit<Text style={{ color: COLORS.redGoogle }}> *</Text>
                </Text>
                <Picker
                  selectedValue={listingFormData.price_units}
                  onValueChange={(itemValue, itemIndex) =>
                    setListingFormData({
                      ...listingFormData,
                      price_units: itemValue,
                    })
                  }
                >
                  {formData?.config?.price_units.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={{ width: (screenWidth - 24) / 2 }}>
                <Text style={styles.titleText}>
                  Price ({formData?.config?.currency})
                  <Text style={{ color: COLORS.redGoogle }}> *</Text>
                </Text>
                <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  value={listingFormData.price}
                  onChangeText={(value) => {
                    setListingFormData({
                      ...listingFormData,
                      price: value,
                    });
                  }}
                  activeOutlineColor={COLORS.primary}
                  contentStyle={{ backgroundColor: COLORS.white, margin: 2 }}
                />
              </View>

              {/* Amenities section */}
              <Text style={styles.titleText}>
                Amenities<Text style={{ color: COLORS.redGoogle }}> *</Text>
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {formData?.custom_fields[
                  formData.custom_fields.findIndex(
                    (val) => val.label === "Amenities"
                  )
                ].options.choices.map((item, index) => (
                  <Checkbox.Item
                    key={item.id}
                    mode="android"
                    label={item.name}
                    status={
                      selectedAmenities.find((element) => {
                        return element === item.id;
                      })
                        ? "checked"
                        : "unchecked"
                    }
                    color={COLORS.primary}
                    onPress={() => {
                      if (
                        !selectedAmenities.find((element) => {
                          return element === item.id;
                        })
                      ) {
                        setSelectedAmenities((prev) => {
                          return [...prev, item.id];
                        });
                      } else {
                        setSelectedAmenities(() => {
                          const newData = selectedAmenities.filter(
                            (item1) => item1 != item.id
                          );
                          return newData;
                        });
                      }
                    }}
                    style={{ width: (screenWidth - 24) / 2 }}
                  />
                ))}
              </View>
            </View>

            {/* Select parking */}
            <Text style={styles.titleText}>
              Parking<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              {formData?.custom_fields[
                formData.custom_fields.findIndex(
                  (val) => val.label === "Parking"
                )
              ].options.choices.map((item) => (
                <RadioButton.Item
                  key={item.id}
                  mode="android"
                  label={item.name}
                  value={item.id}
                  status={parking === item.id ? "checked" : "unchecked"}
                  color={COLORS.primary}
                  onPress={() => setParking(item.id)}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {/* Select bedroom */}
              <View style={{ width: (screenWidth - 24) / 2 }}>
                <Text style={styles.titleText}>
                  Bedroom<Text style={{ color: COLORS.redGoogle }}> *</Text>
                </Text>
                <Picker
                  selectedValue={numberOfBedroom}
                  onValueChange={(itemValue, itemIndex) =>
                    setNumberOfBedroom(itemValue)
                  }
                >
                  {formData?.custom_fields[
                    formData.custom_fields.findIndex(
                      (val) => val.label === "Bedroom"
                    )
                  ].options.choices.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>

              {/* Select bath */}
              <View style={{ width: (screenWidth - 24) / 2 }}>
                <Text style={styles.titleText}>
                  Bath<Text style={{ color: COLORS.redGoogle }}> *</Text>
                </Text>
                <Picker
                  selectedValue={numberOfBath}
                  onValueChange={(itemValue, itemIndex) =>
                    setNumberOfBath(itemValue)
                  }
                >
                  {formData?.custom_fields[
                    formData.custom_fields.findIndex(
                      (val) => val.label === "Bath"
                    )
                  ].options.choices.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Sqft input */}
            <Text style={styles.titleText}>
              Sqft<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Area"
              keyboardType="numeric"
              value={listingFormData.sqft}
              onChangeText={(value) => {
                setListingFormData({
                  ...listingFormData,
                  sqft: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{ backgroundColor: COLORS.white, margin: 2 }}
              disabled={true}
            />

            {/* Location input */}
            <Text style={styles.titleText}>Location</Text>
            <TextInput
              mode="outlined"
              placeholder="Location"
              activeOutlineColor={COLORS.primary}
              contentStyle={{ backgroundColor: COLORS.white, margin: 2 }}
              disabled={true}
            />

            {/* Build year input */}
            <Text style={styles.titleText}>Build Year</Text>
            <TextInput
              mode="outlined"
              activeOutlineColor={COLORS.primary}
              value={listingFormData.buildYear}
              onChangeText={(value) => {
                setListingFormData({
                  ...listingFormData,
                  buildYear: value,
                });
              }}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
            />

            {/* Video URL input */}
            <Text style={styles.titleText}>Video URL</Text>
            <TextInput
              mode="outlined"
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <Text>E.g. https://www.youtube.com/watch?v=RiXdDGk_XCU</Text>

            {/* Description input */}
            <Text style={styles.titleText}>Description</Text>
            <TextInput
              mode="outlined"
              placeholder="Description"
              multiline={true}
              numberOfLines={10}
              value={listingFormData.description}
              onChangeText={(value) => {
                setListingFormData({
                  ...listingFormData,
                  description: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />

            {/* Near places section */}
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 8 }}
            >
              <Image source={require("../assets/yelp.png")} />
              <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16 }}>
                Yelp Nearby Places
              </Text>
            </View>
            <Text style={styles.titleText}>Select Categories</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {nearbyPlaces.map((item, index) => (
                <Checkbox.Item
                  key={index}
                  label={item}
                  mode="android"
                  style={{ width: (screenWidth - 16) / 2 }}
                  disabled={true}
                />
              ))}
            </View>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 8 }}
            >
              <Image source={require("../assets/contact.png")} />
              <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16 }}>
                Contact Details
              </Text>
            </View>
            <Text style={styles.titleText}>
              Name<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Name"
              value={contact.name}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  name: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
            />
            <Text style={styles.titleText}>
              Phone<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Phone"
              keyboardType="numeric"
              value={contact.phone}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  phone: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
            />
            <Text style={styles.titleText}>Whatsapp</Text>
            <TextInput
              mode="outlined"
              placeholder="Whatsapp"
              keyboardType="numeric"
              value={contact.whatsapp_number}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  whatsapp_number: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <Text>Whatsapp number with your country code. Eg.+1xxxxxxxxxx</Text>
            <Text style={styles.titleText}>
              Email<Text style={{ color: COLORS.redGoogle }}> *</Text>
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Email"
              keyboardType="email-address"
              value={contact.email}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  email: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
            />
            <Text style={styles.titleText}>Website</Text>
            <TextInput
              mode="outlined"
              placeholder="Website"
              value={contact.website}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  website: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <Text style={styles.titleText}>Zip Code</Text>
            <TextInput
              mode="outlined"
              placeholder="Zip Code"
              value={contact.zipcode}
              onChangeText={(value) => {
                setContact({ ...contact, zipcode: value });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <Text style={styles.titleText}>Address</Text>
            <TextInput
              mode="outlined"
              placeholder="Address"
              value={contact.address}
              onChangeText={(value) => {
                setContact({
                  ...contact,
                  address: value,
                });
              }}
              activeOutlineColor={COLORS.primary}
              contentStyle={{
                backgroundColor: COLORS.white,
                margin: 2,
              }}
              disabled={true}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: screenWidth - 16,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              <Checkbox.Android
                status={readTNC ? "checked" : "unchecked"}
                onPress={() => setReadTNC(!readTNC)}
                color={COLORS.primary}
              />
              <Text style={{ flex: 1, flexWrap: "wrap" }}>
                I have read and agree to the website
                <Text style={{ color: COLORS.orange }}>
                  {" "}
                  Terms and Conditions
                </Text>
              </Text>
            </View>
            <Divider />
            <Button
              mode="outlined"
              textColor={COLORS.white}
              buttonColor={COLORS.primary}
              style={{ marginTop: 8, marginBottom: 8 }}
              disabled={disableSubmitBtn}
              onPress={() => {
                handleListingFormSubmit();
              }}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: COLORS.text_gray,
    fontWeight: "bold",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 8,
  },
  categoriesBtn: {
    margin: 4,
  },
  btn: {
    margin: 8,
  },
  titleText: {
    marginTop: 8,
    marginBottom: 8,
    color: COLORS.text_gray,
    fontWeight: "bold",
  },
});
