import React, { PureComponent } from 'react';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import TaskHeader from './TaskHeader';
import Score from './Score';


export default class TabBar extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    data: PropTypes.shape({
      taskId: PropTypes.string,
    }),
  };

  static defaultProps = {
    data: null,
  };

  constructor(props) {
    super(props);
    this.data = props.data;
    this.goToDetail = this.goToDetail.bind(this, props.data.taskId);
  }

  // 跳到任务详情
  goToDetail(taskId) {
    const { navigate } = this.props.navigation;
    navigate('TaskDetails', { taskId });
  }

  render() {
    return (
      <TouchableOpacity style={styles.ListItem} onPress={this.goToDetail}>
        <TaskHeader data={this.data} />
        <Score data={this.data} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  ListItem: {
    marginTop: 10,
    borderRadius: 5,
    borderColor: '#dbdbdb',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
  },
});
