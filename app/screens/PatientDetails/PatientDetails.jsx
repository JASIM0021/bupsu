import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {
  useTheme,
  TextInput,
  Button,
  RadioButton,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../Components/header/Header';
import CustomText from '../../Components/Text';
import { responsiveHeight, responsiveWidth } from '../../themes';
import useNavigationHelper from '../helper/NavigationHelper';

const PatientDetails = () => {
  const theme = useTheme();
  const navigation = useNavigationHelper();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [service, setService] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [errors, setErrors] = useState({});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    input: {
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
    },
    sexContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    sexButton: {
      flex: 1,
      marginRight: 8,
    },
    serviceTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    serviceContainer: {
      marginBottom: 8,
    },
    serviceButton: {
      marginBottom: 8,
    },
    uploadContainer: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: 'dashed',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      height: 200,
      overflow: 'hidden',
    },
    uploadText: {
      color: theme.colors.primary,
      marginTop: 10,
    },
    prescriptionImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    uploadIconContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    continueButton: {
      marginTop: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 8,
    },
  });

  const handleUploadPrescription = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPrescription(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!mobileNumber.trim())
      newErrors.mobileNumber = 'Mobile Number is required';
    else if (!/^\d{10}$/.test(mobileNumber))
      newErrors.mobileNumber = 'Invalid Mobile Number';
    if (!age.trim()) newErrors.age = 'Age is required';
    else if (isNaN(age) || parseInt(age) <= 0) newErrors.age = 'Invalid Age';
    if (!sex) newErrors.sex = 'Sex is required';
    if (!service) newErrors.service = 'Service is required';
    if (!pinCode.trim()) newErrors.pinCode = 'PIN Code is required';
    else if (!/^\d{6}$/.test(pinCode)) newErrors.pinCode = 'Invalid PIN Code';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!prescription) newErrors.prescription = 'Prescription is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted');
      navigation.push({
        screen: 'Payment',
        data: {},
      });
      // Navigate to the next screen or process the booking
    }
  };

  const availableServices = [
    { label: 'Blood Test', value: 'Blood Test' },
    { label: 'X-Ray', value: 'X-Ray' },
    { label: 'MRI', value: 'MRI' },
    { label: 'CT Scan', value: 'CT Scan' },
  ];

  return (
    <View style={styles.container}>
      <Header isBack={true} title="Patient Details" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
          error={!!errors.fullName}
        />
        {errors.fullName && (
          <HelperText type="error">{errors.fullName}</HelperText>
        )}

        <TextInput
          label="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!errors.mobileNumber}
        />
        {errors.mobileNumber && (
          <HelperText type="error">{errors.mobileNumber}</HelperText>
        )}

        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          error={!!errors.age}
        />
        {errors.age && <HelperText type="error">{errors.age}</HelperText>}

        <View style={styles.sexContainer}>
          <Button
            mode={sex === 'Male' ? 'contained' : 'outlined'}
            onPress={() => setSex('Male')}
            style={styles.sexButton}
          >
            Male
          </Button>
          <Button
            mode={sex === 'Female' ? 'contained' : 'outlined'}
            onPress={() => setSex('Female')}
            style={styles.sexButton}
          >
            Female
          </Button>
          <Button
            mode={sex === 'Other' ? 'contained' : 'outlined'}
            onPress={() => setSex('Other')}
            style={styles.sexButton}
          >
            Other
          </Button>
        </View>
        {errors.sex && <HelperText type="error">{errors.sex}</HelperText>}

        <View style={styles.serviceContainer}>
          <Dropdown
            style={[
              styles.dropdown,
              errors.service && { borderColor: theme.colors.error },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={availableServices}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a service"
            searchPlaceholder="Search..."
            value={service}
            onChange={item => {
              setService(item.value);
            }}
          />
          {errors.service && (
            <HelperText type="error">{errors.service}</HelperText>
          )}
        </View>

        <TextInput
          label="PIN Code"
          value={pinCode}
          onChangeText={setPinCode}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          error={!!errors.pinCode}
        />
        {errors.pinCode && (
          <HelperText type="error">{errors.pinCode}</HelperText>
        )}

        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          error={!!errors.address}
        />
        {errors.address && (
          <HelperText type="error">{errors.address}</HelperText>
        )}

        <TouchableOpacity
          onPress={handleUploadPrescription}
          style={styles.uploadContainer}
        >
          {prescription ? (
            <View style={{ width: '100%', height: '100%' }}>
              <Image
                source={{ uri: prescription }}
                style={styles.prescriptionImage}
              />
              <View style={styles.uploadIconContainer}>
                <MaterialCommunityIcons
                  name="file-upload"
                  size={40}
                  color={theme.colors.primary}
                />
                <CustomText style={styles.uploadText}>
                  Change Prescription
                </CustomText>
              </View>
            </View>
          ) : (
            <>
              <MaterialCommunityIcons
                name="file-upload"
                size={40}
                color={theme.colors.primary}
              />
              <CustomText style={styles.uploadText}>
                Upload Prescription
              </CustomText>
            </>
          )}
        </TouchableOpacity>
        {errors.prescription && (
          <HelperText type="error">{errors.prescription}</HelperText>
        )}
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
        >
          Continue
        </Button>
      </ScrollView>
    </View>
  );
};

export default PatientDetails;
