import { View, Text, StyleSheet, Image, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FooterIcon({ icon, label }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(label);
  };  

  return (
    <Pressable style={styles.footerIcon} onPress={handlePress}>
      <Image source={icon} style={styles.footerIconImage} />
      <Text style={styles.footerIconText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footerIcon: {
    alignItems: 'center',
    marginHorizontal: 10,
    
  },
  footerIconImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  footerIconText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default FooterIcon;
