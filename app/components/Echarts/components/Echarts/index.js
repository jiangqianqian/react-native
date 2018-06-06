import React, { Component } from 'react';
import { WebView, View, Platform, DeviceEventEmitter, Text, ActivityIndicator } from 'react-native';
import renderChart from './renderChart';
// import echarts from './echarts.min';

// const source = require('./echarts.html');
const source = (Platform.OS === 'ios') ? require('../../../../assets/echarts/echarts.html') : { uri: 'file:///android_asset/echarts.html' };

function webViewLoaded() {
  DeviceEventEmitter.emit('webViewData', 'loaded');
}

export default class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option) {
      this.refs.chart.reload();
    }
  }

  render() {
    return (
      <View style={{ flex: 1, height: this.props.height || 400 }}>
        <WebView
          ref="chart"
          scrollEnabled={false}
          injectedJavaScript={renderChart(this.props)}
          scalesPageToFit
          startInLoadingState
          style={{
            height: this.props.height || 400,
          }}
          // source={require('./tpl.html')}
          source={source}
          // onMessage={(e) => {
          //   this.handleMessage(e)
          // }}
          onLoadEnd={webViewLoaded}
          renderError={() => {
            console.log('renderError');
            return <View><Text>renderError</Text></View>;
          }}
          renderLoading={() => (
            <ActivityIndicator
              style={[{ position: 'absolute', backgroundColor: '#fff', top: 0, left: 0, width: this.props.width || '100%', height: this.props.height || 400 }]}
              size={'small'}
              color="#ccc"
              animating
            />
          )}
        />
      </View>
    );
  }
}
