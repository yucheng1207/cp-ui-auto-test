@quick
Feature: 快速体验

Scenario: 快速体验
    Given 快速体验
    Given I have 42.2 cucumbers in my belly
    """
    多行文本
    多行文本
    """
    Given I have '42.2' cucumbers in my belly
    Given I have a red ball
    Given the following animals
    | anumals   |   age     |
    | cow       |   5       |
    | horse     |   6       |
    | sheep     |   7       |
    Given test json
    """
    {
        "name": "test",
    }
    """


Scenario Outline: Outline Test
    Given 输入"<input>"
    Then 显示"<show>"
    Examples:
        | input | show |
        | nihao | 你好  |
        | hello | 哈喽  |