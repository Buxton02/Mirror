import { View, StyleSheet, FlatList, ScrollView} from 'react-native';
import { LinearGradient }from 'expo-linear-gradient';
import Title from '../components/Header/Title';
import Notice from '../components/HomeMain/Notice';
import Footer from '../components/Footer/Footer';
import Daily from '../components/HomeMain/Daily';

export default function Home() {
  return (
    <View style={styles.container}>
      <Title />
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}>
        <Daily />
        
        <Notice />
      </ScrollView>
      <Footer tab={"Home"}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  contentWrapper: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    
  },
  scrollContent: {
    paddingBottom: 100, // give space above footer
  },
  
});
