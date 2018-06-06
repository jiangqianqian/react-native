
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import Icon from '../components/Icon/';

const status = {
  'no-data-found': '暂无数据',
  'request-failed': '服务请求失败\n请稍后再试',
  'network-error': '当前网络异常\n请检查您的网络',
};

export default class StatusView extends PureComponent {
  render() {
    if (!this.props.status) {
      return (<View style={styles.errorWrapper}><ActivityIndicator
        style={[{ height: 40, backgroundColor: '#f5f5f9', transform: [{ scale: 1.2 }] }, this.props.styles]}
        size={'small'}
        color='#ccc'
        animating={true}
      /></View>);
    }
    return (
      <View style={styles.errorWrapper}>
        <Icon name={this.props.status} size={60} color='#d6d7da' />
        <Text style={styles.errorText}>{status[this.props.status]}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  errorText: {
    color: '#d6d7da',
    textAlign: 'center',
    lineHeight: 20
  },
});
