import pokerDeck from "./PokerDeck";

class Referee {
  constructor(gameState) {
    this.game = gameState.game;
    this.isPaused = false;
    pokerDeck.resetDeck();
  }

  getCurrentRound() {
    return this.game.currentRound;
  }

  getActivePlayers() {
    return this.game.players.filter((player) => player.status === 'ACTIVE');
  }

  /**
   * 判断当前投注轮次是否已经完成
   * @returns {boolean} - 如果投注轮次完成，返回 true；否则返回 false
   */
  isBettingRoundComplete() {
    // 检查所有玩家是否都没有发牌
    if (this.game.players.every((player) => player.holeCards[0] === -1 && player.holeCards[1] === -1)) {
      return true;
    }

    const activePlayers = this.getActivePlayers();

    // 1. 如果一个玩家状态是FOLDED，则另一个玩家直接获胜
    if (activePlayers.length === 1) {
      return true;
    }
    // 2. 两个玩家状态都是ALL_IN
    if (activePlayers.every((player) => player.status === 'ALL_IN')) {
      return true;
    }
    // 3. 如果一个玩家状态是ALL_IN，另一个玩家本轮下注>=ALL_IN玩家本轮下注
    const allInPlayer = activePlayers.find((player) => player.status === 'ALL_IN');
    if (allInPlayer) {
      const otherPlayer = activePlayers.find((player) => player !== allInPlayer);
      if (otherPlayer.chipsThisRound >= allInPlayer.chipsThisRound) {
        return true;
      }
    }

    // 4. 两个玩家本轮都有行动，且下注相等
    if (activePlayers.every((player) => player.hasActionThisRound)) {
      const equalBets = activePlayers.every((player) => player.chipsThisRound === activePlayers[0].chipsThisRound);
      if (equalBets) {
        return true;
      }
    }

    // 如果四种情况都不符合，则继续
    return false;
  }

  advanceRound() {
    const currentRound = this.getCurrentRound();
    const nextRoundMap = {
      START: 'PRE_FLOP',
      PRE_FLOP: 'FLOP',
      FLOP: 'TURN',
      TURN: 'RIVER',
      RIVER: 'SHOWDOWN',
      SHOWDOWN: 'END',
    };

    const nextRound = nextRoundMap[currentRound] || 'END';
    this.game.currentRound = nextRound;

    this.game.players.forEach((player) => {
      player.hasActionThisRound = false;
    });

    switch (nextRound) {
      case 'PRE_FLOP':
        this.dealPreflop();
        break;
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

  dealPreflop() {
    this.game.players.forEach((player) => {
      player.holeCards = pokerDeck.dealCards(2);
    });
    console.log('Preflop has been dealt.');
  }

  dealFlop() {
    this.game.communityCards.flop = pokerDeck.dealCards(3);
    this.game.currentPlayerTurn = this.getNextPlayer();
    console.log('Flop has been dealt.');
  }

  dealTurn() {
    this.game.communityCards.turn = pokerDeck.dealCards(1);
    console.log('Turn has been dealt.');
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  dealRiver() {
    this.game.communityCards.river = pokerDeck.dealCards(1);
    console.log('River has been dealt.');
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  showdown() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 1) {
      const winner = activePlayers[0].id;
      this.game.pot = 0;
      console.log(`Player ${winner} wins the pot by default.`);
    } else {
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
    const activePlayers = this.getActivePlayers();
    return activePlayers.length > 0 ? activePlayers[0].id : null;
  }

  async waitForPlayerAction() {
    const currentPlayerId = this.game.currentPlayerTurn;
    const player = this.game.players.find((p) => p.id === currentPlayerId);
    if (!player) return;

    await new Promise(resolve => setTimeout(resolve, 2000));

    const action = {
      player: currentPlayerId,
      action: 'CHECK',
      amount: 0,
      message: "I'll check.",
    };
    this.game.actions.push(action);
    player.hasActionThisRound = true;
    console.log(`Player ${currentPlayerId} performs action: ${action.action}`);

    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  async run() {
    while (this.getCurrentRound() !== 'END') {
      if (this.isPaused) {
        console.log('Game is paused.');
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      console.log('Current round:', this.getCurrentRound());
      if (this.getCurrentRound() === 'SHOWDOWN') {
        this.showdown();
        this.advanceRound();
        continue;
      }

      if (this.isBettingRoundComplete()) {
        console.log('Betting round complete. Advancing to next round.');
        this.advanceRound();
      } else {
        console.log('Waiting for player action.');
        await this.waitForPlayerAction();
      }
    }
  }

  pause() {
    this.isPaused = true;
    console.log('Game paused.');
  }

  resume() {
    this.isPaused = false;
    console.log('Game resumed.');
  }
}

export default Referee;