import axios from 'axios';
import describeActions from './describeActions';
import util from './util';

async function callModel(game) {
  const payload = JSON.parse(JSON.stringify(game));
  payload.actions = describeActions(payload.actions);
  payload.communityCards.flop = util.air(payload.communityCards.flop);
  payload.communityCards.turn = util.ir(payload.communityCards.turn);
  payload.communityCards.river = util.ir(payload.communityCards.river);
  payload.players.forEach((player) => {
    player.holeCards = util.air(player.holeCards);
    if (player.id !== payload.currentPlayerTurn) {
      player.holeCards = [];
    }
  });

  console.log(JSON.stringify(payload));
  const { data } = await axios.post('/api/action.php', payload);
  if (data.code !== 0) {
    throw new Error(data.message);
  }
  const modelAction = data.data;

  return {
    player: payload.currentPlayerTurn,
    action: modelAction.action,
    amount: modelAction.amount,
    message: modelAction.message,
    analysis: modelAction.analysis,
  };
}

export default callModel;
