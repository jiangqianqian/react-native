import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import Icon from './Icon/';

export default class GoBack extends PureComponent {
  static propTypes = {
    data: PropTypes.string,
  }

  static defaultProps = {
    data: '',
  }
  render() {
    let { iconPress, onBackPress, iconStyle } = this.props;
    if (!onBackPress) {
      onBackPress = () => {
        requestAnimationFrame(() => {
          this.props.navigation.goBack();
        });
      };
    }
    const data = this.props.data || '#fff';
    return (
      <TouchableOpacity style={[styles.iconPress, iconPress]} onPress={onBackPress.bind(this)}>
        <Icon name="navigate-go-back" size={20} color={data} style={[{ marginLeft: -4 }, iconStyle]} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconPress: {
    width: 40,
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
