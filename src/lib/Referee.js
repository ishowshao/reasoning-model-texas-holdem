import pokerDeck from "./PokerDeck";
import Classifier from "./classifier";
import compare from "./compare";
import callModel from "./callModel";
class Referee {
  constructor(gameState) {
    this.game = gameState.game;
    this.isPaused = false;
    this.isStopped = false; // 添加一个标志位来表示游戏是否被强行停止
    pokerDeck.resetDeck();
    this.smallBlindPlayer = this.game.players.find((player) => player.id === this.game.dealer);
    this.bigBlindPlayer = this.game.players.find((player) => player.id !== this.game.dealer);
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
      player.chipsThisRound = 0;
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
    // 根据dealer下盲注，单挑时dealer是小盲
    const dealerPlayer = this.game.players.find((player) => player.id === this.game.dealer);
    const smallBlindPlayer = dealerPlayer;
    const bigBlindPlayer = this.game.players.find((player) => player.id !== dealerPlayer.id);
    smallBlindPlayer.chips -= this.game.table.smallBlind;
    bigBlindPlayer.chips -= this.game.table.bigBlind;
    this.game.pot += this.game.table.smallBlind + this.game.table.bigBlind;
    smallBlindPlayer.chipsThisRound += this.game.table.smallBlind;
    bigBlindPlayer.chipsThisRound += this.game.table.bigBlind;
    this.game.currentPlayerTurn = smallBlindPlayer.id;
    console.log('Preflop has been dealt.');
  }

  dealFlop() {
    this.game.communityCards.flop = pokerDeck.dealCards(3);
    this.game.currentPlayerTurn = this.bigBlindPlayer.id;
    console.log('Flop has been dealt.');
  }

  dealTurn() {
    this.game.communityCards.turn = pokerDeck.dealCards(1)[0];
    this.game.currentPlayerTurn = this.bigBlindPlayer.id;
    console.log('Turn has been dealt.');
  }

  dealRiver() {
    this.game.communityCards.river = pokerDeck.dealCards(1)[0];
    this.game.currentPlayerTurn = this.bigBlindPlayer.id;
    console.log('River has been dealt.');
  }

  showdown() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 1) {
      const winner = activePlayers[0].id;
      this.game.pot = 0;
      console.log(`Player ${winner} wins the pot by default.`);
    } else {
      const community = [...this.game.communityCards.flop, this.game.communityCards.turn, this.game.communityCards.river].filter((card) => card !== -1);
      const winners = this.determineWinner(activePlayers, community);
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

  determineWinner(activePlayers, community) {
    const p1 = new Classifier([...activePlayers[0].holeCards, ...community]);
    const p2 = new Classifier([...activePlayers[1].holeCards, ...community]);
    console.log(p1, p2);
    const v1 = p1.classify();
    const v2 = p2.classify();
    console.log(v1, v2);
    const compareResult = compare(v1, v2);
    if (compareResult > 0) {
      return [activePlayers[0].id];
    } else if (compareResult < 0) {
      return [activePlayers[1].id];
    } else {
      return [activePlayers[0].id, activePlayers[1].id];
    }
  }

  getNextPlayer() {
    const currentPlayerId = this.game.currentPlayerTurn;
    const currentPlayerIndex = this.game.players.findIndex((player) => player.id === currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.game.players.length;
    return this.game.players[nextPlayerIndex].id;
  }

  async waitForPlayerAction() {
    console.log('Waiting for player action...');
    const currentPlayerId = this.game.currentPlayerTurn;
    console.log('Current player:', currentPlayerId);
    const player = this.game.players.find((p) => p.id === currentPlayerId);
    if (!player) {
      console.log('Player not found. Waiting for player action...');
      return;
    }
    const opponent = this.game.players.find((p) => p.id !== currentPlayerId);

    const action = await callModel(this.game);
    

    player.hasActionThisRound = true;
    console.log(`Player ${currentPlayerId} performs action: ${action.action} ${action.amount} ${action.message}`);
    if (action.action === 'FOLD') {
      player.status = 'FOLDED';
    } else if (action.action === 'CALL') {
      const chips = opponent.chipsThisRound - player.chipsThisRound;
      if (chips < 0) {
        player.status = 'ALL_IN';
        player.chipsThisRound += player.chips;
        this.game.pot += player.chips;
        player.chips = 0;
      } else {
        player.chips -= chips;
        player.chipsThisRound = opponent.chipsThisRound;
        this.game.pot += chips;
      }
    } else if (action.action === 'ALL_IN') {
      player.status = 'ALL_IN';
      player.chipsThisRound += player.chips;
      this.game.pot += player.chips;
      player.chips = 0;
    } else if (action.action === 'RAISE' || action.action === 'BET') {
      player.chipsThisRound += action.amount;
      player.chips -= action.amount;
      this.game.pot += action.amount;
    } else if (action.action === 'CHECK') {
      // 检查能不能check
      if (player.chipsThisRound < opponent.chipsThisRound) {
        action.action = 'FOLD';
        action.message = '在无法CHECK的情况下CHECK，被判为FOLD';
        player.status = 'FOLDED';
      }
    }
    // action在上边的if-else中可能会被变更，因为AI给的action可能不符合规则
    this.game.actions.push(action);
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  async run() {
    while (this.getCurrentRound() !== 'END' && !this.isStopped) { // 添加对isStopped的检查
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
        await this.waitForPlayerAction();
      }
    }
  }

  async step() {
    if (this.getCurrentRound() === 'END' || this.isStopped) {
      console.log('Game has ended or stopped.');
      return;
    }

    if (this.isPaused) {
      console.log('Game is paused.');
      return;
    }

    console.log('Current round:', this.getCurrentRound());
    if (this.getCurrentRound() === 'SHOWDOWN') {
      this.showdown();
      this.advanceRound();
      return;
    }

    if (this.isBettingRoundComplete()) {
      console.log('Betting round complete. Advancing to next round.');
      this.advanceRound();
    } else {
      await this.waitForPlayerAction();
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

  stop() {
    this.isStopped = true; // 设置isStopped为true，强行停止游戏
    console.log('Game stopped.');
  }
}

export default Referee;