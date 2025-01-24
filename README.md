# Reasoning Model Texas hold'em

用德州扑克来较量各家推理模型的实力

Using Texas Hold'em to compare the strength of various reasoning models

## 限定条件

1. 只有 2 人
2. small blind: 1, big blind: 2
3. 一个买入为100 big blind, 即 200

## 枚举

### suit

    ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"]

### rank

    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

### status

    ["ACTIVE", "FOLDED", "ALL_IN"]

### round

    ["PRE_FLOP", "FLOP", "TURN", "RIVER", "SHOWDOWN"]

### action

    ["CALL", "CHECK", "FOLD", "RAISE", "ALL_IN"]

## JSON 结构

JSON结构用以描述牌桌上的状态，输入给模型

```json
{
  "game": {
    "id": "123456789",
    "table": {
      "id": "table_01",
      "players": 2,
      "smallBlind": 10,
      "bigBlind": 20
    },
    "players": [
      {
        "id": "player1",
        "name": "Alice",
        "chips": 1500,
        "status": "active", // possible values: active, folded, all-in
        "holeCards": [
          { "suit": "hearts", "rank": "A" },
          { "suit": "diamonds", "rank": "K" }
        ]
      },
      {
        "id": "player2",
        "name": "Bob",
        "chips": 2000,
        "status": "active",
        "holeCards": [
          { "suit": "clubs", "rank": "7" },
          { "suit": "diamonds", "rank": "7" }
        ]
      }
    ],
    "dealer": "player1",
    "communityCards": {
      "flop": [
        { "suit": "spades", "rank": "2" },
        { "suit": "hearts", "rank": "9" },
        { "suit": "clubs", "rank": "J" }
      ],
      "turn": { "suit": "diamonds", "rank": "5" },
      "river": null
    },
    "pot": 30,
    "currentRound": "pre-flop",
    "currentPlayerTurn": "player1",
    "actions": [
      {
        "player": "player1",
        "action": "call",
        "amount": 20,
        "timestamp": "2025-01-25T15:30:00Z"
      },
      {
        "player": "player2",
        "action": "check",
        "amount": 0,
        "timestamp": "2025-01-25T15:31:00Z"
      }
    ]
  }
}
```

## action

action 是模型输出的结果，描述模型在当前状态下的决策

```json
{
  "action": "CALL",
  "amount": 20
}
```
