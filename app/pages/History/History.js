import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
import { QFReactHelper } from '../../common/NativeHelper';
import UserInfo from '../../common/UserInfo';
import GoBack from '../../components/GoBack';
import baseStyles from '../../components/baseStyles';
import HeaderInfo from './HeaderInfo';
import TabList from './TabList/TabList';
import HouseListButton from './HouseListButton';

export default class History extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Q房网浏览历史页',
      headerLeft: (<GoBack navigation={navigation} onBackPress={() => params.navigateBack && params.navigateBack()} />),
    };
  };

  constructor(props) {
    super(props);

    // 初始当前页签为二手房
    this.state = {
      houseTab: 'secondHouseTab',
      valid: false, // 为true表示转私按钮可用
    };

    this.secondHouseData = {}; // 记录二手房请求接口返回的数据
    this.rentHouseData = {}; // 记录出租房请求接口返回的数据
    this.screenProps = UserInfo[UserInfo.target]; // 用screenProps 存起 UserInfo ,方便以后 UserInfo 名字变动后不会影响到使用它的代码

    this.goToPrivatePage = this.goToPrivatePage.bind(this);
    this.houseTypeChange = this.houseTypeChange.bind(this);
  }

  componentWillMount() {
    if (this.screenProps.activeAt === '') {
      // 如果未激活，默认二手房和出租房有返回数据且为空, 便于控制转私按钮是否可点击
      this.setState({
        valid: true,
      });
    }
  }


  componentDidMount() {
    let secondHouseDataFlag;
    let rentHouseDataFlag;
    this.tabListDataEvent = DeviceEventEmitter.addListener('tabListData', (data) => {
      if (data.type === 'secondHouseTab') {
        secondHouseDataFlag = true;
        this.secondHouseData = data.data;
      } else if (data.type === 'rentHouseTab') {
        rentHouseDataFlag = true;
        this.rentHouseData = data.data;
      }

      if (rentHouseDataFlag && secondHouseDataFlag) {
        this.setState({
          valid: true,
        });
      }
    });

    this.props.navigation.setParams({
      navigateBack: this.navigateBack.bind(this),
    });

    try {
      // 监听原生 APP 中的转私状态是否更改，若是，则更新 UserInfo并刷新重新触发render
      const myNativeEmitter = new NativeEventEmitter(QFReactHelper);
      // this.privateInfoChange = DeviceEventEmitter.addListener('privateInfoChange', (data) => {
      this.privateInfoChange = myNativeEmitter.addListener('privateInfoChange', (data) => {
        Object.assign([UserInfo.target], data);

        // this.forceUpdate这个方法不会使HeaderInfo及CommonList组件重新渲染
        this.forceUpdate();
        this.headerInfo.forceUpdate();
        DeviceEventEmitter.emit('commonListRender');
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    // 移除
    this.tabListDataEvent.remove();
    try {
      this.privateInfoChange.remove();
    } catch (e) {
      console.log(e);
    }
  }

  navigateBack() {
    global.requestAnimationFrame(() => {
      QFReactHelper.navPop();
    });
  }

  // 页签切换时调用此方法更新页签
  houseTypeChange(houseTabType) {
    this.setState({
      houseTab: houseTabType,
    });
  }

  // 点击转私进入转私页面
  goToPrivatePage() {
    // 如果转私按钮的数据还在请求中，则按钮无效
    if (this.state.valid) {
      QFReactHelper.showPage('CUSTOMER_TURN_PRIVATE', {
        // 跟原生沟通，可以不传baseUrl,及sessionId
        userInfo: UserInfo[UserInfo.target],
        rent: this.rentHouseData,
        sale: this.secondHouseData,
      });
      // DeviceEventEmitter.emit('privateInfoChange', { isPrivate: true, customerId: '1246565444' });
    }
  }

  // 返回转私按钮
  getPrivateButton() {
    if (!this.screenProps.isPrivate) {
      return (
        <TouchableOpacity style={[styles.bottomButton, styles.buttonTurnPrivate]} onPress={this.goToPrivatePage}>
          <Text style={[{ color: '#fcb836' }, baseStyles.fz15]}>转私</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.bottomButton, styles.buttonTurnPrivate, styles.buttonDisabled]}>
        <Text style={[{ color: '#c5c5c5' }, baseStyles.fz15]}>已转私</Text>
      </View>
    );
  }

  // 返回查看二手房, 出租房按钮
  getHouseListButton(houseListButtonPropData) {
    // 客户被激活了且请求二手房或出租房接口返回数据不为空时才能显示按钮
    if (this.screenProps.activeAt === '') {
      return null;
    }

    return (
      <HouseListButton data={houseListButtonPropData} />
    );
  }


  render() {
    /**
      *页签二手房,出租房切换时,'查看适合客户的房源'处的按钮显示不同的文字
    */
    let houseListButtonPropData;
    if (this.screenProps.activeAt !== '') {
      if (this.state.houseTab === 'secondHouseTab') {
        const houseData = Object.keys(this.secondHouseData).length ? this.secondHouseData : {};
        houseListButtonPropData = { text: '查看适合该客户的二手房', type: 'SALE', houseData };
      } else if (this.state.houseTab === 'rentHouseTab') {
        const houseData = Object.keys(this.rentHouseData).length ? this.rentHouseData : {};
        houseListButtonPropData = { text: '查看适合该客户的出租房', type: 'RENT', houseData };
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f9' }}>
        { /* 头部信息 */}
        <HeaderInfo ref={(headerInfo) => { this.headerInfo = headerInfo; }} />
        { /* 二手房和出租房切换 */}
        <TabList houseTypeChange={this.houseTypeChange} />
        { /* 底部转私和查看二手房,出租房按钮,请求完成拿到数据再显示按钮 */}
        {this.state.valid && (houseListButtonPropData && Object.keys(houseListButtonPropData.houseData).length ?
          (<View style={styles.bottomButtonBar}>
            {this.getPrivateButton()}
            {this.getHouseListButton(houseListButtonPropData)}
          </View>) :
          (<View style={[styles.bottomButtonBar, { justifyContent: 'center' }]}>
            {this.getPrivateButton()}
          </View>))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomButtonBar: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopColor: '#e6e6e6',
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,

  },
  bottomButton: {
    height: 36,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTurnPrivate: {
    width: '26%', // 90/345
    borderColor: '#fcb836',
    borderWidth: 1,
  },
  buttonDisabled: {
    borderColor: '#c5c5c5',
  },
});
