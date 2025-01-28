import axios from 'axios';
import describeGame from './describeGame';

async function callModel(game) {
  const payload = describeGame(game);

  // form encode
  const formData = new FormData();
  formData.append('input', payload);
  const { data } = await axios.post('/api/action.php', formData);
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
