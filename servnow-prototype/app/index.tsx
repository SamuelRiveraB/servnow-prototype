import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Link, RelativePathString, useRouter } from "expo-router";

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const services: { id: number; name: string; route: string }[] = [
    { id: 1, name: "Locksmith", route: "/services/locksmith" },
    { id: 2, name: "Garage Door", route: "/services/garagedoor" },
    { id: 3, name: "Plumbing", route: "/services/plumbing" },
    { id: 4, name: "Electric", route: "/services/electric" },
    { id: 5, name: "Water Damage", route: "/services/waterdmg" },
    { id: 6, name: "Locksmith", route: "/services/locksmith" },
    { id: 7, name: "Garage Door", route: "/services/garagedoor" },
    { id: 8, name: "Plumbing", route: "/services/plumbing" },
    { id: 9, name: "Electric", route: "/services/electric" },
    { id: 10, name: "Water Damage", route: "/services/waterdamage" },
  ];

  // useEffect(() => {
  //   (async () => {
  //     // Request location permission
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     // Get current location
  //     const location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);

  //     // Perform reverse geocoding
  //     fetchAddress(location.coords.latitude, location.coords.longitude);
  //   })();
  // }, []);

  const fetchAddress = async (latitude: number, longitude: number) => {
    const ADDRESS_API_KEY = process.env.ADDRESS_API_KEY;
    console.log(ADDRESS_API_KEY); // PENDING
    const url = `http://api.positionstack.com/v1/reverse?access_key=${ADDRESS_API_KEY}&query=${latitude},${longitude}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setAddress(data.data[0].label);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setErrorMsg("Failed to fetch address");
    }
  };

  const handleServicePress = (route: string) => {
    router.push(`/services/${route}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Display Address */}
      <View style={styles.addressContainer}>
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : address ? (
          <Text style={styles.address}>Your Location: {address}</Text>
        ) : (
          <Text style={styles.address}>Your Location: CurrentLocation</Text>
        )}
      </View>
      <View style={styles.chooseServiceContainer}>
        <Text style={styles.chooseService}>{`Choose your service`}</Text>
      </View>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.servicesContainer}>
        {services.map((service) => (
          <Link
            href={{
              pathname: "/services/[service]",
              params: { service: service.name },
            }}
            key={service.id}
            style={styles.serviceButton}
            onPress={() => handleServicePress(service.route)}
          >
            <Text style={styles.serviceText}>{service.name}</Text>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#aaaaaa",
  },
  addressContainer: {
    paddingVertical: 40,
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  address: {
    fontSize: 26,
    textAlign: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  chooseServiceContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  chooseService: {
    fontSize: 26,
    textAlign: "center",
  },
  servicesContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  serviceButton: {
    width: "95%",
    padding: 40,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  serviceText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
  },
});
