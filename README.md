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

### position

    ["DEALER", "SMALL_BLIND", "BIG_BLIND"]

### round

    ["PRE_FLOP", "FLOP", "TURN", "RIVER", "SHOWDOWN"]

### action

    ["CALL", "CHECK", "FOLD", "RAISE", "ALL_IN"]

## JSON 结构

JSON结构用以描述牌桌上的状态

```json
{
  "game": {
    "gameId": "123456789",
    "table": {
      "tableId": "table_01",
      "maxPlayers": 2,
      "smallBlind": 10,
      "bigBlind": 20,
      "dealerPosition": 0 // 0 或 1，表示玩家数组中的索引
    },
    "players": [
      {
        "playerId": "player1",
        "name": "Alice",
        "chips": 1500,
        "status": "active", // possible values: active, folded, all-in
        "currentBet": 20, // 大盲注
        "holeCards": [
          { "suit": "hearts", "rank": "A" },
          { "suit": "diamonds", "rank": "K" }
        ], // 仅在需要时显示
        "position": "bigBlind" // possible values: dealer, smallBlind, bigBlind
      },
      {
        "playerId": "player2",
        "name": "Bob",
        "chips": 2000,
        "status": "active",
        "currentBet": 10, // 小盲注
        "holeCards": [
          { "suit": "clubs", "rank": "7" },
          { "suit": "diamonds", "rank": "7" }
        ],
        "position": "smallBlind"
      }
    ],
    "communityCards": {
      "flop": [
        { "suit": "spades", "rank": "2" },
        { "suit": "hearts", "rank": "9" },
        { "suit": "clubs", "rank": "J" }
      ],
      "turn": { "suit": "diamonds", "rank": "5" },
      "river": null // 例如，如果尚未发出河牌，则为null
    },
    "pot": 30, // 小盲 + 大盲
    "currentRound": "pre-flop", // possible values: pre-flop, flop, turn, river, showdown
    "currentPlayerTurn": "player1", // 通常由大盲之后的玩家开始
    "actions": [
      {
        "playerId": "player1",
        "action": "call",
        "amount": 20,
        "timestamp": "2025-01-25T15:30:00Z"
      },
      {
        "playerId": "player2",
        "action": "check",
        "amount": 0,
        "timestamp": "2025-01-25T15:31:00Z"
      }
      // 其他动作...
    ],
    "lastUpdated": "2025-01-25T15:35:00Z"
  }
}
```

