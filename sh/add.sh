#!/usr/bin/env bash
echo "请输入提交的原因："
read REASON

if [ "$REASON"x = ""x ]; then
echo "请输入提交原因："
exit 0
fi

cd ../

branchName=`git rev-parse --abbrev-ref HEAD`
git add .
git commit -m "${REASON}"
git pull origin $branchName
git push origin $branchName