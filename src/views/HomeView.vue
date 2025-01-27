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

export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    const referee = new Referee({
      game: {"id":"987654321","table":{"players":2,"smallBlind":1,"bigBlind":2},"players":[{"id":"player1","name":"OpenAI o1-mini","chips":186,"chipsThisRound":0,"hasActionThisRound":false,"status":"ACTIVE","holeCards":[24,32]},{"id":"player2","name":"DeepSeek-V3","chips":186,"chipsThisRound":0,"hasActionThisRound":true,"status":"FOLDED","holeCards":[38,14]}],"dealer":"player1","communityCards":{"flop":[16,3,46],"turn":37,"river":-1},"pot":28,"currentRound":"TURN","currentPlayerTurn":"player1","actions":[{"player":"player1","action":"RAISE","amount":3,"message":"我加注到6，DeepSeek-V3，你跟不跟？","analysis":"当前处于PRE_FLOP阶段，我手中的牌是Q7，虽然不是很强的起手牌，但考虑到对手DeepSeek-V3的底牌未知，且我作为庄家有位置优势，可以加注来测试对手的牌力。我加注到6，是小盲注的3倍，这个加注额度既能给对手压力，又不会让自己承担过多风险。"},{"player":"player2","action":"CALL","amount":0,"message":"跟注3，OpenAI o1-mini，看来你对自己的手牌很有信心啊。","analysis":"当前处于PRE_FLOP阶段，对手OpenAI o1-mini已经加注到6，我手中的牌是K2不同花。虽然牌力一般，但考虑到对手加注的尺度和底池赔率，选择跟注3继续游戏。一方面可以观察对手的行动，另一方面如果转牌和河牌能击中大牌，还有机会逆转局势。"},{"player":"player2","action":"RAISE","amount":10,"message":"看来你对我的加注很感兴趣，OpenAI o1-mini，我再加大点压力，跟不跟？","analysis":"当前牌面是4-4-8，对手DeepSeek-V3的手牌是K2，我的加注可以测试对手的手牌强度，同时增加底池大小，为后续的转牌和河牌轮做准备。如果对手跟注，我可以根据转牌和河牌的情况进一步施加压力，迫使对手做出决策。"},{"player":"player1","action":"RAISE","amount":10,"message":"DeepSeek-V3，你加注到10，是想测试我的牌力吗？我再加注10，看看你是不是真的有信心。","analysis":"目前牌面是4-4-8，我有Q-7，虽然不是很强的牌，但有顺子的可能性，而且对手已经投入了10个筹码，我再加注10，一是增加对手的投入，二是测试对手的牌力，看他是否真的有强牌。"},{"player":"player2","action":"FOLD","amount":0,"message":"OpenAI o1-mini，你的加注策略很激进，但我决定不陪你玩了。我弃牌。","analysis":"当前牌面为4-4-8-Q，对方手牌为K2，对方已经连续加注，表现出很强的牌力。我手牌为空，没有足够的信息判断对方的牌力，而且底池已经很大，风险收益比不合适。因此我选择弃牌，避免进一步损失。"}]},
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
