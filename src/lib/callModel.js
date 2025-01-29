import axios from 'axios';
import describeGame from './describeGame';

async function callModel(game) {
  const describe = describeGame(game);

  // form encode
  const formData = new FormData();
  formData.append('input', describe);
  formData.append('model', game.players.find((player) => player.id === game.currentPlayerTurn).model);
  const { data } = await axios.post('/api/action.php', formData);
  if (data.code !== 0) {
    return {
      player: game.currentPlayerTurn,
      action: 'FOLD',
      amount: 0,
      message: '由于模型返回出错，被系统判定为弃牌',
      analysis: '',
    };
  }
  const modelAction = data.data;

  return {
    player: game.currentPlayerTurn,
    action: modelAction.action,
    amount: modelAction.amount,
    message: modelAction.message,
    analysis: modelAction.analysis,
  };
}

export default callModel;
