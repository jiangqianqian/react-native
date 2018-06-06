import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import screen from '../../utils/screen';

import Icon from '../Icon';

// 本人能力主页显示查看次数
function showViewTimes(viewTimes) {
  if (!viewTimes) {
    return null;
  }
  return (
    <View style={styles.times}>
      <Icon style={styles.timesIcon} name="chakancishu" size={18} color="#6c6b6f" />
      <Text style={styles.timesNumber}>{viewTimes}</Text>
    </View>
  );
}

export default class Level extends PureComponent {
  static propTypes = {
    // any should be replaced with, well, anything.
    // array and object can be replaced with arrayOf and shape, respectively.
    data: PropTypes.shape({
      self: PropTypes.bool,
      level: PropTypes.number,
      levelName: PropTypes.string,
      score: PropTypes.number,
      nextLevelScore: PropTypes.number,
      viewTimes: PropTypes.number,
    }),
  };

  static defaultProps = {
    data: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 进度条初始值为 0
      progress: 0,
    };

    // 34 为左右边距
    this.progressWidth = screen.width - 34 - 34;
    // 控制进度条累加次数
    this.count = 0;
  }

  componentDidMount() {
    this.updateProgress();
  }

  updateProgress() {
    const propsData = this.props.data;
    const step = 15;
    const tempWidth = (propsData.score / propsData.nextLevelScore) * this.progressWidth;
    const currentWidth = tempWidth > this.progressWidth ? this.progressWidth : tempWidth;
    const dis = currentWidth / step;
    let progress;
    if (this.count >= step) {
      return;
    }
    if (this.count < step) {
      progress = this.state.progress + dis;
    }

    this.count += 1;

    this.setState({ progress });
    global.requestAnimationFrame(() => this.updateProgress());


    // if (this.state.progress > ((propsData.score / propsData.nextLevelScore) * this.progressWidth) || this.state.progress > this.progressWidth) {
    //   return;
    // }
    // const progress = this.state.progress + 0.02;
    // this.setState({ progress });
    // this.timer = setInterval(this.updateProgress.bind(this), 0);
    // global.requestAnimationFrame(() => this.updateProgress());
    // InteractionManager.requestAnimationFrame(() => {
    //   this.updateProgress();
    // });
  }

  render() {
    const propsData = this.props.data;
    return (
      <View style={styles.levelBox}>
        <View style={styles.levelNameBox}>
          <View style={styles.levelNameWrap}>
            <Text style={styles.levelName}>LV{propsData.level}  {propsData.levelName}</Text>
          </View>
          {propsData.self && showViewTimes(propsData.viewTimes)}
        </View>
        <View style={styles.barBox}>
          <View style={styles.progressBg}>
            <View style={[styles.progressView, { width: this.state.progress }]} />
          </View>
          {propsData.score <= propsData.nextLevelScore ?
            (<Text style={styles.score}>{propsData.score}/{propsData.nextLevelScore}</Text>) :
            (<Text style={styles.score}>{propsData.score}</Text>)
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  levelBox: {
    paddingTop: 10,
  },
  levelNameBox: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingLeft: 32,
    paddingRight: 14,
  },
  levelNameWrap: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  times: {
    flexDirection: 'row',
    width: 75,
    justifyContent: 'flex-end',
  },
  timesIcon: {
    paddingTop: 1,
    alignSelf: 'center',
  },
  timesNumber: {
    marginLeft: 5,
    fontSize: 12,
    color: '#6c6b6f',
    alignSelf: 'center',
  },
  barBox: {
    paddingLeft: 34,
    paddingRight: 34,
  },
  progressBg: {
    position: 'relative',
    flex: 1,
    height: 5,
    backgroundColor: '#211e28',
  },
  progressView: {
    position: 'absolute',
    height: 5,
    backgroundColor: '#f93',
  },
  score: {
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'right',
    color: '#fff',
    fontSize: 12,
  },
});
