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
      // game: newGame('OpenAI o1-mini', 'DeepSeek-V3', 'player1'),
      game: {"id":"753f2078-50ad-40af-8a64-e2028a19dd15","table":{"players":2,"smallBlind":1,"bigBlind":2},"players":[{"id":"player1","name":"OpenAI o1-mini","chips":180,"chipsThisRound":0,"hasActionThisRound":true,"status":"FOLDED","holeCards":[33,23]},{"id":"player2","name":"DeepSeek-V3","chips":144,"chipsThisRound":36,"hasActionThisRound":true,"status":"ACTIVE","holeCards":[40,4]}],"dealer":"player1","communityCards":{"flop":[17,30,27],"turn":34,"river":-1},"pot":76,"currentRound":"TURN","currentPlayerTurn":"player2","actions":[{"player":"player1","action":"RAISE","amount":3,"message":"我加注到6，DeepSeek-V3，你跟不跟？","analysis":"当前处于前翻牌阶段，我是大盲位，手持8♣和J♥，牌面还可以，而且对手DeepSeek-V3的底牌未知，我选择加注到6，试图从对手那里获取更多信息，同时建立底池。"},{"player":"player2","action":"CALL","amount":3,"message":"跟注3，OpenAI o1-mini，我可不会轻易被吓跑。","analysis":"当前处于PRE_FLOP阶段，对手OpenAI o1-mini加注到6，我手中有2和5，虽然牌面不大，但考虑到对手加注的金额和底池赔率，跟注是合理的选择。同时，我跟注的言辞表现出一定的自信和挑衅，旨在迷惑对手，让他们不确定我手中的牌力。"},{"player":"player2","action":"CHECK","amount":0,"message":"我选择过牌，OpenAI o1-mini，现在压力在你这边了。","analysis":"当前牌面是5-5-2，我有一对5，而对手OpenAI o1-mini在翻牌前加注，翻牌后过牌，可能是在试探我的牌力。我选择过牌，一方面是为了节省筹码，另一方面也是为了诱导对手在转牌圈下注，从而获取更多信息。同时，我也可以观察对手的行动，以便在河牌圈做出更准确的决策。"},{"player":"player1","action":"BET","amount":4,"message":"DeepSeek-V3，看来你很有自信啊，那我就再加注4个筹码，看看你的底牌到底有多强。","analysis":"当前牌面是5-5-2，我有一张J，虽然不是坚果牌，但牌面有对子的可能性，而且对手已经跟注过一轮，我再加注4个筹码，试探对手的反应，如果他跟注，说明他可能有更强的牌，如果他弃牌，我可以赢得底池。"},{"player":"player2","action":"RAISE","amount":8,"message":"OpenAI o1-mini，你加注4个筹码，那我就再给你加注8个筹码，看看你敢不敢跟。","analysis":"当前牌面是5-5-2，DeepSeek-V3有一对5，而OpenAI o1-mini没有明牌。我选择再加注8个筹码，一方面可以测试对手牌力，另一方面也可以给对手施加压力，迫使其做出决策。同时我还有192个筹码，即使再加注8个，筹码仍然充足。"},{"player":"player1","action":"RAISE","amount":12,"message":"DeepSeek-V3，你加注8个筹码，那我就再给你加注12个筹码，看看你敢不敢跟。","analysis":"当前牌面为5-5-2，我有J-8，虽然牌面有对子，但我的手牌并不强。DeepSeek-V3加注8个筹码，可能是有较强的手牌。我选择再加注12个筹码，一是测试DeepSeek-V3的手牌强度，二是通过加注给对手压力，迫使其做出决策。同时我还有192个筹码，加注12个筹码后还有180个筹码，筹码量仍然充足。"},{"player":"player2","action":"CALL","amount":12,"message":"OpenAI o1-mini，你加注12个筹码，看来你对自己的牌很有信心。不过，我手里的牌也不差，我选择跟注12个筹码。","analysis":"当前牌面为5-5-2，对手的底牌为2-5，他加注12个筹码，可能是拿到了5的葫芦或者顺子。我选择跟注12个筹码，一方面可以继续观察对手的行动，另一方面也可以给对手施加压力。如果对手继续加注，我可以选择弃牌，避免损失过多筹码；如果对手过牌或者跟注，我可以继续下注或者加注，进一步试探对手的牌力。"},{"player":"player2","action":"RAISE","amount":36,"message":"OpenAI o1-mini，你加注12个筹码，那我就再给你加注36个筹码，看看你敢不敢跟。","analysis":"当前牌面是5-5-2-9，对手DeepSeek-V3手牌中有5和2，牌面有两对，牌力很强。我选择再加注36个筹码，总共下注40个筹码，试图通过加注来测试对手牌力，迫使对手做出决策。同时，我手里还有180个筹码，即使对手选择跟注，我仍然有足够的筹码继续游戏。"},{"player":"player1","action":"FOLD","amount":0,"message":"DeepSeek-V3，你的加注很有魄力，但我决定不跟你冒险了。这手牌我选择放弃。","analysis":"当前牌局中，我手中的牌是8♣和J♥，公共牌是5♥、5♣、2♣、9♣。尽管我有一个对子，但对手DeepSeek-V3的加注非常激进，从36个筹码加注到72个筹码，总共赌注已经达到144个筹码。考虑到对手的激进打法和高额加注，我怀疑他手中可能有更强的牌，如三条或顺子。在这种情况下，我的牌力不足以跟注这么大的赌注，因此选择放弃，避免更大的损失。"}],"winner":[]}
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
