import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Score extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      taskDesc: PropTypes.string,
      ownerScore: PropTypes.number,
      contributionScore: PropTypes.number,
      growingScore: PropTypes.number,
      customerScore: PropTypes.number,
    }),
  };

  static defaultProps = {
    data: null,
  };

  constructor(props) {
    super(props);
    this.scoreObj = {
      ownerScore: '业主服务力',
      contributionScore: '资源贡献力',
      growingScore: '个人成长力',
      customerScore: '客户服务力',
    };
  }

  // 得分项格式化
  getScoreItem(score, type) {
    if (!score) {
      return null;
    }
    const newScore = (score < 0) ? score : `+${score}`;
    return (
      <View style={styles.scoreItem}>
        <Text style={styles.scoreValue}>{newScore}</Text>
        <Text style={styles.scoreInfo}>{this.scoreObj[type]}</Text>
      </View>
    );
  }

  render() {
    const data = this.props.data;
    return (
      <View style={styles.container}>
        {data.taskDesc && data.taskDesc.length <= 50 &&
          <View style={styles.taskDescBox}>
            <View style={styles.splitLine} />
            <View style={{ flex: 1 }}>
              <Text style={styles.taskDesc}>{data.taskDesc}</Text>
            </View>
          </View>
        }
        <View style={styles.scoreBox}>
          {this.getScoreItem(data.ownerScore, 'ownerScore')}
          {this.getScoreItem(data.customerScore, 'customerScore')}
          {this.getScoreItem(data.growingScore, 'growingScore')}
          {this.getScoreItem(data.contributionScore, 'contributionScore')}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    borderTopColor: '#ebebeb',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  scoreBox: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  scoreItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    color: '#f93',
    fontSize: 16,
  },
  scoreInfo: {
    color: '#9d9ba1',
    fontSize: 12,
  },
  taskDescBox: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingTop: 12,
    paddingRight: 10,
  },
  splitLine: {
    marginRight: 10,
    width: 3,
    height: 17,
    backgroundColor: '#dcdadd',
  },
  taskDesc: {
    position: 'relative',
    ...Platform.select({
      android: {
        top: 0,
      },
      ios: {
        top: -3,
      },
    }),
    lineHeight: 18,
    fontSize: 14,
  },
});
