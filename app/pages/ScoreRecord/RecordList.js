import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import axios from 'axios';
import UltimateListView from 'react-native-ultimate-listview';

import baseStyles from '../../components/baseStyles';
import StatusView from '../../components/StatusView';
import RenderItem from './RenderItem';

export default class RankList extends PureComponent {
  static PropTypes = {
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      status: '',
    };
  }

  _renderItem(data) {
    return (<RenderItem data={data} />);
  }

  async onFetch(page, startFetch, abortFetch) {
    try {
      this.params = this.props.params;
      this.params.page = page || 1;
      const res = await this.requestData();
      startFetch(res);
    } catch (error) {
      abortFetch();
      console.log(error);
    }
  }

  params = { page: 1 }

  requestData() {
    return axios.get('evaluation/taskRecords', { params: this.params || {} })
      .then((res) => {
        if (res.data.code === 'C0000') {
          const items = res.data.data.items;
          this.taskRecordItems = items;
          this.setState({
            status: items.length ? '' : 'no-data-found',
          });
          return items;
        }

        this.setState({
          status: 'request-failed',
        });
        return [];
      }).catch(() => {
        this.setState({
          status: 'network-error',
        });

        return [];
      });
  }

  render() {
    return (
      <View style={[baseStyles.container, { backgroundColor: '#fff' }]}>
        <UltimateListView
          onFetch={this.onFetch.bind(this)}
          getItemLayout={(data, index) => ({
            length: 132, offset: 132 * index, index
          })}
          ref={(ref) => this.listView = ref}
          keyExtractor={(item, index) => { return index }}
          refreshable={false}
          item={this._renderItem.bind(this)}
          numColumns={1}
          pagination={true}
          paginationFetchingView={() => {
            return (
              <View style={styles.fetchLoading}>
                <StatusView styles={{ backgroundColor: '#fff' }} />
                <View><Text style={{ color: '#7e7e7e', fontSize: 14 }}>加载中</Text></View>
              </View>
            );
          }}
          paginationAllLoadedView={() => {
            return (<View style={[styles.rankListNoData]}>
              <Text style={{ color: '#7e7e7e' }}>没有更多数据了</Text>
            </View>);
          }}
          paginationWaitingView={() => {
            let statusView = '';
            if (this.state.status) {
              statusView = (<View style={{ marginTop: 30 }}><StatusView status={this.state.status} styles={{ backgroundColor: '#fff' }} /></View>);
            } else {
              if (Platform.OS !== 'ios' && this.taskRecordItems.length < 10) {
                return null;
              }

              statusView = (<StatusView styles={{ backgroundColor: '#fff' }} />);
            }

            return statusView;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fetchLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff',
  },

  rankListNoData: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
  },
});