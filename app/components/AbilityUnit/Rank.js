import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import UserInfo from '../../common/UserInfo';
import Icon from '../Icon';

export default class Rank extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      branchRank: PropTypes.number,
      areaRank: PropTypes.number,
      regionRank: PropTypes.number,
      cityRank: PropTypes.number,
    }),
    navigation: PropTypes.object,
  };

  static defaultProps = {
    data: null,
    navigation: null,
  };

  constructor(props) {
    super(props);
    this.rankObj = { branchRank: '分店排名', areaRank: '片区排名', regionRank: '大区排名', cityRank: '城市排名' };
    this.goToRankList = this.goToRankList.bind(this);
  }

  // 渲染分店，片区，大区，城市排名
  getRankItem(item, value) {
    return (
      <View style={styles.rank}>
        <Text style={[styles.rankItem, styles.rankValue]}>{value}</Text>
        <Text style={[styles.rankItem, styles.rankName]}>{this.rankObj[item]}</Text>
      </View>
    );
  }

  showRank(propsData) {
    // 如果经纪人无任务数据记录，后台未记录经纪人排名，则此处显示提示“完成一个任务即可查看排名信息”,后端说只要判断一个就行
    if (!propsData.branchRank) {
      if (propsData.self) {
        return (<Text style={styles.noRankData}>完成一个任务即可查看排名信息</Text>);
      }
      return (<Text style={styles.noRankData}>他比较懒，还没做过任何任务</Text>);
    }
    return (<View style={styles.rankBoxInner}>
      {this.getRankItem('branchRank', propsData.branchRank)}
      {this.getRankItem('areaRank', propsData.areaRank)}
      {this.getRankItem('regionRank', propsData.regionRank)}
      {this.getRankItem('cityRank', propsData.cityRank)}
      {propsData.self &&
        <View style={styles.rightArrowWrap} onPress={this.goToRankList}>
          <Icon style={styles.rightArrow} name="xiangyou" size={18} color="#8e8d93" />
        </View>
      }
    </View>);
  }

  // 跳转到排名表
  goToRankList() {
    // console.log(UserInfo[UserInfo.target].personId, '排名信息页面本人personId');
    const { navigate } = this.props.navigation;
    navigate('Leaderboard', { personId: UserInfo[UserInfo.target].personId });
  }

  render() {
    const propsData = this.props.data;
    if (propsData.self && propsData.branchRank) {
      return (
        <TouchableOpacity onPress={this.goToRankList}>
          <View style={styles.rankBox}>
            {this.showRank(propsData)}
          </View>
        </TouchableOpacity>);
    }
    return (
      <View style={styles.rankBox}>
        {this.showRank(propsData)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rankBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 60,
    borderTopColor: '#4a4950',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rankBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    flex: 1,
  },
  rankItem: {
    textAlign: 'center',
    color: '#9d9ba1',
  },
  rankValue: {
    fontSize: 16,
  },
  rankName: {
    paddingTop: 5,
    fontSize: 12,
  },
  rightArrowWrap: {
    height: 35,
    justifyContent: 'center',
  },
  rightArrow: {
    width: 30,
  },
  noRankData: {
    paddingLeft: 15,
    color: '#9d9ba1',
    fontSize: 12,
  },
});
