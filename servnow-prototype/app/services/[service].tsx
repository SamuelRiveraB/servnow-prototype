import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function ServiceScreen() {
  const { service } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the {service} service page</Text>
      {/* Add more UI for the service here */}
      <Link href="/">Go back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
