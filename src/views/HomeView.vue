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
        <div class="col-6">
          <input type="text" v-model="gameManager.game.players[0].name" class="form-control" placeholder="请输入玩家1的名字">
        </div>
        <div class="col-6">
          <input type="text" v-model="gameManager.game.players[1].name" class="form-control" placeholder="请输入玩家2的名字">
        </div>
        <div class="col-12">
          <!-- <button type="submit" class="btn btn-primary me-2" @click="toggleGame">
            {{ buttonLabel }}
          </button> -->
          <button type="button" class="btn btn-primary me-2" @click="step">下一步</button>
          <button type="button" class="btn btn-primary me-2" @click="auto">自动</button>
          <button type="button" class="btn btn-danger me-2" @click="stopGame">停止</button>
          <button type="button" class="btn btn-primary me-2" @click="test">test</button>
        </div>
      </form>
    </div>

    <PokerTable :game="gameManager.game" />
    <div class="container">
      <div v-if="gameManager.game.winner.length > 0">
        <div>本轮获胜: {{ gameManager.game.winner.map(winner => gameManager.game.players.find(player => player.id === winner).name).join(', ') }}</div>
      </div>
      <div v-if="gameManager.game.finalWinner">
        <div>最终获胜: {{ gameManager.game.players.find(player => player.id === gameManager.game.finalWinner).name }}</div>
      </div>
    </div>
    <Actions :actions="gameManager.game.actions" />
  </div>
</template>

