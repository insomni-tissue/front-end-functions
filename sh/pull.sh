#!/usr/bin/env bash

# 获取当地你分支
# branchName = `git branch | grep "*"`
# branchName = `git symbolic-ref --short -q HEAD`
# branchName = `git rev-parse --abbrev-ref HEAD`
cd ../

branchName=`git rev-parse --abbrev-ref HEAD`
git pull origin $branchName