import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';
import axios from 'axios';
import UltimateListView from 'react-native-ultimate-listview';

import baseStyles from '../../components/baseStyles';
import StatusView from '../../components/StatusView';
import RenderItem from './RenderItem';

export default class RankList extends PureComponent {
  static defaultProps = {
    tabType: 'BRANCH',
  };

  static propTypes = {
    tabType: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    parentThis: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      status: '',
    };
  }

  async onFetch(page, startFetch, abortFetch) {
    try {
      this.params.page = page || 1;
      this.params.rankType = this.props.tabType;

      if (this.headerInfoFlag && page === 1) {
        this.props.parentThis.loadingRef.setNativeProps({
          style: {
            left: 0,
          },
        });

        const d1 = this.requestData(); // 拿到的是ajax返回的promise
        const d2 = this.props.parentThis.headerInfoRef.requestData();

        Promise.all([d1, d2]).then(() => {
          this.props.parentThis.loadingRef.setNativeProps({
            style: {
              left: -9999,
            },
          });

          startFetch(this.leaderboardData);
        });
      } else {
        const res = await this.requestData(); // 拿到的是ajax返回的数据
        startFetch(res);
      }
    } catch (error) {
      abortFetch();
      console.log(error);
    }
  }

  params = { page: 1 }
  headerInfoFlag = false

  _renderItem(data) {
    return (<RenderItem data={data} navigation={this.props.navigation} tabType={this.props.tabType} />);
  }

  requestData() {
    return axios.get('evaluation/leaderboard', { params: this.params || {} })
      .then((res) => {
        if (res.data.code === 'C0000') {
          const items = res.data.data.pagination.items;
          this.hasOther = res.data.data.hasOther;

          // 用来判断是否在RankList组件中刷新个人信息
          this.headerInfoFlag = true;

          this.setState({
            status: items.length ? '' : 'no-data-found',
          });

          this.leaderboardData = items;
          return items;
        }

        this.setState({ status: 'request-failed' });
        return [];
      }).catch(() => {
        this.setState({
          status: 'network-error',
        });
        return [];
      });
  }


  render() {
    return (
      <View style={[baseStyles.container]}>
        <UltimateListView
          style={{ backgroundColor: '#fff' }}
          onFetch={this.onFetch.bind(this)}
          getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
          ref={(ref) => { this.listView = ref; }}
          keyExtractor={(item, index) => { return index; }}    
          item={this._renderItem.bind(this)}
          numColumns={1}
          pagination
          refreshable
          refreshableTintColor="#fff"
          customRefreshView={() => { return '' }}
          refreshViewHeight={0}
          paginationFetchingView={() => {
            return (
              <View style={styles.fetchLoading}>
                <StatusView styles={{ backgroundColor: '#fff' }} />
                <View><Text style={{ color: '#7e7e7e', fontSize: 14 }}>加载中</Text></View>
              </View>
            );
          }}
          paginationAllLoadedView={() => {
            return (
              <View style={[styles.rankListNoData]}>
                {
                  this.hasOther ? <Text style={{ color: '#7e7e7e' }}>未上榜的经纪人说明他还未做过任务哦</Text> : null
                }
              </View>
            );
          }}
          paginationWaitingView={() => {
            let statusView = '';
            if (this.state.status) {
              statusView = (<View style={{ marginTop: 30 }}><StatusView status={this.state.status} styles={{ backgroundColor: '#fff' }} /></View>);
            } else {
              statusView = (<StatusView styles={{ backgroundColor: '#fff' }} />);
            }

            return statusView;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fetchLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  rankListNoData: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
  },
});