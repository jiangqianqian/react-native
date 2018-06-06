#!/bin/bash
# 需要先安装fonttools, sudo pip install fonttools

FONTNAME=$1

if [ -z "$FONTNAME" ]; then
  echo 'Usage:'
  echo './build-font.sh <target-font-name.ttf>'
  exit 1;
fi

CURDIR=$( cd "$( dirname $0  )" && pwd )

# cd $CURDIR
# cd ../app/assets/fonts/
# if [ -f '../app/assets/fonts/iconfont.ttf' ]; then
#   echo 'Converting font...'
#   mv ../app/assets/fonts/iconfont.ttf ../app/assets/fonts/${FONTNAME}
#   echo 'Mapping...'
#   python ../../../build/iconfont-mapper.py ${FONTNAME} ../../components/FontMap.js
#   cp ${FONTNAME} ../../../android/app/src/main/assets/fonts/
#   echo 'Convert success.'
# else
#   echo 'Error: File no found. Please make sure that the file is accessible - iconfont.ttf.'
# fi

cd $CURDIR
cd ../app/assets/fonts/
if [ -f '../../../app/assets/fonts/iconfont.ttf' ]; then
  echo 'Converting font...'
  mv ../../../app/assets/fonts/iconfont.ttf ../../../app/assets/fonts/${FONTNAME}
  echo 'Mapping...'
  python ../../../build/iconfont-mapper.py ../../../app/assets/fonts/${FONTNAME} ../../../app/components/Icon/FontMap.js
  cp ../../../app/assets/fonts/${FONTNAME} ../../../android/app/src/main/assets/fonts/
  echo 'Convert success.'
else
  echo 'Error: File no found. Please make sure that the file is accessible - iconfont.ttf.'
fi
