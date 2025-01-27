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

  call(amount) {
    const needChips = amount - this.chipsThisRound;
    if (needChips >= this.chips) {
      this.chipsThisRound += this.chips;
      this.chips = 0;
      this.status = 'ALL_IN';
    } else {
      this.chipsThisRound += needChips;
      this.chips -= needChips;
    }
    this.hasActionThisRound = true;
  }

  bet(amount) {
    if (amount >= this.chips) {
      this.chipsThisRound += this.chips;
      this.chips = 0;
      this.status = 'ALL_IN';
    } else {
      this.chips -= amount;
      this.chipsThisRound += amount;
    }
    this.hasActionThisRound = true;
  }

  allIn() {
    this.chipsThisRound += this.chips;
    this.chips = 0;
    this.status = 'ALL_IN';
    this.hasActionThisRound = true;
  }

  fold() {
    this.status = 'FOLDED';
    this.hasActionThisRound = true;
  }
}

export default Player;
