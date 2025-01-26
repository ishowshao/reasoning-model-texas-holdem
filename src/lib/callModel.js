import axios from 'axios';
import describeActions from './describeActions';
import util from './util';

async function callModel(game) {
  const data = JSON.parse(JSON.stringify(game));
  data.actions = describeActions(data.actions);
  data.communityCards.flop = util.air(data.communityCards.flop);
  data.communityCards.turn = util.ir(data.communityCards.turn);
  data.communityCards.river = util.ir(data.communityCards.river);
  data.players.forEach((player) => {
    player.holeCards = util.air(player.holeCards);
    if (player.id !== data.currentPlayerTurn) {
      player.holeCards = [];
    }
  });

  console.log(JSON.stringify(data));
  const response = await axios.post('/api/action.php', data);
  return {
    player: data.currentPlayerTurn,
    action: response.data.action,
    amount: response.data.amount,
    message: response.data.message,
    analysis: response.data.analysis,
  };
}

export default callModel;
