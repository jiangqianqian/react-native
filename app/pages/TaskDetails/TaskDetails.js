import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  InteractionManager,
} from 'react-native';

import axios from 'axios';


import StatusView from '../../components/StatusView';
import GoBack from '../../components/GoBack';


export default class TaskDetails extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  static defaultProps = {
    navigation: null,
  }
  static navigationOptions = ({ navigation }) => ({
    title: '任务详情',
    headerLeft: (<GoBack
      navigation={navigation}
    />),
  });


  constructor(props) {
    super(props);
    this.state = {
      loadedData: false,
      dataList: [],
      dataSource: [],
    };
  }


  componentDidMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  requestData() {
    // console.log(this.props.navigation.state.params.taskId);
    axios.get('evaluation/taskDetail', {
      params: {
        taskId: this.props.navigation.state.params.taskId,
      },
    })
      .then((res) => {
        if (res.data.code === 'C0000') {
          // console.log(res);
          const data = res.data.data;
          console.log(data);
          // const dataList = (data.recordList.length > 6) ? data.recordList.splice(5, data.recordList.length - 6) : data.recordList;
          // const dataList = data.recordList || [];
          const dataList = data.recordList || null;
          console.log(dataList);
          // const dataRecord = data.taskRecord || [];
          // console.log(dataList);
          this.setState({
            dataSource: data,
            dataList,
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


  // 任务详情内容
  taskContent = (data) =>
    // console.log(data.taskName);
    (
      <View style={{ backgroundColor: '#f0f0f0' }}>
        <View style={styles.desc}>
          <View style={styles.oneline}>
            <View style={styles.row}>
              <Text style={styles.taskName}>
                {data.taskName}
              </Text>
              <Text style={styles.endTime}>
                {data.taskEnd}
              </Text>
            </View>
            {data.complete &&
              <View style={styles.complete}>
                <Text style={styles.completeText}>
                  已完成
                </Text>
              </View>
            }
          </View>
          <Text style={styles.taskContentText}>
            {data.taskDesc}
          </Text>
          <View style={styles.taskType}>
            {
              Object.keys(data).map((key, index) => {
                const typeName = (key === 'ownerScore') ? '业主服务力' : (key === 'contributionScore') ? '资源贡献力' : (key === 'growingScore') ? '个人成长力' : (key === 'customerScore') ? '客户服务力' : key.type;
                return (typeName && data[key] > 0 &&
                  <View style={styles.taskTypeStyle} key={index} >
                    <Text style={styles.value} >+{data[key]}</Text>
                    <Text style={styles.type}>{typeName}</Text>
                  </View>);
              })
            }
          </View>
          <Text style={styles.finishingRate} >
            已有{data.completePerson}人完成该任务,完成率{data.completeScale}
          </Text>
        </View>
        <View style={styles.recordTitle}>
          <Text style={styles.recordTitleText}>我的完成记录</Text>
        </View>
      </View>
    )


  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }
    const dataSource = this.state.dataSource;
    // console.log(dataSource);
    const recordFieldOne = (dataSource.limitMode === 'ONE') ? '完成时间：' : '累计完成：';
    const recordFieldTwo = (dataSource.limitMode === 'ONE') ? '加　　分：' : '累计加分：';
    const recordFieldThree = (dataSource.limitMode === 'ONE') ? '经验值：' : '累计获得经验值：';
    console.log(!this.state.dataList);
    let flag = 0;

    return (
      <View style={styles.container} >
        {(this.state.dataList || (dataSource.limitMode === 'ONE' && dataSource.taskRecord)) ?
          (
            <ScrollView>
              {
                dataSource.taskProgress &&
                <View style={styles.taskProgress} >
                  <Text style={styles.taskProgressText}>{dataSource.taskProgress}
                  </Text>
                </View>
              }
              {this.taskContent(dataSource)}

              <View style={styles.record}>

                {dataSource.taskRecord &&
                  <View style={styles.recordContent} >
                    <View style={styles.finishTime}>
                      <View style={styles.grayLine} />
                      <Text style={styles.fs14}>{recordFieldOne}</Text>
                      {dataSource.taskRecord.completeTimes ?
                        <Text style={[styles.col3, styles.fs14]}>{dataSource.taskRecord.completeTimes}次</Text>
                        :
                        <Text style={[styles.col3, styles.fs14]}>{dataSource.taskRecord.createdAt}</Text>
                      }

                    </View>
                    <View style={styles.addScore}>
                      <View>
                        <Text style={[styles.lh29, styles.fs14]}>
                          {recordFieldTwo}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                        {
                          Object.keys(dataSource.taskRecord).map((key) => {
                            const typeName = (key === 'ownerScore') ? '业主服务力' : (key === 'contributionScore') ? '资源贡献力' : (key === 'growingScore') ? '个人成长力' : (key === 'customerScore') ? '客户服务力' : key.type;
                            if (typeName && dataSource.taskRecord[key] > 0) {
                              flag += 1;
                              return (typeName && dataSource.taskRecord[key] > 0 &&
                                <Text style={[styles.lh29, styles.fs14, styles.col3]}>{typeName}+{dataSource.taskRecord[key]}{(flag % 2 === 0) ? '\b' : '　　'}</Text>
                              );
                            }
                            return null;
                          })
                        }
                      </View>

                    </View>
                    <View style={styles.expValue}>
                      <View style={styles.grayLine} />
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }} >{recordFieldThree}+{dataSource.taskRecord.score}</Text>
                    </View>
                  </View>
                }

                {this.state.dataList &&
                  <View style={styles.recordList}>
                    {
                      this.state.dataList.map((value, index) => (
                        (index < 5 || index === this.state.dataList.length - 1) &&
                        <View
                          key={index}
                        >
                          <View style={styles.item}>
                            <View style={styles.bigCircle} />
                            <Text style={styles.itemText}>{value.createdAt} 完成该任务</Text>
                            {value.firstComplete &&
                              <View style={styles.flag}>
                                <Text style={styles.flagText}>首次完成</Text>
                              </View>
                            }
                          </View>
                          {!value.firstComplete && (
                            (this.state.dataList.length > 6 && index === 4) ?
                              (
                                <View style={styles.circleLine}>
                                  <View style={styles.shortLine} />
                                  <View style={[styles.circle, { marginTop: 3 }]} />
                                  <View style={styles.circle} />
                                  <View style={[styles.circle, { marginBottom: 3 }]} />
                                  <View style={styles.shortLine} />
                                </View>
                              )
                              :
                              (<View style={styles.longLine} />)
                          )
                          }
                        </View>
                      ))
                    }
                  </View>
                }


              </View>
            </ScrollView>

          ) : (
            <ScrollView>
              {this.taskContent(dataSource)}
              <View style={styles.unrecord}>
                <Image style={styles.unrecordImg} source={require('../../assets/img/rwxqNull.png')} />
                <Text style={styles.unrecordText}>你还没完成该任务</Text>
              </View>
            </ScrollView>
          )
        }
      </View >
    );
  }
}


const styles = StyleSheet.create({
  fs14: {
    fontSize: 14,
  },
  lh29: {
    lineHeight: 29,
  },
  col3: {
    color: '#333',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  taskProgress: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#f2f2f6',
    paddingHorizontal: 15,
  },
  taskProgressText: {
    fontSize: 12,
    color: '#ff9933',
  },

  desc: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
    marginBottom: 10,
  },

  oneline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 33,
    marginBottom: 10,
  },
  taskName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  endTime: {
    fontSize: 12,
    paddingLeft: 15,
    color: '#9a9a9a',
  },
  complete: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 18,
    width: 45,
    backgroundColor: '#43c573',
    borderRadius: 9,
  },
  completeText: {
    fontSize: 10,
    color: '#fff',
  },

  taskContentText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 15,
  },

  taskType: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
    height: 60,
  },
  taskTypeStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  type: {
    fontSize: 12,
    color: '#9a9a9a',
  },

  finishingRate: {
    paddingTop: 10,
    fontSize: 12,
    color: '#9a9a9a',
  },


  recordTitle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
    height: 49,
    backgroundColor: '#fff',
  },
  recordTitleText: {
    fontSize: 15,
    color: '#333',
  },

  unrecord: {
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  unrecordImg: {
    marginTop: 20,
    height: 150,
    width: 100,
    zIndex: 99,
  },
  unrecordText: {
    fontSize: 14,
    color: '#9a9a9a',
  },

  record: {
    flex: 1,
  },
  recordContent: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dbdbdb',
    backgroundColor: '#fff',

  },

  finishTime: {
    flexDirection: 'row',
  },
  grayLine: {
    height: 15,
    borderLeftWidth: 3,
    borderColor: '#9a9a9a',
    paddingRight: 5,
  },
  addScore: {
    flexDirection: 'row',
    paddingLeft: 8,

  },
  expValue: {
    flexDirection: 'row',
    paddingTop: 12.5,
  },

  recordList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',

  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#dedede',
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
  },
  itemText: {
    fontSize: 12,
    color: '#333',
  },
  flag: {
    height: 18,
    marginLeft: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ff9933',
    borderRadius: 2,
    paddingHorizontal: 6,
    justifyContent: 'center',

  },
  flagText: {
    fontSize: 12,
    color: '#ff9933',
  },
  longLine: {
    height: 45,
    borderLeftWidth: 1,
    borderColor: '#dedede',
    marginLeft: 4.5,
  },

  circleLine: {
    height: 45,
    marginLeft: 4,
  },
  shortLine: {
    height: 15,
    borderLeftWidth: 1,
    borderColor: '#dedede',
    marginLeft: 0.5,
  },
  circle: {
    height: 2,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#dedede',
    marginVertical: 1.5,
  },
});
