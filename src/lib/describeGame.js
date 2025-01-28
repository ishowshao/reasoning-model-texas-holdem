import util from './util';

function describeActions(game) {
  const actions = game.actions;
  const playerMap = game.players.reduce((map, player) => {
    map[player.id] = player;
    return map;
  }, {});
  const result = actions.map((action) => {
    let description = `轮次: ${action.round} ${playerMap[action.player].name} `;
    switch (action.action) {
      case 'POST_SMALL_BLIND':
        description += `下小盲注 ${action.amount}`;
        break;
      case 'POST_BIG_BLIND':
        description += `下大盲注 ${action.amount}`;
        break;
      case 'RAISE':
        description += `加注(${action.action}) ${action.amount}`;
        break;
      case 'CALL':
        description += `跟注(${action.action}) ${action.amount}`;
        break;
      case 'CHECK':
        description += `过牌(${action.action})`;
        break;
      case 'BET':
        description += `下注(${action.action}) ${action.amount}`;
        break;
      case 'ALL_IN':
        description += `全押(${action.action}) ${action.amount}`;
        break;
      default:
        description += `执行了未知操作`;
    }

    if (action.message) {
      description += ` 并且说: ${action.message}`;
    }

    return description;
  });

  return result;
}

function describeGame(game) {
  const payload = JSON.parse(JSON.stringify(game));
  const currentPlayer = payload.players.find((player) => player.id === payload.currentPlayerTurn);
  const dealer = payload.players.find((player) => player.id === payload.dealer);
  const opponent = payload.players.find((player) => player.id !== currentPlayer.id);
  let description = `德州扑克\n`;
  description += `玩家的状态分三种: 活跃(ACTIVE), 弃牌(FOLDED), 全押(ALL_IN)\n`;
  description += `玩家总数: ${payload.players.length}\n`;
  description += `小盲注: ${payload.table.smallBlind}\n`;
  description += `大盲注: ${payload.table.bigBlind}\n`;
  description += `我是: ${currentPlayer.name}\n`;
  description += `对手: ${opponent.name}\n`;
  description += `dealer: ${dealer.name}\n`;
  description += `我的筹码: ${currentPlayer.chips}\n`;
  description += `我的状态: ${currentPlayer.status}\n`;
  description += `我的手牌: ${util.air(currentPlayer.holeCards).join(', ')}\n`;
  description += `对手的筹码: ${opponent.chips}\n`;
  description += `对手的状态: ${opponent.status}\n`;
  description += `翻牌: ${payload.communityCards.flop[0] !== -1 ? util.air(payload.communityCards.flop).join(', ') : '未发牌'}\n`;
  description += `转牌: ${payload.communityCards.turn !== -1 ? util.ir(payload.communityCards.turn) : '未发牌'}\n`;
  description += `河牌: ${payload.communityCards.river !== -1 ? util.ir(payload.communityCards.river) : '未发牌'}\n`;
  description += `当前轮次: ${payload.currentRound}\n`;
  description += `当前底池: ${payload.pot}\n`;
  description += `历史行动:\n`;
  description += describeActions(payload).join('\n');
  return description;
}

export default describeGame;
