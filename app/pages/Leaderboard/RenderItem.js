import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';
import baseStyles from '../../components/baseStyles';

import placeholderImage from '../../assets/img/head.png';
import firstRank from '../../assets/img/first-rank.png';
import twoRank from '../../assets/img/two-rank.png';
import threeRank from '../../assets/img/three-rank.png';

export default class RenderItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    tabType: PropTypes.string.isRequired,
  }

  render() {
    let imageRank = '';
    let navigatePageName = '';

    const item = this.props.data;
    const { navigate } = this.props.navigation;
    const selfPersonId = this.props.navigation.state.params && this.props.navigation.state.params.personId;

    if (item.rank === 1) {
      imageRank = (<Image style={styles.rankIconStyle} source={firstRank} />);
    } else if (item.rank === 2) {
      imageRank = (<Image style={styles.rankIconStyle} source={twoRank} />);
    } else if (item.rank === 3) {
      imageRank = (<Image style={styles.rankIconStyle} source={threeRank} />);
    } else {
      imageRank = (<View style={styles.rankNumbIcon}><Text style={{ color: '#a1a1a1', fontSize: 12 }}>{item.rank}</Text></View>);
    }

    if (selfPersonId && selfPersonId === item.personId) {
      navigatePageName = 'AbilitySelf';
    } else {
      navigatePageName = 'Ability';
    }

    return (
      <TouchableOpacity style={[baseStyles.rowcenter, styles.itemStyle]} onPress={() => navigate(navigatePageName, { personId: item.personId })}>
        <View style={[baseStyles.rowcenter]}>
          {imageRank}
          <ImageLoad
            style={styles.headPhoto}
            loadingStyle={{ size: 'small', color: 'white' }}
            borderRadius={18}
            placeholderSource={placeholderImage}
            placeholderStyle={{ backgroundColor: '#dedfe1', borderRadius: 18 }}
            source={item.personImageUrl ? { uri: item.personImageUrl } : placeholderImage}/>
          <View style={baseStyles.marginL10}>
            <View style={[baseStyles.rowcenter]}>
              <View><Text style={{ color: '#333', fontSize: 15 }}>{item.personName || ''}</Text></View>
              {
                this.props.tabType !== 'BRANCH' ? (<View style={{ marginLeft: 5 }}><Text style={{ color: '#333', fontSize: 12 }}>{item.branchOrgName || ''}</Text></View>) : null
              }
            </View>
            <View style={{ marginTop: 5 }}><Text style={{ color: '#9a9a9a', fontSize: 12 }}>LV{item.level || ''}-{item.levelName || ''}</Text></View>
          </View>
        </View>
        <View><Text style={{ color: '#7e7e7e', fontSize: 12 }}>{item.score || ''}</Text></View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  itemStyle: {
    height: 72,
    marginLeft: 15,
    marginRight: 15,
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  rankIconStyle: {
    width: 25,
    height: 28,
    resizeMode: 'cover',
  },

  rankNumbIcon: {
    width: 22,
    height: 22,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  headPhoto: {
    width: 36,
    height: 36,
    overflow: 'hidden',
    marginLeft: 10,
  },
});