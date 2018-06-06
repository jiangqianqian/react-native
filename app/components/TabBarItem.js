/**
 * qfang.com broker-app
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import Icon from './Icon/';

class TabBarItem extends PureComponent {
  render() {
    let selectedImage = this.props.selectedImage ? this.props.selectedImage : this.props.normalImage;
    return (
      <Icon name={this.props.focused
        ? selectedImage
        : this.props.normalImage}
        size={this.props.size}
        color={this.props.focused
          ? this.props.tintColor
          : "#cccccc"}
      />
    );
  }
};

export default TabBarItem;
