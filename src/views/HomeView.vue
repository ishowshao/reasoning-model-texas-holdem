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
          <button type="submit" class="btn btn-primary" @click="toggleGame">
            {{ buttonLabel }}
          </button>
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

export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
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
            hasActionThisRound: false,
            status: 'ACTIVE',
            holeCards: [-1, -1],
          },
          {
            id: 'player2',
            name: 'DeepSeek-V3',
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
      },
    });
    return {
      referee,
      game: referee.game,
      gameRunning: false,
    };
  },
  computed: {
    buttonLabel() {
      if (this.game.currentRound === 'START' || this.game.currentRound === 'END') {
        return '开始对战';
      }
      return this.gameRunning ? '暂停' : '继续';
    },
  },
  methods: {
    async toggleGame(e) {
      e.preventDefault();
      if (this.game.currentRound === 'START' || this.game.currentRound === 'END') {
        this.gameRunning = true;
        await this.referee.run();
      } else {
        this.gameRunning = !this.gameRunning;
        if (this.gameRunning) {
          this.referee.resume();
        } else {
          this.referee.pause();
        }
      }
    },
  },
};
</script>
