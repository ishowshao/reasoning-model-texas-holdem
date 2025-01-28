function describeActions(actions) {
  const result = actions.map((action) => {
    let description = `${action.player} `;
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
      default:
        description += `执行了未知操作`;
    }

    if (action.message && actions.indexOf(action) === actions.length - 1) {
      description += ` 并且说: ${action.message}`;
    }

    return description;
  });

  return result;
}

export default describeActions;
