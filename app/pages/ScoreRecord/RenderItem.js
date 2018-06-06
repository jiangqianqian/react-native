import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';

import baseStyles from '../../components/baseStyles';

export default class RenderItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const items = this.props.data;
    return (
      <View style={[baseStyles.rowcenter, styles.itemList]}>
        <View style={{ flex: 8, paddingRight: 5 }}>
          <View style={[baseStyles.rowcenter, { justifyContent: 'flex-start', flexWrap: 'wrap' }]}>
            <View style={{ marginRight: 6 }}>
              <Text style={[baseStyles.color333, baseStyles.fz16]}>{ items.taskName || '' }</Text>
            </View>
            {
              items.taskGroup ? <View style={styles.taskMark}><Text style={[baseStyles.fz12, { color: '#8c8eb9' }]}>{ items.taskGroup }</Text></View> : null
            }
          </View>
          {
            items.taskDesc ? <View style={{ marginTop: 10 }}>
              <Text style={[baseStyles.fz14, { color: '#9a9a9a', lineHeight: 23 }]}>{ items.taskDesc }</Text>
            </View> : null
          }
          <View style={{ marginTop: 15 }}>
            <Text style={[baseStyles.fz12, baseStyles.colorF7e]}>{ items.createdAt || ''}</Text>
          </View>
        </View>
        <View>
          { items.ownerScore ? <Text style={[baseStyles.fz12, baseStyles.color333, baseStyles.marginB8]}>
            { items.ownerItemName } { items.ownerScore > 0 ? ('+' + items.ownerScore) : <Text style={{ color: '#f74c31' }}> { items.ownerScore }</Text> }
          </Text> : null
          }
          { items.contributionScore ? <Text style={[baseStyles.fz12, baseStyles.color333, baseStyles.marginB8]}>
          { items.contributionItemName } { items.contributionScore > 0 ? ('+' + items.contributionScore) : <Text style={{ color: '#f74c31' }}> { items.contributionScore }</Text> }
          </Text> : null
          }
          { items.growingScore ? <Text style={[baseStyles.fz12, baseStyles.color333, baseStyles.marginB8]}>
          { items.growingItemName }  { items.growingScore > 0 ? ('+' + items.growingScore) : <Text style={{ color: '#f74c31' }}>{ items.growingScore }</Text> }
          </Text> : null
          }
          { items.customerScore ? <Text style={[baseStyles.fz12, baseStyles.color333, baseStyles.marginB8]}>
          { items.customerItemName } { items.customerScore > 0 ? ('+' + items.customerScore) : <Text style={{ color: '#f74c31' }}>{ items.customerScore }</Text> }
          </Text> : null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  taskMark: {
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8eb9',
    borderRadius: 4,
  },
});