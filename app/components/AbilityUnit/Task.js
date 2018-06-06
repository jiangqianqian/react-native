import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Task extends PureComponent {
  static propTypes = {
    task: PropTypes.number,
    self: PropTypes.bool,
    navigation: PropTypes.object,
  };

  static defaultProps = {
    task: 0,
    self: null,
    navigation: null,
  };

  constructor(props) {
    super(props);
    this.goToTaskList = this.goToTaskList.bind(this);
  }

  // 跳到任务列表
  goToTaskList() {
    const { navigate } = this.props.navigation;
    navigate('TaskList');
  }

  render() {
    return (
      <View style={styles.taskBox}>
        <View style={styles.taskTitleWrap}>
          <Text style={styles.taskTitle}>任务</Text>
        </View>
        <View style={styles.taskBody}>
          <View style={styles.taskInfo}>
            <Text style={styles.taskInfoText}>
              {this.props.task ?
                `当前共${this.props.task}个进行中任务` :
                '暂无进行中任务'}

            </Text>
          </View>
          {this.props.self &&
            (<TouchableOpacity style={styles.taskBtn} onPress={this.goToTaskList}>
              <Text style={styles.taskBtnText}>查看任务</Text>
            </TouchableOpacity>)
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  taskBox: {
    backgroundColor: '#fff',
  },
  taskTitleWrap: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 48,
    justifyContent: 'center',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
  },
  taskBody: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    minHeight: 60,
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskInfoText: {
    fontSize: 12,
    color: '#9a9a9a',
  },
  taskBtn: {
    width: 84,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
    borderColor: '#f93',
    borderWidth: StyleSheet.hairlineWidth,
  },
  taskBtnText: {
    fontSize: 12,
    color: '#f93',
  },
});
