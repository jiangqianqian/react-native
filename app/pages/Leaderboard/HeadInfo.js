import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, InteractionManager } from 'react-native';

import axios from 'axios';
import ImageLoad from 'react-native-image-placeholder';

import baseStyles from '../../components/baseStyles';
import Icon from '../../components/Icon';

import placeholderImage from '../../assets/img/head.png';

export default class HeadInfo extends PureComponent {
  state = {
    items: {},
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.requestData('BRANCH');
    });
  }

  requestData(tabType) {
    this.tabType = tabType;
    return axios
      .get('evaluation/selfRank', { params: { rankType: tabType } }).then((res) => {
        if (res.data.code === 'C0000') {
          this.setState({ items: res.data.data });
        }
      });
  }

  render() {
    const items = this.state.items;
    let tabTypeText = '';

    switch (this.tabType) {
      case 'BRANCH':
        tabTypeText = '分店';
        break;
      case 'AREA':
        tabTypeText = '片区';
        break;
      case 'REGION':
        tabTypeText = '大区';
        break;
      case 'CITY':
        tabTypeText = '城市';
        break;
      default: '分店';
    }

    return (
      <View style={[styles.personDetail, baseStyles.rowcenter]}>
        <ImageLoad
          style={styles.headPhoto}
          loadingStyle={{ size: 'small', color: 'white' }}
          borderRadius={18}
          placeholderSource={placeholderImage}
          placeholderStyle={{ backgroundColor: '#dedfe1', width: 45, height: 45 }}
          source={items.personImageUrl ? { uri: items.personImageUrl } : placeholderImage} />
        <View style={[styles.infoDetails]}>
          <View style={[baseStyles.rowcenter, { justifyContent: 'flex-start', backgroundColor: '#2f2e36' }]} >
            <View>
              <Text style={[baseStyles.fz16, baseStyles.ftBold, baseStyles.colorFff]}>{items.personName || ''}</Text>
            </View>
            <View style={styles.rankBlock}>
              <Text style={[baseStyles.fz11, { color: '#2f2e36' }]}>
                LV.{items.level || ''} {items.levelName || ''}
              </Text>
            </View>
          </View>
          <View style={[baseStyles.rowcenter, { marginTop: 15, backgroundColor: '#2f2e36', justifyContent: 'flex-start' }]}>
            <View style={{ marginRight: 8 }}>
              <Text style={baseStyles.color9d9}>经验值 {items.score || ''}</Text>
            </View>
            <View style={[baseStyles.rowcenter, { marginRight: 8 }]}>
              <Text style={baseStyles.color9d9}>排名{items.rank || ''}</Text>
              {
                items.rankChange ? <Icon name={items.rankChange > 0 ? 'mingcishangsheng' : 'mingcixiajiang'} size={16} color={items.rankChange > 0 ? '#43c573' : '#ff9933'} /> : null
              }
            </View>
            <View style={{ marginRight: 5 }}>
              <Text style={baseStyles.color9d9}>打败{items.defeatScale || ''}{tabTypeText}经纪人</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  personDetail: {
    width: '100%',
    position: 'absolute',
    left: 15,
    top: 50,
    elevation: 10,
    zIndex: 10,
  },

  headPhoto: {
    width: 45,
    height: 45,
    overflow: 'hidden',
  },

  infoDetails: {
    marginLeft: 15,
    width: '90%',
  },

  rankBlock: {
    width: 84,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: '#727282',
    borderRadius: 3,
    marginLeft: 10,
  },
});