<script>
import PokerTable from '../components/PokerTable.vue';
import Actions from '../components/Actions.vue';
import GameManager from '../lib/GameManager';
import describeGame from '../lib/describeGame';
export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    const gameManager = new GameManager('令狐冲', '东方不败');
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
      this.gameManager.stop();
    },
    step() {
      this.gameManager.step();
    },
    auto() {
      this.gameManager.auto();
    },
    test() {
      console.log(describeGame({"id":"58a32e58-24cf-4136-8de2-5bc4e78766d9","table":{"players":2,"smallBlind":1,"bigBlind":2},"players":[{"id":"player1","name":"令狐冲","chips":0,"chipsThisRound":0,"hasActionThisRound":false,"status":"ALL_IN","holeCards":[37,22]},{"id":"player2","name":"东方不败","chips":0,"chipsThisRound":0,"hasActionThisRound":false,"status":"ALL_IN","holeCards":[43,25]}],"dealer":"player1","communityCards":{"flop":[4,2,44],"turn":17,"river":-1},"pot":400,"currentRound":"TURN","currentPlayerTurn":"player2","actions":[{"player":"player1","action":"RAISE","amount":4,"message":"东方不败，你这名字起得霸气，不过牌桌上可不讲名气，只讲实力。我这手牌，感觉不错，加注4个筹码，看看你敢不敢跟。","analysis":"目前是前翻牌阶段，我手中的牌是Q和T，虽然不是最强的起手牌，但也算是中等偏上的牌力。东方不败的底牌未知，但根据他的名字和目前的下注情况，我猜测他可能持有一手不错的牌。因此，我选择加注4个筹码，试探对方的反应，同时也为自己争取更多的底池份额。如果东方不败跟注或再加注，说明他手中的牌力可能更强，我需要谨慎应对；如果他选择弃牌，那么我就可以轻松赢得底池。"},{"player":"player2","action":"RAISE","amount":8,"message":"令狐冲，你这话说得不错，不过实力不是靠说，是靠牌。我这手牌，我有信心，再跟你加注8个筹码，看看你敢不敢接招。","analysis":"当前轮次为PRE_FLOP，东方不败已经加注4个筹码，我手中持有K高牌，且令狐冲加注后表现出较强的牌力。我选择再加注8个筹码，一方面增加底池，另一方面通过加注施压，试图迫使对手在信息不足的情况下做出决策，从而获取优势。"},{"player":"player1","action":"RAISE","amount":16,"message":"东方不败，你这话说得霸气，不过德州扑克不是靠气势，是靠策略和冷静。我这手牌，我有信心，再跟你加注16个筹码，看看你敢不敢接招。","analysis":"当前处于PRE_FLOP阶段，我手中有QT，虽然不是最强的起手牌，但也不算差。东方不败已经加注8个筹码，我选择再加注16个筹码，一方面可以测试对手的牌力，另一方面可以增加底池的大小，为后续的牌局增加更多的变数。同时，通过加注也可以展示我的信心和决心，给对手一定的压力。"},{"player":"player2","action":"RAISE","amount":32,"message":"令狐冲，你的策略和冷静我领教了，不过德州扑克也是勇气的较量。我这手牌，我有信心，我再加注32个筹码，看看你敢不敢跟。","analysis":"目前处于PRE_FLOP阶段，双方已经进行了较大幅度的加注，令狐冲从最初的4个筹码加注到16个筹码，东方不败则从8个筹码加注到当前的32个筹码。考虑到东方不败的底牌是5♦和K♥，这是一个相对较强的起手牌，有同花和顺子的潜力，因此选择继续加注以测试对手的决心和牌力。同时，通过加注也可以增加底池的大小，为后续可能的赢牌增加收益。"},{"player":"player1","action":"RAISE","amount":64,"message":"东方不败，你的勇气可嘉，但德州扑克是智慧的游戏。我欣赏你的自信，但有时候，自信过头就是鲁莽。我再加注64个筹码，看看你是否真的敢跟。","analysis":"当前轮次为PRE_FLOP，我手中的牌为QT，虽然不是顶级牌面，但也算不错。东方不败已经加注到32个筹码，显示出很强的牌力。我选择再加注64个筹码，一方面是为了测试东方不败的牌力，另一方面也是为了建立大的底池，为后续的牌局做准备。如果东方不败跟注，说明他手中的牌很可能是AA、KK或者AK等强牌，我会谨慎行事；如果他选择弃牌，那么我就赢得了底池。"},{"player":"player2","action":"CALL","amount":64,"message":"令狐冲，你确实技艺高超，但德州扑克中，勇气与智慧并重。我东方不败，今日就让你见识一下，什么叫做真正的胆识。","analysis":"当前轮到东方不败行动，根据之前的加注记录，双方已经进行了多次加注，令狐冲的加注到了64筹码。东方不败手上有一张♦5和一张♥K，虽然牌面不强，但在德州扑克中，任何牌都有可能在后续的公共牌中得到提升。考虑到令狐冲的加注行为和言语挑衅，东方不败选择跟注64筹码，一方面保持牌局的竞争力，另一方面也是对令狐冲心理战术的回应。"},{"player":"player2","action":"ALL_IN","amount":128,"message":"东方不败，你的胆识我已见识，但德州扑克是场长跑，不是一局定输赢。我再加注，看看你是否有决心跟到底。","analysis":"当前底池已有170筹码，东方不败在翻牌前和翻牌后连续加注，显示了较强的牌力。我手中虽然无牌，但东方不败的连续加注可能意味着他手中有较强的牌型，如顶对或顺子。此时我选择再加注到128，即底池的2倍，旨在测试东方不败的决心和牌力。如果东方不败跟注，说明他手中牌力较强，我可以选择在转牌和河牌圈继续施压；如果他选择弃牌，我也能以较小的代价赢得底池。"},{"player":"player1","action":"ALL_IN","amount":128,"message":"东方不败，你的胆识我已见识，但德州扑克是场长跑，不是一局定输赢。我再加注，看看你是否有决心跟到底。","analysis":"当前牌面为♠5♠3♦6，我手中的牌为♣Q♥T，虽然目前牌面没有明确的顺子或同花，但我手中有一张Q，有机会组成顺子或同花。东方不败已经ALL_IN，我需要通过加注来测试他的牌力，同时增加底池，以便在后续的转牌和河牌中获得更大的收益。我选择加注128，使得底池达到413，迫使东方不败做出决策。"}],"winner":[],"finalWinner":null}));
    },
  },
};
</script>
