import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";

import { Button, List, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { COLORS } from "../variables/color";
import api from "../api/client";

export default function SelectLocation({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState([...route.params.data]);

  useEffect(() => {
    handleLoadLocationChild();
  }, []);

  function handleLoadLocationChild() {
    for (let i = 0; i < locationData.length; i++) {
      api
        .get("locations", { parent_id: locationData[i].term_id })
        .then((res) => {
          if (res.ok) {
            if (res.data.length) {
              setLocationData((prevLocationData) => {
                const newData = [...prevLocationData];
                let test = newData.filter(
                  (item) => item.term_id === res.data[0].parent
                )[0];
                test.child = res.data;
                return newData;
              });
              setIsLoading(false);
            }
          }
        })
        .catch((error) => {
          Alert.alert(error);
        });
    }
  }

  function handleSelectLocation(location) {
    if (route.params.type === "search") {
      navigation.navigate("home", { location });
    } else if (route.params.type === "adnew") {
      navigation.navigate("adnew", { location });
    } else if (route.params.type === "filter") {
      navigation.navigate("search", { location });
    }
  }

  const LocationItem = ({ item }) => {
    return (
      <>
        {item?.child ? (
          <List.Accordion title={item.name}>
            <List.Item
              title={["\t", "All"].join("")}
              key={item.term_id}
              onPress={() => {
                handleSelectLocation(item);
              }}
            />
            {item.child.map((itemChild) => (
              <List.Item
                title={["\t", itemChild.name].join("")}
                key={itemChild.term_id}
                onPress={() => {
                  handleSelectLocation(itemChild);
                }}
              />
            ))}
          </List.Accordion>
        ) : (
          <List.Item
            title={item.name}
            onPress={() => {
              handleSelectLocation(item);
            }}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          size="large"
        />
      ) : (
        <>
          {locationData?.map((item) => (
            <LocationItem item={item} key={item.term_id} />
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
