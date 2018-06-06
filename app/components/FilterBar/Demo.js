/**
 * Created by yoara on 2017/7/6.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  DeviceEventEmitter,
  TextInput
} from 'react-native';
import FilterBar from './FilterBar';
import * as FilterData from './FilterData';
import * as Constants from '../../common/Constants';

export default class Demo extends PureComponent {
  constructor () {
    super();
    this.state = {loading : true};
  }

  componentDidMount () {
    this.subscription = DeviceEventEmitter.addListener('demoInfo', (data) => {
      let field = data.field;
      let value = data.item.key;
      if (value instanceof Array) {
        value = value.join(',');
      }
      this.setState({choice : `字段名：${field}，字段值：${value}`});
    });
  }

  componentWillUnmount () {
    // 移除
    this.subscription.remove();
  }

  render () {
    let customView = (
      <View style={{height : Constants.HEIGHT_RATIO * 57}}>
        <TextInput style={{height : Constants.HEIGHT_RATIO * 57, width : Constants.STANDARD_WIDTH}}
                   onSubmitEditing={(event) => {
                     DeviceEventEmitter.emit('filterViewSubmit', event.nativeEvent.text);
                   }}></TextInput>
      </View>
    );

    let contentTextStyle = {
      fontSize : 18,
      color : "#456789",
    };
    let contentViewStyle = {
      borderBottomColor : "#223344",
    }
    let bar = [
      {
        text : '房型',
        field : 'houseType',
        dataList : FilterData.getHouseStyle()
      },
      {
        text : '分组',
        field : 'group',
        dataList : FilterData.getGroup()
      },
      {
        text : '价格',
        field : 'price',
        dataList : FilterData.getPrice(),
        contentTextStyle:contentTextStyle,
        contentViewStyle:contentViewStyle,
        customData : {
          placeHolderLow : '最低价格',
          placeHolderHigh : '最高价格',
          unit : '万元'
        }
      },
      {
        text : '自定义View',
        field : 'price',
        dataList : FilterData.getPrice(),
        customData : {
          type : 'custom',
          customView : customView,
        }
      },
    ];

    //embed
    return (
      <View style={styles.container}>
        <FilterBar items={bar} emitName="demoInfo"></FilterBar>
        <Text>等待选择：{this.state.choice}</Text>
      </View>);

    //navigation，单独选项切换页面
    //navigate('FilterView', {
    //    entityList: bar[2].dataList,
    //    customData:bar[2].customData,
    //    field:bar[2].field,
    //    contentViewStyle:bar[2].contentViewStyle,
    //    contentTextStyle:bar[2].contentTextStyle,
    // })
  }
}

const styles = StyleSheet.create({
  container : {
    justifyContent : 'space-between',
    flex : 1,
  },
});
