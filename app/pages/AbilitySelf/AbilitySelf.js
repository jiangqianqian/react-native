import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  InteractionManager,
  FlatList,
  Platform,
} from 'react-native';
import axios from 'axios';
import PropTypes from 'prop-types';

import { QFReactHelper } from '../../common/NativeHelper';
import GoBack from '../../components/GoBack';

// 请求异常组件
import StatusView from '../../components/StatusView';
import Icon from '../../components/Icon';

import Level from '../../components/AbilityUnit/Level';
import Rank from '../../components/AbilityUnit/Rank';
import Task from '../../components/AbilityUnit/Task';
import Radar from '../../components/AbilityUnit/Radar';

function navigateBack() {
  global.requestAnimationFrame(() => {
    QFReactHelper.navPop();
  });
}

// 点击顶部等级信息区域可进入经纪人对应的个人信息页面
function goToPersonInfo() {
  // 跳本人个人信息页面，原生需要 personId 传空字符串
  QFReactHelper.showPage('PERSON_INFO', { personId: '' });
}

export default class AbilitySelf extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: '当前等级',
      headerLeft: (<GoBack navigation={navigation} onBackPress={() => params.navigateBack && params.navigateBack()} />),
      headerRight: (
        <TouchableOpacity onPress={() => { navigation.navigate('LevelIntro'); }}>
          <Text style={styles.headerRight}>等级说明</Text>
        </TouchableOpacity>
      ),
      // 安卓兼容（标题栏居中显示）
      headerTitleStyle: {
        ...Platform.select({
          android: {
            fontSize: 20,
            fontWeight: 'normal',
            alignSelf: 'center',
            marginLeft: navigation.state.routeName === 'AbilitySelf' ? 0 : -40, // 返回按钮定义的宽度
          },
          ios: {
            fontSize: 17,
          },
        }),
      },
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      loadedData: false,
      dataSource: {},
    };
    this.goToScore = this.goToScore.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.scoreObj = {
      ownerScore: '业主服务力',
      contributionScore: '资源贡献力',
      growingScore: '个人成长力',
      customerScore: '客户服务力',
    };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  componentDidMount() {
    this.props.navigation.setParams({
      navigateBack,
    });
  }

  requestData() {
    axios
      .get('evaluation/abilityIndex')
      // .get('http://172.16.72.98:8081/app/pages/AbilitySelf/data.json')
      .then((res) => {
        if (res.data.code !== 'C0000') {
          this.setState({ status: 'request-failed' });
          return;
        }

        this.setState({ dataSource: res.data.data, loadedData: true });
      })
      .catch((error) => {
        console.log(error, 'error');
        this.setState({ status: 'network-error' });
      });
  }

  // 跳到能力得分页面
  goToScore() {
    const { navigate } = this.props.navigation;
    navigate('ScoreRecord');
  }


  // 格式化得分项（如果是正数，加上符号‘+“）
  formatScore(score, type) {
    if (!score) {
      return null;
    }
    return (
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>{this.scoreObj[type]}</Text>
        <Text style={styles.score}>
          {score < 0 ?
            (<Text style={{ color: '#f74c31' }}>{score}</Text>) :
            `+${score}`
          }
        </Text>
      </View>
    );
  }

  // 渲染得分记录的每一项
  renderItem(data) {
    return (
      <View style={styles.ListItem}>
        <View style={styles.listItemLeft}>
          <Text style={styles.ListItemName}>
            {data.item.taskName}
          </Text>
          {/* 显示任务分组 */}
          {data.item.taskGroup &&
            (<View style={styles.groupWrap}>
              <Text style={styles.groupText}>{data.item.taskGroup}</Text>
            </View>)
          }
          {/* 显示任务描述 */}
          {data.item.taskDesc &&
            (<Text style={styles.taskDesc}>{data.item.taskDesc}</Text>)
          }
          <Text style={styles.createDate}>{data.item.createdAt}</Text>
        </View>
        <View style={styles.listItemRight}>
          {this.formatScore(data.item.ownerScore, 'ownerScore')}
          {this.formatScore(data.item.customerScore, 'customerScore')}
          {this.formatScore(data.item.growingScore, 'growingScore')}
          {this.formatScore(data.item.contributionScore, 'contributionScore')}
        </View>
      </View>
    );
  }

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }

    const dataSource = this.state.dataSource;
    const navigation = this.props.navigation;
    return (<View>
      {/* hack写法 解决点击顶部信息跳到原生个人信息页后再点击返回 ScrollView 会多出20高度（非样式导致） */}
      <View style={{ height: 0 }} />
      <ScrollView style={styles.abilityBox}>
        <TouchableOpacity style={styles.header} onPress={goToPersonInfo}>
          <Level data={dataSource} />
          <Rank data={dataSource} navigation={navigation} />
        </TouchableOpacity>
        <View style={styles.container}>
          <Task self={dataSource.self} task={dataSource.task} navigation={navigation} />
          <View>
            <Radar data={dataSource} navigation={navigation} />
            {dataSource.taskRecordCount > 0 &&
              (<View style={styles.listBox}>
                {dataSource.taskRecordCount > 3 ?
                  (<TouchableOpacity style={styles.listTitleWrap} onPress={this.goToScore}>
                    <Text style={styles.listTitle}>能力得分记录</Text>
                    <View style={styles.listBtn}>
                      <Text style={styles.listBtnText}>更多</Text>
                      <Icon style={styles.listIcon} name="xiangyou" size={16} color="#9a9a9a" />
                    </View>
                  </TouchableOpacity>) :
                  (<View style={styles.listTitleWrap}>
                    <Text style={styles.listTitle}>能力得分记录</Text>
                  </View>)
                }
                <View style={styles.listBody}>
                  <FlatList
                    data={dataSource.taskRecords}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderItem}
                  />
                </View>
              </View>)
            }
          </View>
        </View>
      </ScrollView>
    </View>);
  }
}

const styles = StyleSheet.create({
  abilityBox: {
    backgroundColor: '#f0f0f0',
  },
  headerRight: {
    marginRight: 14,
    fontSize: 14,
    color: '#fff',
  },
  header: {
    backgroundColor: '#2f2e36',
  },
  listBox: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  listTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    height: 48,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listBtn: {
    position: 'relative',
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listBtnText: {
    position: 'relative',
    right: -3,
    zIndex: 2,
    fontSize: 12,
    color: '#9a9a9a',
  },
  ListItem: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    marginRight: 15,
    marginLeft: 15,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItemLeft: {
    flex: 1,
  },
  ListItemName: {
    marginRight: 5,
    color: '#333',
    fontSize: 16,
  },
  groupWrap: {
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    height: 18,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderColor: '#8c8eb9',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
  },
  groupText: {
    color: '#8c8eb9',
    fontSize: 12,
  },
  taskDesc: {
    paddingTop: 15,
    paddingBottom: 5,
    color: '#9a9a9a',
    fontSize: 14,
  },
  createDate: {
    paddingTop: 10,
    color: '#7e7e7e',
    fontSize: 12,
  },
  listItemRight: {
    paddingLeft: 10,
    width: 100,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  scoreText: {
    paddingRight: 6,
    fontSize: 12,
    color: '#333',
  },
  score: {
    minWidth: 18,
    fontSize: 14,
    color: '#333',
  },
});
