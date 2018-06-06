#!/bin/bash
# Created by ljf

IOSDIR=../broker-platform-ios
cp -r ios/RNBundle/broker.* ${IOSDIR}/JMPanKeTong/RNBundle/broker/
cp -r ios/RNBundle/assets ${IOSDIR}/JMPanKeTong/RNBundle/
cp -r app/assets/fonts/*.* ${IOSDIR}/JMPanKeTong/RNBundle/broker/

cd ${IOSDIR}
#离线
#./build.sh release
#在线
./build.sh debug online
