import BigNumber from "bignumber.js";

export const BN = (x) => new BigNumber(x);


// Calc trade size
const tradesize = (balanceTradedToken,tradeSize) => balanceTradedToken.times(tradeSize.div(BN(100))).times(BN(2)); // *2 to get % of TVL, token A depth *2 = TVL when pool is balanced

// Calc token received
const tokenBOutput = (tokenAinput,tokenAdepth,tokenBdepth) => (tokenAinput.times(tokenAdepth).times(tokenBdepth)).div(tokenAinput.plus(tokenAdepth).times(tokenAinput.plus(tokenAdepth)));

// Calc token received Uniswap
const tokenBOutputUS = (tokenAinput,tokenAdepth,tokenBdepth, swapfee) => ((tokenAinput.times(tokenBdepth)).div((tokenAinput.plus(tokenAdepth))).times(BN(1).minus(swapfee.div(BN(100)))));

// Cal Rt (price of A in B)
const Rt = (tokenAdepth,tokenBdepth) => tokenBdepth.div(tokenAdepth);

// Calc asset Price
const assetPrice = (initialPrice,pricemovePercentage) => initialPrice.times(BN(1).plus(pricemovePercentage.div(BN(100))));

// Calc TVL
const TVL = (tokenAdepth,tokenBdepth, priceA, priceB, pricemovementPercA, pricemovementPercB) => (tokenAdepth.times(priceA).times(BN(1).plus(pricemovementPercA.div(BN(100)))).plus(tokenBdepth.times(priceB).times(BN(1).plus(pricemovementPercB.div(BN(100))))));

// Calc new Balance
function newBalance(tokeninputA,tokenBOutput, tokenAdepth,tokenBdepth, swap){
  if (swap === false){ // if swap is false then A tokens are swapped for B tokens
  tokenAdepth = tokenAdepth.plus(tokeninputA);
  tokenBdepth = tokenBdepth.minus(tokenBOutput);
  }
  else{ // if swap is true then B tokens are swapped for A tokens
    tokenAdepth = tokenAdepth.minus(tokeninputA);
    tokenBdepth = tokenBdepth.plus(tokenBOutput);
  }
  return({newTokenAdepth: tokenAdepth, newTokenBdepth: tokenBdepth});
}



