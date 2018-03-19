const VALUES = [100, 50, 20, 10, 5, 2, 1];
const DENOMINATIONS = ['One Euro', 'Fifty cents', 'Twenty cents', 'Ten cents', 'Five cents', 'Two cents', 'One cent'];

function getOptimalChangeFor(euro){
    let sum = parseFloat(euro);
    if(Number.isNaN(sum) || !Number.isFinite(sum) || sum < 0) throw 'wrong input';
    let output = [];
    let cents = sum * 100;
    VALUES.forEach(function(coinValue, coinIndex){
        if(cents !== 0){
            let quantity = Math.floor(cents / coinValue);
            for(let i = 0; i < quantity; i++){
                output.push({denomination: DENOMINATIONS[coinIndex]});
            }
            cents -= quantity * coinValue;
        }
    });

    return output;
}