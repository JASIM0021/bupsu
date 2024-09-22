import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Components/header/Header';
import { useTheme } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import CustomText from '../../Components/Text';
import GolbalStyle from '../../Style';
import * as ImagePicker from 'expo-image-picker';
import { responsiveHeight, responsiveWidth } from '../../themes';
import Search from '../../Components/Search/Search';
import Hstack from '../../Components/Hstack/Hstack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Vstack from '../../Components/Vstack/Vstack';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { SCREEN_NAME } from '../../Constant';

const BloodGroupTest = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // State for modal and image
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to pick an image using Expo Image Picker
  const pickImage = async () => {
    console.log('click pic');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to handle uploading the image
  const handleUpload = () => {
    if (selectedImage) {
      // Upload the image logic here (e.g., API call)
      // After success, close the modal and navigate to success page
      setModalVisible(false);
      navigation.navigate(SCREEN_NAME.UploadSuccess); // Assuming you have a 'UploadSuccess' screen
    } else {
      Alert.alert('Please select an image to upload.');
    }
  };

  const styles = StyleSheet.create({
    swiperWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    swipImage: {
      width: '100%',
      height: responsiveHeight,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    dot: {
      backgroundColor: 'rgba(0,0,0,.2)',
      width: 8,
      height: 8,
      borderRadius: 4,
      margin: 3,
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
      width: 8,
      height: 8,
      borderRadius: 4,
      margin: 3,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
    },
    listContainer: {
      width: '48%',
      padding: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 12,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      alignItems: 'center',
    },
    listImage: {
      width: responsiveWidth + 40,
      height: responsiveHeight + 20,
      borderRadius: 8,
      marginBottom: 8,
    },
    listTextContainer: {
      flex: 1,
      alignItems: 'center',
    },
    listTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.colors.text,
    },
    listDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 6,
    },
    listPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.accent,
    },
    sectionTitle: {
      marginVertical: 20,
      color: theme.colors.primary,
    },
  });

  const images = [
    'https://via.placeholder.com/600x300.png?text=Image+1',
    'https://via.placeholder.com/600x300.png?text=Image+2',
    'https://via.placeholder.com/600x300.png?text=Image+3',
  ];

  const listData = [
    {
      orgName: 'USG whole abdomen',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      price: 800,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Test+1',
    },
    {
      orgName: 'USG upper abdomen',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      price: 700,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Test+2',
    },
    {
      orgName: 'MRI Brain',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      price: 1200,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Test+3',
    },
    {
      orgName: 'CT Scan Brain',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      price: 1600,
      imageUrl: 'https://via.placeholder.com/100x100.png?text=Test+4',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => console.log(item.orgName)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
      <View style={styles.listTextContainer}>
        <CustomText text={item.orgName} style={styles.listTitle} />
        <CustomText
          text={item.description}
          style={styles.listDescription}
          numberOfLines={2}
        />
        <CustomText text={`₹ ${item.price}`} style={styles.listPrice} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header isBack={true} title="Blood Group Test" />

      <View style={{ height: responsiveHeight }}>
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
              onPress={() => console.log('Image Pressed', index)}
            >
              <Image source={{ uri: image }} style={styles.swipImage} />
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>

      <Vstack justifyContent="center" alignItems="center">
        <Search isClick={true} />

        {/* Button to trigger modal */}
        <TouchableOpacity
          style={[GolbalStyle.btnComon, { width: '95%' }]}
          onPress={() => setModalVisible(true)}
        >
          <Hstack alignItems="center" gap={10}>
            <MaterialCommunityIcons
              name="file-upload"
              size={36}
              color={theme.colors.secondary}
            />
            <CustomText
              bold="bold"
              size="sm"
              color="white"
              text="Book by Uploading Your Prescription"
            />
          </Hstack>
        </TouchableOpacity>
      </Vstack>

      <View
        style={[
          GolbalStyle.mtSM,
          { width: '100%', justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <CustomText
          text="Select A Test"
          size="lg"
          bold="bold"
          textAlign="center"
          style={styles.sectionTitle}
        />
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for Image Picker */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: '90%',
              padding: 20,
              backgroundColor: theme.colors.background,
              borderRadius: 10,
            }}
          >
            <CustomText text="Upload Prescription" size="lg" bold="bold" />
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: 200, marginTop: 10 }}
              />
            )}
            <TouchableOpacity
              style={[GolbalStyle.btnComon, { marginTop: 20 }]}
              onPress={pickImage}
            >
              <CustomText text="Choose Image" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[GolbalStyle.btnComon, { marginTop: 10 }]}
              onPress={handleUpload}
            >
              <CustomText text="Upload" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                GolbalStyle.btnComon,
                { marginTop: 10, backgroundColor: theme.colors.error },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <CustomText text="Cancel" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BloodGroupTest;
