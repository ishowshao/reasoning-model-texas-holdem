/**
 * 牌型等级
 */
const RANK = {
    'RoyalStraightFlush': 9,
    'StraightFlush': 8,
    'FourOfAKind': 7,
    'FullHouse': 6,
    'Flush': 5,
    'Straight': 4,
    'ThreeOfAKind': 3,
    'TwoPair': 2,
    'OnePair': 1,
    'HighCard': 0
};

/**
 * 比较两个reduce的大小
 * reduce1 == reduce2 返回 0
 * reduce1 > reduce2 返回 大于0的值
 * reduce1 < reduce2 返回 小于0的值
 *
 * @param {Array} reduce1
 * @param {Array} reduce2
 * @returns {number}
 */
const compareReduce = (reduce1, reduce2) => {
    let result = 0;
    let length = reduce1.length;
    for (let i = 0; i < length; i++) {
        result = reduce1[i] - reduce2[i];
        if (result !== 0) {
            break;
        }
    }
    return result;
};

/**
 * 建立在分类器的pattern和reduce基础上,进行牌面大小比较
 * value 是 {pattern, reduce} 这即可表示一个牌面的绝对价值大小
 * value1 == value2 返回 0
 * value1 > value2 返回 大于0的值
 * value1 < value2 返回 小于0的值
 * pattern 大小通过rank计算
 * reduce 是一个数组, 牌型的需比较值的最简化,例如:
 *     金刚牌: [2, 3] 表示4张相同的牌是2 剩下一张是3
 *     葫芦: [2, 3] 表示3张相同的是2 一对是3
 *     顺子: [9] 表示顺子大头是9 顺子只需要比较最大的那个牌
 *     高牌: [9, 7, 5, 3, 2] 高牌需要依次比较每个牌
 *
 * @param {Object} value1
 * @param {Object} value2
 * @returns {number}
 */
const compare = (value1, value2) => {
    const p1 = RANK[value1.pattern];
    const p2 = RANK[value2.pattern];

    if (p1 === p2) {
        return compareReduce(value1.reduce, value2.reduce);
    } else {
        return p1 - p2;
    }
};

export default compare;