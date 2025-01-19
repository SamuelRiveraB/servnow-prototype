import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React from "react";

interface Company {
  name: string;
  serviceId: number;
}

interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  location: { lat: number; long: number };
  company: Company;
  rating: number;
  photo: string;
}

export default function ServiceScreen() {
  const { id, serviceName } = useLocalSearchParams();
  const [technicians, setTechnicians] = useState<Technician[]>();
  const router = useRouter();

  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/technicians/service/${id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setTechnicians(result);
      } catch (err) {
        setTechnicians([
          {
            id: 1,
            firstName: "David",
            lastName: "Jones",
            photo:
              "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "ServNow",
              serviceId: 1,
            },
          },
          {
            id: 2,
            firstName: "John",
            lastName: "Doe",
            photo:
              "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1989072, long: -75.57493439594916 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
          {
            id: 3,
            firstName: "Jane",
            lastName: "Smith",
            photo:
              "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.19702045, long: -75.5591826240879 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
          {
            id: 4,
            firstName: "David",
            lastName: "Jones",
            photo:
              "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "ServNow",
              serviceId: 1,
            },
          },
          {
            id: 5,
            firstName: "John",
            lastName: "Doe",
            photo:
              "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
          {
            id: 6,
            firstName: "Jane",
            lastName: "Smith",
            photo:
              "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
          {
            id: 7,
            firstName: "David",
            lastName: "Jones",
            photo:
              "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "ServNow",
              serviceId: 1,
            },
          },
          {
            id: 8,
            firstName: "John",
            lastName: "Doe",
            photo:
              "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
          {
            id: 9,
            firstName: "Jane",
            lastName: "Smith",
            photo:
              "https://plus.unsplash.com/premium_photo-1688572454849-4348982edf7d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            location: { lat: 6.1964825999999995, long: -75.57387140463291 },
            rating: 5,
            company: {
              name: "Tech Solutions",
              serviceId: 1,
            },
          },
        ]);
        console.error("error", err);
      }
    };

    fetchServices();
  }, []);

  const showHireAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Are you sure?",
        "Do you want to hire this technician?",
        [
          {
            text: "Cancel",
            onPress: () => reject("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => resolve("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    });
  };

  const openModal = (technician: Technician) => {
    setSelectedTechnician(technician);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTechnician(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          // setCoords({ latitude: 6.262293, longitude: -75.598558 });
          latitude: 6.262293,
          longitude: -75.598558,
          latitudeDelta: 0.0112,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={{
            latitude: 6.262293,
            longitude: -75.598558,
          }}
          title="Current Location"
        />
        {technicians &&
          technicians.map((technician) => (
            <Marker
              key={technician.id}
              coordinate={{
                latitude: technician.location.lat,
                longitude: technician.location.long,
              }}
              title={technician.firstName}
              onPress={() => openModal(technician)}
            />
          ))}
      </MapView>

      {/* Modal for Technician Details */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal} />
        <View style={styles.bottomSheet}>
          {selectedTechnician && (
            <>
              <Image
                source={{ uri: selectedTechnician.photo }}
                style={styles.photo}
              />
              <Text style={styles.name}>
                {selectedTechnician.firstName} {selectedTechnician.lastName}
              </Text>
              <Text style={styles.company}>
                {selectedTechnician.company.name}
              </Text>
              <Text style={styles.rating}>
                {selectedTechnician.rating}{" "}
                <AntDesign name="star" size={16} color="#f5d442" />
              </Text>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    flex: 1,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  company: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  rating: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
