import pokerDeck from "./PokerDeck";


class Referee {
  constructor(gameState) {
    this.game = gameState.game;
    pokerDeck.resetDeck();
  }

  getCurrentRound() {
    return this.game.currentRound;
  }

  getActivePlayers() {
    return this.game.players.filter((player) => player.status === 'ACTIVE');
  }

  isBettingRoundComplete() {
    // 简化逻辑：检查所有活跃玩家是否都有最新的行动
    const actions = this.game.actions;
    const activePlayers = this.getActivePlayers();
    const lastActionPerPlayer = {};

    actions.forEach((action) => {
      lastActionPerPlayer[action.player] = action;
    });

    return activePlayers.every((player) => lastActionPerPlayer[player.id]);
  }

  advanceRound() {
    const currentRound = this.getCurrentRound();
    const nextRoundMap = {
      PRE_FLOP: 'FLOP',
      FLOP: 'TURN',
      TURN: 'RIVER',
      RIVER: 'SHOWDOWN',
      SHOWDOWN: 'END',
    };

    const nextRound = nextRoundMap[currentRound] || 'END';
    this.game.currentRound = nextRound;

    switch (nextRound) {
      case 'FLOP':
        this.dealFlop();
        break;
      case 'TURN':
        this.dealTurn();
        break;
      case 'RIVER':
        this.dealRiver();
        break;
      case 'SHOWDOWN':
        this.showdown();
        break;
      case 'END':
        console.log('Game has ended.');
        break;
      default:
        console.log('Unknown round. Ending game.');
        this.game.currentRound = 'END';
    }
  }

  dealFlop() {
    // 发三张公共牌
    this.game.communityCards.flop = pokerDeck.dealCards(3);
    this.game.currentPlayerTurn = this.getNextPlayer();
    console.log('Flop has been dealt.');
  }

  dealTurn() {
    // 发一张转牌
    this.game.communityCards.turn = pokerDeck.dealCards(1);
    console.log('Turn has been dealt.');
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  dealRiver() {
    // 发一张河牌
    this.game.communityCards.river = pokerDeck.dealCards(1);
    console.log('River has been dealt.');
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  showdown() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 1) {
      // 只有一个玩家活跃，自动赢得奖池
      const winner = activePlayers[0].id;
      this.game.pot = 0;
      console.log(`Player ${winner} wins the pot by default.`);
    } else {
      // 多玩家参与摊牌，比较手牌
      const community = [...this.game.communityCards.flop, ...(this.game.communityCards.turn ? [this.game.communityCards.turn] : []), ...(this.game.communityCards.river ? [this.game.communityCards.river] : [])];
      const winners = determineWinner(activePlayers, community);
      const pot = this.game.pot;
      const splitPot = Math.floor(pot / winners.length);
      winners.forEach((winnerId) => {
        const player = this.game.players.find((p) => p.id === winnerId);
        if (player) {
          player.chips += splitPot;
        }
      });
      this.game.pot = 0;
      console.log(`Players ${winners.join(', ')} win the pot.`);
    }
  }

  getNextPlayer() {
    // 简化示例，返回第一个活跃玩家
    const activePlayers = this.getActivePlayers();
    return activePlayers.length > 0 ? activePlayers[0].id : null;
  }

  waitForPlayerAction() {
    // 在实际应用中，这里应该是等待玩家输入或通过 API 接收
    // 简化示例，自动进行一个模拟动作
    const currentPlayerId = this.game.currentPlayerTurn;
    const player = this.game.players.find((p) => p.id === currentPlayerId);
    if (!player) return;

    // 模拟一个动作，这里可以根据实际逻辑调整
    const action = {
      player: currentPlayerId,
      action: 'CHECK',
      amount: 0,
      message: "I'll check.",
    };
    this.game.actions.push(action);
    console.log(`Player ${currentPlayerId} performs action: ${action.action}`);

    // 更新下一轮行动玩家
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  run() {
    while (this.getCurrentRound() !== 'END') {
      if (this.getCurrentRound() === 'SHOWDOWN') {
        this.showdown();
        this.advanceRound();
        continue;
      }

      if (this.isBettingRoundComplete()) {
        this.advanceRound();
      } else {
        this.waitForPlayerAction();
      }
    }
  }
}

export default Referee;