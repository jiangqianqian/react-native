import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Easing,
  Dimensions,
  DeviceEventEmitter,
  TextInput,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import * as Constants from '../../common/Constants';
import GoBack from '../../components/GoBack';

const { width, height } = Dimensions.get('window');
const [left, top] = [0, 0];

/**
 * filter数据展示控件，可单独部署也可嵌入部署
 * <b>filterViewClose事件，用于关闭内嵌弹出层而不选择值</b>
 * <b>filterViewSubmit事件，用于自定义View提交值响应</b>
 *
 * eventName:选填，监听事件名称，不填则默认"filterChoose"
 * field:字段名，必填，回传参数时写回
 * title:选填，导航组件title参数
 * contentViewStyle:选择栏自定义样式
 * contentTextStyle:文本框自定义样式
 * entityList：选择项数据数组
 *            key:实际参数值
 *            value:显示值
 * customData:自定义参数数据
 *            type:类型，可不填。
 *                 * '2-Input'，默认类型，是高低两个输入区的文本输入
 *                 * 'custom'，表示自定义view组件，将替换本组件默认的文本输入view
 *            customView:当type为'custom'时必填，表示自定义view组件，将替换本组件默认的文本输入view
 *            placeHolderLow:默认文本输入view有效，可不填，低区placeHolder显示内容
 *            placeHolderHigh:默认文本输入view有效，可不填，高区placeHolder显示内容
 *            unit: 单位，不填则不显示
 */
