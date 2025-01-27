import { v4 as uuidv4 } from 'uuid';

function newGame(player1Name, player2Name, dealer) {
  return {
    id: uuidv4(),
    table: {
      players: 2,
      smallBlind: 1,
      bigBlind: 2,
    },
    players: [
      {
        id: 'player1',
        name: player1Name,
        chips: 200,
        chipsThisRound: 0,
        hasActionThisRound: false,
        status: 'ACTIVE',
        holeCards: [-1, -1],
      },
      {
        id: 'player2',
        name: player2Name,
        chips: 200,
        chipsThisRound: 0,
        hasActionThisRound: false,
        status: 'ACTIVE',
        holeCards: [-1, -1],
      },
    ],
    dealer: dealer,
    communityCards: {
      flop: [-1, -1, -1],
      turn: -1,
      river: -1,
    },
    pot: 0,
    currentRound: 'START',
    currentPlayerTurn: dealer,
    actions: [],
    winner: [],
  };
}

export default newGame;
