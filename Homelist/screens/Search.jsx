import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import {
  Button,
  ActivityIndicator,
  Checkbox,
  RadioButton,
  TextInput,
  Divider,
} from "react-native-paper";

import Header from "../components/Header";

import { COLORS } from "../variables/color";
import CategoryIcon from "../components/CategoryIcon";
import api from "../api/client";
import { Picker } from "@react-native-picker/picker";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function Search({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [disable, setDisable] = useState(true);
  const [locations, setLocations] = useState();
  const [categories, setCategories] = useState();
  const [searchFields, setSearchFiels] = useState();
  const [filterCustoms, setFilterCustoms] = useState({});
  const [orderBySelected, setOrderBySelected] = useState("");
  const [listingTypeSelected, setListingTypeSelected] = useState([]);

  useEffect(() => {
    getLocations();
    getCategories();
    //getSearchFields();
  }, []);

  useEffect(() => {
    if (!filterCustoms.categories) return;
    setIsLoading(true);
    getSearchFields();
  }, [filterCustoms.categories]);

  useEffect(() => {
    if (route?.params?.location) {
      setFilterCustoms((prev) => {
        return {
          ...prev,
          locations: route?.params?.location.term_id,
        };
      });
    } else return;
  }, [route?.params?.location]);

  useEffect(() => {
    console.log(filterCustoms);
    if (filterCustoms !== null) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [filterCustoms]);

  const getLocations = () => {
    api.get("locations").then((res) => {
      if (res.ok) {
        setLocations(res.data);
      }
    });
  };

  const getCategories = () => {
    api.get("categories").then((res) => {
      if (res.ok) {
        setCategories(res.data);
        setIsLoading(false);
      }
    });
  };

  const getSearchFields = () => {
    api
      .get("search-fields", { category_id: filterCustoms.categories })
      .then((res) => {
        if (res.ok) {
          setSearchFiels(res.data);
          setIsLoading(false);
        }
      });
  };

  const handleSelectLocation = () => {
    navigation.navigate("Select Location", { data: locations, type: "filter" });
  };

  const handleClearFilter = () => {
    setFilterCustoms({});
    if (route?.params?.location) {
      route.params = null;
    }
  };

  const handleLoadListingData = () => {
    navigation.navigate("home", { filterCustoms });
  };

  const CategoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoriesItem,
          {
            backgroundColor:
              item.term_id === filterCustoms.categories
                ? COLORS.bg_primary
                : COLORS.white,
          },
        ]}
        onPress={() => {
          setFilterCustoms((prev) => {
            return {
              ...prev,
              categories: item.term_id,
            };
          });
        }}
      >
        <CategoryIcon
          iconName={item.icon.class}
          iconColor={COLORS.primary}
          iconSize={18}
        />
        <Text style={[styles.textGray, { marginTop: 8 }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

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
        <View style={{ flex: 1 }}>
          <ScrollView style={{ margin: 8 }}>
            {/* Select location btn */}
            <Button
              mode="outlined"
              textColor={COLORS.black}
              style={styles.locationBtn}
              onPress={() => handleSelectLocation()}
            >
              <Image source={require("../assets/pin.png")} />
              <Text>
                {route?.params?.location
                  ? route.params.location.name
                  : "Location"}
              </Text>
            </Button>

            {/* Select category section */}
            <Text style={styles.title}>All Categories</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {categories?.map((item) => (
                <CategoryItem key={item.term_id} item={item} />
              ))}
            </View>

            {/* Sort by section */}
            {searchFields && (
              <View>
                <Text style={styles.title}>Sort by</Text>
                <Picker
                  selectedValue={filterCustoms.order_by}
                  onValueChange={(itemValue, itemIndex) =>
                    setFilterCustoms((prev) => {
                      return {
                        ...prev,
                        ["order_by"]: itemValue,
                      };
                    })
                  }
                >
                  {searchFields?.order_by.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            )}

            {/* Custom field section */}
            {searchFields?.custom_fields?.map((item) => (
              <View key={item.id}>
                <Text style={styles.title}>{item.label}</Text>
                {item.type === "radio" && (
                  <RadioButton.Group
                    onValueChange={(value) =>
                      setFilterCustoms((prev) => {
                        return {
                          ...prev,
                          [item.meta_key]: value,
                        };
                      })
                    }
                    value={filterCustoms[item.meta_key]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {item.options?.choices.map((element) => (
                        <RadioButton.Item
                          key={element.id}
                          label={element.name}
                          value={element.id}
                          color={COLORS.primary}
                          style={{ width: (screenWidth - 24) / 2 }}
                        />
                      ))}
                    </View>
                  </RadioButton.Group>
                )}
                {item.type === "checkbox" && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {item.options?.choices.map((element) => (
                      <Checkbox.Item
                        key={element.id}
                        mode="android"
                        color={COLORS.primary}
                        label={element.name}
                        value={element.id}
                        style={{ width: (screenWidth - 24) / 2 }}
                        status={
                          filterCustoms[item.meta_key]?.find((ele) => {
                            return ele === element.id;
                          })
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => {
                          let newData = [];
                          if (filterCustoms[item.meta_key]) {
                            newData = filterCustoms[item.meta_key];
                            if (
                              !newData.find((ele) => {
                                return ele === element.id;
                              })
                            ) {
                              newData.push(element.id);
                            } else {
                              newData = newData.filter((ele) => {
                                return ele !== element.id;
                              });
                            }
                          } else {
                            newData.push(element.id);
                          }
                          setFilterCustoms((prev) => {
                            return {
                              ...prev,
                              [item.meta_key]: newData,
                            };
                          });
                        }}
                      />
                    ))}
                  </View>
                )}
                {item.type === "select" && (
                  <Picker
                    selectedValue={filterCustoms[item.meta_key]}
                    onValueChange={(itemValue, itemIndex) =>
                      setFilterCustoms((prev) => {
                        return {
                          ...prev,
                          [item.meta_key]: itemValue,
                        };
                      })
                    }
                  >
                    {item.options?.choices.map((element) => (
                      <Picker.Item
                        key={element.id}
                        label={element.name}
                        value={element.id}
                      />
                    ))}
                  </Picker>
                )}
                {item.type === "number" && (
                  <TextInput
                    mode="outlined"
                    placeholder={item.placeholder}
                    selectionColor={COLORS.primary}
                    activeOutlineColor={COLORS.primary}
                    keyboardType="numeric"
                    value={!filterCustoms[item.meta_key] && ""}
                    onChangeText={(value) => {
                      setFilterCustoms((prev) => {
                        return {
                          ...prev,
                          [item.meta_key]: value,
                        };
                      });
                    }}
                  />
                )}
                {item.type === "text" && (
                  <TextInput
                    mode="outlined"
                    placeholder={item.placeholder}
                    selectionColor={COLORS.primary}
                    activeOutlineColor={COLORS.primary}
                    value={!filterCustoms[item.meta_key] && ""}
                    onChangeText={(value) => {
                      setFilterCustoms((prev) => {
                        return {
                          ...prev,
                          [item.meta_key]: value,
                        };
                      });
                    }}
                  />
                )}
              </View>
            ))}

            {/* Purpose section */}
            {/* <Text style={styles.title}>Purpose</Text>
          {searchFields.listing_types.map((item) => (
            <Checkbox.Item
              key={item.id}
              label={item.name}
              mode="android"
              color={COLORS.primary}
              status={
                listingTypeSelected.find((element) => {
                  return element === item.id;
                })
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => {
                if (
                  !listingTypeSelected.find((element) => {
                    return element === item.id;
                  })
                ) {
                  setListingTypeSelected(() => {
                    return [...listingTypeSelected, item.id];
                  });
                } else {
                  setListingTypeSelected(() => {
                    return listingTypeSelected.filter(
                      (element) => element != item.id
                    );
                  });
                }
              }}
            />
          ))} */}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 8,
            }}
          >
            <Button
              mode="contained"
              buttonColor={COLORS.bg_dark}
              textColor={COLORS.primary}
              style={{ width: (screenWidth - 24) / 2 }}
              onPress={() => handleClearFilter()}
              disabled={Object.keys(filterCustoms).length === 0}
            >
              Clear All
            </Button>
            <Button
              mode="contained"
              buttonColor={COLORS.primary}
              textColor={COLORS.white}
              style={{ width: (screenWidth - 24) / 2 }}
              onPress={() => handleLoadListingData()}
              disabled={Object.keys(filterCustoms).length === 0}
            >
              Apply Filters
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
    backgroundColor: "#fff",
  },
  locationBtn: {
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  categoriesItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    margin: 4,
    height: 80,
    borderRadius: 10,
    width: (screenWidth - 46) / 3,
  },
  title: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
});
