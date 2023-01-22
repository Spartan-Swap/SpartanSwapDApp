// TODO: Move + rename file based on where this calculator/simulator will live in the DApp (probably components/poolSimulator/simulator.tsx)
// TODO: Make this a component (maybe inside a Modal for now)
// TODO: Embed this component in a page of its own (maybe 'tools'?)

import type BigNumber from "bignumber.js";
import { BN } from "./formatting";

// TODO: Link to this component onClick on the 'Liquidity' page so users can assess the pool they are choosing based on a simulated price movement they might expect...
// could take this a step further and pull up a table with all pools available with the same selected pair (ie. user selects 'IL Calculator' when in the SPv2 BUSD:SPARTA...
// pool and it brings up the PCS pair as well to compare the simulation directly against one-another)

// Calc trade size
const tradesize = (balanceTradedToken: BigNumber, tradeSize: BigNumber) =>
  balanceTradedToken.times(tradeSize.div("100")).times("2"); // *2 to get % of TVL, token A depth *2 = TVL when pool is balanced

// Calc token received
const tokenBOutput = (
  tokenAinput: BigNumber,
  tokenAdepth: BigNumber,
  tokenBdepth: BigNumber
) =>
  tokenAinput
    .times(tokenAdepth)
    .times(tokenBdepth)
    .div(tokenAinput.plus(tokenAdepth).times(tokenAinput.plus(tokenAdepth)));

// Calc token received Uniswap
const tokenBOutputUS = (
  tokenAinput: BigNumber,
  tokenAdepth: BigNumber,
  tokenBdepth: BigNumber,
  swapfee: BigNumber
) =>
  tokenAinput
    .times(tokenBdepth)
    .div(tokenAinput.plus(tokenAdepth))
    .times(BN("1").minus(swapfee.div("100")));

// Cal Rt (price of A in B)
const Rt = (tokenAdepth: BigNumber, tokenBdepth: BigNumber) =>
  tokenBdepth.div(tokenAdepth);

// Calc asset Price
const assetPrice = (initialPrice: BigNumber, pricemovePercentage: BigNumber) =>
  initialPrice.times(BN("1").plus(pricemovePercentage.div("100")));

// Calc TVL
const TVL = (
  tokenAdepth: BigNumber,
  tokenBdepth: BigNumber,
  priceA: BigNumber,
  priceB: BigNumber,
  pricemovementPercA: BigNumber,
  pricemovementPercB: BigNumber
) =>
  tokenAdepth
    .times(priceA)
    .times(BN("1").plus(pricemovementPercA.div("100")))
    .plus(
      tokenBdepth
        .times(priceB)
        .times(BN("1").plus(pricemovementPercB.div("100")))
    );

// Calc new Balance
function newBalance(
  tokeninputA: BigNumber,
  tokenBOutput: BigNumber,
  tokenAdepth: BigNumber,
  tokenBdepth: BigNumber,
  swap: boolean
) {
  if (swap === false) {
    // if swap is false then A tokens are swapped for B tokens
    tokenAdepth = tokenAdepth.plus(tokeninputA);
    tokenBdepth = tokenBdepth.minus(tokenBOutput);
  } else {
    // if swap is true then B tokens are swapped for A tokens
    tokenAdepth = tokenAdepth.minus(tokeninputA);
    tokenBdepth = tokenBdepth.plus(tokenBOutput);
  }
  return { newTokenAdepth: tokenAdepth, newTokenBdepth: tokenBdepth };
}

