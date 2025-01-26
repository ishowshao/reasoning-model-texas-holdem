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
  });

  console.log(JSON.stringify(data));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    player: data.currentPlayerTurn,
    action: 'CHECK',
    amount: 0,
    message: "I'll check.",
  };
}

export default callModel;
