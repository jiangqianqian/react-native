import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function noDataList() {
  return (<View style={styles.noDataWrapper}>
    <Text style={styles.noDataText}>
      {'想看到客户房源喜好报告吗？\n让你的客户赶快使用Q房网app吧'}
    </Text>
  </View>);
}

const styles = StyleSheet.create({
  noDataWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#d6d7da',
    textAlign: 'center',
    lineHeight: 20,
  },
});
