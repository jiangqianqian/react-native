import React, { PureComponent } from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { QFReactHelper } from './common/NativeHelper';
import HTTPAdapter from './common/HTTPAdapter';
import Routers from './common/Routers';
import UserInfo from './common/UserInfo';

const navigatorConfig = {
  initialRouteName: '',
  navigationOptions: {
    headerBackTitle: null,
    headerTintColor: '#fff',
    showIcon: true,
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: '#2f2e36',
      elevation: 999,
      zIndex: 999,
      ...Platform.select({
        android: {
          paddingTop: 20,
          height: 65,
        },
        ios: {
          height: 45,
        },
      }),
    },
    headerTitleStyle: {
      ...Platform.select({
        android: {
          fontSize: 20,
          fontWeight: 'normal',
          alignSelf: 'center',
          marginLeft: -40, // 返回按钮定义的宽度
        },
        ios: {
          fontSize: 17,
        },
      }),
    },
  },
};

let MyNavigator = null;

class Root extends PureComponent {
  params = {};

  constructor(props) {
    super(props);

    this.getParamsFromNative(props);
    this.initNavigator();

    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('#000', true);
    }
  }

  // 获取原生 APP 传入的用户信息，并初始化接口请求默认参数
  getParamsFromNative(props) {
    this.params = {
      target: props.target, // Histroy,Evaluation,TaskList
      baseUrl: props.baseUrl,
      sessionId: props.sessionId,
      Evaluation: {
        personId: (props[props.target] && props[props.target].personId),
      },
      History: {
        cell: (props[props.target] && props[props.target].cell),
        regAt: (props[props.target] && props[props.target].regAt),
        activeAt: (props[props.target] && props[props.target].activeAt),
        lastBrowseAt: (props[props.target] && props[props.target].lastBrowseAt),
        isPrivate: (props[props.target] && props[props.target].isPrivate),
        name: (props[props.target] && props[props.target].name),
        beInviteId: (props[props.target] && props[props.target].beInviteId),
        deviceId: (props[props.target] && props[props.target].deviceId),
        customerId: (props[props.target] && props[props.target].customerId),
      },
    };

    Object.assign(UserInfo, this.params); // 缓存用户信息
    if (!this.params.sessionId) {
      console.log('用户未登录');
      QFReactHelper.show('数据异常，请联系管理员！', 2);
      QFReactHelper.navPop();
    }

    console.log(`当前用户 ${JSON.stringify(this.params)}`);

    HTTPAdapter.setup(this.params);
  }

  // 根据用户类型定义路由入口
  initNavigator() {
    switch (this.params.target) {
      case 'History':
        navigatorConfig.initialRouteName = 'History';
        break;
      case 'Evaluation':
        navigatorConfig.initialRouteName = 'AbilitySelf';
        break;
      case 'TaskList':
        navigatorConfig.initialRouteName = 'TaskList';
        break;
      default:
        navigatorConfig.initialRouteName = 'History';
        break;
    }
    MyNavigator = StackNavigator(Routers, navigatorConfig);
  }

  componentWillMount() {
    QFReactHelper.statistical('start', navigatorConfig.initialRouteName);
  }

  componentWillUnmount() {
    QFReactHelper.statistical('end', navigatorConfig.initialRouteName);
  }

  render() {
    return (
      <MyNavigator />
    );
  }
}


export default Root;
