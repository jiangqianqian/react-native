import React, { PureComponent } from 'react';

import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  StatusBar,
} from 'react-native';

import axios from 'axios';

import StatusView from '../../components/StatusView';
import GoBack from '../../components/GoBack';

const data = '#333';

export default class AbilityIntro extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    showIcon: true,
    headerStyle: {
      backgroundColor: '#fff',
      elevation: 999,
      zIndex: 999,
      ...Platform.select({
        android: {
          height: 45,
          marginTop: 20,
        },
        ios: {
          height: 65,
        },
      }),
    },
    headerLeft: (<GoBack
      navigation={navigation}
      data={data}
    />),
  });

  constructor(props) {
    super(props);
    this.state = {
      loadedData: false,
      dataSource: [],
    };
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBackgroundColor('#fff', true);
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.requestData.bind(this));
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBackgroundColor('#000', true);
    }
  }
  // http://172.16.72.138:8082/qfang-agent-api/api/mobile/unified/login?params={"phone"="15973182465","password"="182465"}
  requestData() {
    axios.get('evaluation/item', {
      // axios.get('evaluation/task', {
      params: {
        desc: true,
      },
    })
      .then((res) => {
        if (res.data.code === 'C0000') {
          const resData = res.data.data;
          this.setState({
            dataSource: resData,
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

  // this.props.navigation.state.params.title
  header = () => (
    <View>
      <View style={styles.titleStyle}>
        <Text style={styles.titleTextStyle}>
          能力说明
        </Text>
      </View>
      <View style={styles.lineStyle} />
    </View>

  )

  renderItem = (dataSource) => {
    const { item } = dataSource;
    return (
      <View style={styles.contentStyle}>
        <Text style={styles.contentTitle}>
          {item.name}
        </Text>
        <Text style={styles.contentText}>
          {item.desc}
        </Text>
      </View>
    );
  }

  render() {
    if (!this.state.loadedData) {
      return <StatusView status={this.state.status} styles={{ backgroundColor: '#eae9ef' }} />;
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={this.renderItem}
          keyExtractor={(item, value) => value} // 增加key值
          ListHeaderComponent={this.header}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  titleStyle: {
    paddingTop: 15,
    paddingBottom: 30,
    marginHorizontal: 15,

  },
  titleTextStyle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  lineStyle: {
    width: 48,
    borderTopWidth: 0.5,
    borderColor: '#dbdbdb',
    marginLeft: 15,

  },
  contentStyle: {
    paddingTop: 30,
    paddingBottom: 25,
    borderBottomWidth: 0.5,
    borderColor: '#dbdbdb',
    marginHorizontal: 15,

  },
  contentTitle: {
    fontSize: 19,
    color: '#333',
    paddingBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 26,
  },

});