// MAIN function to calculate impermanent loss
export function ILcalcSP(
  initialAdepth: string,
  initialBdepth: string,
  initialPriceA: string,
  initialPriceB: string,
  pricemovementPercA: string,
  pricemovementPercB: string,
  tradeSizePercentage: string,
  fixedFeePerc: string,
  SlipFeeBasesModelTrue: boolean
) {
  const poolBalance = {
    NewBalancePoolA: BN("0"),
    NewBalancePoolB: BN("0"),
  };

  const _initialAdepth = BN(initialAdepth);
  const _initialBdepth = BN(initialBdepth);
  const _initialPriceA = BN(initialPriceA);
  const _initialPriceB = BN(initialPriceB);
  const _pricemovementPercA = BN(pricemovementPercA);
  const _pricemovementPercB = BN(pricemovementPercB);
  const _tradeSizePercentage = BN(tradeSizePercentage);
  const _fixedFeePerc = BN(fixedFeePerc);

  const _RtInitial = _initialBdepth.div(_initialAdepth).toFixed(9); // get initial Rt value (price of asset A in B)
  const _RtPumped = assetPrice(_initialPriceA, _pricemovementPercA)
    .div(assetPrice(_initialPriceB, _pricemovementPercB))
    .toFixed(9); // Get Rt when price movement occurs (pool depth A * token price A = pool depth B * token price B)
  let _RtReturned = _RtInitial; // Rt Returned will be used in loop
  poolBalance.NewBalancePoolA = _initialAdepth;
  poolBalance.NewBalancePoolB = _initialBdepth;
  const _initialTVL = TVL(
    _initialAdepth,
    _initialBdepth,
    _initialPriceA,
    _initialPriceB,
    _pricemovementPercA,
    _pricemovementPercB
  ); // Get initial TVL
  let _endTVL = BN("0");
  let _IL = BN("0");
  const arrPoolbehaviour = [
    {
      TVL: TVL(
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        _initialPriceA,
        _initialPriceB,
        _pricemovementPercA,
        _pricemovementPercB
      ), // set initial pool behaviour array. If no trades happen this value will be returned
      BalancePoolA: poolBalance.NewBalancePoolA,
      BalancePoolB: poolBalance.NewBalancePoolB,
      rt: _RtReturned,
      tokenInputA: BN("0"),
      TokenIntype: "",
      tokenOutputB: BN("0"),
      TokenOuttype: "",
      IL: BN("0"),
    },
  ];

  for (
    let i = 0;
    _RtInitial > _RtPumped ? _RtReturned > _RtPumped : _RtReturned < _RtPumped;
    i++
  ) {
    //do until actual Rt value is above( or below, depends of price movement direction) or equal to calculated pumped Rt
    let _tokeninput = BN("0");
    let _tokenOut = BN("0");
    let newPoolBalance = { newTokenAdepth: BN("0"), newTokenBdepth: BN("0") };
    let swap = false;

    if (_RtInitial > _RtPumped) {
      // if pumped Rt is smaller than initial Rt then add A tokens and remove B tokens from pool
      swap = false;
      _tokeninput = tradesize(
        poolBalance.NewBalancePoolA,
        _tradeSizePercentage
      );
      if (SlipFeeBasesModelTrue) {
        _tokenOut = tokenBOutput(
          _tokeninput,
          poolBalance.NewBalancePoolA,
          poolBalance.NewBalancePoolB
        );
      } else {
        _tokenOut = tokenBOutputUS(
          _tokeninput,
          poolBalance.NewBalancePoolA,
          poolBalance.NewBalancePoolB,
          _fixedFeePerc
        );
      }
      newPoolBalance = newBalance(
        _tokeninput,
        _tokenOut,
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        swap
      );
    } else if (_RtInitial < _RtPumped) {
      // if pumped Rt is bigger than initial Rt then add B tokens and remove A tokens from pool
      swap = true;
      _tokeninput = tradesize(
        poolBalance.NewBalancePoolB,
        _tradeSizePercentage
      );
      _tokenOut = tokenBOutput(
        _tokeninput,
        poolBalance.NewBalancePoolB,
        poolBalance.NewBalancePoolA
      );
      if (SlipFeeBasesModelTrue) {
        _tokenOut = tokenBOutput(
          _tokeninput,
          poolBalance.NewBalancePoolB,
          poolBalance.NewBalancePoolA
        );
      } else {
        _tokenOut = tokenBOutputUS(
          _tokeninput,
          poolBalance.NewBalancePoolB,
          poolBalance.NewBalancePoolA,
          _fixedFeePerc
        );
      }
      newPoolBalance = newBalance(
        _tokenOut,
        _tokeninput,
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        swap
      );
    } else {
      break;
    }

    const tokenInType = swap ? "token B" : "token A";
    const tokenOutType = !swap ? "token B" : "token A";

    poolBalance.NewBalancePoolA = newPoolBalance.newTokenAdepth;
    poolBalance.NewBalancePoolB = newPoolBalance.newTokenBdepth;
    _RtReturned = Rt(
      poolBalance.NewBalancePoolA,
      poolBalance.NewBalancePoolB
    ).toFixed(9);
    _endTVL = TVL(
      poolBalance.NewBalancePoolA,
      poolBalance.NewBalancePoolB,
      _initialPriceA,
      _initialPriceB,
      _pricemovementPercA,
      _pricemovementPercB
    );
    arrPoolbehaviour[i] = {
      TVL: TVL(
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        _initialPriceA,
        _initialPriceB,
        _pricemovementPercA,
        _pricemovementPercB
      ),
      BalancePoolA: poolBalance.NewBalancePoolA,
      BalancePoolB: poolBalance.NewBalancePoolB,
      rt: _RtReturned,
      tokenInputA: _tokeninput,
      TokenIntype: tokenInType,
      tokenOutputB: _tokenOut,
      TokenOuttype: tokenOutType,
      IL: _endTVL.div(_initialTVL).minus("1").times("10000").div("100"),
    };
  }

  _endTVL = TVL(
    poolBalance.NewBalancePoolA,
    poolBalance.NewBalancePoolB,
    _initialPriceA,
    _initialPriceB,
    _pricemovementPercA,
    _pricemovementPercB
  ); // get end TVL
  _IL = _endTVL.div(_initialTVL).minus("1").times("10000").div("100"); // TODO: Check if this is meant to be used? Its currently floating and not returned at all
  return arrPoolbehaviour;
}

