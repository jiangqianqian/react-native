/**
 * qfang.com broker-app
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import screen from '../utils/screen';

class LoadingView extends PureComponent {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator style={[styles.centering]} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: screen.height,
    alignItems: 'center',
    flexDirection: 'column'
  },
  centering: {
    justifyContent: 'center',
    padding: 8,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
});

export default LoadingView;
