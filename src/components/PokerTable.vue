<template>
  <div class="poker-table p-2">
    <div>
      <div class="d-flex">
        <div>
          <div class="d-flex align-items-center">
            <div class="me-1">player 1</div>
            <div class="dealer-icon" v-if="game.dealer === game.players[0].id"></div>
          </div>
          <div class="d-flex">
            <div>
              <div class="d-flex">
                <PokerCard :card="game.players[0].holeCards[0]" />
                <PokerCard :card="game.players[0].holeCards[1]" />
              </div>
              <div class="text-center">{{ game.players[0].chips }}</div>
            </div>
          </div>
        </div>
        <div class="flex-grow-1">
          <div class="text-center">pot</div>
          <div class="text-center">{{ game.pot }}</div>
          <div class="d-flex justify-content-between">
            <div>{{ game.players[0].chipsThisRound }}</div>
            <div>{{ game.players[1].chipsThisRound }}</div>
          </div>
        </div>
        <div>
          <div class="d-flex align-items-center">
            <div class="me-1">player 2</div>
            <div class="dealer-icon" v-if="game.dealer === game.players[1].id"></div>
          </div>
          <div class="d-flex">
            <div>
              <div class="d-flex">
                <PokerCard :card="game.players[1].holeCards[0]" />
                <PokerCard :card="game.players[1].holeCards[1]" />
              </div>
              <div class="text-center">{{ game.players[1].chips }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <div class="me-2">
          <div>Flop</div>
          <div class="d-flex">
            <PokerCard :card="game.communityCards[0]" />
            <PokerCard :card="game.communityCards[1]" />
            <PokerCard :card="game.communityCards[2]" />
          </div>
        </div>
        <div class="me-2">
          <div>Turn</div>
          <PokerCard :card="game.communityCards[3]" />
        </div>
        <div>
          <div>River</div>
          <PokerCard :card="game.communityCards[4]" />
        </div>
      </div>
      <div class="text-center my-2">
        <a href="/heads-up-rules" class="text-black" style="font-size: 12px;">单挑规则说明</a>
      </div>
    </div>
  </div>
</template>
<script>
import PokerCard from './PokerCard.vue';
import pokerDeck from '../lib/PokerDeck';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  components: {
    PokerCard,
  },
  data() {
    return {
    };
  },
  methods: {
    deal() {
      return pokerDeck.dealCards(1)[0];
    },
    dealCards(n) {
      return pokerDeck.dealCards(n);
    },
  },
};
</script>
<style>
.poker-table {
  width: 100vw;
  height: 66vw;
  background-color: #14A076;
}
.dealer-icon {
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 50%;
}
</style>
