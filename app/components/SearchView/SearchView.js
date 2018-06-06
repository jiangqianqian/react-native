/**
 * qfang.com broker-app
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';

import UserInfo from '../../common/UserInfo';

import Icon from '../../components/Icon/';
import Autocomplete from '../../components/AutoComplete';
import SearchHistory from './SearchHistory';
import styles from './Search.style';

class Search extends PureComponent {
  static navigationOptions = {
    header: null
  };

  static defaultProps = {
    list: [],
    itemKey: 'id',
    itemValue: 'value',
    placeholderText: '请输入关键字',
    historyKey: 'historyList',
    renderItem: () => null,
    onSelect: () => null,
    transform: (data) => data,
  };

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      query: props.query || ''
    };

    this.historyKey = `${this.props.historyKey}-${UserInfo.accountId}`;

  }

  // 关键字输入后向后台模糊查询
  requestData(query) {
    if (query.length === 0) {
      this.setState({
        list: []
      });
      return;
    }

    axios.get(this.props.url, {
      params: {
        keyword: query
      }
    }).then((res) => {

      if (res.data.status === 'C0000') {
        this.setState({
          list: this.props.transform(res.data)
        });
      } else {
        this.setState({
          list: []
        });
      }
    });
  }

  /* 选中项后的操作
   * 保存到历史记录中
   * 调用外部"选中"方法进行相应处理
   */
  _selectItem(item) {
    this._saveHistory(item);

    // 回显选中的文字到输入框中
    // this.setState({ query: item[this.props.itemValue] });

    this.props.onSelect(item);
  }

  _saveHistory(item) {
    const { itemKey } = this.props;

    storage.load({ key: this.historyKey }).then(list => {

      if (list.length >= 5) {
        list.pop();
      }

      // 过滤选过相同的记录
      list = list.filter(val => {
        return item[itemKey] != val[itemKey];
      });

      list.unshift(item);

      storage.save({
        key: this.historyKey,
        data: list,
      });

    }).catch(err => {
      // 未保存过历史记录，则追回一条
      storage.save({
        key: this.historyKey,
        data: [item],
      });
    });
  }

  // 查询结果的展示
  _renderItem = ({ item }) => {
    return this.props.renderItem(item);

    // (
    //   <TouchableOpacity style={styles.itemRow} onPress={() => { this._selectItem(item) }}>
    //     {this.props.renderItem(item)}
    //   </TouchableOpacity>
    // );
  };

  _renderTextInput(props) {

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.inputStyle, styles.searchView]}>
          <Icon name="magnifier" size={18} color="#7e7e7e" style={styles.searchIcon} />
          <TextInput {...props} style={styles.inputStyle} underlineColorAndroid="transparent" />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => { props.navigation.goBack() }}>
          <Text style={styles.buttonText}>
            取消
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let { query } = this.state;
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          containerStyle={styles.autocompleteContainer}
          data={this.state.list}
          inputContainerStyle={styles.inputContainerStyle}
          listContainerStyle={styles.listContainerStyle}
          listStyle={[styles.listStyle, this.props.listStyle]}
          renderTextInput={this._renderTextInput.bind(this)}
          onChangeText={(text) => {
            this.setState({ query: text.trim() });
            this.requestData(text.trim());
          }}
          placeholder={this.props.placeholderText}
          renderItem={this._renderItem.bind(this)}
          navigation={this.props.navigation}
        />
        <SearchHistory
          query={this.state.query}
          historyKey={this.historyKey}
          renderItem={this._renderItem.bind(this)} />
      </View>
    );
  }
}

export default Search;
