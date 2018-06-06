/**
 * qfang.com brokerApp
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import FontMap from './FontMap';

const DEFAULT_ICON_SIZE = 30;
let fontReference = 'broker';

class Icon extends PureComponent {
  render() {
    let { name, size, color, style, ...props } = this.props;
    let glyph = FontMap(name);
    size = size || DEFAULT_ICON_SIZE;
    let styleDefaults: Object = {
      fontSize: size,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color,
    };
    props.style = [styleDefaults, style];
    props.ref = (component) => this._root = component;
    styleDefaults.fontFamily = fontReference;
    // console.log(this.props)
    return (<Text {...props} ref={(c) => this.iconRef = c}>{glyph}</Text>);
  }
};

export default Icon;
