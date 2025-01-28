const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♣', '♦'];

/**
 * ID 转换为 可读字符
 *
 * @param {number} id 牌ID 0-51
 * @returns {string}
 */
const ir = function (id) {
    if (id < 0 || id > 51) {
        return '';
    }
    return SUITS[Math.floor(id / 13)] + CARDS[id % 13];
};

/**
 * 可读字符转换到ID
 *
 * @param {string} str 字符
 * @returns {number}
 */
const ri = function (str) {
    return SUITS.indexOf(str.charAt(0)) * 13 + CARDS.indexOf(str.charAt(1));
};

const shuffle = a => {
    let j;
    let x;
    for (let i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
};

/**
 * 随机生成指定个数的牌
 *
 * @param {number} count 生成个数
 * @returns {Array}
 */
const generate = count => {
    let cards = new Set();
    while (true) {
        cards.add(Math.floor(Math.random() * 52));
        if (cards.size === count) {
            break;
        }
    }
    return Array.from(cards);
};

/**
 * 对牌数组转换可读
 *
 * @param {Array} cards
 * @returns {Array}
 */
const air = cards => {
    return cards.map(card => ir(card));
};

/**
 * 牌的可读数组转换为ID数组
 *
 * @param {Array} cards 可读数组
 * @returns {Array}
 */
const ari = cards => {
    return cards.map(card => ri(card));
};


/**
 * 获取剩余牌
 *
 * @param {Array} knownCards 已知牌
 * @returns {Array}
 */
const getRestCards = knownCards => {
    let cards = [];
    for (let i = 0; i < 52; i++) {
        if (knownCards.indexOf(i) === -1) {
            cards.push(i);
        }
    }
    return cards;
};

/**
 * 在给定牌中选择两张的所有组合
 *
 * @param {Array} cards 给定牌
 * @param {Function} callback 对每个组合执行此回调
 */
const combine2 = (cards, callback) => {
    let combine = [0, 0];
    let length = cards.length;
    for (let i = 0; i < length; i++) {
        combine[0] = cards[i];
        for (let j = 0; j < length; j++) {
            if (j > i) {
                combine[1] = cards[j];
                callback(combine);
            }
        }
    }
};

const isPocketPair = (cardA, cardB) => {
    return cardA % 13 === cardB % 13;
};

const isPocketAK = (cardA, cardB) => {
    let hasA = (cardA % 13 === 0) || (cardB % 13 === 0);
    let hasK = (cardA % 13 === 12) || (cardB % 13 === 12);
    return hasA && hasK;
};

export default {ir, ri, shuffle, generate, air, ari, getRestCards, combine2, isPocketPair, isPocketAK};
