import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Animated,
  PanResponder,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import Header from '../../../../Components/header/Header';
import Search from '../../../../Components/Search/Search';
import ScrollViewHelper from '../../../../Components/ScrollViewHelper/ScrollViewHelper';
import CustomText from '../../../../Components/Text';
import CustomCards from '../../../../Components/Cards/CustomCards';
import { responsiveHeight, responsiveWidth } from '../../../../themes';
import GolbalStyle from '../../../../Style';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import ImageConstant from '../../../../Constant/ImageConstant';
import Swiper from 'react-native-swiper';
import BookCard from '../../../../Components/BookCard/BookCard';
import AutocompleteDistricts from '../../../../Components/AutoComplete/AutocompleteDistricts';
import ActionSheet from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import useNavigationHelper from '../../../helper/NavigationHelper';
import { SCREEN_NAME } from '../../../../Constant';
import { useGetAllAddressQuery } from '../../../../features/api/address/address.api';
import { useGetServiceResultQuery } from '../../../../features/api/service/medecalService';
import Loader from '../../../../Components/Loader/Loader';

const HomeTab = () => {
  const theme = useTheme();
  const { data, isLoading, isError, error } = useGetAllAddressQuery();
  const colorSchem = useColorScheme();
  const [selectedCategory, setSelectedCategory] = React.useState(new Set());
  const [isActionSheetVisible, setActionSheetVisible] = React.useState(false);
  const { location } = useSelector(state => state.globalReducer);
  const [queryParams, setQueryParams] = useState([
    {
      name: 'serviceCoverAreaAddress',
      value: location?.name,
    },
  ]);
  const {
    data: allservices,
    isLoading: servicesLoading,
    refetch,
  } = useGetServiceResultQuery({
    queryParams,
  });

  console.log('allservices', allservices);
  console.log('location', location);
  const actionSheetRef = useRef(null);
  const openActionSheet = () => {
    setActionSheetVisible(true);
    actionSheetRef.current?.show();
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };

  // useMemo(() => {

  // }, [location?.name]);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          { dy: pan.y }, // Track the movement along the y-axis
        ],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e, gestureState) => {
        // Determine if the panel should be swiped up or down
        if (gestureState.dy > 0) {
          // Swiped down
          Animated.spring(pan, {
            toValue: { x: 0, y: responsiveHeight / 1.2 },
            useNativeDriver: false,
          }).start();
        } else {
          // Swiped up
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    button: {
      marginTop: 20,
    },
    swiperWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    swipImage: {
      width: '100%',
      height: responsiveHeight * 2,
      borderRadius: 10,
    },
    dot: {
      backgroundColor: 'rgba(0,0,0,.2)',
      width: 8,
      height: 8,
      borderRadius: 4,
      margin: 3,
    },
    activeDot: {
      backgroundColor: '#000',
      width: 8,
      height: 8,
      borderRadius: 4,
      margin: 3,
    },
    cartSection: {
      height: responsiveHeight / 1.2,
      backgroundColor: theme.colors.surface,
      // borderWidth: 1,
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
      zIndex: 999,
    },
    noDataContainer: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      // backgroundColor: 'red',
    },
  });

  const images = [
    'https://via.placeholder.com/600x300.png?text=Image+1',
    'https://via.placeholder.com/600x300.png?text=Image+2',
    'https://via.placeholder.com/600x300.png?text=Image+3',
  ];

  const handleImagePress = index => {
    console.log(`Image ${index + 1} clicked`);
  };

  const navigation = useNavigationHelper();

  const serviceArr = [
    {
      name: 'Book Directly Using Prescription',
      subTitle: 'Directly book by uploading your prescription',
      onPress: () => {
        navigation.push({
          screen: 'PatientDetails',
          data: {},
        });
      },
    },
    {
      name: 'Book a Test and Diagnostic Appointment',
      subTitle: 'Blood test, X-ray, MRI, CT scan, and more',
      onPress: () => {
        navigation.push({
          screen: SCREEN_NAME.BloodGroupTest,
          data: {},
        });
      },
    },
    {
      name: 'Book Home Care Health Service',
      subTitle: 'Blood test, ECG, and other home services',
      onPress: () => {
        navigation.push({
          screen: SCREEN_NAME.BloodGroupTest,
          data: {},
        });
      },
    },
    {
      name: 'E-Health Consultancy',
      subTitle:
        'Consult directly with an expert for your health issues.\nSasthosathi service is also available.',
      number: '+91 81161 82108',
      onPress: () => {
        const phoneNumber = '+91 81161 82108';
        if (Platform.OS === 'android') {
          Linking.openURL(`tel:${phoneNumber}`);
          return;
        }

        if (Platform.OS === 'ios') {
          Linking.openURL(`telprompt:${phoneNumber}`);
          return;
        }
      },
    },
  ];

  useEffect(() => {
    setQueryParams([
      {
        name: 'serviceCoverAreaAddress',
        value: location?.name,
      },
    ]);
    actionSheetRef.current?.hide();
    closeActionSheet();
  }, [location?.name]);

  useEffect(() => {
    if (!location?.name) {
      actionSheetRef.current?.show();
    }
  }, []);

  const handleServiceNavigation = data => {
    console.log('data?.navigationScreen', data?.navigationScreen);
    switch (data?.navigationScreen) {
      // case '':
      case 'e_health_call':
        if (Platform.OS === 'android') {
          Linking.openURL(`tel:${data?.serviceContactNumber}`);
          return;
        }

        if (Platform.OS === 'ios') {
          Linking.openURL(`telprompt:${data?.phoneNumber}`);
          return;
        }
        break;
      case 'patient_details':
        navigation.push({
          screen: 'PatientDetails',
          data: {},
        });
        break;
      default:
        navigation.push({
          screen: SCREEN_NAME.BloodGroupTest,
          data: {},
        });
    }
  };
  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading || servicesLoading} />

      <Header isBack={false} isShop={true} isPhone={true} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={[GolbalStyle.row]}>
          <CustomText
            text="Sample collection from"
            size="sm"
            bold="400"
            color="gray"
          />
          <TouchableOpacity onPress={() => openActionSheet()}>
            <View style={[GolbalStyle.row]}>
              <Image source={ImageConstant.location} />
              <CustomText
                text={location?.name}
                size="sm"
                bold="bold"
                underline
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* <Search isClick={true} /> */}

        <ScrollView
          contentContainerStyle={{
            height: '100%',
          }}
        >
          {/* Image Swiper */}
          <View style={{ height: responsiveHeight * 2 }}>
            <Swiper
              style={styles.swiperWrapper}
              autoplay
              autoplayTimeout={2.5}
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.activeDot} />}
            >
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(index)}
                >
                  <Image
                    source={ImageConstant.offer}
                    style={styles.swipImage}
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>

          {/* Service */}
          <View style={[GolbalStyle.mtMD]}>
            <CustomText text="Service" bold="bold" />
          </View>

          {/* CARD */}
          <View style={[GolbalStyle.mtSM]}>
            {allservices?.data?.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  columnGap: 20,
                  height: '100%',
                }}
                data={allservices?.data}
                horizontal={true}
                renderItem={({ item }) => {
                  return (
                    <BookCard
                      onPress={() => handleServiceNavigation(item)}
                      title={item?.serviceName}
                      subTitle={item?.description}
                      number={item?.navigationScreen == 'e_health_call'}
                    />
                  );
                }}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <CustomText
                  text="No services available in your area"
                  color={theme.colors.primary}
                  size="lg"
                  textAlign="center"
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <ActionSheet ref={actionSheetRef}>
        <View style={[GolbalStyle.column, { height: responsiveHeight * 4 }]}>
          <AutocompleteDistricts />
        </View>
      </ActionSheet>
    </View>
  );
};

export default HomeTab;
