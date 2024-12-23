import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../../Components/header/Header';
import CustomText from '../../Components/Text';
import Search from '../../Components/Search/Search';
import { SCREEN_NAME } from '../../Constant';
import ImageConstant from '../../Constant/ImageConstant';
import { responsiveHeight, responsiveWidth, screenWidth } from '../../themes';
import useNavigationHelper from '../helper/NavigationHelper';
import { useGetTestbyQueryQuery } from '../../features/api/service/medecalService';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Components/Loader/Loader';
import { saveSelectedTest } from '../../features/slice/GlobalSlice';

const { width } = Dimensions.get('window');

const BloodGroupTest = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const carouselRef = useRef(null);
  const navigation = useNavigationHelper();
  const { location } = useSelector(state => state.globalReducer);
  const [queryParams, setQueryParam] = useState([
    {
      name: 'coverAddress',
      value: location?.name,
    },
    {
      name: 'searchTerm',
      value: search,
    },
  ]);

  const {
    data: testData,
    isLoading,
    refetch,
  } = useGetTestbyQueryQuery({ queryParams });

  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    carouselContainer: {
      height: responsiveHeight * 1,
      marginBottom: 20,
    },
    carouselItem: {
      width: '100%',
      height: '100%',
      borderRadius: 15,
      overflow: 'hidden',
    },
    carouselImage: {
      width: '100%',
      height: '100%',
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 16,
      color: theme.colors.primary,
    },
    testItem: {
      flex: 1,
      margin: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 0.5,
    },
    testImage: {
      width: '100%',
      height: responsiveWidth * 1.5,
    },
    testInfo: {
      padding: 12,
    },
    testName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    testDescription: {
      fontSize: 12,
      color: theme.colors.text,
      marginTop: 4,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    discountedPrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    originalPrice: {
      fontSize: 12,
      color: theme.colors.secondary,
      textDecorationLine: 'line-through',
      marginLeft: 8,
    },
    bookButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    bookButtonText: {
      color: theme.colors.background,
      fontWeight: 'bold',
      fontSize: 12,
    },
  });

  const images = [
    'https://via.placeholder.com/600x300.png?text=Image+1',
    'https://via.placeholder.com/600x300.png?text=Image+2',
    'https://via.placeholder.com/600x300.png?text=Image+3',
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={ImageConstant.demo_img} style={styles.carouselImage} />
    </View>
  );

  const handleBook = item => {
    dispatch(saveSelectedTest(item));
    navigation.push({
      screen: SCREEN_NAME.PatientDetails,
      data: {},
    });
  };

  const renderTestItem = ({ item }) => (
    <Pressable style={styles.testItem} onPressIn={() => handleBook(item)}>
      <Image
        source={ImageConstant.demo_img}
        style={styles.testImage}
        resizeMode="cover"
      />
      <View style={styles.testInfo}>
        <CustomText text={item?.organizationName} style={styles.testName} />
        <CustomText
          text={item?.organizationAddress}
          style={styles.testDescription}
        />
        <View style={styles.priceContainer}>
          <CustomText
            text={`₹ ${
              item?.discountedPrice ? item?.discountedPrice : item?.mrp
            }`}
            style={styles.discountedPrice}
          />
          <CustomText text={`₹ ${item?.mrp}`} style={styles.originalPrice} />
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBook(item)}
        >
          <CustomText text="Book Now" style={styles.bookButtonText} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  useEffect(() => {
    setQueryParam([
      {
        name: 'coverAddress',
        value: location?.name,
      },
      {
        name: 'searchTerm',
        value: search,
      },
    ]);
  }, [search]);

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <Header isBack={true} title="Blood Group Test" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={images}
            renderItem={renderCarouselItem}
            sliderWidth={width - 32}
            itemWidth={width - 32}
            loop={true}
            autoplay={true}
            autoplayInterval={3000}
          />
        </View>

        <Search isClick={false} setText={setSearch} />

        <CustomText text="Available Tests" style={styles.sectionTitle} />

        <FlatList
          data={testData?.data}
          renderItem={renderTestItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </ScrollView>
    </View>
  );
};

export default BloodGroupTest;