// MAIN function to simulate multiple trades
export function multiTrade(
  initialAdepth: string,
  initialBdepth: string,
  initialPriceA: string,
  initialPriceB: string,
  pricemovementPercA: string[],
  pricemovementPercB: string[],
  tradeSizePercentages: string[],
  fixedFeePerc: string,
  SlipFeeBasesModelTrue: boolean,
  amountOfRepeatablePM: string
) {
  // Type conversions
  const _amountOfRepeatablePM = Number(amountOfRepeatablePM);

  const arrReturnedValues = [];
  let returnedPoolCondition = [];
  const _initialPriceA = BN(initialPriceA);
  const _initialPriceB = BN(initialPriceB);
  let _initialAdepth = BN(initialAdepth);
  let _initialBdepth = BN(initialBdepth);
  const storeInitialAdepth = _initialAdepth;
  const storeInitialBdepth = _initialBdepth;
  let totalAmountOfTrades = 0;

  for (let i = 0; i < _amountOfRepeatablePM; i++) {
    // do for amount of repeatable price movements
    returnedPoolCondition = ILcalcSP(
      initialAdepth,
      initialBdepth,
      initialPriceA,
      initialPriceB,
      pricemovementPercA[i] ?? "0",
      pricemovementPercB[i] ?? "0",
      tradeSizePercentages[i] ?? "0",
      fixedFeePerc,
      SlipFeeBasesModelTrue
    );
    returnedPoolCondition = multiTradeImpLossCalc(
      returnedPoolCondition,
      BN(pricemovementPercA[i] ?? "0"),
      BN(pricemovementPercB[i] ?? "0"),
      storeInitialAdepth,
      storeInitialBdepth,
      _initialPriceA,
      _initialPriceB
    );
    arrReturnedValues.push(...returnedPoolCondition);
    _initialAdepth =
      returnedPoolCondition[returnedPoolCondition.length - 1]?.BalancePoolA ??
      BN("0"); // update initial depth value after IL calculation of each individual repeatable price movement
    _initialBdepth =
      returnedPoolCondition[returnedPoolCondition.length - 1]?.BalancePoolB ??
      BN("0");
    totalAmountOfTrades = arrReturnedValues.length; // store the amount of trades needed to reach the pool balance after each individual PM
  }

  const _initialTVL = TVL(
    storeInitialAdepth,
    storeInitialBdepth,
    _initialPriceA,
    _initialPriceB,
    BN(pricemovementPercA[_amountOfRepeatablePM - 1] ?? "0"),
    BN(pricemovementPercB[_amountOfRepeatablePM - 1] ?? "0")
  );
  const _endTVL = TVL(
    arrReturnedValues[arrReturnedValues.length - 1]?.BalancePoolA ?? BN("0"),
    arrReturnedValues[arrReturnedValues.length - 1]?.BalancePoolB ?? BN("0"),
    _initialPriceA,
    _initialPriceB,
    BN(pricemovementPercA[_amountOfRepeatablePM - 1] ?? "0"),
    BN(pricemovementPercB[_amountOfRepeatablePM - 1] ?? "0")
  );
  const _IL = _endTVL.div(_initialTVL).minus("1").times("10000").div("100");
  const IL = _IL.toFixed(2).toString();
  const text = [
    {
      text: "",
      value: [""],
    },
  ];
  text[0] = { text: "multi trade parameters", value: [""] };
  text.push({
    text: "Amount of repeatable price movements = ",
    value: [amountOfRepeatablePM],
  });
  text.push({
    text: "Repeatable price movements in percentage of asset A (%) = ",
    value: pricemovementPercA,
  });
  text.push({
    text: "Repeatable price movements in percentage of asset B (%) = ",
    value: pricemovementPercB,
  });
  text.push({
    text: "Amount of trades needed to rebalance pool = ",
    value: [totalAmountOfTrades.toString()],
  });
  text.push({ text: "IL(%) (+ is gain, - is loss) = ", value: [IL + " %"] });
  return { arrReturnedValues, IL, text };
}

