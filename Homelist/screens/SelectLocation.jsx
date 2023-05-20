import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, ActivityIndicator } from "react-native";

import { Button, List } from "react-native-paper";

import { COLORS } from "../variables/color";
import api from "../api/client";

export default function SelectLocation({ route, navigation }) {
  //const [initial, setInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState([
    ...route.params.locationData,
  ]);
  const [childLocationData, setChildLocationData] = useState();

  useEffect(() => {
    handleLoadLocationChild();
    //setChildLocationData(locationData);
    //setIsLoading(false);
  }, [isLoading]);

  function handleLoadLocationChild() {
    for (let i = 0; i < locationData.length; i++) {
      api
        .get("locations", { parent_id: locationData[i].term_id })
        .then((res) => {
          if (res.ok) {
            if (res.data.length) {
              locationData[i].child = res.data;
            }
          }
        })
        .catch((error) => {
          Alert.alert(error);
        });
    }
    setTimeout(()=>{setIsLoading(false);}, 3000);    
  }

  const LocationItem = ({ item }) => {
    return (
      <>
        {item?.child ? (
          <List.Accordion title={item.name}>
            {item.child.map((itemChild) => (
              <List.Item title={itemChild.name} key={itemChild.term_id} />
            ))}
          </List.Accordion>
        ) : (
          <List.Item title={item.name} />
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
          {locationData.map((item) => (
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
