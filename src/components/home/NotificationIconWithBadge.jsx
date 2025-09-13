import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FONTS, COLOR } from '../../constants/Theme';

const NotificationIcon = ({ badgeCount = 0, onPress }) => {
  const animatedValue = new Animated.Value(1);

  const handlePress = () => {
    // Add subtle press animation
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress && onPress();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.notificationContainer}
      activeOpacity={0.7}
    >
      <Animated.View 
        style={[
          styles.iconWrapper,
          { transform: [{ scale: animatedValue }] }
        ]}
      >
        {/* Icon background circle */}
        <View style={styles.iconBackground}>
          <MaterialIcons 
            name="notifications-none" 
            size={22} 
            color={COLOR.textPrimary || "#334155"} 
          />
        </View>
        
        {/* Enhanced badge with gradient-like effect */}
        {badgeCount > 0 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : badgeCount.toString()}
              </Text>
            </View>
            {/* Pulse effect for new notifications */}
            <View style={styles.pulseBadge} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 50,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 10,
  },
  pulseBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    opacity: 0.3,
    transform: [{ scale: 1.2 }],
    zIndex: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default NotificationIcon;