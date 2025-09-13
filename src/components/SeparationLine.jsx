import { View, StyleSheet } from 'react-native'
import React from 'react'
import { COLOR } from '../constants/Theme'

const SeparationLine = () => {
  return (
    <View style={styles.line}>
    </View>
  )
}
const styles = StyleSheet.create({
  line:{
    width:"100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.stroke,
    marginBottom:10
  }
})
export default SeparationLine