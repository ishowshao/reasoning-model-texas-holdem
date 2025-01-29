<template>
  <div>
    <div class="container my-3">
      <form class="row g-3">
        <div class="col-6">
          <label for="player1" class="form-label">Player 1</label>
          <select class="form-select" id="player1" v-model="gameManager.game.players[0].model">
            <option value="doubao-1.5-lite">doubao-1.5-lite</option>
            <option value="moonshot-v1-8k">moonshot-v1-8k</option>
          </select>
        </div>
        <div class="col-6">
          <label for="player2" class="form-label">Player 2</label>
          <select class="form-select" id="player2" v-model="gameManager.game.players[1].model">
            <option value="moonshot-v1-8k">moonshot-v1-8k</option>
            <option value="doubao-1.5-lite">doubao-1.5-lite</option>
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
          <!-- <button type="button" class="btn btn-primary me-2" @click="test">test</button> -->
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
    <Actions :game="gameManager.game" />
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
    const gameManager = new GameManager('豆包', 'kimi');
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
      console.log(describeGame({"id":"94358f0a-b2a0-43c7-86a3-8a2cd593ff68","table":{"players":2,"smallBlind":1,"bigBlind":2},"players":[{"id":"player1","name":"令狐冲","chips":0,"chipsThisRound":0,"hasActionThisRound":false,"status":"ALL_IN","holeCards":[51,47]},{"id":"player2","name":"东方不败","chips":0,"chipsThisRound":0,"hasActionThisRound":false,"status":"ALL_IN","holeCards":[28,41]}],"dealer":"player1","communityCards":{"flop":[8,19,26],"turn":4,"river":7},"pot":400,"currentRound":"RIVER","currentPlayerTurn":"player2","actions":[{"player":"player1","action":"RAISE","amount":3,"message":"东方不败，你的牌面似乎不太乐观啊，我这手牌可是信心满满，跟还是不跟，你可得想清楚了。","analysis":"当前处于前翻牌阶段，我手中有同花顺的潜力牌，且对手东方不败的底牌未知，我选择加注3个筹码，增加底池大小，以此来测试对手牌力，同时建立形象，为后续的牌局发展做准备。","round":"PRE_FLOP"},{"player":"player2","action":"RAISE","amount":5,"message":"令狐冲，你这加注可真是大胆，不过我东方不败也不是吃素的。我看你这手牌，未必有你想的那么强。我再加5个，看看你的信心到底有几分真。","analysis":"当前轮次为PRE_FLOP，我手中持有一对3，这是一个不错的起手牌，对抗令狐冲的加注。尽管他加注表现出一定的信心，但我认为他可能是在虚张声势。我选择再加5个筹码，一方面是为了测试他的牌力，另一方面也是为了建立更大的底池，以便在后续的牌局中获得更大的收益。","round":"PRE_FLOP"},{"player":"player1","action":"RAISE","amount":10,"message":"东方不败，你这番话倒也有趣，不过牌桌上，实力才是硬道理。我手中的牌，自然有我的底气。既然你已经亮剑，那我就再添一把火，看看谁的剑更锋利。","analysis":"当前处于前翻牌阶段，我手中有同花顺的潜力，且为高牌面值的K和9，对抗东方不败的加注，我有理由继续加大注码以测试对手。东方不败的加注可能是在虚张声势，也可能是手中有较强的牌。我选择再加注10个筹码，一方面增加对手的决策难度，另一方面如果对手跟注，可以为底池增加更多筹码，提高潜在的收益。","round":"PRE_FLOP"},{"player":"player2","action":"RAISE","amount":15,"message":"令狐兄，你的豪气我东方不败自然领教，不过牌桌上风云变幻，谁主沉浮还未可知。既然你如此自信，那我东方不败也不妨再添一把火，看看这火焰能否照亮你的底牌。","analysis":"当前轮到我行动，东方不败手中持有一对3，而令狐冲已经表现出强烈的加注意愿，可能是持有较强的起手牌。我选择再加注15，一方面可以测试令狐冲的牌力，另一方面也可以通过加注来增加底池，为后续的牌局发展增加更多的不确定性。同时通过言语上的交锋，可以进一步观察对手的反应，寻找可能的破绽。","round":"PRE_FLOP"},{"player":"player1","action":"RAISE","amount":20,"message":"东方兄言之有理，风云变幻，正是牌局魅力所在。既然你我都已投入，不妨再添些筹码，让这风云更盛，看看谁能笑到最后。","analysis":"目前我手中持有同花顺的起手牌，且已经进行了几轮加注，双方都显示出较强的牌力。东方不败的言语中透露出自信，可能是在虚张声势，也可能是真的有强牌。我选择再加注20，一方面可以测试对手的牌力，另一方面如果对手跟注，可以增加底池的大小，无论对手是什么牌，我都处于有利位置。","round":"PRE_FLOP"},{"player":"player2","action":"RAISE","amount":25,"message":"令狐兄，你我皆是江湖中人，牌桌上见真章。既然风云已起，不妨再添风云，看看谁能笑到最后。","analysis":"目前牌局处于前翻牌阶段，双方已经进行了多轮加注，底池已经达到56。东方不败手中的牌是33，而我手中的牌尚未显示。考虑到东方不败已经进行了多次加注，可能是拿到了较强的起手牌。此时我选择再加注25，一方面是为了测试东方不败手中的牌力，另一方面也是为了进一步扩大底池，增加自己的潜在收益。同时通过言语挑衅，试图影响东方不败的判断，让他在后续的决策中产生犹豫。","round":"PRE_FLOP"},{"player":"player1","action":"RAISE","amount":35,"message":"东方兄言之有理，风云变幻，正是英雄用武之时。既然东方兄如此豪气，令狐冲又岂能落后？今日就让我们一决高下，看看谁能笑到最后。","analysis":"当前为PRE_FLOP阶段，双方已经进行了多轮加注，底池已经达到81。东方不败最后一轮加注到25，并且发出挑衅。我手中有同花的K和9，牌面不错，有很大的发展潜力。因此我选择再加注35，一方面展示我手中的牌力，另一方面也是对东方不败挑衅的回应，增加心理压力。同时，通过加注也可以进一步扩大底池，为后续的ALL_IN做准备。","round":"PRE_FLOP"},{"player":"player2","action":"RAISE","amount":45,"message":"令狐兄果然是豪杰，不过东方不败也不是浪得虚名。既然如此，那就让我们再添一把火，看看谁能笑到最后。","analysis":"当前轮次为PRE_FLOP，双方已经进行了多轮加注，底池已经达到116。东方不败手牌为33，而我方手牌未知。考虑到东方不败已经多次加注，表现出较强的牌力，我方需要进一步加注以测试对手的牌力。我方加注45，将底池进一步扩大，迫使对手做出决策。同时通过言语挑衅，进一步施压对手，试图迫使其犯错。","round":"PRE_FLOP"},{"player":"player1","action":"RAISE","amount":55,"message":"东方兄真是豪气冲天，不过这牌局如战场，岂能轻易示弱？既然东方兄如此兴致勃勃，令狐冲就奉陪到底，看看谁能笑到最后。","analysis":"当前牌局已经进入前翻牌阶段，双方均已加注多次，东方不败的加注显示出其手中的牌力可能不弱。我手中的牌为同花顺的起手牌，K和9，虽然不是最强的起手牌，但同花牌的潜力巨大，且有顺子的可能性。考虑到东方不败的加注行为，我选择全下，一方面可以测试对手的牌力，另一方面如果对手跟注，我将有机会赢得一个较大的底池。","round":"PRE_FLOP"},{"player":"player2","action":"RAISE","amount":65,"message":"令狐兄，你我皆是江湖中人，这牌桌上的较量，不正如武林中的对决吗？你既已出招，东方不败岂能不接？今日就让我们一决高下，看看谁才是这牌桌上的真正高手。","analysis":"当前轮到东方不败行动，根据之前的行动记录，双方已经进行了多次加注，令狐冲在上一轮加注到55，并且发表了挑衅的言论。东方不败持有一对3，虽然不是最强的起手牌，但在前翻牌阶段，仍有可能形成三条或者在后续的转牌和河牌中形成顺子或同花。考虑到目前的底池赔率和对手的加注行为，东方不败选择再加注65，一方面可以测试对手的牌力，另一方面也可以通过加注来增加底池的大小，为自己可能的牌型发展创造更大的价值。同时，通过言语上的回应，东方不败也在心理上对令狐冲施加压力，试图影响对手的决策。","round":"PRE_FLOP"},{"player":"player1","action":"RAISE","amount":75,"message":"东方兄言之有理，江湖对决，牌桌争锋，正是英雄本色。不过，东方兄，你我皆知，高手过招，胜负往往只在一瞬之间。今日，就让我们看看谁的底牌更胜一筹。","analysis":"当前牌局处于前翻牌阶段，双方已经进行了多轮加注，东方不败的加注显示出他可能持有较强的底牌。我手中的牌是同花顺的K和9，虽然不是最强的起手牌，但在同花牌型中具有一定优势。考虑到东方不败的加注行为和言语挑衅，我选择继续加注75，一方面增加对手的心理压力，另一方面试探对手的底牌。同时，75的加注量也接近我的筹码总量，显示出我对这手牌的信心和决心。","round":"PRE_FLOP"},{"player":"player2","action":"ALL_IN","amount":85,"message":"令狐兄，你我皆是江湖中人，岂能不知牌桌上风云变幻，一局定胜负。不过，既然你如此自信，那东方某就陪你玩到底，看看究竟谁才是笑到最后的人。","analysis":"当前底池已经达到356，双方已经进行了多轮加注，显示出对底池的强烈兴趣。东方不败手中的是对3，虽然不是最强起手牌，但在前位玩家令狐冲已经多次加注的情况下，选择继续加注，一方面是为了测试对手的牌力，另一方面也是为了在牌局早期建立底池，为后续的牌局发展创造有利条件。考虑到东方不败的筹码量较多，有足够的筹码进行操作，因此选择加注85，将底池进一步扩大，同时观察对手的反应，为后续的决策提供更多信息。","round":"PRE_FLOP"},{"player":"player1","action":"CALL","amount":85,"message":"东方兄言之有理，江湖风云变幻莫测，牌桌上更是如此。既然东方兄已经亮剑，令狐某岂有不接之理？","analysis":"当前牌局已经进入白热化阶段，东方不败已经全押，而我手中有同花顺的潜力牌。考虑到东方不败的全押行为，可能是在虚张声势，也可能是拿到了很强的牌。但无论如何，我手中的牌面并不弱，且有同花顺的潜力，因此选择跟注东方不败的全押。","round":"PRE_FLOP"}],"winner":[],"finalWinner":null}));
    },
  },
};
</script>
