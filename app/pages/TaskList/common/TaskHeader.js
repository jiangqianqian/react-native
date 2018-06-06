import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../../../components/Icon';

// 后端将任务进度作为字符串整体返回，前端处理进行中的任务个数用特别颜色显示
function formatTaskProgress(progress) {
  const array = progress.split('/');
  const text = array[0].split(/\d+/);
  const times = array[0].match(/\d+/);
  return (
    <Text style={styles.taskProgress}>{text[0]}<Text style={{ color: '#f93' }}>{times[0]}</Text>/{array[1]}</Text>
  );
}

export default class TaskHeader extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      limitMode: PropTypes.string,
      taskName: PropTypes.string,
      taskEnd: PropTypes.string,
      completeTimes: PropTypes.number,
      taskProgress: PropTypes.string,
      complete: PropTypes.bool,
      taskId: PropTypes.string,
    }),
  };

  static defaultProps = {
    data: null,
  };

  constructor(props) {
    super(props);
    this.limitModeObj = {
      one: {
        style: 'taskTypeOne',
        iconStyle: 'iconOne',
        iconName: 'yicixing-',
        taskTypeText: '一次性',
      },
      unrestricted: {
        style: 'taskTypeUnrestricted',
        iconStyle: 'iconUnrestricted',
        iconName: 'wuxianci-',
        taskTypeText: '无限次',
      },
      restricted: {
        style: 'taskTypeRestricted',
        iconStyle: 'iconRestricted',
        iconName: 'youxianci-',
        taskTypeText: '有限次',
      },
    };
  }

  getTaskTypeIcon(limitMode) {
    let taskTypeObj;
    switch (limitMode) {
      case 'ONE':
        taskTypeObj = this.limitModeObj.one;
        break;
      case 'UNRESTRICTED':
        taskTypeObj = this.limitModeObj.unrestricted;
        break;
      case 'EVERYDAY':
      case 'WEEKLY':
      case 'MONTHLY':
        taskTypeObj = this.limitModeObj.restricted;
        break;
      default: break;
    }

    return (
      taskTypeObj &&
      (<View style={[styles[taskTypeObj.style], styles.taskTypeBox]}>
        <Icon style={styles[taskTypeObj.iconStyle]} name={taskTypeObj.iconName} size={23} color="#fff" />
        <Text style={styles.taskTypeText}>{taskTypeObj.taskTypeText}</Text>
      </View>)
    );
  }

  render() {
    const data = this.props.data;

    return (
      <View style={styles.container}>
        <View style={styles.mainInfo}>
          {this.getTaskTypeIcon(data.limitMode)}
          <View style={styles.taskNameBox}>
            <Text style={styles.taskName}>{data.taskName}</Text>
            {/* 任务没结束 */}
            {data.taskEnd &&
              data.taskEnd !== '已结束' &&
              (<Text style={styles.taskEndTime}>{data.taskEnd}</Text>)
            }
            {/* 日常任务的累计完成次数 */}
            {data.completeTimes && (<Text style={styles.taskEndTime}>累计完成{data.completeTimes}次</Text>)}
          </View>
        </View>
        <View style={styles.rightInfo}>
          {data.taskProgress &&
            formatTaskProgress(data.taskProgress)
          }
          {/* 任务已结束，如已结束与已完成同时存在，优先展示已完成 */}
          {data.taskEnd &&
            data.taskEnd === '已结束' && !data.complete &&
            (<View style={[styles.flagBox, styles.taskEndBox]}><Text style={styles.flagText}>已结束</Text></View>)
          }
          {data.complete &&
            (<View style={[styles.flagBox, styles.completeBox]}>
              <Text style={styles.flagText}>已完成</Text>
            </View>)
          }
          <Icon style={styles.rightArrowIcon} name="xiangyou" size={16} color="#dbd9dc" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingRight: 10,
    paddingBottom: 18,
    paddingLeft: 10,
  },
  mainInfo: {
    flexDirection: 'row',
  },
  taskTypeBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTypeOne: {
    backgroundColor: '#3ac8b5',
  },
  taskTypeUnrestricted: {
    backgroundColor: '#f3983e',
  },
  taskTypeRestricted: {
    backgroundColor: '#f4c34e',
  },
  taskTypeText: {
    position: 'relative',
    top: -3,
    fontSize: 8,
    color: '#fff',
  },
  taskNameBox: {
    paddingTop: 3,
    paddingLeft: 8,
  },
  taskName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  taskEndTime: {
    ...Platform.select({
      android: {
        paddingTop: 3,
      },
      ios: {
        paddingTop: 10,
      },
    }),
    fontSize: 12,
    color: '#9a9a9a',
  },
  flagBox: {
    width: 45,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  flagText: {
    fontSize: 10,
    color: '#fff',
  },
  taskEndBox: {
    backgroundColor: '#dbd9dc',
  },
  rightInfo: {
    paddingTop: 3,
  },
  completeBox: {
    backgroundColor: '#43c573',
  },
  taskProgress: {
    fontSize: 12,
    color: '#9a9a9a',
  },
  rightArrowIcon: {
    marginTop: 10,
    textAlign: 'right',
  },
});
