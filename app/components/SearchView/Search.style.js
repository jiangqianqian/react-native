import React, { PureComponent } from 'react';
import { screen, system } from '../../utils';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    flex: 1,
    paddingTop: system.isIOS ? 66 : 46,

  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: system.isIOS ? 20 : 0,
    height: screen.height - 20,
    backgroundColor: '#fff'
  },

  inputContainerStyle: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#e5e5e5',
  },

  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
    borderWidth: 0,
    margin: 10,
    marginTop: 7,
    marginBottom: 7
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10
  },
  searchText: {
    fontSize: 14,
    color: '#7e7e7e'
  },

  inputStyle: {
    width: '82%',
    height: 30,
    padding: 0
  },
  button: {
    height: 30,
  },
  buttonText: {
    fontSize: 15,
    margin: 7,
    marginLeft: 0,
    color: '#3a3a3a',
  },

  listContainerStyle: {
  },
  listStyle: {
    borderWidth: 0,
    margin: 0,
  },
  itemRow: {
    marginLeft: 15,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 15,
    margin: 10,
    marginLeft: 0,
    color: '#9a9a9a',
  }
});
