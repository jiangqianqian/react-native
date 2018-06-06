import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import Echarts from '../Echarts';

import screen from '../../utils/screen';

import Icon from '../Icon';

// 雷达图屏幕尺寸兼容
function getRadarRadius() {
  if (screen.width <= 320) {
    return '30%';
  } else if (screen.width > 320 && screen.width <= 375) {
    return '50%';
  }
  return '60%';
}

export default class Radar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      ownerScore: PropTypes.number,
      contributionScore: PropTypes.number,
      growingScore: PropTypes.number,
      customerScore: PropTypes.number,
    }),
    navigation: PropTypes.object,
  };

  static defaultProps = {
    data: null,
    navigation: null,
  };

  constructor(props) {
    super(props);
    this.goToAbilityIntro = this.goToAbilityIntro.bind(this);
    this.state = {
      fadeAnim: new Animated.Value(0), // 设置能力总值动画初始值
    };
  }

  componentDidMount() {
    this.webViewEvent = DeviceEventEmitter.addListener('webViewData', (data) => {
      if (data === 'loaded') {
        // 能力总值的渐入动画，安卓显示比较慢，作 500ms 的延时
        Animated.timing(
          this.state.fadeAnim,
          { toValue: 1 },
        ).start();
      }
    });
  }

  componentWillUnmount() {
    // 移除
    this.webViewEvent.remove();
  }

  // 获取各能力维度的最小值
  getMinimun() {
    const radarData = this.props.data;
    const minValue = Math.min(radarData.ownerScore, radarData.growingScore, radarData.customerScore, radarData.contributionScore);
    return minValue >= 0 ? 0 : minValue;
  }

  // 获取各能力维度的最大值
  getMaximun() {
    const radarData = this.props.data;
    const maxValue = Math.max(radarData.ownerScore, radarData.growingScore, radarData.customerScore, radarData.contributionScore);
    return maxValue;
  }

  // 跳转到能力说明页面
  goToAbilityIntro() {
    const { navigate } = this.props.navigation;
    navigate('AbilityIntro');
  }

  render() {
    const radarData = this.props.data;
    console.log(radarData, '来自雷达图的数据');
    // 雷达图配置信息
    const option = {
      // animation: false,
      radar: [
        {
          indicator: [
            { text: `业主服务力 ${radarData.ownerScore}`, min: this.getMinimun(), max: this.getMaximun() },
            { text: `资源贡献力 ${radarData.contributionScore}`, min: this.getMinimun(), max: this.getMaximun() },
            { text: `个人成长力 ${radarData.growingScore}`, min: this.getMinimun(), max: this.getMaximun() },
            { text: `客户服务力 ${radarData.customerScore}`, min: this.getMinimun(), max: this.getMaximun() },

          ],
          splitNumber: 4,
          center: ['50%', '50%'],
          name: {
            formatter: '{value}',
            textStyle: {
              color: '#9a9a9a',
              fontSize: Platform.OS === 'ios' ? 14 : 13,
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#e0e0e0',
            },
          },
          radius: getRadarRadius(),
        },
      ],
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [radarData.ownerScore, radarData.contributionScore, radarData.growingScore, radarData.customerScore],
              areaStyle: {
                normal: {
                  opacity: 0.2,
                  color: '#ffbe71',
                },
              },
              lineStyle: {
                normal: {
                  color: '#ffbe71',
                },
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                },
              },
            },
          ],
        },
      ],
    };

    return (
      <View style={styles.radarBox}>
        <View style={styles.radarTitleWrap}>
          <Text style={styles.radarTitle}>能力值</Text>
          {radarData.self &&
            (<TouchableOpacity style={styles.radarBtn} onPress={this.goToAbilityIntro}>
              <Text style={styles.radarBtnText}>能力说明</Text>
              <Icon style={styles.radarIcon} name="wenhao" size={18} color="#9a9a9a" />
            </TouchableOpacity>)
          }
        </View>
        {/* 本人能力主页如果没有任务则显示“完成一个任务即可查看能力图” */}
        { !radarData.self || radarData.taskRecordCount > 0 ?
          (<View>
            <Echarts option={option} width={screen.width} height={260} />
            <View style={styles.totalValueBox}>
              <Animated.Text style={[{ opacity: this.state.fadeAnim }, styles.totalValue]}>
                {radarData.ownerScore + radarData.growingScore + radarData.contributionScore + radarData.customerScore}
              </Animated.Text>
            </View>
          </View>) : (
            <View style={styles.noRadarData}>
              <Icon name="no-data-found" size={40} color="#d6d7da" />
              <Text style={styles.noRadarDataText}>完成一个任务即可查看能力图</Text>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radarBox: {
    position: 'relative',
    marginTop: 10,
    backgroundColor: '#fff',
  },
  radarTitleWrap: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    height: 48,
    alignItems: 'center',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  radarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  radarBtn: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarBtnText: {
    paddingRight: 5,
    fontSize: 12,
    color: '#9a9a9a',
  },
  chart: {
    flex: 1,
    height: 300,
  },
  totalValueBox: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 100,
    height: 50,
    marginTop: -10,
    marginLeft: -50,
    backgroundColor: 'transparent',
  },
  totalValue: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#f93',
    fontWeight: 'bold',
  },
  noRadarData: {
    marginTop: -30,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRadarDataText: {
    marginTop: 10,
    fontSize: 12,
    color: '#9a9a9a',
  },
});
