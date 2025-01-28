class Player {
  constructor(id, name, chips) {
    this.id = id;
    this.name = name;
    this.chips = chips;
    this.chipsThisRound = 0;
    this.hasActionThisRound = false;
    this.status = 'ACTIVE';
    this.holeCards = [-1, -1];
  }

  load(player) {
    this.id = player.id;
    this.name = player.name;
    this.chips = player.chips;
    this.chipsThisRound = player.chipsThisRound;
    this.hasActionThisRound = player.hasActionThisRound;
    this.status = player.status;
    this.holeCards = player.holeCards;
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
      this.chipsThisRound += this.chips;
      this.chips = 0;
      this.status = 'ALL_IN';
      return this.chips;
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

  nextRound() {
    this.chipsThisRound = 0;
    this.hasActionThisRound = false;
  }
}

export default Player;
