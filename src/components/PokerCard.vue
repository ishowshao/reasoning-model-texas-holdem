<template>
  <div class="poker-card" :class="cardClass">
    <div v-if="card !== -1">
      <div class="poker-card-suit">{{ suitsMap[suit] }}</div>
      <div class="poker-card-rank">{{ rank }}</div>
    </div>
  </div>
</template>

<script>
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
    cardClass() {
      if (this.card === -1) {
        return 'poker-card-back';
      }
      return this.isRedSuit ? 'poker-card-red' : 'poker-card-black';
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
.poker-card {
  /* border: 1px solid #888888; */
  background-color: white;
  border-radius: 8px;
  width: 50px;
  height: 75px;
  position: relative;
  padding: 10px;
  font-size: 20px;
  margin: 1px;
}

.poker-card-rank {
  font-weight: bold;
  font-size: 30px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-family: monospace;
}

.poker-card-suit {
  font-size: 20px;
  position: absolute;
  top: 5px;
  left: 5px;
}

.poker-card-red {
  color: red;
}

.poker-card-black {
  color: black;
}

.poker-card-back {
  background-image: url('@/assets/pokerback.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
