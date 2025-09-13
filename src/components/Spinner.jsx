import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import { COLOR, FONTS } from '../constants/Theme'

const Spinner = () => {
  return (
    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <LottieView
      style={{width:150, height:150}}
      source={require("../../assets/spinner.json")}
      autoPlay
      loop
      />
      <Text style={{fontFamily:FONTS.medium, color:COLOR.grey}}>Loading, Please wait ...</Text>
    </View>
  )
}

export default Spinner