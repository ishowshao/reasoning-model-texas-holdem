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
          <!-- <button type="submit" class="btn btn-primary me-2" @click="toggleGame">
            {{ buttonLabel }}
          </button> -->
          <!-- <button type="button" class="btn btn-danger" @click="stopGame">停止</button> -->
          <button type="button" class="btn btn-primary" @click="step">下一步</button>
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
import newGame from '../lib/newGame';

export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    const referee = new Referee({
      game: newGame('OpenAI o1-mini', 'DeepSeek-V3', 'player1'),
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
    stopGame() {
      this.referee.stop();
    },
    step() {
      this.referee.step();
    },
  },
};
</script>
