const VendingMachine = (function() {
    const VALUES = [100, 50, 20, 10, 5, 2, 1];
    const DENOMINATIONS = ['One Euro', 'Fifty cents', 'Twenty cents', 'Ten cents', 'Five cents', 'Two cents', 'One cent'];

    function isNotPositiveNumber(num) {
        return Number.isNaN(num) || !Number.isFinite(num) || num <= 0;
    }

    return class VendingMachine {
        constructor(coinSupply) {
            // if no supply received use unlimited supply
            this.coinSupply = coinSupply || VALUES.map(item => Number.POSITIVE_INFINITY);
        }

        getChangeFor(euro) {
            let sum = parseFloat(euro);
            let result = [];
            let coinsInUse = [];
            if (isNotPositiveNumber(sum)) throw 'Wrong input';
            // rounding the full number of cents due to JS math problems
            coinsInUse = this._recursiveSplit(Math.round(sum * 100), VALUES.map(() => 0), 0);
            if (coinsInUse === null) throw 'Insufficient coins';

            // convert answer to required format
            coinsInUse.forEach((coinsNum, coinIndex) => {
                this.coinSupply[coinIndex] -= coinsNum;
                for (let i = 0; i < coinsNum; i++) {
                    result.push({ denomination: DENOMINATIONS[coinIndex] });
                }
            });

            return result;
        }

        _recursiveSplit(sum, coinsInUse, coinIndex) {
            // if these are the cheapest coins(last index), try going level up and changing number of more expensive coins
            if (coinIndex >= VALUES.length) return null;

            let coinValue = VALUES[coinIndex];
            let coinSupply = this.coinSupply[coinIndex];
            let quantity = Math.floor(sum / coinValue);
            let output = null;

            // use as much coins of current denomination, as possible
            if (quantity > this.coinSupply[coinIndex]) {
                quantity = this.coinSupply[coinIndex];
            }
            sum -= quantity * coinValue;
            coinsInUse[coinIndex] += quantity;

            if (sum === 0) {
                return coinsInUse;
            }

            // if not enough coins yet, try adding cheaper coins
            output = this._recursiveSplit(sum, coinsInUse, coinIndex + 1);

            // if even now there are not enough coins, try using less of current coins and add cheaper ones
            while (output === null && coinsInUse[coinIndex] > 0) {
                coinsInUse[coinIndex]--;
                sum += coinValue;
                output = this._recursiveSplit(sum, coinsInUse, coinIndex + 1);
            }

            return output;
        }
    };
})();

const DEFAULT_SUPPLY = [11, 24, 0, 99, 200, 11, 23];

let limitedMachine = new VendingMachine(DEFAULT_SUPPLY);
let unlimitedMachine = new VendingMachine();

function getOptimalChangeFor(euro) {
    return unlimitedMachine.getChangeFor(euro);
}

function getChangeFor(euro) {
    return limitedMachine.getChangeFor(euro);
}