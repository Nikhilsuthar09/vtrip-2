import { useFonts } from "expo-font";
import {
  Inter_700Bold,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { IBMPlexSans_700Bold } from "@expo-google-fonts/ibm-plex-sans/700Bold";
import { Montserrat_800ExtraBold } from "@expo-google-fonts/montserrat";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/Navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AirplaneLoading from "./src/components/AirplaneLoading";
import { AuthProvider } from "./src/Context/AuthContext";

export default function App() {
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_300Light,
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
    IBMPlexSans_700Bold,
    Montserrat_800ExtraBold,
  });

  if (!loaded && !error) {
    return <AirplaneLoading />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
