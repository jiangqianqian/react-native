import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';

import { QFReactHelper } from '../../common/NativeHelper';
import GoBack from '../../components/GoBack';

// 请求异常组件
import StatusView from '../../components/StatusView';

import Level from '../../components/AbilityUnit/Level';
import Rank from '../../components/AbilityUnit/Rank';
import Task from '../../components/AbilityUnit/Task';
import Radar from '../../components/AbilityUnit/Radar';

export default class Ability extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: '他人等级',
    headerLeft: (<GoBack navigation={navigation} />),
  });

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
    this.goToPersonInfo = this.goToPersonInfo.bind(this);
    // 获取从排名表传来的参数
    this.personId = this.props.navigation.state.params.personId;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  // 点击顶部等级信息区域可进入经纪人对应的个人信息页面
  goToPersonInfo() {
    QFReactHelper.showPage('PERSON_INFO', { personId: this.personId });
  }

  requestData() {
    axios
      .get('evaluation/abilityIndex', {
        params: {
          personId: this.personId,
        },
      })
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

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }

    const dataSource = this.state.dataSource;
    return (
      <ScrollView style={styles.abilityBox}>
        <TouchableOpacity style={styles.header} onPress={this.goToPersonInfo}>
          <View style={styles.signBox}>
            <Text style={styles.signName} numberOfLines={1} ellipsizeMode="tail">
              {dataSource.personName}
              {dataSource.sign &&
                <Text style={styles.sign}>  {dataSource.sign}</Text>
              }
            </Text>
          </View>
          <Level data={dataSource} />
          <Rank data={dataSource} />
        </TouchableOpacity>
        <Task self={dataSource.self} task={dataSource.task} />
        <Radar data={dataSource} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  abilityBox: {
    flex: 1,
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
  signBox: {
    paddingTop: 10,
    paddingLeft: 32,
    paddingRight: 14,
    paddingBottom: 5,
  },
  signName: {
    fontSize: 19,
    color: '#fff',
  },
  sign: {
    paddingLeft: 10,
    fontSize: 12,
    color: '#97959b',
  },
});
