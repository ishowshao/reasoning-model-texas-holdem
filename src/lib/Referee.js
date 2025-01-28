import pokerDeck from "./PokerDeck";
import Classifier from "./classifier";
import compare from "./compare";
import callModel from "./callModel";
class Referee {
  constructor(state) {
    this.game = state;
    this.isPaused = false;
    this.isStopped = false; // 添加一个标志位来表示游戏是否被强行停止
  }

  getDealerPlayer() {
    return this.game.players.find((player) => player.id === this.game.dealer);
  }

  getSmallBlindPlayer() {
    return this.game.players.find((player) => player.id === this.game.dealer);
  }

  getBigBlindPlayer() {
    return this.game.players.find((player) => player.id !== this.game.dealer);
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
    if (this.game.players.every((player) => player.hasNoHoleCards())) {
      return true;
    }

    // 1. 如果一个玩家状态是FOLDED，不需要继续投注
    if (this.game.players.some((player) => player.status === 'FOLDED')) {
      return true;
    }
    // 2. 两个玩家状态都是ALL_IN
    if (this.game.players.every((player) => player.status === 'ALL_IN')) {
      return true;
    }
    // 3. 如果一个玩家状态是ALL_IN，另一个玩家本轮下注>=ALL_IN玩家本轮下注
    const allInPlayer = this.game.players.find((player) => player.status === 'ALL_IN');
    if (allInPlayer) {
      const otherPlayer = this.game.players.find((player) => player !== allInPlayer);
      if (otherPlayer.chipsThisRound >= allInPlayer.chipsThisRound) {
        return true;
      }
    }

    // 4. 两个玩家本轮都有行动，且下注相等
    if (this.game.players.every((player) => player.hasActionThisRound)) {
      const equalBets = this.game.players.every((player) => player.chipsThisRound === this.game.players[0].chipsThisRound);
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

    let nextRound = nextRoundMap[currentRound] || 'END';
    // 如果有一个玩家FOLDED，直接推进到SHOWDOWN
    if (this.game.players.some((player) => player.status === 'FOLDED')) {
      nextRound = 'SHOWDOWN';
    }

    this.game.players.forEach((player) => {
      player.nextRound();
    });

    this.game.currentRound = nextRound;
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
    const smallBlindPlayer = this.getSmallBlindPlayer();
    const bigBlindPlayer = this.getBigBlindPlayer();

    const chip1 = smallBlindPlayer.bet(this.game.table.smallBlind);
    const chip2 = bigBlindPlayer.bet(this.game.table.bigBlind);
    this.game.pot += chip1 + chip2;

    this.game.currentPlayerTurn = smallBlindPlayer.id;
    console.log('Preflop has been dealt.');
  }

  dealFlop() {
    this.game.communityCards.flop = pokerDeck.dealCards(3);
    this.game.currentPlayerTurn = this.getBigBlindPlayer().id;
    console.log('Flop has been dealt.');
  }

  dealTurn() {
    this.game.communityCards.turn = pokerDeck.dealCards(1)[0];
    this.game.currentPlayerTurn = this.getBigBlindPlayer().id;
    console.log('Turn has been dealt.');
  }

  dealRiver() {
    this.game.communityCards.river = pokerDeck.dealCards(1)[0];
    this.game.currentPlayerTurn = this.getBigBlindPlayer().id;
    console.log('River has been dealt.');
  }

  showdown() {
    // debugger;
    if (this.game.players.some((player) => player.status === 'FOLDED')) {
      const winner = this.game.players.find((player) => player.status !== 'FOLDED');
      winner.chips += this.game.pot;
      this.game.pot = 0;
      this.game.winner = [winner.id];
      console.log(`Player ${winner.id} wins the pot by default.`);
    } else {
      const community = [...this.game.communityCards.flop, this.game.communityCards.turn, this.game.communityCards.river].filter((card) => card !== -1);
      const winners = this.determineWinner(this.game.players, community);
      const pot = this.game.pot;
      const splitPot = Math.floor(pot / winners.length);
      if (winners.length === 1) {
        this.game.players.find((player) => player.id === winners[0]).chips += pot;
      } else {
        this.game.players.forEach((player) => {
          if (winners.includes(player.id)) {
            player.chips += splitPot;
          }
        });
        if (pot % 2 === 1) {
          // pot是奇数，无法平分给两个玩家，剩余的一个筹码分给dealer
          const dealer = this.getDealerPlayer();
          dealer.chips += 1;
        }
      }
      
      this.game.pot = 0;
      this.game.winner = winners;
      console.log(`Players ${winners.join(', ')} win the pot.`);
    }
  }

  determineWinner(players, community) {
    const p1 = new Classifier([...players[0].holeCards, ...community]);
    const p2 = new Classifier([...players[1].holeCards, ...community]);
    console.log(p1, p2);
    const v1 = p1.classify();
    const v2 = p2.classify();
    console.log(v1, v2);
    const compareResult = compare(v1, v2);
    if (compareResult > 0) {
      return [players[0].id];
    } else if (compareResult < 0) {
      return [players[1].id];
    } else {
      return [players[0].id, players[1].id];
    }
  }

  getNextPlayer() {
    const currentPlayerId = this.game.currentPlayerTurn;
    const currentPlayerIndex = this.game.players.findIndex((player) => player.id === currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.game.players.length;
    return this.game.players[nextPlayerIndex].id;
  }

  async waitForPlayerAction() {
    // debugger;
    console.log('等待玩家操作');
    const currentPlayerId = this.game.currentPlayerTurn;
    console.log('当前玩家:', currentPlayerId, this.game.players.find((p) => p.id === currentPlayerId).name);
    const player = this.game.players.find((p) => p.id === currentPlayerId);
    if (!player) {
      console.log('玩家未找到. 等待玩家操作...');
      return;
    }
    if (player.status === 'ALL_IN') {
      this.game.actions.push({
        player: currentPlayerId,
        action: 'ALL_IN',
        amount: 0,
        message: '已经ALL_IN，等待其他玩家操作',
      });
      this.game.currentPlayerTurn = this.getNextPlayer();
      return;
    }
    const opponent = this.game.players.find((p) => p.id !== currentPlayerId);

    const action = await callModel(this.game);
    

    player.hasActionThisRound = true;
    console.log(`${action.action} ${action.amount} ${action.message}`);
    console.log(`%c${action.action}`, 'background-color: blue;');
    if (action.action === 'FOLD') {
      player.fold();
    } else if (action.action === 'CALL') {
      const chips = player.call(opponent.chipsThisRound);
      this.game.pot += chips;
    } else if (action.action === 'ALL_IN') {
      // debugger;
      const chips = player.allIn();
      this.game.pot += chips;
    } else if (action.action === 'CHECK') {
      // 检查能不能check
      if (player.chipsThisRound < opponent.chipsThisRound) {
        action.action = 'FOLD';
        action.message = '在无法CHECK的情况下CHECK，被判为FOLD';
        player.status = 'FOLDED';
      }
    } else { // RAISE 和 BET
      let chips = action.amount;
      if (action.amount >= player.chips) {
        action.action = 'ALL_IN';
        chips = player.allIn();
      } else {
        if (!opponent.hasActionThisRound) {
          chips = player.bet(action.amount);
          action.action = 'BET';
        } else {
          chips = player.bet(action.amount);
          if (player.chipsThisRound > opponent.chipsThisRound) {
            action.action = 'RAISE';
          } else if (player.chipsThisRound === opponent.chipsThisRound) {
            action.action = 'CALL';
          } else {
            // AI给的amount可能不准，此时下注小于对手，按照AI的意图，应该补充为CALL逻辑
            chips = player.call(opponent.chipsThisRound);
            action.action = 'CALL';
          }
        }
      }
      this.game.pot += chips;
    } 
    // action在上边的if-else中可能会被变更，因为AI给的action可能不符合规则
    this.game.actions.push(action);
    this.game.currentPlayerTurn = this.getNextPlayer();
  }

  async step() {
    // debugger;
    console.log('step');
    console.log(JSON.stringify(this.game));
    if (this.isStopped) {
      console.log('Game has stopped.');
      return;
    }
    if (this.getCurrentRound() === 'END') {
      console.log('Game has ended.');
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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