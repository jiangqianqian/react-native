import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  InteractionManager,
  TouchableOpacity,
  Image,
} from 'react-native';

import axios from 'axios';

// 请求异常组件
import StatusView from '../../components/StatusView';
import Icon from '../../components/Icon/';


import GoBack from '../../components/GoBack';

const listColor = [
  ['#c0c0c0', '#a6a6a6', '#e5e5e3', '#f0f0f0', '#f0f0f0'],
  ['#fbc104', '#ad5a00', '#f1d122', '#a12326', '#fcf4c6'],
];
export default class LevelIntro extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: '等级说明',
    headerLeft: (<GoBack
      navigation={navigation}
    />),
  });

  static propTypes = {
    navigation: PropTypes.object,
  }

  static defaultProps = {
    navigation: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      loadedData: false,
      dataSource: [],
    };
  }


  componentDidMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  requestData() {
    axios.get('evaluation/level')
      .then((res) => {
        // console.log(res);
        if (res.data.code === 'C0000') {
          const data = res.data.data;

          if (data.levelList) {
            const lengths = data.levelList.length;
            data.levelList.map((item, index) => {
              item.index = index + 1;
              if (index + 1 > Math.ceil(lengths / 2)) {
                item.listColorItem = listColor[1];
              } else {
                item.listColorItem = listColor[0];
              }
              return true;
            });
          }
          this.setState({
            dataSource: data,
            loadedData: true,
            status: '',
          });
        } else {
          this.setState({
            status: 'request-failed',
          });
        }
      }).catch((err) => {
        this.setState({
          status: 'request-failed',
        });
        console.log(err);
      });
  }


  renderItem = (data) => {
    const { item } = data;
    // console.log('item.listColorItem=', item.listColorItem);
    console.log('item.listColorItem=', item.listColorItem[3]);
    return (
      <View>
        <View style={[styles.SignIcon, { backgroundColor: item.listColorItem[4], borderColor: item.listColorItem[0] }]}>
          <Icon style={styles.IconStyle} name="xingji" size={16} color={item.listColorItem[2]} />
          {/* <Icon style={styles.IconStyle} name="jiangpai-1" size={20} color={item.listColorItem[2]} /> */}
        </View>
        <View style={styles.itemStyle}>
          <View style={styles.itemLeftStyle}>
            <View style={[styles.levelSignBox, { borderColor: item.listColorItem[0], backgroundColor: item.listColorItem[2] }]}>
              <Text style={[styles.levelSignText, { textShadowColor: item.listColorItem[1] }]} >LV{item.index}</Text>
            </View>
            <Text style={styles.signTitle}>
              {item.levelName}
            </Text>
          </View>
          <View >
            <Text style={styles.minScore}>
              最小经验值{item.minScore}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >
        <Image style={styles.rankBanner} source={require('../../assets/img/rank-banner.png')} />
        <View style={styles.contentStyle} >
          <View style={styles.oneline}>
            <View style={styles.onelineOne}>
              <View>
                <Text style={styles.myLevelStyle}>
                  我的等级
                </Text>
              </View>
              <View>
                <Text style={styles.levelStyle}>
                  LV{this.state.dataSource.level}
                </Text>
              </View>
              <View style={styles.levelName}>
                <Text style={styles.levelNameStyle}>
                  {this.state.dataSource.levelName}
                </Text>
              </View>
            </View>
            {(this.state.dataSource.needScore <= 0) &&
              <View>
                <TouchableOpacity
                  style={styles.searchTask}
                  onPress={() => global.requestAnimationFrame(() => {
                    navigate('TaskList');
                  })}
                >
                  <Text style={styles.searchTaskStyle}>
                    查看任务
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          {(this.state.dataSource.needScore > 0) &&
            <View style={styles.twoline}>
              <View >
                <Text style={styles.DvalueStyle}>
                  距离下一等级还有{this.state.dataSource.needScore}经验值
                </Text>
              </View>
              <TouchableOpacity
                style={styles.searchTask}
                onPress={() => global.requestAnimationFrame(() => {
                  navigate('TaskList');
                })}
              >
                <Text style={styles.searchTaskStyle}>
                  查看任务
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
        <View style={styles.listStyle}>
          <FlatList
            data={this.state.dataSource.levelList}
            renderItem={this.renderItem}
            keyExtractor={(item, value) => value} // 增加key值
          />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  rankBanner: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentStyle: {
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#2f2e36',
    paddingHorizontal: 15, // 左右padding设置
    marginBottom: 40,
    // marginVertical: 15, // 上下margin设置
  },
  oneline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
  },
  onelineOne: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myLevelStyle: {
    fontSize: 15,
    color: '#9d9ba1',
  },
  levelStyle: {
    fontSize: 20,
    marginHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelName: {
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 18,
    // width: 54,
    backgroundColor: '#727282',
    borderRadius: 2,
  },
  levelNameStyle: {
    fontSize: 11,
    color: '#2f2e36',
  },

  twoline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DvalueStyle: {
    marginTop: 20,
    fontSize: 12,
    color: '#9d9ba1',
  },
  searchTask: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    width: 83,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: '#b5b6ce',
  },
  searchTaskStyle: {
    fontSize: 12,
    color: '#b5b6ce',
  },

  listStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
  },
  itemStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    alignItems: 'center',
    height: 60,
    // borderBottomWidth: 0.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
  },
  itemLeftStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',

  },
  levelSignBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 19,
    borderRadius: 8,
    borderWidth: 1,
  },
  SignIcon: {
    height: 22,
    width: 22,
    position: 'absolute',
    zIndex: 99,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 21,
    left: 13,
    borderRadius: 11.5,
    // borderWidth: 0.5,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  IconStyle: {
    textShadowOffset: { width: 0.5, hegith: 0.5 },
    textShadowColor: '#fff',
  },
  levelSignText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 18,
    color: '#fff',
    textShadowOffset: { width: 0.5, hegith: 0.5 },
  },
  signTitle: {
    marginLeft: 15,
    color: '#333',
    fontSize: 15,
  },
  minScore: {
    color: '#7e7e7e',
    fontSize: 12,
  },

});
