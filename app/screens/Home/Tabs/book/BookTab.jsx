import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../../Components/header/Header';
import CustomText from '../../../../Components/Text';
import GolbalStyle from '../../../../Style';
import {
  responsiveHeight,
  responsiveWidth,
  screenHeight,
  screenWidth,
} from '../../../../themes';
import useNavigationHelper from '../../../helper/NavigationHelper';
import { SCREEN_NAME } from '../../../../Constant';
import ImageConstant from '../../../../Constant/ImageConstant';

const BookTab = () => {
  const navigation = useNavigationHelper();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingHorizontal: screenWidth * 0.04,
    },
    listContainer: {
      paddingVertical: screenHeight * 0.02,
    },
    itemContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: screenHeight * 0.02,
      padding: screenHeight * 0.02,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageContainer: {
      marginRight: screenWidth * 0.04,
    },
    image: {
      width: responsiveHeight,
      height: responsiveHeight,
      borderRadius: 8,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 4,
    },
    address: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.7,
    },
    iconContainer: {
      marginLeft: screenWidth * 0.02,
    },
  });

  const listData = [
    {
      id: '1',
      name: 'Matri Scan Center',
      description: 'USG whole abdomen',
      address: 'Matri scan Center, Ranisahib, Burdwan Pin- 713101',
      image: 'https://example.com/matri-scan-center.jpg',
    },
    {
      id: '2',
      name: 'Burdwan Scan Centre Pvt. Ltd',
      description: 'USG whole abdomen',
      address: 'Burdwan Scan Centre, City Center, Burdwan Pin- 713102',
      image: 'https://example.com/burdwan-scan-centre.jpg',
    },
    {
      id: '3',
      name: 'Advanced Imaging Center',
      description: 'MRI Brain Scan',
      address: 'Advanced Imaging, Medical Complex, Burdwan Pin- 713103',
      image: 'https://example.com/advanced-imaging-center.jpg',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.push({
          screen: SCREEN_NAME.ERecipt,
          data: {},
        });
      }}
    >
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <Image
            source={ImageConstant.demo_img}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <CustomText style={styles.name} text={item.name} />
          <CustomText
            style={styles.description}
            text={`Test: ${item.description}`}
          />
          <CustomText
            style={styles.address}
            text={`Address: ${item.address}`}
            numberOfLines={2}
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon name="chevron-right" size={24} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header isBack={false} title="E-Appointment" />
      <Divider />
      <FlatList
        contentContainerStyle={[styles.listContainer, styles.content]}
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default BookTab;
