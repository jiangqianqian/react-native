import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';


export default class TabBar extends PureComponent {
  static propTypes = {
    goToPage: PropTypes.func, // 跳转到对应tab的方法
    activeTab: PropTypes.number, // 当前被选中的tab下标
    tabs: PropTypes.arrayOf(PropTypes.string), // 所有tabs集合
  }

  static defaultProps = {
    goToPage: null, // 跳转到对应tab的方法
    activeTab: 0, // 当前被选中的tab下标
    tabs: [],
  };

  componentDidMount() {
    // Animated.Value监听范围 [0, tab数量-1]
    // this.props.scrollValue.addListener(this.setAnimationValue);
  }

  // setAnimationValue({ value }) {
  //   console.log(value);
  // }

  renderTabOption(tab, i) {
    let color = '#989898';
    let bottomLine = null;
    if (this.props.activeTab === i) {
      color = '#fff';
      bottomLine = (<View style={styles.bottomLine} />);
    }
    // const color = this.props.activeTab === i ? '#fff' : '#989898'; // 判断i是否是当前选中的tab，设置不同的颜色
    return (
      <TouchableOpacity key={i} onPress={() => this.props.goToPage(i)} style={styles.tab}>
        <View style={styles.tabItem}>
          <View style={styles.tabTextWrap}>
            <Text style={{ color }}>
              {tab}
            </Text>
          </View>
          {bottomLine}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#2f2e36',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTextWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLine: {
    height: 1,
    width: 42,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
});
