import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform, DeviceEventEmitter, Text, ActivityIndicator } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

// const source = require('./echarts.html');
const source = (Platform.OS == 'ios') ? require('../../../../../app/assets/echarts/echarts.html') : {uri:'file:///android_asset/echarts.html'};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indicator: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.option !== this.props.option) {
      this.refs.chart.reload();
    }
  }

  // 发送数据给webView
  // componentDidMount() {
  //   this.refs.chart.postMessage(100);
  // }

  // 处理从webView传来的数据
  // handleMessage(e) {
  //   console.log('webViewData')
  //   DeviceEventEmitter.emit('webViewData', { data: e.nativeEvent.data });
  // }

  webViewLoaded(e) {
    // this.setState({
    //   indicator: false,
    // });
    DeviceEventEmitter.emit('webViewData', 'loaded');
  }

  render() {
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          scalesPageToFit = {true}
          startInLoadingState = {true}
          style={{
            height: this.props.height || 400,
          }}
          // source={require('./tpl.html')}
          source={source}
          // onMessage={(e) => {
          //   this.handleMessage(e)
          // }}
          onLoadEnd={this.webViewLoaded.bind(this)}
          renderError={() => {
              console.log('renderError')
              return <View><Text>renderError</Text></View>
          }}
          renderLoading={() => {
              return (
                <ActivityIndicator
                style={[{ position: 'absolute', backgroundColor: '#fff', top: 0, left: 0, width: this.props.width || '100%', height: this.props.height || 400}]}
                size={'small'}
                color='#ccc'
                animating={true}
              />
              );
          }}
        />
      </View>
    );
  }
}
