import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  Linking,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import * as Constants from '../../common/Constants';

const { width, height } = Dimensions.get('window');
const [cellW] = [width - 28];
const [left, top] = [0, 0];
const [middleLeft] = [(width - cellW) / 2];

export default class BottomEvent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      hide: true,
    };
    this.entityList = [];// 数据源
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidUpdate() {

  }

  render() {
    if (this.state.hide) {
      return null;
    } else {
      let containerHeight = this.entityList.length * 40 + 100;
      this.state.containerHeight = containerHeight;
      return (
        <View style={[styles.container, { height: containerHeight }]}>
          <View style={styles.mask} />

          <View style={[styles.tip, { marginTop: this.state.animateHeight || height }]}>
            <View style={styles.tipTitleView}>
              <Text style={styles.tipTitleText}>{this.state.title}</Text>
            </View>
            {
              this.entityList.map((item, i) => this._renderItem(item, i))
            }

            <View style={styles.gap} />

            <TouchableHighlight style={styles.button} underlayColor="#f0f0f0" onPress={() => this._cancel()}>
              <Text style={styles.buttonText}>取消</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }

  _renderItem(item, i) {
    return (
      <TouchableHighlight key={i} style={styles.tipContentView}
        underlayColor="#f0f0f0" onPress={() => this._choose(item)}>
        <Text style={styles.tipText}>
          {item['showContent'] == null ? item['phone'] + ' (' + item['name'] + ')' : item['showContent']}</Text>
      </TouchableHighlight>
    );
  }

  // 显示动画
  in() {
    LayoutAnimation.configureNext({
      duration: 200, // 持续时间
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    this.setState({ animateHeight: height - this.state.containerHeight - 34 });
  }

  // 隐藏动画
  out() {
    this.setState({ animateHeight: height, hide: true });
  }

  // 取消
  _cancel() {
    if (!this.state.hide) {
      this.out();
    }
  }

  // 选择
  _choose(item) {
    if (!this.state.hide) {
      if ('tel' == item.type || 'sms' == item.type) {
        let url = 'tel' == item.type ? 'tel:' + item.phone : 'sms:' + item.phone;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            Alert.alert('当前版本不支持拨打号码或发送短信');
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.log('未知错误' + err));
      } else if ('func' == item.type) {
        item.func(item);
      }
      this.out();
    }
  }

  /**
   * 弹出控件
   * title: 标题
   * entityList：选择项数据   数组
   *            name:姓名
   *            phone:电话
   *           showContent:弹出框现实内容，不填则显示[（电话） 姓名]
   *            type:(tel/sms/func回调函数)
   */
  show(title: string, entityList: Array) {
    this.entityList = entityList;
    if (this.state.hide) {
      this.setState({ title: title, hide: false }, this.in);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    marginTop: -height + Constants.STANDARD_HEIGHT * 0.08,   // 54是BottomBar的高度
    left: left,
    top: top,
  },
  mask: {
    justifyContent: 'center',
    backgroundColor: '#383838',
    opacity: 0.8,
    position: 'absolute',
    width: width,
    height: height,
    left: left,
    top: top,
    elevation: 99
  },
  tip: {
    width: cellW,
    left: middleLeft,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 99,
    borderRadius: 5,
  },
  tipTitleView: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitleText: {
    color: '#3a3a3a',
    fontSize: 17,
    fontWeight: 'bold'
  },
  tipContentView: {
    width: cellW,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    color: '#ffa200',
    fontSize: 17,
    textAlign: 'center',
  },
  button: {
    height: 40,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 17,
    color: '#999',
    textAlign: 'center',
  },
  gap: {
    height: 10,
    width: cellW,
    backgroundColor: '#383838',
    opacity: 0.8,
  },
});
