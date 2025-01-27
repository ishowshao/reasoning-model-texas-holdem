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

    <PokerTable :game="gameManager.game" />
    <div v-if="gameManager.game.winner.length > 0">
      <div>本轮获胜: {{ gameManager.game.winner.map(winner => gameManager.game.players.find(player => player.id === winner).name).join(', ') }}</div>
    </div>
    <div v-if="gameManager.game.finalWinner">
      <div>最终获胜: {{ gameManager.game.players.find(player => player.id === gameManager.game.finalWinner).name }}</div>
    </div>
    <Actions :actions="gameManager.game.actions" />
  </div>
</template>

<script>
import PokerTable from '../components/PokerTable.vue';
import Actions from '../components/Actions.vue';
import GameManager from '../lib/GameManager';
export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    const gameManager = new GameManager('令狐冲', '东方不败', {"id":"e158fa71-6d11-40b9-8678-5b70c84babd1","table":{"players":2,"smallBlind":1,"bigBlind":2},"players":[{"id":"player1","name":"令狐冲","chips":397,"chipsThisRound":2,"hasActionThisRound":false,"status":"ACTIVE","holeCards":[28,11]},{"id":"player2","name":"东方不败","chips":0,"chipsThisRound":1,"hasActionThisRound":false,"status":"ACTIVE","holeCards":[42,49]}],"dealer":"player2","communityCards":{"flop":[-1,-1,-1],"turn":-1,"river":-1},"pot":3,"currentRound":"PRE_FLOP","currentPlayerTurn":"player2","actions":[],"winner":[],"finalWinner":null});
    return {
      gameManager,
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
      // this.referee.stop();
    },
    step() {
      this.gameManager.step();
    },
  },
};
</script>
