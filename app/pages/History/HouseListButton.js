import React, { PureComponent } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { QFReactHelper } from '../../common/NativeHelper';
import baseStyles from '../../components/baseStyles';

function goToList(houseData, type) {
  QFReactHelper.showPage('CHECK_MATHING_HOUSELIST', { args: JSON.stringify({ ...houseData, type }) });
}

export default class HouseListButton extends PureComponent {
  static propTypes = {
    // any should be replaced with, well, anything.
    // array and object can be replaced with arrayOf and shape, respectively.
    data: PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.string,
      houseData: PropTypes.object,
    }),
  };

  static defaultProps = {
    data: null,
  };

  render() {
    const propsData = this.props.data;
    return (
      Object.keys(propsData.houseData).length ?
        (<TouchableOpacity style={[styles.bottomButton, styles.buttonShowHouseList]} onPress={() => { goToList(propsData.houseData, propsData.type); }}>
          <Text style={[baseStyles.colorFff, baseStyles.fz15]}>{propsData.text}</Text>
        </TouchableOpacity>) : null
    );
  }
}


const styles = StyleSheet.create({
  bottomButton: {
    height: 36,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShowHouseList: {
    width: '70%', // 240/345
    backgroundColor: '#fcb836',
  },
});
