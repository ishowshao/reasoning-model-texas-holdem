<template>
  <div class="container my-3 action-list">
    <div v-for="(action, index) in actions" :key="index" class="action-item">
      <div class="action-message">
        <strong>{{ game.players.find((player) => player.id === action.player).name }}:</strong> {{ action.message }}
      </div>
      <div class="action-details">
        <span>Action {{index + 1}}: {{ action.action }}</span> - <span>{{ action.amount }}</span>
        <span @click="toggleAnalysis(index)" class="icon-question">
            <IconQuestionCircle />
        </span>
        <div v-if="showAnalysis[index]" class="action-analysis">
          {{ action.analysis }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconQuestionCircle from './icons/IconQuestionCircle.vue';

export default {
  components: {
    IconQuestionCircle,
  },
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  computed: {
    actions() {
      return this.game.actions;
    },
  },
  data() {
    return {
      showAnalysis: this.game.actions.map(() => false),
    };
  },
  methods: {
    toggleAnalysis(index) {
      this.showAnalysis[index] = !this.showAnalysis[index];
    },
  },
};
</script>

<style>
.action-list {
  display: flex;
  flex-direction: column-reverse;
}

.action-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.action-message {
  margin-bottom: 5px;
}

.action-details {
  font-size: 0.9em;
  color: gray;
}

.icon-question {
  cursor: pointer;
  margin-left: 5px;
  color: darkgray;
}

.action-analysis {
  margin-top: 5px;
  font-size: 0.8em;
  color: darkgray;
}
</style>
