#!/bin/bash
# Created by ljf

IOSDIR=../broker-platform-ios
cp -r ios/RNBundle/brokerapp.* ${IOSDIR}/JMPanKeTong/RNBundle/brokerapp/
cp -r ios/RNBundle/assets ${IOSDIR}/JMPanKeTong/RNBundle/
cp -r app/assets/fonts/*.* ${IOSDIR}/JMPanKeTong/RNBundle/brokerapp/

cd ${IOSDIR}
./build.sh release
