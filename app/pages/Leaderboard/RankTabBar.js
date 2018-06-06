import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  // InteractionManager,
  // Platform,
} from 'react-native';

import PropTypes from 'prop-types';

export default class RankTabBar extends React.Component {
  static PropTypes = {
    goToPage: PropTypes.func,
    style: PropTypes.object,
    tabs: PropTypes.array,
    parentThis: PropTypes.object,
  }

  rankTabs = [] // tab View ref数组集合
  rankTextTabs = []// tab Text ref数组集合

  tabSwitch(index, clickFlag) {
    // 去掉InteractionManager.runAfterInteractions，因为它是等动画完成之后再执行，快速切换页签再点返回时，会出现闪退
    // InteractionManager.runAfterInteractions(() => {
    // 只有tab点击的时候才需要goToPage
    if (clickFlag) {
      this.props.parentThis.scrollTabRef.goToPage(index);
    }

    this.rankTabs.forEach((v, i) => {
      v.setNativeProps({
        style: {
          backgroundColor: '#2f2e36',
        },
      });

      this.rankTextTabs[i].setNativeProps({
        style: {
          color: '#9d9ba1',
        },
      });
    });

    this.rankTabs[index].setNativeProps({
      style: {
        backgroundColor: '#fff',
      },
    });

    this.rankTextTabs[index].setNativeProps({
      style: {
        color: '#2f2e36',
      },
    });
    // });
  }

  render() {
    // const tabsLength = this.props.tabs.length;
    const tabsArrays = ['分店', '片区', '大区', '城市'];

    return (
      <View style={[styles.tabs, this.props.style]}>
        {tabsArrays.map((tab, i) => {
          return (
            <TouchableOpacity key={tab} ref={(ref) => { this.rankTabs[i] = ref; }} onPress={this.tabSwitch.bind(this, i, true)} style={[styles.tab, i === 0 ? styles.curTab : '', i === 3 ? styles.lastTab : '', i === 1 ? { borderLeftWidth: 1,
              borderLeftColor: '#fff' } : '']}>
              <Text style={[styles.tabText, i === 0 ? styles.curTextTab : '']} ref={(ref) => { this.rankTextTabs[i] = ref; }}>{tab}</Text>
            </TouchableOpacity>);
        })}
      </View>);
  }
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    backgroundColor: '#2f2e36',
  },

  tab: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },

  tabText: {
    color: '#9d9ba1',
    fontSize: 14,
  },

  curTab: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRightWidth: 0,
  },

  curTextTab: {
    color: '#2f2e36',
  },

  lastTab: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    borderRightWidth: 0,
  },
});
