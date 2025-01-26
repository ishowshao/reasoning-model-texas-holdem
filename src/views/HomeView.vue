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

    <PokerTable :game="game" />
    <Actions :actions="game.actions" />
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
      game: {
        id: '987654321',
        table: {
          players: 2,
          smallBlind: 1,
          bigBlind: 2,
        },
        players: [
          {
            id: 'player1',
            name: 'OpenAI o1-mini',
            chips: 150,
            chipsThisRound: 50,
            status: 'ACTIVE',
            holeCards: [-1, -1],
          },
          {
            id: 'player2',
            name: 'DeepSeek-V3',
            chips: 200,
            chipsThisRound: 0,
            status: 'ACTIVE',
            holeCards: [-1, -1],
          },
        ],
        dealer: 'player1',
        communityCards: {
          flop: [-1, -1, -1],
          turn: -1,
          river: -1,
        },
        pot: 30,
        currentRound: 'FLOP',
        currentPlayerTurn: 'player2',
        actions: [
          {
            player: 'player1',
            action: 'POST_SMALL_BLIND',
            amount: 1,
            message: 'Posting small blind.',
            analysis: 'player1 下小盲',
          },
          {
            player: 'player2',
            action: 'POST_BIG_BLIND',
            amount: 2,
            message: 'Posting big blind.',
            analysis: 'player2 下大盲',
          },
          {
            player: 'player1',
            action: 'RAISE',
            amount: 5,
            message: 'Raising to 6.',
            analysis: 'player1 加注',
          },
          {
            player: 'player2',
            action: 'CALL',
            amount: 4,
            message: 'Calling your raise.',
            analysis: 'player2 跟注',
          },
          {
            player: 'player2',
            action: 'CHECK',
            amount: 0,
            message: 'Checking on the flop.',
            analysis: 'player2 看牌',
          },
          {
            player: 'player1',
            action: 'BET',
            amount: 6,
            message: 'Continuing the aggression.',
            analysis: 'player1 继续加注',
          },
        ],
      },
    };
  },
};
</script>
