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
          <button type="submit" class="btn btn-primary">开始对战</button>
        </div>
      </form>
    </div>

    <PokerTable />
    <Actions :actions="actions" />
  </div>
</template>

<script>
import PokerTable from '../components/PokerTable.vue';
import Actions from '../components/Actions.vue';

export default {
  components: {
    PokerTable,
    Actions,
  },
  data() {
    return {
      actions: [
        {
          player: 'player1',
          action: 'POST_SMALL_BLIND',
          amount: 1,
          message: 'Posting small blind.',
          analysis: 'Player1决定下小盲注',
        },
        {
          player: 'player2',
          action: 'POST_BIG_BLIND',
          amount: 2,
          message: 'Posting big blind.',
          analysis: 'Player2决定下大盲注',
        },
        {
          player: 'player1',
          action: 'RAISE',
          amount: 5,
          message: 'Raising to 6.',
          analysis: 'Player1决定加注',
        },
        {
          player: 'player2',
          action: 'CALL',
          amount: 4,
          message: 'Calling your raise.',
          analysis: 'Player2决定跟注',
        },
        {
          player: 'player2',
          action: 'CHECK',
          amount: 0,
          message: 'Checking on the flop.',
          analysis: 'Player2决定过牌',
        },
        {
          player: 'player1',
          action: 'BET',
          amount: 6,
          message: 'Continuing the aggression.',
          analysis: 'Player1决定继续加注',
        },
      ],
    };
  },
};
</script>
