import React, { PureComponent } from 'react';
import {
  InteractionManager,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import axios from 'axios';
import PropTypes from 'prop-types';

import { QFReactHelper } from '../../common/NativeHelper';
import UserInfo from '../../common/UserInfo';
import TabBar from './common/TabBar';

import GoBack from '../../components/GoBack';
import StatusView from '../../components/StatusView';

import PerList from './PerList';

function navigateBack() {
  global.requestAnimationFrame(() => {
    QFReactHelper.navPop();
  });
}

export default class TaskList extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: '我的任务',
      headerLeft: UserInfo.target === 'TaskList' ? (<GoBack navigation={navigation} onBackPress={() => params.navigateBack && params.navigateBack()} />) : (<GoBack navigation={navigation} />),
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      status: false,
      loadedData: false,
      dataSource: {},
    };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  componentDidMount() {
    this.props.navigation.setParams({
      navigateBack,
    });
  }

  requestData() {
    axios
      .get('evaluation/task')
      // .get('http://172.16.72.98:8081/app/pages/TaskList/data.json')
      .then((res) => {
        if (res.data.code !== 'C0000') {
          this.setState({ status: 'request-failed' });
          return;
        }
        this.setState({ dataSource: res.data.data, loadedData: true });
      })
      .catch((error) => {
        console.log(error, 'error');
        this.setState({ status: 'network-error' });
      });
  }

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }

    const dataSource = this.state.dataSource;
    const navigation = this.props.navigation;

    return (
      <ScrollableTabView
        tabBarBackgroundColor="#2f2e36"
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#989898"
        initialPage={0}
        locked={false}
        renderTabBar={() => <TabBar />}
      >
        {/* 没有新手任务不显示新手任务页签 */}
        {dataSource.hasTiroTask &&
          (<PerList tabLabel="新手任务" tabType="TIRO" dataSource={dataSource} navigation={navigation} />)
        }
        <PerList tabLabel="日常任务" tabType="DAILY" dataSource={dataSource.hasTiroTask ? null : dataSource} navigation={navigation} />
        <PerList tabLabel="特殊任务" tabType="SPECIAL" navigation={navigation} />
      </ScrollableTabView>
    );
  }
}
