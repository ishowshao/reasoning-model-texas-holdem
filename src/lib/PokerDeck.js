class PokerDeck {
    constructor() {
        /**
         * 初始化扑克牌堆，包含52张牌，编号为0-51。
         */
        this.resetDeck();
        console.log(`初始化牌堆，包含 ${this.availableCards.length} 张牌。`);
    }

    dealCards(n) {
        /**
         * 随机发放n张牌，确保每张牌在一个实例中不重复发放。
         * 
         * @param {number} n - 要发放的牌数
         * @returns {number[]} - 包含n张牌的数组
         * @throws {Error} - 如果请求的牌数超过剩余牌数
         */
        if (n > this.availableCards.length) {
            throw new Error(`无法发放 ${n} 张牌，剩余牌数不足（剩余 ${this.availableCards.length} 张）。`);
        }

        const dealt = [];
        for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * this.availableCards.length);
            const card = this.availableCards.splice(randomIndex, 1)[0];
            dealt.push(card);
        }

        console.log(`已发放 ${n} 张牌，剩余 ${this.availableCards.length} 张牌。`);
        return dealt;
    }

    resetDeck() {
        /**
         * 重置牌堆，将所有牌重新放回并洗牌。
         */
        this.availableCards = Array.from({ length: 52 }, (_, index) => index);
        console.log("牌堆已重置。");
    }

    getRemainingCount() {
        /**
         * 获取剩余牌数。
         * 
         * @returns {number} - 剩余牌数
         */
        return this.availableCards.length;
    }

    getDealtCards() {
        /**
         * 获取已发放的牌（不在availableCards中的牌）。
         * 
         * @returns {number[]} - 已发放的牌数组
         */
        const allCards = Array.from({ length: 52 }, (_, index) => index);
        return allCards.filter(card => !this.availableCards.includes(card));
    }
}

let pokerDeck = new PokerDeck();

export default pokerDeck;