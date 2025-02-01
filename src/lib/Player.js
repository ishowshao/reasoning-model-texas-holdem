class Player {
  constructor(id, name, chips, model) {
    this.id = id;
    this.model = model;
    this.name = name;
    this.chips = chips;
    this.chipsThisRound = 0;
    this.hasActionThisRound = false;
    this.status = 'ACTIVE';
    this.holeCards = [-1, -1];
  }

  load(player) {
    this.id = player.id;
    this.model = player.model;
    this.name = player.name;
    this.chips = player.chips;
    this.chipsThisRound = player.chipsThisRound;
    this.hasActionThisRound = player.hasActionThisRound;
    this.status = player.status;
    this.holeCards = player.holeCards;
  }

  setModel(model) {
    this.model = model;
  }

  postSmallBlind() {
    const chips = 1;
    this.chipsThisRound += chips;
    this.chips -= chips;
    if (this.chips === 0) {
      // 如果下注后筹码为0，则状态为ALL_IN，并且后续也无需有任何操作
      this.status = 'ALL_IN';
      this.hasActionThisRound = true;
    }
    return chips;
  }

  /**
   * 下大盲注
   * 下大盲注时，筹码可能是1，也可能是2，此时下注后直接ALL_IN
   * @returns {Number} 实际支付的筹码
   */
  postBigBlind() {
    let chips = 2;
    if (this.chips < chips) {
      chips = this.chips;
      this.status = 'ALL_IN';
      this.hasActionThisRound = true;
    }
    this.chipsThisRound += chips;
    this.chips -= chips;
    return chips;
  }

  /**
   * 跟注
   * @param {Number} amount 需要跟到的筹码
   * @returns {Number} 实际支付的筹码
   */
  call(amount) {
    this.hasActionThisRound = true;
    const needChips = amount - this.chipsThisRound;
    if (needChips >= this.chips) {
      const chips = this.chips;
      this.chipsThisRound += chips;
      this.chips = 0;
      this.status = 'ALL_IN';
      return chips;
    } else {
      this.chipsThisRound += needChips;
      this.chips -= needChips;
      return needChips;
    }
  }

  /**
   * 下注
   * @param {Number} amount 目标下注量
   * @returns {Number} 实际支付的筹码
   */
  bet(amount) {
    this.hasActionThisRound = true;
    if (amount >= this.chips) {
      const chips = this.chips;
      this.chipsThisRound += chips;
      this.chips = 0;
      this.status = 'ALL_IN';
      return chips;
    } else {
      this.chips -= amount;
      this.chipsThisRound += amount;
      return amount;
    }
  }

  /**
   * 全押
   * @returns {Number} 实际支付的筹码
   */
  allIn() {
    const chips = this.chips;
    this.chipsThisRound += chips;
    this.chips = 0;
    this.status = 'ALL_IN';
    this.hasActionThisRound = true;
    return chips;
  }

  fold() {
    this.status = 'FOLDED';
    this.hasActionThisRound = true;
  }

  hasNoHoleCards() {
    return this.holeCards[0] === -1 && this.holeCards[1] === -1;
  }

  /**
   * 进入下一轮时，需要清空本轮下注的筹码，并且标记本轮还没有任何操作
   */
  nextRound() {
    this.chipsThisRound = 0;
    this.hasActionThisRound = false;
  }
}

export default Player;
