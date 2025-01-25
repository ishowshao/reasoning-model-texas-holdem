<template>
  <div class="poker-table p-2">
    <div>
      <div class="d-flex justify-content-between">
        <div>
          <div>player 1</div>
          <div class="d-flex">
            <PokerCard :card="deal()" />
            <PokerCard :card="deal()" />
          </div>
        </div>
        <!-- <div>回放中</div> -->
        <div>
          <div>player 2</div>
          <div class="d-flex">
            <PokerCard :card="deal()" />
            <PokerCard :card="deal()" />
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <div class="me-2">
          <div>Flop</div>
          <div class="d-flex">
            <PokerCard :card="deal()" />
            <PokerCard :card="deal()" />
            <PokerCard :card="deal()" />
          </div>
        </div>
        <div class="me-2">
          <div>Turn</div>
          <PokerCard :card="deal()" />
        </div>
        <div>
          <div>River</div>
          <PokerCard :card="deal()" />
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
  height: 60vw;
  background-color: #14A076;
}
</style>
