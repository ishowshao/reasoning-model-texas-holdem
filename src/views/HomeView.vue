<template>
  <div>
    <div class="container my-3">
      <form class="row g-3">
        <div class="col-6">
          <label for="player1" class="form-label">Player 1</label>
          <select class="form-select" id="player1">
            <option value="player1">moonshot-v1-8k</option>
            <option value="player2">DeepSeek-V3</option>
          </select>
        </div>
        <div class="col-6">
          <label for="player2" class="form-label">Player 2</label>
          <select class="form-select" id="player2">
            <option value="player1">moonshot-v1-8k</option>
            <option value="player2">DeepSeek-V3</option>
          </select>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary" @click="startGame">开始对战</button>
        </div>
      </form>
    </div>

    <PokerTable :game="game" />
    <Actions :actions="game.actions" />
  </div>
</template>

<script>
import PokerTable from '../components/PokerTable.vue';
import Actions from '../components/Actions.vue';
import Referee from '../lib/Referee';

const referee = new Referee({
  game: {
    id: '987654321',
    table: {
      players: 2,
      smallBlind: 1,
      bigBlind: 2,
    },
    players: [
      {
        id: 'player1',
        name: 'OpenAI o1-mini',
        chips: 200,
        chipsThisRound: 0,
        status: 'ACTIVE',
        holeCards: [-1, -1],
      },
      {
        id: 'player2',
        name: 'DeepSeek-V3',
        chips: 200,
        chipsThisRound: 0,
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
  },
});

export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    return {
      game: referee.game,
    };
  },
  methods: {
    async startGame(e) {
      e.preventDefault();
      await referee.run();
    },
  },
};
</script>
