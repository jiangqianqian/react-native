#!/bin/bash
# Created by ljf

ANDROIDDIR=../QfangJoin
cp -r android/app/src/main/assets/ ${ANDROIDDIR}/assets/
cp -r android/app/src/main/res/drawable* ${ANDROIDDIR}/res/

cd ${ANDROIDDIR}
gradlew clean && gradlew assembleRelease
open build/bakApk/
