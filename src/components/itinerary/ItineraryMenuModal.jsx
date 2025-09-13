import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLOR, FONT_SIZE, FONTS } from '../../constants/Theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ItineraryMenuModal = ({ 
  visible, 
  onClose, 
  onEdit, 
  onDelete, 
  selectedItem,
  buttonPosition 
}) => {
  const handleEdit = () => {
    onEdit(selectedItem);
    onClose();
  };

  const handleDelete = () => {
    onDelete(selectedItem);
    onClose();
  };

  // Calculate modal position based on button position
  const getModalStyle = () => {
    if (!buttonPosition) return styles.modalContent;
    
    const modalWidth = 160;
    const modalHeight = 120;
    
    // Position modal near the button but ensure it stays within screen bounds
    let left = buttonPosition.x - modalWidth + 20;
    let top = buttonPosition.y + 30;
    
    // Adjust if modal goes off screen
    if (left < 20) left = 20;
    if (left + modalWidth > screenWidth - 20) left = screenWidth - modalWidth - 20;
    if (top + modalHeight > screenHeight - 100) top = buttonPosition.y - modalHeight - 10;
    
    return {
      ...styles.modalContent,
      position: 'absolute',
      left,
      top,
    };
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={getModalStyle()}>
              {/* Edit Option */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEdit}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <Feather 
                    name="edit-2" 
                    size={18} 
                    color={COLOR.textPrimary} 
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Edit</Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Delete Option */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons 
                    name="trash-outline" 
                    size={18} 
                    color={COLOR.danger} 
                    style={styles.menuIcon}
                  />
                  <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: COLOR.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
    width: 18,
  },
  menuText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  deleteText: {
    color: COLOR.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.stroke,
    marginHorizontal: 16,
  },
});

export default ItineraryMenuModal;