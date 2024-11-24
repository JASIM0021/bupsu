import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme, Button, RadioButton, Text, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../Components/header/Header';
import SwipeButton from 'rn-swipe-button';
import ConfirmationModal from '../../Components/Modal/ConfirmationModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useNavigationHelper from '../helper/NavigationHelper';
import { useSelector } from 'react-redux';
import {
  useCreateAppointmentMutation,
  useCreateDirectAppointmentMutation,
} from '../../features/api/appontment/appointment.api';
import { SCREEN_NAME } from '../../Constant';
import Loader from '../../Components/Loader/Loader';

const PaymentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigationHelper();
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [modalVisible, setModalVisible] = useState(false);
  const confirmInputRef = useRef(null);

  const prescription = useRoute()?.params?.data;
  const [createAppionment, { data, isLoading, isError, isSuccess, error }] =
    useCreateAppointmentMutation();

  const [
    createDirectAppiontment,
    {
      data: dData,
      isLoading: dIsLoading,
      isError: dIserror,
      isSuccess: dIsSuccess,
      error: derror,
    },
  ] = useCreateDirectAppointmentMutation();

  const { patientDetails, selectedTest } = useSelector(
    state => state?.globalReducer,
  );

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

  console.log('prescription', prescription); // prescription file:///data/user/0/com.health.BUPSE/cache/ImagePicker/61032f5c-38af-4470-8771-222e578ced25.png

  const handleOrderComplete = () => {
    console.log(' patientDetails, selectedTest ', patientDetails, selectedTest);

    setModalVisible(false);

    let formData = new FormData();
    // Convert data to JSON string and append to formData
    formData.append('file', {
      uri: prescription,
      name: 'prescription.png',
      type: 'image/png', // Adjust the type based on your file type
    });
    // Add prescription to formData if it's a direct appointment

    if (selectedTest?.organization) {
      let data = {
        organization: selectedTest?.organization,
        paymentStatus: 'PAID',
        paymentType: 'CASH',
        review: 'Excellent service.',
        patientInfo: { ...patientDetails },
        medicalTestLists: [
          {
            testCode: selectedTest?.testCode,
            testName: selectedTest?.testName,
            sample: selectedTest?.sample,
            mrp: selectedTest?.mrp,
            organizationName: selectedTest?.organizationName,
            organizationCode: selectedTest?.organizationCode,
            appointmentTiming: selectedTest?.organizationTiming[0],
          }, // Use the modified selectedTest without _id
        ],
      };

      formData.append('data', JSON.stringify(data));
      createAppionment(formData);
    } else {
      let data = {
        paymentStatus: 'PAID',
        paymentType: 'CASH',
        review: 'Excellent service.',
        patientInfo: { ...patientDetails },
      };

      formData.append('data', JSON.stringify(data));

      createDirectAppiontment(formData);
    }

    // navigation.push({
    //   screen: 'OrderSuccess',
    // });
    // Alert.alert('Success', 'Your order has been placed successfully!');
    // Navigate to order confirmation or home screen
    // navigation.navigate('OrderConfirmation');
  };

  const handlePaymentMethodChange = value => {
    setPaymentMethod(value);
  };

  useEffect(() => {
    if (isSuccess || dIsSuccess) {
      Alert.alert('Success', 'Order placed successfully');
      navigation.push({
        screen: SCREEN_NAME.OrderSuccess,
      });
    }

    if (isError || dIserror) {
      // handle error
      // Alert.alert('Error', 'Server Error');
      console.log('error', error, derror);
    }
  }, [isSuccess, isError, isLoading, dIsLoading, dIsSuccess]);

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading || dIserror || dIsLoading} />
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