// Correct IL for multitrade
function multiTradeImpLossCalc(
  returnedPoolCondition: {
    TVL: BigNumber;
    BalancePoolA: BigNumber;
    BalancePoolB: BigNumber;
    rt: string;
    tokenInputA: BigNumber;
    TokenIntype: string;
    tokenOutputB: BigNumber;
    TokenOuttype: string;
    IL: BigNumber;
  }[],
  pricemovementPercA: BigNumber,
  pricemovementPercB: BigNumber,
  initialAdepth: BigNumber,
  initialBdepth: BigNumber,
  initialPriceA: BigNumber,
  initialPriceB: BigNumber
) {
  for (let i = 0; i < returnedPoolCondition.length; i++) {
    const actualTVL = TVL(
      returnedPoolCondition[i]?.BalancePoolA ?? BN("0"),
      returnedPoolCondition[i]?.BalancePoolB ?? BN("0"),
      initialPriceA,
      initialPriceB,
      pricemovementPercA,
      pricemovementPercB
    );
    const initialTVL = TVL(
      initialAdepth,
      initialBdepth,
      initialPriceA,
      initialPriceB,
      pricemovementPercA,
      pricemovementPercB
    );
    const _tvl = actualTVL.div(initialTVL).minus("1").times("10000").div("100");
    const _retPoolCondItem = returnedPoolCondition[i] ?? {
      TVL: BN("0"),
      BalancePoolA: BN("0"),
      BalancePoolB: BN("0"),
      rt: "",
      tokenInputA: BN("0"),
      TokenIntype: "",
      tokenOutputB: BN("0"),
      TokenOuttype: "",
      IL: BN("0"),
    };
    _retPoolCondItem.IL = _tvl;
    returnedPoolCondition[i] = _retPoolCondItem;
  }
  return returnedPoolCondition;
}
