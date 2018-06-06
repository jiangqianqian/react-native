#!/bin/bash
# Created by ljf

ANDROIDDIR=../QfangJoin
cp -r android/app/src/main/assets/ ${ANDROIDDIR}/assets/
cp -r android/app/src/main/res/drawable* ${ANDROIDDIR}/res/

cd ${ANDROIDDIR}
#离线
#gradle clean && gradle assembleRelease
#在线
gradle clean && gradle assembleRelease -PrnModel=online

open build/bakApk/
