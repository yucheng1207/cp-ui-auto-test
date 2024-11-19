# # language: zh-CN

# 功能: 登录 Ctrip

# 测试 Ctrip 登录功能

# 背景:
#     假如 要执行测试了
#     那么 提前做一些事情

# 规则: Rule name

# 场景: 成功登录 Ctrip
#     假如 进入'登录'页
#     当 点击登入會員按钮
#     当 我输入账号'yucheng'
#     当 点击继续
#     当 我输入密码'123456'
#     当 点击登录
#     那么 登录成功


# 场景: 登录 Ctrip 密码错误
#     假如 进入'登录'页
#     当 点击登入會員按钮
#     当 我输入账号'yucheng'
#     当 点击继续
#     当 我输入密码'123456'
#     当 点击登录
#     那么 登录成功



@login
Feature: 登录 Ctrip

这是一个登录 Ctrip 用例描述


Scenario: 成功登录 Ctrip
    Given 进入'登录'页
    When 点击登入會員按钮
    When 我输入账号'yucheng'
    When 点击继续
    When 我输入密码'123456'
    When 点击登录
    Then 登录成功

Scenario: 登录 Ctrip 密码错误
    Given 进入'登录'页
    When 点击登入會員按钮
    When 我输入账号'yucheng'
    When 点击继续
    When 我输入密码'123456'
    When 点击登录
    Then 密码错误