// MAIN function to calculate impermanent loss
export function ILcalcSP(initialAdepth,initialBdepth,initialPriceA, initialPriceB, pricemovementPercA, pricemovementPercB, tradeSizePercentage, fixedFeePerc, SlipFeeBasesModelTrue){
  let poolBalance = {
    NewBalancePoolA:BN(0),
    NewBalancePoolB:BN(0)
    }

const _initialAdepth = BN(initialAdepth);
const _initialBdepth = BN(initialBdepth);
const _initialPriceA = BN(initialPriceA);
const _initialPriceB = BN(initialPriceB);
const _pricemovementPercA = BN(pricemovementPercA);
const _pricemovementPercB = BN(pricemovementPercB);
const _tradeSizePercentage = BN(tradeSizePercentage);
const _fixedFeePerc = BN(fixedFeePerc);


const _RtInitial =  (_initialBdepth.div(_initialAdepth)).toFixed(9); // get initial Rt value (price of asset A in B)
const _RtPumped = ((assetPrice(_initialPriceA,_pricemovementPercA).div(assetPrice(_initialPriceB,_pricemovementPercB)))).toFixed(9); // Get Rt when price movement occurs (pool depth A * token price A = pool depth B * token price B)
let _RtReturned = _RtInitial; // Rt Returned will be used in loop 
poolBalance.NewBalancePoolA = _initialAdepth;
poolBalance.NewBalancePoolB = _initialBdepth;
const _initialTVL = TVL(_initialAdepth, _initialBdepth, _initialPriceA, _initialPriceB, _pricemovementPercA, _pricemovementPercB); // Get initial TVL
let _endTVL = BN(0);
let _IL = BN(0);
let arrPoolbehaviour = [{TVL: (TVL(poolBalance.NewBalancePoolA ,poolBalance.NewBalancePoolB, _initialPriceA, _initialPriceB, _pricemovementPercA, _pricemovementPercB)), // set initial pool behaviour array. If no trades happen this value will be returned
  BalancePoolA: poolBalance.NewBalancePoolA, 
  BalancePoolB: poolBalance.NewBalancePoolB,
  rt: _RtReturned,
  tokenInputA: 0,
  TokenIntype: "",
  tokenOutputB: 0, 
  TokenOuttype: "",
  IL: 0}];



for (let i=0; (_RtInitial>_RtPumped) ? _RtReturned > _RtPumped : _RtReturned < _RtPumped ; i++){ //do until actual Rt value is above( or below, depends of price movement direction) or equal to calculated pumped Rt 
  let _tokeninput = BN(0);
  let _tokenOut = BN(0);
  let newPoolBalance = BN(0);
  let swap = false;

  if(_RtInitial>_RtPumped){ // if pumped Rt is smaller than initial Rt then add A tokens and remove B tokens from pool
    swap = false;
_tokeninput = tradesize(poolBalance.NewBalancePoolA,_tradeSizePercentage);
if (SlipFeeBasesModelTrue){_tokenOut = tokenBOutput(_tokeninput, poolBalance.NewBalancePoolA,poolBalance.NewBalancePoolB)} else {_tokenOut = tokenBOutputUS(_tokeninput, poolBalance.NewBalancePoolA,poolBalance.NewBalancePoolB, _fixedFeePerc)};
newPoolBalance = newBalance(_tokeninput,_tokenOut, poolBalance.NewBalancePoolA,poolBalance.NewBalancePoolB, swap);
  }
else if (_RtInitial<_RtPumped){  // if pumped Rt is bigger than initial Rt then add B tokens and remove A tokens from pool
  swap = true;
  _tokeninput = tradesize(poolBalance.NewBalancePoolB,_tradeSizePercentage);
_tokenOut = tokenBOutput(_tokeninput, poolBalance.NewBalancePoolB,poolBalance.NewBalancePoolA);
if (SlipFeeBasesModelTrue){_tokenOut = tokenBOutput(_tokeninput, poolBalance.NewBalancePoolB,poolBalance.NewBalancePoolA)} else {_tokenOut = tokenBOutputUS(_tokeninput, poolBalance.NewBalancePoolB,poolBalance.NewBalancePoolA, _fixedFeePerc)};
newPoolBalance = newBalance(_tokenOut,_tokeninput, poolBalance.NewBalancePoolA,poolBalance.NewBalancePoolB, swap);
}
else{
  break;
}

let tokenInType = (swap) ? "token B" : "token A";
let tokenOutType = (!swap) ? "token B" : "token A";

poolBalance.NewBalancePoolA = newPoolBalance.newTokenAdepth;
poolBalance.NewBalancePoolB = newPoolBalance.newTokenBdepth;
_RtReturned = (Rt(poolBalance.NewBalancePoolA,poolBalance.NewBalancePoolB)).toFixed(9);
_endTVL = TVL(poolBalance.NewBalancePoolA ,poolBalance.NewBalancePoolB, _initialPriceA, _initialPriceB, _pricemovementPercA, _pricemovementPercB); 
arrPoolbehaviour[i] = {TVL: (TVL(poolBalance.NewBalancePoolA ,poolBalance.NewBalancePoolB, _initialPriceA, _initialPriceB, _pricemovementPercA, _pricemovementPercB)), 
  BalancePoolA: poolBalance.NewBalancePoolA, 
  BalancePoolB: poolBalance.NewBalancePoolB,
  rt: _RtReturned,
  tokenInputA: _tokeninput,
  TokenIntype: tokenInType,
  tokenOutputB: _tokenOut, 
  TokenOuttype: tokenOutType,
  IL: ((((_endTVL.div(_initialTVL)).minus(BN(1))).times(BN(10000))).div(BN(100)))
}
}

_endTVL = TVL(poolBalance.NewBalancePoolA ,poolBalance.NewBalancePoolB, _initialPriceA, _initialPriceB, _pricemovementPercA, _pricemovementPercB); // get end TVL
_IL = (((_endTVL.div(_initialTVL)).minus(BN(1))).times(BN(10000))).div(BN(100))
return (arrPoolbehaviour);
}


