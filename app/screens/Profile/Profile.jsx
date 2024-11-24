import {
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar, Divider, useTheme, Button } from 'react-native-paper';
import Header from '../../Components/header/Header';
import Hstack from '../../Components/Hstack/Hstack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import Vstack from '../../Components/Vstack/Vstack';
import { responsiveHeight, responsiveWidth } from '../../themes';
import CustomText from '../../Components/Text';
import useNavigationHelper from '../helper/NavigationHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import GolbalStyle from '../../Style';
import AsyncStorage from '../../helper/AsyncStorage';
import { SCREEN_NAME } from '../../Constant';
import {
  useGetProfileInfoQuery,
  useUpdatePatientProfileMutation,
} from '../../features/api/user/userApiSlice';
import Loader from '../../Components/Loader/Loader';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown for sex and blood group
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

const Profile = () => {
  const theme = useTheme();
  const { data, isLoading, isError, error, refetch } = useGetProfileInfoQuery();

  const [
    updateProfile,
    { isLoading: updateLoading, isError: isupdateError, error: updateError },
  ] = useUpdatePatientProfileMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    contactNumber: '',
    name: '',
    profilePhoto: '',
    age: '',
    sex: '',
    pinCode: '',
    bloodGroup: '',
    address: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    box: {
      backgroundColor: theme.colors.primary,
      height: responsiveHeight + 300,
      paddingHorizontal: responsiveWidth / 2,
      paddingTop: StatusBar.currentHeight + 60,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    dropdown: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
  });

  const navigation = useNavigationHelper();
  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          AsyncStorage.clearAll();
          navigation.push({
            screen: SCREEN_NAME.Login,
          });
        },
      },
    ]);
  };

  const handleEditPress = () => {
    setProfileData({
      ...profileData,
      email: data?.data?.profileInfo?.email || '',
      contactNumber: data?.data?.profileInfo?.contactNumber || '',
      name: data?.data?.profileInfo?.name || '',
      // profilePhoto: data?.data?.profileInfo?.profilePhoto || null,
      age: data?.data?.profileInfo?.age || '',
      sex: data?.data?.profileInfo?.sex || '',
      pinCode: data?.data?.profileInfo?.pinCode || '',
      bloodGroup: data?.data?.profileInfo?.bloodGroup || '',
      address: data?.data?.profileInfo?.address || '',
    });
    setModalVisible(true);
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, profilePhoto: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    // Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number

    if (
      !profileData.name ||
      !profileData.email ||
      !profileData.contactNumber ||
      !profileData.age ||
      !profileData.address ||
      !profileData.sex ||
      !profileData.bloodGroup
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (!emailPattern.test(profileData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!phonePattern.test(profileData.contactNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }

    if (isNaN(profileData.age) || profileData.age <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid age.');
      return;
    }

    console.log('data?.data?.profileInfo?', data?.data?.profileInfo?._id);

    //  Save the updated profile data logic here
    // Assuming you have a function to update the profile
    console.log('formData', profileData); // Changed from data to profileData

    //  Save the updated profile data logic here
    // Assuming you have a function to update the profile
    let formData = new FormData();
    formData.append('data', JSON.stringify(profileData));

    // console.log('data?.data?.profileInfo?._id', data?.data);
    const newdata = { formData, id: data?.data?.profileInfo?._id };
    updateProfile(newdata)
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Profile updated successfully!');
        refetch();
        setModalVisible(false);
      })
      .catch(error => {
        console.log('error', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      });

    setModalVisible(false);
  };

  console.log('error', error);

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading || updateLoading} />
      <SafeAreaView edges={['bottom']}>
        <Vstack style={[GolbalStyle.box, styles.box]}>
          <Hstack
            justifyContent="space-between"
            style={{ width: Dimensions.get('screen').width - 40 }}
          >
            <CustomText text="My Profile" bold="bold" color="white" />
            <Hstack gap={20}>
              <Pressable
                style={{
                  backgroundColor: theme.colors.background,
                  padding: 5,
                  borderRadius: 20,
                }}
                onPress={handleLogout}
              >
                <AntDesign name="poweroff" size={20} color={''} />
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: theme.colors.background,
                  padding: 5,
                  borderRadius: 20,
                }}
                onPress={handleEditPress}
              >
                <AntDesign name="edit" size={20} color={''} />
              </Pressable>
            </Hstack>
          </Hstack>

          <Vstack
            justifyContent="center"
            alignItems="center"
            style={{ width: '100%' }}
            gap={10}
          >
            <Avatar.Text
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              size={responsiveHeight + 40}
              label={
                data?.data?.profileInfo?.name
                  ? data?.data?.profileInfo?.name.substring(0, 2).toUpperCase()
                  : 'NA'
              }
            />
            <CustomText
              text={
                data?.data?.profileInfo?.name
                  ? `${data?.data?.profileInfo?.name} (${data?.data?.profileInfo?.age})`
                  : 'Update your name'
              }
              color="white"
            />
          </Vstack>

          <Vstack
            style={{
              width: '100%',
              marginTop: responsiveHeight,
              borderRadius: responsiveHeight / 4,
              padding: responsiveHeight / 4,
              backgroundColor: theme.colors.background,
            }}
          >
            <AccountItems
              title={
                data?.data?.profileInfo?.name
                  ? data?.data?.profileInfo?.name
                  : 'Edit Profile Name'
              }
              icon={'account'}
            />
            <AccountItems
              title={
                data?.data?.profileInfo?.contactNumber
                  ? data?.data?.profileInfo?.contactNumber
                  : 'Update Number'
              }
              icon={'phone'}
            />

            <AccountItems title={'E appointment'} icon={'view-list-outline'} />

            <AccountItems
              title={'View Prescription'}
              icon={'sticker-plus-outline'}
            />
          </Vstack>
        </Vstack>

        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Entypo name="circle-with-cross" size={30} color={'red'} />
            </Pressable>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={profileData.name}
                onChangeText={text =>
                  setProfileData({ ...profileData, name: text })
                }
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInput.focus()}
              />
              <TextInput
                ref={input => (emailInput = input)}
                style={styles.input}
                placeholder="Email"
                value={profileData.email}
                onChangeText={text =>
                  setProfileData({ ...profileData, email: text })
                }
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => contactInput.focus()}
              />
              <TextInput
                ref={input => (contactInput = input)}
                style={styles.input}
                placeholder="Contact Number"
                value={profileData.contactNumber}
                onChangeText={text =>
                  setProfileData({ ...profileData, contactNumber: text })
                }
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => ageInput.focus()}
              />
              <TextInput
                ref={input => (ageInput = input)}
                style={styles.input}
                placeholder="Age"
                value={profileData.age}
                onChangeText={text =>
                  setProfileData({ ...profileData, age: Number(text) })
                }
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => addressInput.focus()}
              />
              <TextInput
                ref={input => (addressInput = input)}
                style={styles.input}
                placeholder="Address"
                value={profileData.address}
                onChangeText={text =>
                  setProfileData({ ...profileData, address: text })
                }
                returnKeyType="next"
                onSubmitEditing={() => addressInput.focus()}
              />
              {/* <Pressable onPress={handleImagePicker}>
                <Text style={styles.input}>Upload Profile Photo</Text>
              </Pressable> */}
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Select Sex', value: '' },
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                  { label: 'Other', value: 'OTHER' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Sex"
                value={profileData.sex}
                onChange={item => {
                  setProfileData({ ...profileData, sex: item.value });
                }}
              />
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Select Blood Group', value: '' },
                  { label: 'A+', value: 'A+' },
                  { label: 'A-', value: 'A-' },
                  { label: 'B+', value: 'B+' },
                  { label: 'B-', value: 'B-' },
                  { label: 'AB+', value: 'AB+' },
                  { label: 'AB-', value: 'AB-' },
                  { label: 'O+', value: 'O+' },
                  { label: 'O-', value: 'O-' },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Blood Group"
                value={profileData.bloodGroup}
                onChange={item => {
                  setProfileData({ ...profileData, bloodGroup: item.value });
                }}
              />
              <Vstack style={{ width: '100%' }} gap={10}>
                <Button
                  style={{ width: '100%' }}
                  mode="contained"
                  onPress={handleSave}
                >
                  Save Changes
                </Button>
              </Vstack>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default Profile;

const AccountItems = ({ title, icon }) => {
  return (
    <Vstack style={{ width: '100%', height: 'auto', padding: 20 }} gap={10}>
      <Hstack
        justifyContent="space-between"
        style={{ width: '100%', alignSelf: 'center' }}
      >
        <Hstack gap={20}>
          <MaterialCommunityIcons name={icon} size={22} />
          <CustomText text={title} />
        </Hstack>

        <AntDesign name="arrowright" size={22} />
      </Hstack>
      <Divider
        style={{
          width: '100%',
          backgroundColor: 'black',
          height: 0.5,
        }}
      />
    </Vstack>
  );
};
