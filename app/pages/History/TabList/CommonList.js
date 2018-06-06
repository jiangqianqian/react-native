// 二手房,出租房公用组件
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  InteractionManager,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserInfo from '../../../common/UserInfo';
// 请求异常组件
import StatusView from '../../../components/StatusView';

export default class CommonList extends PureComponent {
  static propTypes = {
    tabType: PropTypes.string,
    tabLabel: PropTypes.string,
  };

  static defaultProps = {
    tabType: '',
    tabLabel: '',
  };

  constructor(props) {
    super(props);
    this.screenProps = UserInfo[UserInfo.target];
    this.state = {
      status: false,
      loadedData: false,
      dataSource: {},
    };
    this.noAttentionData = (<View><Text style={styles.value}>暂无数据</Text></View>);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));

    // 添加公用列表组件的刷新事件，当从原生转私页跳到历史浏览页时需要触发此事件
    this.commonListRender = DeviceEventEmitter.addListener('commonListRender', () => {
      InteractionManager.runAfterInteractions(this.requestData.bind(this));
    });
  }

  componentWillUnmount() {
    // 移除
    this.commonListRender.remove();
  }

  getPriceOrArea(type) {
    // 处理意向价格和面积的内容
    let jsx = '';
    let unit = '';
    let data = {};
    if (type === 'price') {
      unit = (this.props.tabType === 'secondHouseTab' ? '万' : '元/月');
      data = this.state.dataSource.attentionPrice;
    } else {
      unit = '平米';
      data = this.state.dataSource.attentionBuildArea;
    }
    if (Object.keys(data).length) {
      jsx = (<View>
        <Text style={styles.value}>{data.min}-{data.max}{unit}</Text>
      </View>);
    } else {
      jsx = this.noAttentionData;
    }
    return jsx;
  }

  getPatternOrGardenJsx(type) {
    // 处理意向户型和意向小区的内容
    let jsx = '';
    const data = (type === 'pattern' ? this.state.dataSource.attentionPattern : this.state.dataSource.attentionGarden);
    for (const value of data) {
      jsx += `${value.name}  `;
    }
    if (data.length) {
      jsx = (<View><Text style={styles.value}>{jsx}</Text></View>);
    } else {
      jsx = this.noAttentionData;
    }
    return jsx;
  }

  // 根据不同页签请求二手房或出租房的意向数据
  requestData() {
    const secondHouseTabFlag = (this.props.tabType === 'secondHouseTab');
    const houseState = secondHouseTabFlag ? 'SALE' : 'RENT';
    // const url = secondHouseTabFlag ? 'tabListSale.json' : 'tabListRent.json';
    axios
      .get('invite/queryQfangBrowseHistory', {
      // .get(`http://172.16.72.98:8081/app/pages/History/${url}`, {
        params: {
          params: JSON.stringify({
            beInviteId: this.screenProps.beInviteId,
            deviceId: this.screenProps.deviceId,
            houseState,
          }),
        },
      })
      .then((res) => {
        if (res.data.code !== 1000) {
          this.setState({ status: 'request-failed' });
          return;
        }

        this.setState({ dataSource: res.data.data, loadedData: true });
        if (secondHouseTabFlag) {
          // console.log(new Date().getTime(), 'secondHouseTab');
          DeviceEventEmitter.emit('tabListData', { data: res.data.data, type: 'secondHouseTab' });
        } else {
          // console.log(new Date().getTime(), 'rentHouseTab');
          DeviceEventEmitter.emit('tabListData', { data: res.data.data, type: 'rentHouseTab' });
        }
      })
      .catch((error) => {
        console.log(error, 'error');
        this.setState({ status: 'network-error' });
      });
  }

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} />;
    }

    if (!Object.keys(this.state.dataSource).length) {
      return (<View style={styles.noDataWrapper}>
        <Text style={styles.noDataText}>很遗憾,该客户在Q房网未浏览过{this.props.tabLabel}</Text>
      </View>);
    }

    return (
      <ScrollView style={styles.listBox}>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.title}>意向小区</Text>
          </View>
          <View>
            {this.getPatternOrGardenJsx('garden')}
          </View>
        </View>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.title}>意向价格</Text>
          </View>
          {this.getPriceOrArea('price')}
        </View>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.title}>意向面积</Text>
          </View>
          {this.getPriceOrArea('area')}
        </View>
        <View style={[styles.listItem, { borderBottomWidth: 0 }]}>
          <View>
            <Text style={styles.title}>意向户型</Text>
          </View>
          {this.getPatternOrGardenJsx('pattern')}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  listBox: {
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#fff',
  },
  listItem: {
    paddingTop: 30,
    paddingBottom: 25,
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    paddingBottom: 10,
    fontSize: 15,
    color: '#7e7e7e',
  },
  value: {
    lineHeight: 20,
    fontSize: 16,
    color: '#3a3a3a',
  },
  noDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDataText: {
    lineHeight: 20,
    color: '#d6d7da',
    textAlign: 'center',
  },
});
