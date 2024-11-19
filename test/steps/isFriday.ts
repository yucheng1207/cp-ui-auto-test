/*
 * @Author: ychengzhang ychengzhang@trip.com
 * @Date: 2024-01-25 14:45:10
 * @LastEditors: ychengzhang ychengzhang@trip.com
 * @LastEditTime: 2024-01-25 16:59:58
 * @FilePath: /ui-auto-test/test/steps/isFriday.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

Given('today is {string}', function (givenDay) {
  console.log(`step: today is ${givenDay}`)
  this.today = givenDay;
});

When('I ask whether it\'s Friday yet', function () {
  console.log(`step: I ask whether it\'s Friday yet`)
  this.actualAnswer = isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  console.log(`step: I should be told ${expectedAnswer}`)
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});