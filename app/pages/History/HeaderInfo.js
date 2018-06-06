import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { QFReactHelper } from '../../common/NativeHelper';
import UserInfo from '../../common/UserInfo';
import Icon from '../../components/Icon/';

// 处理电话号码
function formatTel(tel) {
  if (!tel) { return null; }
  return `${tel.substring(0, 3)} ${tel.substring(3, 7)} ${tel.substring(7, 11)}`;
}

export default class HeaderInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.screenProps = UserInfo[UserInfo.target];
    this.goToCustomerDetail = this.goToCustomerDetail.bind(this);
  }
  // 拨打电话或发送短信
  openUrl(type, text) {
    Linking.canOpenURL(`${type}:${this.screenProps.cell}`).then((supported) => {
      if (!supported) {
        Alert.alert(text);
      } else {
        // QFReactHelper.statistical('event', 'XF-CustomerList-Dial');
        Linking.openURL(`${type}:${this.screenProps.cell}`);
      }
    }).catch((err) => { console.log(`未知错误${err}`); });
  }

  goToCustomerDetail() {
    QFReactHelper.showPage('CUSTOMER_DETAIL', {
      customerId: this.screenProps.customerId,
      beInviteId: this.screenProps.beInviteId,
    });
  }

  render() {
    // 用户信息
    const screenProps = this.screenProps;

    // 根据转私状态判断是否要显示信息和电话图标
    let rightInfo = null;
    if (!screenProps.isPrivate) {
      rightInfo = (
        <View style={styles.rightInfo}>
          <View style={styles.iconBox}>
            <TouchableOpacity
              style={[styles.iconWrap, styles.iconWrapMsg]}
              onPress={() => this.openUrl('sms', '当前版本不支持发送短信')}
            >
              <Icon name="duanxin" size={28} color="#fcb836" />
            </TouchableOpacity>
          </View>
          <View style={styles.iconBox}>
            <TouchableOpacity
              style={[styles.iconWrap, styles.iconWrapTel]}
              onPress={() => this.openUrl('tel', '当前版本不支持拨打号码')}
            >
              <Icon name="dianhua" size={28} color="#25ae5f" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.leftInfo}>
          <View style={styles.telWrap}>
            {screenProps.isPrivate ?
              (<TouchableOpacity onPress={this.goToCustomerDetail}>
                <Text style={styles.telText}>{`${screenProps.name}  `}{formatTel(screenProps.cell)}</Text>
              </TouchableOpacity>) :
              (<Text style={styles.telText}>{formatTel(screenProps.cell)}</Text>)
            }
          </View>
          <View style={styles.timeWrap}>
            <Text style={styles.timeText}>注册时间: {screenProps.regAt || '暂无'}</Text>
          </View>
          <View style={styles.timeWrap}>
            <Text style={styles.timeText}>最后浏览时间: {screenProps.lastBrowseAt || '暂无'}</Text>
          </View>
        </View>
        {rightInfo}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
    backgroundColor: '#fff',
  },
  leftInfo: {
    flex: 1,
  },
  telWrap: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  timeWrap: {
    paddingBottom: 5,
  },
  telText: {
    fontSize: 18,
    color: '#3a3a3a',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    color: '#7e7e7e',
  },
  rightInfo: {
    paddingTop: 2.5,
    width: 118,
    flexDirection: 'row',
  },
  iconBox: {
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginRight: 15,
  },
  iconWrapMsg: {
    backgroundColor: 'rgba(252,184,54,.4)',
  },
  iconWrapTel: {
    backgroundColor: 'rgba(37,174,95,.4)',
  },
});
