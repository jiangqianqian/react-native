import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import UltimateListView from 'react-native-ultimate-listview';
import axios from 'axios';
import PropTypes from 'prop-types';
import { screen } from '../../utils';
import ListItem from './common/ListItem';
import StatusView from '../../components/StatusView';
import Icon from '../../components/Icon/';

export default class PerList extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    tabType: PropTypes.string,
    dataSource: PropTypes.object,
  };

  static defaultProps = {
    tabType: '',
    dataSource: null,
  };

  constructor(props) {
    super(props);
    this.params = {
      taskGroup: this.props.tabType,
    };
    this.state = {
      status: false,
      statusText: '没有更多数据了',
    };
    // 数据加载完后显示为 true
    this.allDataLoad = false;
    this.onFetch = this.onFetch.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  async onFetch(page, startFetch, abortFetch) {
    try {
      this.params.page = page || 1;
      let res;
      // 如果有从 TaskList.js 传来的数据，则直接渲染，不请求数据
      if (this.params.page === 1 && this.props.dataSource) {
        res = this.props.dataSource.pagination;
        if (res.recordCount <= 0) {
          this.setState({
            status: 'no-data-found',
            statusText: '请耐心等待任务发布',
          });
        }
      } else {
        res = await this.requestData();
      }
      // console.log(res.items, 'PerList');
      startFetch(res.items, 10);
    } catch (err) {
      abortFetch();
      console.log(err);
    }
  }

  requestData() {
    this.setState({
      statusText: '没有更多数据了',
    });
    if (this.allDataLoad) {
      return { items: [] };
    }
    // console.log(this.params, 'taskParams');
    return axios.get('evaluation/task', { params: this.params || {} }).then((res) => {
      // return axios.get('http://172.16.72.98:8081/app/pages/TaskList/data.json/1', { params: this.params || {} }).then((res) => {
      if (res.data.code === 'C0000') {
        const pagination = res.data.data.pagination;
        if (pagination.recordCount <= 0) {
          this.setState({
            status: 'no-data-found',
            statusText: '请耐心等待任务发布',
          });
          return { items: [] };
        }

        if (pagination.currentPage === pagination.nextPage) {
          this.allDataLoad = true;
        }
        return pagination;
      }
      this.setState({
        status: 'request-failed',
        statusText: '服务请求失败\n请稍后再试',
      });
      return { items: [] };
    }).catch((error) => {
      console.log('error=', error);
      this.setState({
        status: 'network-error',
        statusText: '当前网络异常\n请检查您的网络',
      });
      return { items: [] };
    });
  }

  renderItem(data) {
    return (
      <ListItem data={data} navigation={this.props.navigation} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <UltimateListView
          onFetch={this.onFetch}
          keyExtractor={(item, index) => index}
          refreshable={false}
          // 状态栏20 标题栏45 tab栏40 解决安卓有滚动条的问题
          customRefreshViewHeight={-125}
          item={this.renderItem}
          numColumns={1}
          pagination
          paginationFetchingView={() => (<View style={styles.center}>
            <StatusView styles={{ backgroundColor: 'transparent' }} />
            {/* <Text style={styles.grayColor}>加载中</Text> */}
          </View>)}
          paginationAllLoadedView={() => (<View style={styles.noDataTipStyle}>
            <Text style={styles.grayColor}>{this.state.statusText}</Text>
          </View>)}
          paginationWaitingView={() => (<StatusView styles={{ backgroundColor: 'transparent' }} />)}
          emptyView={() => (<View style={styles.center}>
            <Icon name={this.state.status} size={60} color="#d6d7da" />
          </View>)
          }
        />
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#f0f0f0',
  },
  noDataTipStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  center: {
    marginTop: (screen.height / 2) - 100,
    alignItems: 'center',
  },
  grayColor: {
    color: '#a8a8a8',
    textAlign: 'center',
  },
});
