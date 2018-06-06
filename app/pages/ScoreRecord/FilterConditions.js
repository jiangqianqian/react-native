import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  DeviceEventEmitter,
} from 'react-native';

import PropTypes from 'prop-types';
import axios from 'axios';
import { QFReactHelper } from '../../common/NativeHelper';

import DatePicker from '../../components/DatePicker/DatePicker';
import GoBack from '../../components/GoBack';
import baseStyles from '../../components/baseStyles';

export default class FilterConditions extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: '筛选条件',
      headerLeft: (<GoBack navigation={navigation} />),
      headerRight: (
        <TouchableOpacity style={{ paddingRight: 15 }} onPress={() => params.reset()}>
          <Text style={styles.saveTxt}>重置</Text>
        </TouchableOpacity>
      ),
    };
  }

  constructor() {
    super();

    this.state = {
      startDate: '',
      endDate: '',
      itemData: [],
      dataNomit: true,
    };

    this.item = ''; // 能力得分ID
    this.scoreType = '';// 加减分项
  }

  componentDidMount() {
    this.props.navigation.setParams({
      reset: this.reset.bind(this),
    });

    InteractionManager.runAfterInteractions(() => {
      // 请求能力项数据
      this.requestData();

      // 设置日期选择的最小值与最大值 （最小日期和最小日期设置 相差不超过90天）
      const nowDate = new Date();
      this.maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
      const selectDate = nowDate.getDate();
      const setNewDate = new Date(nowDate.setDate(selectDate - 89));
      this.minDate = setNewDate.getFullYear() + '-' + (setNewDate.getMonth() + 1) + '-' + setNewDate.getDate();
    });
  }

  setRefStyle(refType, type) {
    if (type === 'active') {
      this[refType].setNativeProps({
        style: {
          borderColor: '#fcb836',
        },
      });

      this[(refType + 'Text')].setNativeProps({
        style: {
          color: '#fcb836',
        },
      });
    } else {
      this[refType].setNativeProps({
        style: {
          borderColor: '#c5c5c5',
        },
      });

      this[(refType + 'Text')].setNativeProps({
        style: {
          color: '#9c9fae',
        },
      });
    }
  }

  // 条件选择 首先清空当前点击列的当前状态 然后再使当前点击高亮
  filterSelect(key, value, refIndex) {
    InteractionManager.runAfterInteractions(() => {
      if (key === 'date') {
        this.setState({
          startDate: '',
          endDate: '',
          dataNomit: true,
        });

        this.minDate = ' ';
      } else if (key === 'item') {
        const length = this.state.itemData.length + 2;

        for (let i = 1; i < length; i++) {
          this.setRefStyle(('item' + i + 'Ref'));
        }

        this.setRefStyle(('item' + refIndex + 'Ref'), 'active');
        this.item = value;
      } else if (key === 'scoreType') {
        const scoreTypeArry = ['Nomit', 'ADD', 'MINUS'];

        for (let i = 0, length = scoreTypeArry.length; i < length; i++) {
          this.setRefStyle(('scoreType' + scoreTypeArry[i] + 'Ref'));
        }

        this.setRefStyle(('scoreType' + refIndex + 'Ref'), 'active');
        this.scoreType = value;
      }
    });
  }

  requestData() {
    axios.get('evaluation/item', { params: { desc: false } })
      .then((res) => {
        if (res.data.code === 'C0000') {
          const items = res.data.data;
          this.capabilityItemsArry = [];

          for (let i = 0; i < items.length; i++) {
            this.capabilityItemsArry.push(items[i].id);
          }

          // 重置上一次选择的条件
          const filterNaviParams = this.props.navigation.state.params;
          if (Object.keys(filterNaviParams).length > 1) {
            this.setState({
              dataNomit: (filterNaviParams.startDate || filterNaviParams.endDate) ? false : true,
              itemData: items,
              startDate: filterNaviParams.startDate ? filterNaviParams.startDate : null,
              endDate: filterNaviParams.endDate ? filterNaviParams.endDate : null,
            });

            const capabilityCacheIndex = this.capabilityItemsArry.indexOf(filterNaviParams.item);

            if (capabilityCacheIndex >= 0) {
              this.filterSelect('item', filterNaviParams.item, capabilityCacheIndex + 2);
            }

            if (filterNaviParams.scoreType) {
              this.filterSelect('scoreType', filterNaviParams.scoreType, filterNaviParams.scoreType);
            }
          } else {
            this.setState({
              itemData: items,
            });
          }
        }
      });
  }

  reset() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        startDate: '',
        endDate: '',
        dataNomit: true,
      });

      this.item = '';
      this.scoreType = '';

      this.filterSelect('item', '', 1);// 重置能力项
      this.filterSelect('scoreType', '', 'Nomit'); // 重置加减分项
    });
  }

  dateSelect(date, type) {
    InteractionManager.runAfterInteractions(() => {
      if (type === 'start') {
        this.setState({ startDate: date, dataNomit: false });
      } else if (type === 'end') {
        this.setState({ endDate: date, dataNomit: false });
      }
    });
  }

  submitFilter() {
    InteractionManager.runAfterInteractions(() => {
      const startDate = this.state.startDate;
      const endDate = this.state.endDate;

      if (startDate && endDate) {
        const startDateTime = +new Date(this.state.startDate);
        const endDateTime = +new Date(this.state.endDate);
        if (startDateTime > endDateTime) {
          QFReactHelper.show("开始日期不能大于结束日期", 5);
          return false;
        }
      }

      const params = {
        startDate: this.state.startDate ? this.state.startDate : '',
        endDate: this.state.endDate ? this.state.endDate : '',
        item: this.item ? this.item : '',
        scoreType: this.scoreType ? this.scoreType : '',
      };

      DeviceEventEmitter.emit('filterParams', params);
      this.props.navigation.goBack();
    });
  }

  render() {
    return (
      <View style={[baseStyles.container, styles.filterContainer]}>
        <View style={styles.filterList}>
          <View style={styles.listTitle}><Text style={styles.listTitleText}>时间</Text></View>
          <TouchableOpacity ref={(ref) => { this.dateNomitRef = ref; }} onPress={this.filterSelect.bind(this, 'date', 22)} style={[styles.filter, this.state.dataNomit ? styles.filterActive : '', { marginBottom: 25 }]}><Text style={[styles.filterText, this.state.dataNomit ? styles.filterActiveText : '']}>不限</Text></TouchableOpacity>
          <View style={[baseStyles.rowcenter, styles.filterCont]}>
            <View style={{ marginRight: 6 }}><Text style={{ color: '#333', fontSize: 14 }}>自定义时间</Text></View>
            <DatePicker
              style={styles.dateSelect}
              date={this.state.startDate}
              mode="date"
              placeholder="起始日期"
              format="YYYY-MM-DD"
              minDate={this.minDate}
              maxDate={this.maxDate}
              confirmBtnText="确定"
              cancelBtnText="取消"
              tipsText="支持查看90天内记录"
              showIcon={false}
              customStyles={{
                dateInput: {
                  marginLeft: 5,
                  height: 25,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: '#f6f6f6',
                },
              }}
              onDateChange={(date) => { this.dateSelect(date, 'start'); }}
            />
            <View><Text style={{ color: '#e0e0e0' }}> - </Text></View>
            <DatePicker
              style={styles.dateSelect}
              date={this.state.endDate}
              mode="date"
              placeholder="结束日期"
              format="YYYY-MM-DD"
              minDate={this.minDate}
              maxDate={this.maxDate}
              confirmBtnText="确定"
              cancelBtnText="取消"
              tipsText="支持查看90天内记录"
              showIcon={false}
              disabled={false}
              customStyles={{
                dateInput: {
                  marginLeft: 5,
                  height: 25,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: '#f6f6f6',
                },
              }}
              onDateChange={(date) => { this.dateSelect(date, 'end'); }}
            />
          </View>
        </View>
        <View style={styles.filterList}>
          <View style={styles.listTitle}><Text style={styles.listTitleText}>能力项</Text></View>
          <View style={[baseStyles.rowcenter, styles.filterCont]}>
            <TouchableOpacity onPress={this.filterSelect.bind(this, 'item', ' ', 1)} ref={(ref) => this.item1Ref = ref} style={[styles.filter, styles.filterActive]}><Text ref={(ref) => this.item1RefText = ref} style={[styles.filterText, styles.filterActiveText]}>不限</Text></TouchableOpacity>
            {this.state.itemData.map((v, i) => {
              return (<TouchableOpacity key={i} onPress={this.filterSelect.bind(this, 'item', v.id, (i + 2))} ref={(ref) => this['item' + (i + 2) + 'Ref'] = ref} style={styles.filter}><Text ref={(ref) => this['item' + (i + 2) + 'RefText'] = ref} style={styles.filterText}>{v.name || ''}</Text></TouchableOpacity>)
            })}
          </View>
        </View>
        <View style={styles.filterList}>
          <View style={styles.listTitle}><Text style={styles.listTitleText}>加减分项</Text></View>
          <View style={[baseStyles.rowcenter, styles.filterCont]}>
            <TouchableOpacity onPress={this.filterSelect.bind(this, 'scoreType', ' ', 'Nomit')} ref={(ref) => this.scoreTypeNomitRef = ref} style={[styles.filter, styles.filterActive]}><Text ref={(ref) => this.scoreTypeNomitRefText = ref} style={[styles.filterText, styles.filterActiveText]}>不限</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.filterSelect.bind(this, 'scoreType', 'ADD', 'ADD')} ref={(ref) => this.scoreTypeADDRef = ref} style={styles.filter}><Text ref={(ref) => this.scoreTypeADDRefText = ref} style={styles.filterText}>加分</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.filterSelect.bind(this, 'scoreType', 'MINUS', 'MINUS')} ref={(ref) => this.scoreTypeMINUSRef = ref} style={styles.filter}><Text ref={(ref) => this.scoreTypeMINUSRefText = ref} style={styles.filterText}>减分</Text></TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[baseStyles.rowcenter, styles.submitBtn]} onPress={this.submitFilter.bind(this)}>
          <Text style={[baseStyles.fz16, baseStyles.colorFff]}>确定</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingTop: 20,
    backgroundColor: '#fff',
  },

  saveTxt: {
    color: '#fff',
    fontSize: 16,
  },

  filterList: {
    marginTop: 20,
    marginLeft: 15,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dbdbdb',
  },

  filterCont: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },

  dateSelect: {
    width: 90,
    height: 25,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listTitle: {
    marginBottom: 20,
  },

  listTitleText: {
    color: '#333',
    fontSize: 16,
  },

  filter: {
    width: 75,
    height: 25,
    marginLeft: 5,
    marginRight: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c5c5c5',
    borderRadius: 2,
  },

  filterActive: {
    borderColor: '#fcb836',
  },

  filterText: {
    fontSize: 12,
    color: '#9c9fae',
  },

  filterActiveText: {
    color: '#fcb836',
  },

  submitBtn: {
    marginLeft: 20,
    marginRight: 20,
    width: '90%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcb836',
    borderRadius: 4,
    position: 'absolute',
    bottom: 10,
  },
});