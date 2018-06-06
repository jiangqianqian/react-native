/**
 * Created by yoara on 2017/7/6.
 */

/**
 * FilterBar组件用于接受数据数组筛选，点击操作后返回数据的值
 * <b>filterViewSubmit事件，用于自定义View提交值响应</b>
 * props:
 *  emitName:必填，父组件事件监听id
 *  items:数组对象，元素item格式如下：
 *       field:字段名，必填，回传参数时写回
 *       text:文字描述
 *       textColor:文字默认颜色
 *       contentViewStyle:选择栏自定义样式
 *       contentTextStyle:文本框自定义样式
 *       dataList:下拉框数据数组对象，元素如下：
 *            key:向后台传递的值
 *            value:界面显示值
 *       customData:自定义参数数据
 *            type:类型，可不填。
 *                 * '2-Input'，默认类型，是高低两个输入区的文本输入
 *                 * 'custom'，表示自定义view组件，将替换本组件默认的文本输入view
 *            customView:当type为'custom'时必填，表示自定义view组件，将替换本组件默认的文本输入view
 *            placeHolderLow:默认文本输入view有效，可不填，低区placeHolder显示内容
 *            placeHolderHigh:默认文本输入view有效，可不填，高区placeHolder显示内容
 *            unit: 单位，不填则不显示
 */
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated,
  Easing,
  DeviceEventEmitter,
} from 'react-native';
import * as Constants from '../../common/Constants';

import Icon from '../Icon/';
import FilterView from './FilterView';

export default class FilterBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.emitName = props.emitName + "_FilterBar";
    this.checkedItems = {};
  }

  static propTypes = {
    emitName: React.PropTypes.string.isRequired,
  }

  componentWillMount() {
    for (let index in this.props.items) {
      this.state[index + 'active'] = false;
      this.state[index + 'rotate'] = new Animated.Value(0);
    }
    this.state.itemCount = this.props.items.length;
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(this.emitName, (data) => {
      DeviceEventEmitter.emit(this.props.emitName, data);
      // 修改标题名
      for (let item of this.props.items) {
        if (data.field == item.field) {
          this.checkedItems[item.field] = data.item.value;
        }
      }
      this._active(-1);
    });

    this.activeScription = DeviceEventEmitter.addListener('blackClose', () => {
      this._active(-1);
    });
  }

  componentWillUnmount() {
    // 移除
    this.subscription.remove();
    this.activeScription.remove();
  }

  // 激活效果
  _active(activeIndex) {
    let active = {};
    let activeItemIndex = null;
    let unActiveItemIndex = null;
    let viewShow = true;
    for (let index in this.props.items) {
      let _index = index + 'active';
      // 被选中之下拉框
      if (activeIndex == _index) {
        // 如果是激活状态，则取消激活
        if (this.state[activeIndex]) {
          unActiveItemIndex = index;
          active[activeIndex] = false;
          // 收起下拉框
          DeviceEventEmitter.emit('filterViewClose');
          viewShow = false;
        } else {  //否则，激活
          activeItemIndex = index;
          active[activeIndex] = true;
        }
      } else {
        // 其他下拉框全部关闭
        if (this.state[_index]) {
          unActiveItemIndex = index;
          active[_index] = false;
        }
      }
    }
    this.setState(active);
    if (activeItemIndex != null) {
      this._showUp(activeItemIndex);
    }
    if (unActiveItemIndex != null) {
      this._showDown(unActiveItemIndex);
    }
    return viewShow;
  }

  // item被点击后触发函数
  _onPress(activeIndex, item) {
    if (this._active(activeIndex)) {
      if (item.dataList != null) {
        this.refs.filterView.show(item.field, item.dataList, item.customData, item.contentViewStyle, item.contentTextStyle);
      }
    }
  }

  //转角向下
  _showDown(index) {
    Animated.timing(
      this.state[index + 'rotate'],
      {
        easing: Easing.linear,//一个用于定义曲线的渐变函数
        duration: 300,//动画持续的时间（单位是毫秒），默认为500。
        toValue: 0,//动画的最终值
      }
    ).start();
  }

  //转角向上
  _showUp(index) {
    Animated.timing(
      this.state[index + 'rotate'],
      {
        easing: Easing.linear,//一个用于定义曲线的渐变函数
        duration: 300,//动画持续的时间（单位是毫秒），默认为500。
        toValue: 0.5,//动画的最终值
      }
    ).start();
  }

  render() {
    let views = [];
    for (let index in this.props.items) {
      let item = this.props.items[index];
      let activeIndex = index + 'active';
      let text = this.checkedItems[item.field] ? this.checkedItems[item.field] : item.text;
      if (text.length >= 5) {
        text = text.substring(0, 3) + '...';
      }
      views.push(
        <TouchableHighlight
          style={[styles.itemContainer, index == this.props.items.length - 1 && styles.itemContainerLast]}
          key={index} underlayColor='#f9f9f9'
          onPress={() => this._onPress(activeIndex, item)}>
          <View style={styles.item}>
            <Text numberOfLines={1} style={[styles.itemText]}>{text}</Text>
            <Animated.View style={[{
              transform: [{
                rotateZ: this.state[index + 'rotate'].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }]}>
              <Icon style={styles.itemIcon} size={20} name="triangle-down"
                color={this.state[activeIndex] ? '#ff9911' : (item.textColor ? item.textColor : '#a8a8a7')} />
            </Animated.View>
          </View>
        </TouchableHighlight>);
    }

    return (
      <View style={Constants.OS == 'ios' && styles.outContainer}>
        <View style={styles.container}>
          {views}
        </View>
        <FilterView ref="filterView" embed="true" eventName={this.emitName} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outContainer: {
    zIndex: 95,
  },
  container: {
    height: Constants.STANDARD_HEIGHT * 0.066,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dedfe0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dedfe0',
    backgroundColor: '#f9f9f9'
  },
  itemContainer: {
    height: Constants.STANDARD_HEIGHT * 0.04,
    flex: 1,
    alignItems: 'center'
  },
  itemContainerLast: {
    borderRightWidth: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#3a3a3a',
    alignItems: 'center'
  },
  itemIcon: {
    alignItems: 'center',
  },
  itemTextActive: {
    color: '#f91',
  }
});
