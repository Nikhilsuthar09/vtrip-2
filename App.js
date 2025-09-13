import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  Inter_700Bold,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { IBMPlexSans_700Bold } from "@expo-google-fonts/ibm-plex-sans/700Bold";

import { useFonts } from "expo-font";

export default function App() {
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_300Light,
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
    IBMPlexSans_700Bold,
  });
  return (
    <View style={styles.container}>
      <Text style={{fontFamily:"Inter_700Bold", color:"#6750A4"}}>My app</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
