import {
  StyleSheet
} from 'react-native';
import screen from '../utils/screen';

const baseStyles = StyleSheet.create({
  fz10: {
    fontSize: 10
  },

  fz11: {
    fontSize: 11
  },

  fz12: {
    fontSize: 12
  },

  fz14: {
    fontSize: 14
  },

  fz16: {
    fontSize: 16
  },

  fz18: {
    fontSize: 18
  },

  fz20: {
    fontSize: 20
  },

  fz25: {
    fontSize: 25
  },

  colorFff: {
    color: '#fff'
  },

  colorCcc: {
    color: '#ccc'
  },

  colorF91: {
    color: '#f91'
  },

  colorF7e: {
    color: '#7e7e7e'
  },

  colorEa5: {
    color: '#ea5532'
  },

  colorA95: {
    color: '#00a95f'
  },

  colorAfe: {
    color: '#00afec'
  },

  colorA3a: {
    color: '#3a3a3a'
  },

  color333: {
    color: '#333'
  },

  colorA8: {
    color: '#a8a8a8'
  },

  colorFfa: {
    color: '#ffa200'
  },
  
  color9d9: {
    color: '#9d9ba1'
  },

  ftBold: {
    fontWeight: 'bold'
  },

  container: {
    backgroundColor: '#f5f5f9',
    flex: 1
  },

  rowcenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  marginB10: {
    marginBottom: 10
  },

  marginT10: {
    marginTop: 10
  },

  marginB8: {
    marginBottom: 8
  },

  marginT8: {
    marginTop: 8
  },

  marginL8: {
    marginLeft: 8
  },

  marginL10: {
    marginLeft: 10
  },

  marginL15: {
    marginLeft: 15
  },

  overlay: {
    justifyContent: 'center',
    backgroundColor: '#999',
    opacity: 0.4,
    position: 'absolute',
    width: screen.width,
    height: screen.height,
    left: 0,
    top: 0,
    zIndex: 99,
    elevation: 99,
  }
});

export default baseStyles;
