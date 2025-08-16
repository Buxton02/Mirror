import { View, Text, StyleSheet, Image } from 'react-native';
import FooterIcon from './FooterIcon';
import HomeS from '../../assets/icons/home-selected.png';
import HomeD from '../../assets/icons/home-deselected.png';
import ChatD from '../../assets/icons/chat-deselected.png';
import ChatS from '../../assets/icons/chat-selected.png';
import BookmarkD from '../../assets/icons/bookmark-deselected.png';
import BookmarkS from '../../assets/icons/bookmark-selected.png';
import ContactD from '../../assets/icons/contacts-deselected.png';
import ContactS from '../../assets/icons/contacts-selected.png';


function Footer({ tab }) {
  if (tab === 'Home') {
    return (
      <View style={styles.footer}>
        <FooterIcon icon={HomeS} label="Home" />
        <FooterIcon icon={ChatD} label="Chat" />
        <FooterIcon icon={BookmarkD} label="Journal" />
        <FooterIcon icon={ContactD} label="Account" />
      </View>
    );
  } else if (tab === 'Chat') {
    return (
      <View style={styles.footer}>
        <FooterIcon icon={HomeD} label="Home" />
        <FooterIcon icon={ChatS} label="Chat" />
        <FooterIcon icon={BookmarkD} label="Journal" />
        <FooterIcon icon={ContactD} label="Account" />
      </View>
    );
  } else if (tab === 'Journal') {
    return (
      <View style={styles.footer}>
        <FooterIcon icon={HomeD} label="Home" />
        <FooterIcon icon={ChatD} label="Chat" />
        <FooterIcon icon={BookmarkS} label="Journal" />
        <FooterIcon icon={ContactD} label="Account" />
      </View>
    );
  } else if (tab === 'Account') {
    return (
      <View style={styles.footer}>
        <FooterIcon icon={HomeD} label="Home" />
        <FooterIcon icon={ChatD} label="Chat" />
        <FooterIcon icon={BookmarkD} label="Journal" />
        <FooterIcon icon={ContactS} label="Account" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    // borderWidth: 1,
    // borderColor: 'red',
    backgroundColor: '#fff',
    boxShadow: '0px -3px 5px rgba(0, 0, 0, 0.11)',
  },
});

export default Footer;