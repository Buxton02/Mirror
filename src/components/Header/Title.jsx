import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient }from 'expo-linear-gradient';

function Title() {
  return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mirror</Text>
        <LinearGradient
            colors={['#AFCFF6', '#fff', '#A7C6ED']}
            start={{ x: 0, y: 0 }}  
            end={{ x: 1, y: 0 }} 
            style={styles.titleDot}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    
  },
  titleContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  titleDot: {   
    width: 10,
    height: 12,
    borderRadius: 50,
    overflow: 'hidden',
    transform: [{scaleY: 2}],
  },
  
});

export default Title;
