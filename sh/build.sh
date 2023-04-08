#!/usr/bin/env bash
echo "请输入构建环境sit/uat/prod："
read ENV

if [ "$ENV"x = ""x ]; then
echo "请输入构建环境sit/uat/prod："
exit 0
fi

cd ../

npm run "${ENV}"
