import Classifier from './classifier';
import util from './util';

console.time('speed');
for (let i = 0; i < 10000000; i++) {
    let cards = util.generate(7);
    // console.log(util.air(cards));
    const classifier = new Classifier(cards);
    const result = classifier.classify();
    if (result.pattern === 'StraightFlush' || result.pattern === 'RoyalStraightFlush') {
        console.log(cards, util.air(cards));
        console.log(result);

    }
    // StraightFlush RoyalStraightFlush
}
console.timeEnd('speed');
