@demo
Feature:  Demo 测试
  Scenario: demo测试
    Given 进入网页'https://secure.trip.com/webapp/cashier/home?tradeNo=20240523195217TP1348581570186949361761&locale=zh-HK&orderId=32463740442&pageId=10320668153&curr=JPY'
    Given 存在元素'.trip-pay-button-pc-wrapper'
    Given 进入网页'https://www.google.com.hk/'
    Given 存在元素'.RNNXgb'
    Given 进入网页'https://web-pay.line.me/web/payment/waitPreLogin?transactionReserveId=Tkl0TWZhQlpaT3BnUU9HN1FJaGJKWTdtWUlLNEFHbzhQUW1rM1NJcDBBY2dzNTNFclJtNCtBb25kMVpnMWxmQQ&locale=zh-TW_LP'
    Given 存在元素'.ly_qrcode'

