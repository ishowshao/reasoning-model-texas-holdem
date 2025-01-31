import { v4 as uuidv4 } from 'uuid';
import Referee from './Referee';
import Player from './Player';
import pokerDeck from './PokerDeck';
class GameManager {
  constructor(name1, name2, state = null) {
    this.isStopped = false;
    this.dealerIndex = 0;
    if (state) {
      this.game = this.stateToObject(state);
    } else {
      this.game = {
        id: uuidv4(),
        table: {
          players: 2,
          smallBlind: 1,
          bigBlind: 2,
        },
        waitingForPlayerAction: false,
        players: [new Player('player1', name1, 200, 'doubao-1.5-lite'), new Player('player2', name2, 200, 'moonshot-v1-8k')],
        dealer: 'player1',
        communityCards: {
          flop: [-1, -1, -1],
          turn: -1,
          river: -1,
        },
        pot: 0,
        currentRound: 'START',
        currentPlayerTurn: 'player1',
        actions: [],
        // 当前局的winner
        winner: [],
        // 最终胜利的玩家，即赢得所有筹码的玩家
        finalWinner: null,
      };
    }
    this.referee = new Referee(this.game);
  }

  stateToObject(state) {
    for (let i = 0; i < state.players.length; i++) {
      let player = new Player(state.players[i].id, state.players[i].name, state.players[i].chips);
      player.load(state.players[i]);
      state.players[i] = player;
    }
    return state;
  }

  setModel(playerIndex, model) {
    this.game.players[playerIndex].setModel(model);
  }

  next() {
    console.log('开始下一局');
    pokerDeck.resetDeck();

    this.dealerIndex = (this.dealerIndex + 1) % 2;
    this.game.dealer = this.game.players[this.dealerIndex].id;
    this.game.currentPlayerTurn = this.game.dealer;
    this.game.players.forEach((player) => {
      player.hasActionThisRound = false;
      player.chipsThisRound = 0;
      player.holeCards = [-1, -1];
      player.status = 'ACTIVE';
    });
    this.game.communityCards = {
      flop: [-1, -1, -1],
      turn: -1,
      river: -1,
    };
    this.game.pot = 0;
    this.game.currentRound = 'START';
    this.game.actions = [];
    this.game.winner = [];
  }

  async auto() {
    while (!this.game.finalWinner && !this.isStopped) {
      await this.step();
    }
  }

  async step() {
    if (!this.game.finalWinner) {
      if (this.game.winner.length > 0) {
        if (this.game.players.some((player) => player.chips === 0)) {
          this.game.finalWinner = this.game.winner[0];
          console.log('游戏结束，最终赢家是：', this.game.finalWinner);
        } else {
          this.next();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } else {
        await this.referee.step();
      }
    }
  }

  stop() {
    this.isStopped = true;
  }
}

export default GameManager;