const filterChooseEventName = 'filterChoose';
export default class FilterView extends Component {
  constructor(props) {
    super(props);
    this.entityList = []; // 下拉数据列
    if (props.embed) {
      this.state = {
        animate: true,
        hide: true,
        topDistance: Constants.STANDARD_HEIGHT * 0.066,
      };
      this.entityPromise = null;
      this.customData = null; // 自定义数据列
      this.dataField = null; // 回传字段名
      this.contentViewStyle = null; // 选择栏自定义样式
      this.contentTextStyle = null; // 文本框自定义样式
      this.eventName = props.eventName ? props.eventName : filterChooseEventName;
    } else {  // 单独页面跳转
      this.entityPromise = this.props.navigation.state.params.entityList;
      this.customData = this.props.navigation.state.params.customData;
      this.dataField = this.props.navigation.state.params.field;
      this.contentViewStyle = this.props.navigation.state.params.contentViewStyle;
      this.contentTextStyle = this.props.navigation.state.params.contentTextStyle;

      // 响应事件
      this.eventName = this.props.navigation.state.params.eventName ?
        this.props.navigation.state.params.eventName : filterChooseEventName;

      this.state = {
        hide: false,
        topDistance: 0
      };
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title || '',
    headerLeft: (<GoBack navigation={navigation} />)
  });

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('filterViewClose', () => {
      this.out();
    });
    // 内嵌模式
    if (!this.props.embed) {
      let _this = this;
      this.entityPromise.then((data) => {
        _this.entityList = data;
        _this.setState({ hide: false });
      });
    }
    // 选择项组件自定义
    this.subscriptionSubmit = DeviceEventEmitter.addListener('filterViewSubmit', (data) => {
      this._submit(data);
    });
  }

  componentWillUnmount() {
    // 移除
    this.subscription.remove();
    this.subscriptionSubmit.remove();
  }

  render() {
    if (this.state.hide) {
      return null;
    } else {
      let containerHeight = this.entityList.length * Constants.HEIGHT_RATIO * 44;
      if (this.customData != null) {
        containerHeight = containerHeight + Constants.HEIGHT_RATIO * 57;
      }
      if (this.state.animate) {
        return this.returnEmbedView(containerHeight);
      } else {
        return this.returnView(containerHeight);
      }
    }
  }

  returnView(containerHeight) {
    return (
      <ScrollView style={[styles.container, {
        height: containerHeight > Constants.STANDARD_HEIGHT ? Constants.STANDARD_HEIGHT : containerHeight,
        top: top + this.state.topDistance
      }]}>
        {
          this.entityList.map((item, i) => this._renderItem(item, i))
        }
        {
          this.customData == null ? null : this.returnSubmitView()
        }
      </ScrollView>
    )
  }

  returnEmbedView(containerHeight) {
    return (
      <View style={[styles.container, { height: containerHeight, top: top + this.state.topDistance }]}>
        <View style={[styles.mask, { flex: 1 }]}>
          <TouchableOpacity onPress={() => this._blackOut()} style={{ flex: 1 }} />
        </View>

        <View style={[styles.tip]}>
          <ScrollView style={{ height: containerHeight > 300 ? 300 : containerHeight }}>
            {
              this.entityList.map((item, i) => this._renderItem(item, i))
            }
            {
              this.customData == null ? null : this.returnSubmitView()
            }
          </ScrollView>
        </View>
      </View>
    );
  }

  /**
   * 底部自定义提交按钮栏
   */
  returnSubmitView() {
    return (
      <View>
        {
          'custom' == this.customData.type ?
            (this.customData.customView ? this.customData.customView : null) :
            (
              <View style={styles.submitView}>
                <TextInput onChangeText={(text) => this.state.customDataLow = text}
                  style={[styles.submitViewLow]} keyboardType="numeric"
                  placeholder={this.customData ? this.customData.placeHolderLow : ''}
                  maxLength={8} underlineColorAndroid='transparent'></TextInput>
                <Text style={[styles.submitViewGip]}>—</Text>
                <TextInput onChangeText={(text) => this.state.customDataHigh = text}
                  style={[styles.submitViewLow, styles.submitViewHigh]} keyboardType="numeric"
                  placeholder={this.customData ? this.customData.placeHolderHigh : ''}
                  maxLength={8} underlineColorAndroid="transparent"></TextInput>
                <Text style={[styles.submitViewGip, { width: Constants.WIDTH_RATIO * 30 }]}>
                  {this.customData ? this.customData.unit : ''}</Text>
                <TouchableHighlight style={styles.button} underlayColor="#f0f0f0" onPress={() => this._submit()}>
                  <Text style={styles.buttonText}>确定</Text>
                </TouchableHighlight>
              </View>
            )
        }
      </View>
    );
  }

  _renderItem(item, i) {
    return (
      <TouchableHighlight key={i} style={[styles.tipContentView, this.contentViewStyle]}
        underlayColor="#f0f0f0" onPress={() => this._choose(item)}>
        <Text style={[styles.tipText, this.contentTextStyle]}>{item.value}</Text>
      </TouchableHighlight>
    );
  }

  _blackOut() {
    this.out();
    DeviceEventEmitter.emit("blackClose", null);
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
  }

  // 隐藏动画
  out() {
    this.setState({ hide: true });
  }

  // 点击确认提交
  _submit(data = null) {
    let item = {};
    // 自定义组件
    if (this.customData && 'custom' == this.customData.type) {
      item.key = data;
    } else {  // 默认高低区输入Vew
      item.key = [this.state.customDataLow, this.state.customDataHigh];
    }
    this._choose(item);
  }

  // 选择最终结果
  _choose(item) {
    let data = { field: this.dataField, item: item };
    if (!this.state.hide) {
      DeviceEventEmitter.emit(this.eventName, data);
      if (this.state.animate) {
        this.out();
      } else {
        this.props.navigation.goBack();
      }
    }
  }

  show(field, entityList, customData = null, contentViewStyle = null, contentTextStyle = null) {
    this.entityList = [];
    this.dataField = field;
    this.entityPromise = entityList;
    this.customData = customData;
    this.contentViewStyle = contentViewStyle;
    this.contentTextStyle = contentTextStyle;
    let _this = this;
    this.entityPromise.then((data) => {
      _this.entityList = data;
      _this.setState({ hide: false }, _this.state.hide ? this.in : () => {
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: width,
    height: height,
    left: left
  },
  mask: {
    justifyContent: "center",
    backgroundColor: "#383838",
    opacity: 0.8,
    position: "absolute",
    width: width,
    height: height,
    left: left,
    top: top,
    elevation: 99
  },
  tip: {
    width: width,
    backgroundColor: "#fff",
    top: top,
    elevation: 99,
  },
  tipContentView: {
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    height: Constants.HEIGHT_RATIO * 44,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  tipText: {
    marginLeft: Constants.WIDTH_RATIO * 17,
    color: "#3a3a3a",
    fontSize: 16,
    textAlignVertical: "bottom"
  },
  submitView: {
    borderTopWidth: 0.5,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    height: Constants.HEIGHT_RATIO * 57,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  submitViewLow: {
    marginTop: Constants.HEIGHT_RATIO * (Constants.OS == 'ios' ? 14 : 8),
    marginLeft: Constants.WIDTH_RATIO * 15,
    width: Constants.WIDTH_RATIO * 90,
    height: Constants.HEIGHT_RATIO * (Constants.OS == 'ios' ? 30 : 40),
    borderRadius: 2,
    backgroundColor: "#f5f5f9",
    fontSize: 14,
    textAlign: 'center',
  },
  submitViewHigh: {
    marginLeft: Constants.WIDTH_RATIO * 3,
  },
  submitViewGip: {
    marginLeft: Constants.WIDTH_RATIO * 3,
    width: Constants.WIDTH_RATIO * 14,
    marginTop: Constants.HEIGHT_RATIO * 19,
  },
  button: {
    marginTop: Constants.HEIGHT_RATIO * 14,
    marginLeft: Constants.WIDTH_RATIO * 25,
    width: Constants.WIDTH_RATIO * 90,
    height: Constants.HEIGHT_RATIO * 30,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ffa200",
  },
  buttonText: {
    fontSize: 14,
    color: "#999999",
    textAlign: 'center',
  },
});
