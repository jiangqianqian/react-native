import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import PropTypes from 'prop-types';
import UserInfo from '../../../common/UserInfo';
import CommonList from './CommonList';
import NoDataList from './NoDataList';

export default class TabList extends PureComponent {
  // constructor() {
  //   super();
  // }

  static propTypes = {
    houseTypeChange: PropTypes.func,
  };

  static defaultProps = {
    houseTypeChange: null,
  };

  render() {
    let tabContent;
    if (UserInfo[UserInfo.target].activeAt === '') {
      tabContent = {
        sale: (<NoDataList tabLabel="二手房" />),
        rent: (<NoDataList tabLabel="出租房" />),
      };
    } else {
      tabContent = {
        sale: (<CommonList tabLabel="二手房" tabType="secondHouseTab" />),
        rent: (<CommonList tabLabel="出租房" tabType="rentHouseTab" />),
      };
    }

    return (
      <View style={styles.tabListBox}>
        <ScrollableTabView
          tabBarBackgroundColor="#fff"
          tabBarActiveTextColor="#fcb836"
          tabBarInactiveTextColor="#7e7e7e"
          initialPage={0}
          tabBarTextStyle={styles.tabBarText}
          tabBarUnderlineStyle={styles.tabBarUnderline}
          locked={false}
          renderTabBar={() => <DefaultTabBar style={styles.tabBarHead} tabStyle={styles.tabItem} />}
          onChangeTab={(obj) => { this.props.houseTypeChange(obj.ref.props.tabType); }}
          prerenderingSiblingsNumber={Infinity}
        >
          {tabContent.sale}
          {tabContent.rent}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabListBox: {
    flex: 1,
  },
  tabBarHead: {
    height: 42,
    borderBottomColor: '#ebebeb',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
  },
  tabItem: {
    paddingBottom: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#dbdbdb',
  },
  // NoDataListWrapper: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // NoDataListText: {
  //   color: '#d6d7da',
  //   textAlign: 'center',
  //   lineHeight: 20,
  // },
  tabBarUnderline: {
    left: '25%',
    width: 60,
    height: 2,
    marginLeft: -30,
    alignSelf: 'center',
    backgroundColor: '#fcb836',
    borderBottomWidth: 0,
  },
  tabBarText: {
    fontSize: 13,
    fontWeight: 'normal',
  },
});
