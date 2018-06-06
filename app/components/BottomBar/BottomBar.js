/**
 * Created by yoara on 2017/6/14.
 */

/**
 * BottomBar组件接受按钮参数，可为按钮自定义显示、行为等
 * props:
 *  item:数组对象，格式如下：
 *       icon:图标
 *       text:文字描述
 *       textColor:文字默认颜色
 *       func:点击回调函数
 *       events:弹出框事件触发机制，包括三类事件tel,sms,func回调函数
 *            name:姓名
 *            phone:电话
 *            showContent:弹出框现实内容，不填则显示[（电话） 姓名]
 *            type:(tel/sms/func)
 *            func:仅当type为func类型时，才会执行的回调函数
 */
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import * as Constants from '../../common/Constants';

import Icon from '../Icon/';
import BottomEvent from './BottomEvent'

export default class BottomBar extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    for (let index in this.props.items) {
      this.state[index + 'active'] = false;
    }
  }

  //激活效果
  _active(activeIndex) {
    let active = {};
    for (let index in this.props.items) {
      active[index + 'active'] = false;
    }
    active[activeIndex] = true;
    this.setState(active);
  }

  //item被点击后触发函数
  _onPress(activeIndex, item) {
    this._active(activeIndex);
    if (item.func != null) {
      item.func();
    }
    if (item.events != null) {
      this.refs['bottomEvent'].show(item.text, item.events);
    }
  }

  render() {
    let views = [];
    for (let index in this.props.items) {
      let refIndex = index + 'icon';
      let activeIndex = index + 'active';
      let item = this.props.items[index];
      views.push(
        <TouchableHighlight key={index} underlayColor="#f0f0f0" onPress={() => this._onPress(activeIndex, item)}>
          <View style={styles.item}>
            <Icon ref={refIndex} style={styles.itemIcon} name={item.icon} size={20}
              color={this.state[activeIndex] ? '#ffa200' : (item.textColor ? item.textColor : '#3a3a3a')} />
            <Text style={[styles.itemText, this.state[activeIndex] && styles.itemTextActive]}>{item.text}</Text>
          </View>
        </TouchableHighlight>);
    }

    return (
      <View>
        <View style={styles.container}>
          {views}
        </View>
        <BottomEvent ref="bottomEvent" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Constants.STANDARD_HEIGHT * 0.08,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b4b4b4',
    backgroundColor: '#fff'
  },
  item: {
    alignItems: 'center'
  },
  itemIcon: {
    marginBottom: Constants.STANDARD_HEIGHT * 0.008
  },
  itemText: {
    fontSize: 10,
    color: '#7e7e7e',
  },
  itemTextActive: {
    color: '#ffa200',
  }
});
