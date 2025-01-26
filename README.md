# Reasoning Model Texas hold'em

用德州扑克来较量各家推理模型的实力

Using Texas Hold'em to compare the strength of various reasoning models

## 限定条件

1. 只有 2 人
2. small blind: 1, big blind: 2
3. 一个买入为100 big blind, 即 200

## ENUM

### suit

    ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"]

### rank

    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

### status

    ["ACTIVE", "FOLDED", "ALL_IN"]

### round

    ["PRE_FLOP", "FLOP", "TURN", "RIVER", "SHOWDOWN", "END"]

### action

    ["CALL", "CHECK", "FOLD", "RAISE", "BET", "ALL_IN"]

## JSON 结构

JSON结构用以描述一局德州扑克从开始到当前状态的全部信息

```json
{
  "game": {
    "id": "123456789",
    "table": {
      "players": 2,
      "smallBlind": 1,
      "bigBlind": 2
    },
    "players": [
      {
        "id": "player1",
        "name": "OpenAI o1-mini",
        "chips": 150,
        "chipsThisRound": 50,
        "status": "ACTIVE",
        "holeCards": [0, 1]
      },
      {
        "id": "player2",
        "name": "DeepSeek R1",
        "chips": 200,
        "chipsThisRound": 0,
        "status": "ACTIVE",
        "holeCards": [2, 3]
      }
    ],
    "dealer": "player1",
    "communityCards": {
      "flop": [4, 5, 6],
      "turn": 7,
      "river": null
    },
    "pot": 30,
    "currentRound": "PRE_FLOP",
    "currentPlayerTurn": "player1",
    "actions": [
      {
        "player": "player1",
        "action": "CALL",
        "amount": 20,
        "message": "I call"
      },
      {
        "player": "player2",
        "action": "CHECK",
        "amount": 0,
        "message": "I check"
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
  "amount": 20,
  "message": "看来你很喜欢这手牌，我决定再加注，看看你是否真的有信心。",
  "analysis": "Player1决定跟注20筹码"
}
```

## Mock data

```json
{
  "game": {
    "id": "987654321",
    "table": {
      "players": 2,
      "smallBlind": 1,
      "bigBlind": 2
    },
    "players": [
      {
        "id": "player1",
        "name": "OpenAI o1-mini",
        "chips": 150,
        "chipsThisRound": 50,
        "status": "ACTIVE",
        "holeCards": [0, 1]
      },
      {
        "id": "player2",
        "name": "DeepSeek R1",
        "chips": 200,
        "chipsThisRound": 0,
        "status": "ACTIVE",
        "holeCards": [2, 3]
      }
    ],
    "dealer": "player1",
    "communityCards": {
      "flop": [4, 5, 6],
      "turn": null,
      "river": null
    },
    "pot": 30,
    "currentRound": "FLOP",
    "currentPlayerTurn": "player2",
    "actions": [
      {
        "player": "player1",
        "action": "POST_SMALL_BLIND",
        "amount": 1,
        "message": "Posting small blind."
      },
      {
        "player": "player2",
        "action": "POST_BIG_BLIND",
        "amount": 2,
        "message": "Posting big blind."
      },
      {
        "player": "player1",
        "action": "RAISE",
        "amount": 5,
        "message": "Raising to 6."
      },
      {
        "player": "player2",
        "action": "CALL",
        "amount": 4,
        "message": "Calling your raise."
      },
      {
        "player": "player2",
        "action": "CHECK",
        "amount": 0,
        "message": "Checking on the flop."
      },
      {
        "player": "player1",
        "action": "BET",
        "amount": 6,
        "message": "Continuing the aggression."
      }
    ]
  }
}
```
