<template>
  <div class="card" :class="{'red-card': isRedSuit, 'black-card': !isRedSuit}">
    <div class="card-suit">{{ suitsMap[suit] }}</div>
    <div class="card-rank">{{ rank }}</div>
  </div>
</template>

<script>
// 使用0-51代表52张牌
// 花色顺序是 ♠ ♥ ♣ ♦
// 牌面顺序是 A 2 3 4 5 6 7 8 9 T J Q K
// 0-12 即 ♠A ♠2 ♠3 ♠4 ♠5 ♠6 ♠7 ♠8 ♠9 ♠T ♠J ♠Q ♠K
// 13-25 即 ♥A ♥2 ♥3 ♥4 ♥5 ♥6 ♥7 ♥8 ♥9 ♥T ♥J ♥Q ♥K
// 26-38 即 ♣A ♣2 ♣3 ♣4 ♣5 ♣6 ♣7 ♣8 ♣9 ♣T ♣J ♣Q ♣K
// 39-51 即 ♦A ♦2 ♦3 ♦4 ♦5 ♦6 ♦7 ♦8 ♦9 ♦T ♦J ♦Q ♦K
const suitsMap = ['♠', '♥', '♣', '♦'];
const ranksMap = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

export default {
  name: 'PokerCard',
  props: {
    card: {
      type: Number,
      required: true,
    },
  },
  computed: {
    suit() {
      return Math.floor(this.card / 13);
    },
    rank() {
      return ranksMap[this.card % 13];
    },
    isRedSuit() {
      return this.suit === 1 || this.suit === 3;
    },
  },
  data() {
    return {
      suitsMap,
    };
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #888888;
  border-radius: 8px;
  width: 50px;
  height: 75px;
  position: relative;
  padding: 10px;
  font-size: 20px;
}

.card-rank {
  font-weight: bold;
  font-size: 30px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-family: monospace;
}

.card-suit {
  font-size: 20px;
  position: absolute;
  top: 5px;
  left: 5px;
}

.red-card {
  color: red;
}

.black-card {
  color: black;
}
</style>