// MAIN function to simulate multiple trades
export function multiTrade(initialAdepth, initialBdepth, initialPriceA, initialPriceB, pricemovementPercA, pricemovementPercB, tradeSizePercentages, fixedFeePerc, SlipFeeBasesModelTrue, amountOfRepeatablePM){ 
  let arrReturnedValues = [];
  let returnedPoolCondition = [];
  const _initialPriceA = BN(initialPriceA);
  const _initialPriceB = BN(initialPriceB);
  let _initialAdepth = BN(initialAdepth);
  let _initialBdepth = BN(initialBdepth);
  const storeInitialAdepth = _initialAdepth;
  const storeInitialBdepth = _initialBdepth;
  let totalAmountOfTrades = BN(0);
  const _fixedFeePerc = BN(fixedFeePerc);


  for (let i=0; i<amountOfRepeatablePM; i++){ // do for amount of repeatable price movements
    returnedPoolCondition = ILcalcSP(_initialAdepth, _initialBdepth, _initialPriceA, _initialPriceB, BN(pricemovementPercA[i]), BN(pricemovementPercB[i]), BN(tradeSizePercentages[i]), _fixedFeePerc, SlipFeeBasesModelTrue);
    returnedPoolCondition = multiTradeImpLossCalc(returnedPoolCondition, BN(pricemovementPercA[i]), BN(pricemovementPercB[i]), storeInitialAdepth, storeInitialBdepth, _initialPriceA, _initialPriceB)
    arrReturnedValues.push(...returnedPoolCondition);
    _initialAdepth = returnedPoolCondition[returnedPoolCondition.length-1].BalancePoolA; // update initial depth value after IL calculation of each individual repeatable price movement
    _initialBdepth = returnedPoolCondition[returnedPoolCondition.length-1].BalancePoolB;
    totalAmountOfTrades = arrReturnedValues.length; // store the amount of trades needed to reach the pool balance after each individual PM
  }

 

let _initialTVL = TVL(storeInitialAdepth ,storeInitialBdepth, _initialPriceA, _initialPriceB, BN(pricemovementPercA[amountOfRepeatablePM-1]), BN(pricemovementPercB[amountOfRepeatablePM-1]));
let _endTVL = TVL(arrReturnedValues[arrReturnedValues.length-1].BalancePoolA ,arrReturnedValues[arrReturnedValues.length-1].BalancePoolB, _initialPriceA, _initialPriceB, BN(pricemovementPercA[amountOfRepeatablePM-1]), BN(pricemovementPercB[amountOfRepeatablePM-1]));
let _IL = (((_endTVL.div(_initialTVL)).minus(BN(1))).times(BN(10000))).div(BN(100));
let IL = _IL.toFixed(2).toString();
let text = [{
text : [],
value : []
}];
text[0] = ({text : "multi trade parameters", value: null});
text.push({text : "Amount of repeatable price movements = ", value: amountOfRepeatablePM});
text.push({text : "Repeatable price movements in percentage of asset A (%) = ", value: pricemovementPercA});
text.push({text : "Repeatable price movements in percentage of asset B (%) = ", value: pricemovementPercB});
text.push({text : "Amount of trades needed to rebalance pool = ", value: totalAmountOfTrades});
text.push({text : "IL(%) (+ is gain, - is loss) = ", value: IL+" %"});
return ({arrReturnedValues, IL, text});
 }


 // Correct IL for multitrade
 function multiTradeImpLossCalc(returnedPoolCondition, pricemovementPercA, pricemovementPercB, initialAdepth, initialBdepth, initialPriceA, initialPriceB){

for (let i = 0; i < returnedPoolCondition.length; i++){
  let actualTVL = TVL(returnedPoolCondition[i].BalancePoolA ,returnedPoolCondition[i].BalancePoolB, initialPriceA, initialPriceB, pricemovementPercA, pricemovementPercB);
  let initialTVL = TVL(initialAdepth ,initialBdepth, initialPriceA, initialPriceB, pricemovementPercA, pricemovementPercB);
   returnedPoolCondition[i].IL = ((((actualTVL.div(initialTVL)).minus(BN(1)).times(BN(10000)))).div(BN(100)));
}
return (returnedPoolCondition);
 }



