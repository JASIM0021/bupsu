import {
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { useGetProfileInfoQuery } from '../../features/api/user/userApiSlice';
import Loader from '../../Components/Loader/Loader';

const Profile = () => {
  const theme = useTheme();
  const { data, isLoading, isError, refetch } = useGetProfileInfoQuery();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    contactNumber: '',
    name: '',
    profilePhoto: null,
    age: null,
    sex: null,
    pinCode: null,
    bloodGroup: null,
    address: null,
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
      email: data?.data?.profileInfo?.email || '',
      contactNumber: data?.data?.profileInfo?.contactNumber || '',
      name: data?.data?.profileInfo?.name || '',
      profilePhoto: data?.data?.profileInfo?.profilePhoto || null,
      age: data?.data?.profileInfo?.age || null,
      sex: data?.data?.profileInfo?.sex || null,
      pinCode: data?.data?.profileInfo?.pinCode || null,
      bloodGroup: data?.data?.profileInfo?.bloodGroup || null,
      address: data?.data?.profileInfo?.address || null,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    // Save the updated profile data logic here
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading || isError} />
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
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={profileData.name}
                onChangeText={text =>
                  setProfileData({ ...profileData, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={profileData.email}
                onChangeText={text =>
                  setProfileData({ ...profileData, email: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={profileData.contactNumber}
                onChangeText={text =>
                  setProfileData({ ...profileData, contactNumber: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={profileData.age}
                onChangeText={text =>
                  setProfileData({ ...profileData, age: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={profileData.address}
                onChangeText={text =>
                  setProfileData({ ...profileData, address: text })
                }
              />
              <Vstack style={{ width: '100%' }} gap={10}>
                <Button
                  style={{ width: '100%' }}
                  mode="contained"
                  onPress={handleSave}
                >
                  Save
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
