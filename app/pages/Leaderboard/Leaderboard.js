import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import GoBack from '../../components/GoBack';
import baseStyles from '../../components/baseStyles';
import screen from '../../utils/screen';

import HeaderInfo from './HeadInfo';
import RankList from './RankList';
import RankTabBar from './RankTabBar';

export default class Leaderboard extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  static defaultProp = {
    navigation: {},
  }

  static navigationOptions = ({ navigation }) => ({
    title: '排行榜',
    headerLeft: (<GoBack navigation={navigation} />),
  })

  curTimeFlag = true
  time = null

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={baseStyles.container}>
        <View ref={(ref) =>  this.loadingRef = ref} style={styles.overLayer}>
          <View style={styles.loadingBack}>
            <ActivityIndicator style={{ transform: [{ scale: 1.5 }] }} color="white" />
          </View>
        </View>
        <View style={{ backgroundColor: '#2f2e36', width: '100%' }}><Image style={styles.rankBanner} source={require('../../assets/img/rank-banner.png')} /></View>
        <HeaderInfo ref={(ref) => { this.headerInfoRef = ref; }} />
        <RankTabBar style={styles.tabDefaultStyle} parentThis={this} ref={(c) => { this.tabRef = c; }} />
        <ScrollableTabView
          style={styles.tabView}
          ref={(c) => { this.scrollTabRef = c; }}
          onChangeTab={(obj) => {
            global.requestAnimationFrame(() => {
              this.rankListRef.headerInfoFlag = false;
              this.headerInfoRef.requestData(obj.ref.props.tabType);
            });
          }}

          onScroll={() => {
            if (this.curTimeFlag) {
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                this.tabRef.tabSwitch(this.scrollTabRef.state.currentPage);
                this.curTimeFlag = true;
              }, 400);

              this.curTimeFlag = false;
            }
          }}
          renderTabBar={() => <View></View>}
        >
          <RankList ref={(ref) => this.rankListRef=ref} tabLabel="分店" tabType="BRANCH" navigation={navigation} parentThis={this} />
          <RankList ref={(ref) => this.rankListRef=ref} tabLabel="片区" tabType="AREA" navigation={navigation} parentThis={this} />
          <RankList ref={(ref) => this.rankListRef=ref} tabLabel="大区" tabType="REGION" navigation={navigation} parentThis={this} />
          <RankList ref={(ref) => this.rankListRef=ref} tabLabel="城市" tabType="CITY" navigation={navigation} parentThis={this} />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overLayer: {
    width: screen.width,
    height: screen.height,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: -9999,
    zIndex: 100,
    elevation: 100,
  },

  loadingBack: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankBanner: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },

  tabView: {
    width: '100%',
  },

  tabDefaultStyle: {
    width: '90%',
    height: 32,
    position: 'absolute',
    zIndex: 99,
    elevation: 99,
    top: 0,
    left: '5%',
  },
});
