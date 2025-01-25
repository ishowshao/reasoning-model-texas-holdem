<template>
  <div class="card" :class="{'red-card': isRedSuit, 'black-card': !isRedSuit}">
    <div class="card-suit">{{ suitsMap[card.suit] }}</div>
    <div class="card-rank">{{ card.rank }}</div>
  </div>
</template>

<script>
const suitsMap = {
  'hearts': '♥',
  'diamonds': '♦',
  'clubs': '♣',
  'spades': '♠',
};

export default {
  name: 'PokerCard',
  props: {
    card: {
      type: Object,
      required: true,
      validator: function (value) {
        return ['hearts', 'diamonds', 'clubs', 'spades'].includes(value.suit) && ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].includes(value.rank);
      },
    },
  },
  data() {
    return {
      suitsMap,
    };
  },
  computed: {
    isRedSuit() {
      return this.card.suit === 'hearts' || this.card.suit === 'diamonds';
    },
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
