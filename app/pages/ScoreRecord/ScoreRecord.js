import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  DeviceEventEmitter,
  InteractionManager,
} from 'react-native';

import GoBack from '../../components/GoBack';
import baseStyles from '../../components/baseStyles';
import Icon from '../../components/Icon';

import RecordList from './RecordList';

export default class ScoreRecord extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    // const { params ={} } = navigation.state;
    return {
      title: '得分记录',
      headerLeft: (<GoBack navigation={navigation} />),
    };
  }

  state = {
    params: {},
  }

  componentDidMount() {
    // 获取参数重生刷新列表
    this.scoreRecordRefresh = DeviceEventEmitter.addListener('filterParams', (params) => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          params: params,
        });

        this.filterParam = params;

        if (Object.values(params).join('').length) {
          this.filterIconRef.iconRef.setNativeProps({
            style: {
              color: '#fcb836',
            },
          });

          this.filterRef.setNativeProps({
            style: {
              color: '#fcb836',
            },
          });
        } else {
          this.filterIconRef.iconRef.setNativeProps({
            style: {
              color: '#fff',
            },
          });

          this.filterRef.setNativeProps({
            style: {
              color: '#fff',
            },
          });
        }

        // 刷新子组件的listView
        this.recordListRef.listView.refresh();
        // 如果有数据 是listView滚动条滚动到顶部
        if (this.recordListRef.listView.getRows().length > 0) {
          this.recordListRef.listView.scrollToIndex({ animated: false, viewPosition: 0, index: 0 });
        }
      });
    });
  }

  componentWillUnmount() {
    this.scoreRecordRefresh.remove();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.container, { backgroundColor: '#fff' }]}>
        <RecordList ref={(ref) => { this.recordListRef = ref; }} params={this.state.params} />
        <TouchableOpacity style={[baseStyles.rowcenter, styles.filterBtn]} onPress={() => navigate('FilterConditions', this.filterParam)}>
          <Icon name="shaixuan" size={18} color="#fff" ref={(c) => this.filterIconRef = c}/>
          <Text style={[baseStyles.fz16, baseStyles.colorFff, { marginLeft: 5 }]} ref={(c) => this.filterRef = c}>筛选</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterBtn: {
    width: 95,
    height: 35,
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -47.5,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(112,112,112, 0.7)',
    borderRadius: 4,
  },
});