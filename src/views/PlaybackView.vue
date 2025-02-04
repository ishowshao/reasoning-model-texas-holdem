<template>
  <div>
    <div class="container my-2">
      <form class="row g-3">
        <div class="col-12">
          <label for="playback" class="form-label">选择回放</label>
          <select class="form-select" id="playback" v-model="playbackId" :disabled="running">
            <option v-for="item in playbackList" :key="item.id" :value="item.id">{{ item.title }} {{ item.ctime }}</option>
          </select>
        </div>
        <div v-if="playback && playback.log[0].players.length > 0" class="col-12">
          <div>Player 1: {{ playback.log[0].players[0].name }} {{ playback.log[0].players[0].model }}</div>
          <div>Player 2: {{ playback.log[0].players[1].name }} {{ playback.log[0].players[1].model }}</div>
        </div>
        <div class="col-12">
          <button type="button" class="btn btn-primary me-2" @click="auto" :disabled="!playbackId">{{ running ? '暂停' : '开始' }}</button>
          <button type="button" class="btn btn-danger me-2" @click="stop" :disabled="!running">停止</button>
          <!-- 新的上一步按钮 -->
          <button type="button" class="btn btn-primary me-2" @click="prevStep" :disabled="!playbackId">上一步</button>
          <!-- 修改后的下一步按钮 -->
          <button type="button" class="btn btn-primary me-2" @click="step" :disabled="!playbackId">下一步</button>
        </div>
      </form>
    </div>

    <PokerTable :game="gameManager.game" />
    <div class="container">
      <div v-if="gameManager.game.winners.length > 0">
        <div>本轮获胜: {{ gameManager.game.winners.map(winner => gameManager.game.players.find(player => player.id === winner).name).join(', ') }}</div>
      </div>
      <div v-if="gameManager.game.finalWinner">
        <div>最终获胜: {{ gameManager.game.players.find(player => player.id === gameManager.game.finalWinner).name }}</div>
      </div>
    </div>
    <Actions :game="gameManager.game" />
  </div>
</template>

<script>
import PokerTable from '../components/PokerTable.vue';
import Actions from '../components/Actions.vue';
import GameManager from '../lib/GameManager';
import NavBar from '../components/NavBar.vue';
import describeGame from '../lib/describeGame';
import axios from 'axios';

export default {
  components: {
    PokerTable,
    Actions,
    NavBar,
  },
  data() {
    return {
      gameManager: new GameManager('', ''),
      running: false,
      interval: null,
      playbackId: '',
      playbackList: [],
      playback: null,
      index: 0,
    };
  },
  watch: {
    playbackId() {
      this.loadPlayback();
    },
  },
  methods: {
    stop() {
      this.running = false;
      this.index = 0;
      clearInterval(this.interval);
    },
    step() {
      if (this.index < this.playback.log.length) {
        this.gameManager = new GameManager(this.playback.log[this.index].players[0].name, this.playback.log[this.index].players[1].name, this.playback.log[this.index]);
        console.log(this.playback.log[this.index]);
        this.index++;
      } else {
        this.stop();
      }
    },
    // 新增的上一步方法
    prevStep() {
      if (this.index > 0) {
        this.index--;
        this.gameManager = new GameManager(
          this.playback.log[this.index].players[0].name,
          this.playback.log[this.index].players[1].name,
          this.playback.log[this.index]
        );
      }
    },
    auto() {
      if (this.running) {
        this.running = false;
        clearInterval(this.interval);
      } else {
        this.running = true;
        this.interval = setInterval(() => {
          if (this.index < this.playback.log.length) {
            this.gameManager = new GameManager(this.playback.log[this.index].players[0].name, this.playback.log[this.index].players[1].name, this.playback.log[this.index]);
            // console.log(this.playback.log[this.index]);
            this.index++;
          } else {
            this.stop();
          }
        }, 2000);
      }
    },
    async loadPlayback() {
      const { data } = await axios.get(`/api/playback.php?id=${this.playbackId}`);
      this.playback = data.data;
    },
  },
  async created() {
    // 请求接口获取回放列表
    const { data } = await axios.get('/api/playback-list.php');
    console.log(data);
    this.playbackList = data.data;
  },
};
</script>
