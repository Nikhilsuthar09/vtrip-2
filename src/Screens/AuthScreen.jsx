import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../Configs/firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  handleFirebaseAuthErrors,
  handleLoginValidation,
} from "../utils/AuthHandlers";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { signInGoogle } from "../utils/googleSignin";
import { useNavigation } from "@react-navigation/native";
import GoogleLoader from "../components/GoogleLoader";

export default function AuthScreen() {
  const email = useRef("");
  const password = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigation = useNavigation();

  const signin = async (email, password) => {
    Keyboard.dismiss();
    setIsLoading(true);
    // input validation
    if (!handleLoginValidation(email, password)) {
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      // Signed in
    } catch (error) {
      const errorMessage = handleFirebaseAuthErrors(error);
      console.log(errorMessage);
      setIsLoading(false);
      Alert.alert("Error ", errorMessage);
    }
  };

  const handleGoogleSignin = async () => {
    setGoogleLoading(true);
    await signInGoogle();
    setGoogleLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleForgotPassword = async () => {
    if (!email.current.trim()) {
      Alert.alert("Please enter your email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.current)) {
      Alert.alert("Please enter a valid email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.current);
      console.log("Success");
      Alert.alert(
        "Password Reset Email Sent",
        "We’ve sent you a link to reset your password. Please check your inbox (and your spam or junk folder if you don’t see it)."
      );
    } catch (e) {
      Alert.alert(
        "Error",
        "Couldn't complete your request please try again later"
      );
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.bgImage2}
        source={require("../../assets/img/ellipse1.png")}
      />
      <Image
        style={styles.bgImage1}
        source={require("../../assets/img/ellipse2.png")}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 50, height: 52 }}
              source={require("../../assets/icon.png")}
            />
            <Text
              style={{
                color: COLOR.textPrimary,
                fontFamily: FONTS.logoBold,
                fontSize: FONT_SIZE.H1,
                marginLeft: -10,
              }}
            >
              trip
            </Text>
          </View>
          <View style={styles.loginContainer}>
            <View style={styles.logintitle}>
              <Text style={styles.loginText}>Login </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.signupLinkText}>
                  {" "}
                  Don't have an account?{" "}
                </Text>
                <Pressable onPress={() => navigation.push("SignUp")}>
                  <Text
                    style={{
                      color: COLOR.primary,
                      fontFamily: FONTS.semiBold,
                      fontSize: FONT_SIZE.caption,
                    }}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.icon_input_container}>
                  <MaterialIcons
                    name="email"
                    style={styles.inputIcon}
                    size={18}
                    color={COLOR.placeholder}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor={COLOR.placeholder}
                    onChangeText={(value) => (email.current = value)}
                    autoCorrect={false}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <View style={styles.icon_input_container}>
                    <Entypo
                      name="lock-open"
                      style={styles.inputIcon}
                      size={18}
                      color={COLOR.placeholder}
                    />
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Password"
                      placeholderTextColor={COLOR.placeholder}
                      onChangeText={(value) => (password.current = value)}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                    />
                  </View>
                  <Pressable
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <AntDesign
                      name={showPassword ? "eye" : "eye-invisible"}
                      size={20}
                      color={COLOR.grey}
                    />
                  </Pressable>
                </View>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotpasswordText}>
                    Forgot Password ?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.loginbuttons}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLOR.primary} />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => signin(email.current, password.current)}
                >
                  <View style={styles.loginbuttonContainer}>
                    <Text style={styles.loginbuttontext}>Log In</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={styles.separater}>
                <View style={styles.separaterLine}></View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.separaterLine}></View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoogleSignin}
              >
                <View style={styles.googleButtonContainer}>
                  <Image
                    style={{ width: 22, height: 24 }}
                    source={require("../../assets/google.svg")}
                  />
                  <Text style={styles.googleButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <GoogleLoader visible={googleLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.53)",
    alignItems: "center",
    gap: 20,
    borderRadius: 12,
    padding: 20,
  },
  bgImage1: {
    position: "absolute",
    right: 0,
    height: "70%",
    width: "60%",
  },
  bgImage2: {
    position: "absolute",
    height: "50%",
    width: "70%",
  },
  icon_input_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    paddingLeft: 8,
  },
  logintitle: { gap: 8 },
  loginText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H1,
    textAlign: "center",
    color: COLOR.textPrimary,
  },
  signupLinkText: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  inputfieldsContainer: {
    display: "flex",
    gap: 16,
  },
  loginbuttons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  loginbuttonContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 16,
    backgroundColor: COLOR.primary,
    width: 275,
  },
  loginbuttontext: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: "#FFFFFF",
    textAlign: "center",
  },
  googleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    width: 275,
  },
  googleButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
    textAlign: "center",
  },
  input: {
    height: 46,
    width: 275,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 35,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  passwordContainer: {
    position: "relative",
    width: 275,
  },
  passwordInput: {
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 45,
    paddingLeft: 35,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 13,
    padding: 2,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    paddingVertical: 6,
  },
  forgotpasswordText: {
    marginTop: 14,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: COLOR.primary,
    textAlign: "right",
  },
  separater: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  separaterLine: {
    width: 100,
    height: 1,
    backgroundColor: COLOR.stroke,
  },
  orText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: Platform.OS === "ios" ? "flex-start" : "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
});
