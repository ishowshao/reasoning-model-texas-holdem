import { v4 as uuidv4 } from 'uuid';

class GameManager {
  constructor(name1, name2) {
    this.dealerIndex = 0;
    this.game = {
      id: uuidv4(),
      table: {
        players: 2,
        smallBlind: 1,
        bigBlind: 2,
      },
      players: [
        {
          id: 'player1',
          name: name1,
          chips: 200,
          chipsThisRound: 0,
          hasActionThisRound: false,
          status: 'ACTIVE',
          holeCards: [-1, -1],
        },
        {
          id: 'player2',
          name: name2,
          chips: 200,
          chipsThisRound: 0,
          hasActionThisRound: false,
          status: 'ACTIVE',
          holeCards: [-1, -1],
        },
      ],
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

  next() {
    this.dealerIndex = (this.dealerIndex + 1) % 2;
    this.game.dealer = this.game.players[this.dealerIndex].id;
    this.game.currentPlayerTurn = this.game.dealer;
    this.game.players.forEach((player) => {
      player.hasActionThisRound = false;
      player.chipsThisRound = 0;
      player.holeCards = [-1, -1];
      player.status = 'ACTIVE';
    });
    this.communityCards = {
      flop: [-1, -1, -1],
      turn: -1,
      river: -1,
    };
    this.pot = 0;
    this.currentRound = 'START';
    this.actions = [];
    this.winner = [];
  }
}

export default GameManager;
