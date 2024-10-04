import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme, Button, RadioButton, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Header from '../../Components/header/Header';
import SwipeButton from 'rn-swipe-button';
import ConfirmationModal from '../../Components/Modal/ConfirmationModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useNavigationHelper from '../helper/NavigationHelper';

const PaymentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigationHelper();
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [modalVisible, setModalVisible] = useState(false);
  const confirmInputRef = useRef(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    paymentCard: {
      marginBottom: 16,
      elevation: 4,
      borderRadius: 8,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    paymentText: {
      marginLeft: 8,
      flex: 1,
    },
    recommendedTag: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.surface,
      padding: 4,
      borderRadius: 4,
      fontSize: 12,
    },
    swipeButtonContainer: {
      marginTop: 24,
      // borderRadius: 8,
      overflow: 'hidden',
    },
  });

  const handleConfirmOrder = () => {
    if (paymentMethod === 'cashOnDelivery') {
      setModalVisible(true);
    } else {
      // Handle other payment methods
      Alert.alert('Payment', 'Proceeding with selected payment method');
    }
  };

  const handleOrderComplete = () => {
    setModalVisible(false);
    navigation.push({
      screen: 'OrderSuccess',
    });
    // Alert.alert('Success', 'Your order has been placed successfully!');
    // Navigate to order confirmation or home screen
    // navigation.navigate('OrderConfirmation');
  };

  const handlePaymentMethodChange = value => {
    setPaymentMethod(value);
  };

  return (
    <View style={styles.container}>
      <Header isBack={true} title="Payment" />
      <ScrollView contentContainerStyle={styles.content}>
        <RadioButton.Group
          onValueChange={handlePaymentMethodChange}
          value={paymentMethod}
        >
          <TouchableOpacity
            onPress={() => handlePaymentMethodChange('cashOnDelivery')}
          >
            <Card style={styles.paymentCard}>
              <View style={styles.paymentOption}>
                <RadioButton value="cashOnDelivery" />
                <Icon name="cash" size={24} color={theme.colors.primary} />
                <Text style={styles.paymentText}>Cash on Delivery</Text>
                <Text style={styles.recommendedTag}>Recommended</Text>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePaymentMethodChange('onlinePay')}
          >
            <Card style={styles.paymentCard}>
              <View style={styles.paymentOption}>
                <RadioButton value="onlinePay" />
                <Icon
                  name="credit-card"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.paymentText}>Online Payment</Text>
              </View>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePaymentMethodChange('debitCard')}
          >
            <Card style={styles.paymentCard}>
              <View style={styles.paymentOption}>
                <RadioButton value="debitCard" />
                <Icon name="card" size={24} color={theme.colors.primary} />
                <Text style={styles.paymentText}>Debit Card</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </RadioButton.Group>

        {paymentMethod === 'cashOnDelivery' && (
          <View style={styles.swipeButtonContainer}>
            <SwipeButton
              title="Swipe to Confirm"
              onSwipeSuccess={handleOrderComplete}
              railBackgroundColor="#e74c3c"
              railFillBackgroundColor="#2ecc71"
              thumbIconBackgroundColor={theme.colors.background}
              thumbIconBorderColor="#2ecc71"
              railBorderColor="#e74c3c"
              titleColor={theme.colors.background}
              titleFontSize={16}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
