import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#FAF0CA', marginBottom: 10 },
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 50,
    color: '#000000', 
    textAlign: 'center'
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%', 
  },
  interestBubble: {
    padding: 12,
    margin: 5,
    borderRadius: 50, 
    backgroundColor: '#E9C46A',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    maxWidth: 120, 
  },
  selectedBubble: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  interestText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  oddBubble: {
    marginRight: 10, 
  },
  evenBubble: {
    marginLeft: 10, 
  },
  button: {
    backgroundColor: '#F4A261', 
    padding: 15, 
    borderRadius: 25, 
    marginTop: 20, 
    width: '50%', 
    alignItems: 'center',
    opacity: 0.9,
  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold',
  },
});
