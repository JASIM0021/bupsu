import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from '../screens/ProductScreen';
import AuthNavigation from './AuthNavigation';
import { SCREEN_COMPONENT, SCREEN_NAME } from '../Constant';

const screen = [
  {
    name: SCREEN_NAME.HomeTab,
    component: SCREEN_COMPONENT.HomeTab,
  },
  {
    name: SCREEN_NAME.Search,
    component: SCREEN_COMPONENT.Search,
  },
  {
    name: SCREEN_NAME.BloodGroupTest,
    component: SCREEN_COMPONENT.BloodGroupTest,
  },
  {
    name: SCREEN_NAME.ERecipt,
    component: SCREEN_COMPONENT.ERecipt,
  },
  {
    name: SCREEN_NAME.UploadSuccess,
    component: SCREEN_COMPONENT.UploadSuccess,
  },
  {
    name: SCREEN_NAME.PatientDetails,
    component: SCREEN_COMPONENT.PatientDetails,
  },
  {
    name: SCREEN_NAME.Payment,
    component: SCREEN_COMPONENT.Payment,
  },
  {
    name: SCREEN_NAME.OrderSuccess,
    component: SCREEN_COMPONENT.OrderSuccess,
  },
];

const HomeNavigation = ({ route }) => {
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        initialRouteName={SCREEN_NAME.HomeTab}
        screenOptions={{
          headerShown: false,
          headerSearchBarOptions: {
            cancelButtonText: 'Cancel',
          },
        }}
      >
        {screen.map((sc, index) => {
          return (
            <>
              <Stack.Screen
                name={sc.name}
                component={sc.component}
                key={sc.name}
              />
            </>
          );
        })}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default HomeNavigation;
