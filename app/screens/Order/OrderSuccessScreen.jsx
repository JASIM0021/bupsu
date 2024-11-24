import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useNavigationHelper from '../helper/NavigationHelper';
import { useDispatch } from 'react-redux';
import { saveSelectedTest } from '../../features/slice/GlobalSlice';

const OrderSuccessScreen = () => {
  const theme = useTheme();
  const navigation = useNavigationHelper();

  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    icon: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      marginBottom: 32,
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
    },
    button: {
      marginBottom: 16,
      borderRadius: 8,
      paddingVertical: 12,
    },
    viewOrderButton: {
      backgroundColor: theme.colors.primary,
    },
    backToHomeButton: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    viewOrderButtonText: {
      color: theme.colors.surface,
    },
    backToHomeButtonText: {
      color: theme.colors.primary,
    },
  });

  const handleViewOrder = () => {
    dispatch(saveSelectedTest({}));
    navigation.push({
      screen: 'HomeTab',
      data: { index: 1 },
    });
  };

  const handleBackToHome = () => {
    dispatch(saveSelectedTest({}));
    navigation.push({
      screen: 'HomeTab',
    });
  };

  return (
    <View style={styles.container}>
      <Icon
        name="check-circle"
        size={100}
        color={theme.colors.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>🎉 Order Placed Successfully! 🎉</Text>
      <Text style={styles.message}>
        Thank you for your order! 😊 We're thrilled to have you as our customer.
        {'\n\n'}
        Our team will reach out to you shortly using the details you provided.
        📞
        {'\n\n'}
        Get ready for a great experience! 🌟
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleViewOrder}
          style={[styles.button, styles.viewOrderButton]}
          labelStyle={[styles.buttonText, styles.viewOrderButtonText]}
        >
          View Order in Order History
        </Button>
        <Button
          mode="outlined"
          onPress={handleBackToHome}
          style={[styles.button, styles.backToHomeButton]}
          labelStyle={[styles.buttonText, styles.backToHomeButtonText]}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
};

export default OrderSuccessScreen;
