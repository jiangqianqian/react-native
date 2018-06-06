import { NativeModules } from 'react-native';

let helper  = NativeModules.QFReactHelper;

if (!helper) {
  helper = {};
  function fakeNative() {
    console.log(arguments);
  }
  let methods = ['navPop', 'logout', 'show', 'statistical', 'hideDialog', 'showMainTabbar', 'showPage'];
  methods.forEach((method) => helper[method] = fakeNative);
}
export const QFReactHelper = helper;
