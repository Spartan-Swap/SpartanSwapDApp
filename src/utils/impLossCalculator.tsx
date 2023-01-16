// TODO: Convert to TSX
// TODO: Convert pretty much all types to BigNumber to ensure precise arithmetic (JS integer limitations)
// TODO: Move + rename file based on where this calculator/simulator will live in the DApp (probably components/poolSimulator/simulator.tsx)
// TODO: Make this a component (maybe inside a Modal for now)
// TODO: Embed this component in a page of its own (maybe 'tools'?)

// TODO: Link to this component onClick on the 'Liquidity' page so users can assess the pool they are choosing based on a simulated price movement they might expect...
// could take this a step further and pull up a table with all pools available with the same selected pair (ie. user selects 'IL Calculator' when in the SPv2 BUSD:SPARTA...
// pool and it brings up the PCS pair as well to compare the simulation directly against one-another)

// Calc trade size
const tradesize = (balanceTradedToken: number, tradeSize: number) =>
  balanceTradedToken * tradeSize * 2; // *2 to get % of TVL, token A depth *2 = TVL when pool is balanced

// Calc token received
const tokenBOutput = (tokenAinput: number, tokenAdepth: number, tokenBdepth: number) =>
  (tokenAinput * tokenAdepth * tokenBdepth) /
  Math.pow(tokenAinput + tokenAdepth, 2);

// Calc token received Uniswap
const tokenBOutputUS = (tokenAinput: number, tokenAdepth: number, tokenBdepth: number, swapfee: number) =>
  ((tokenAinput * tokenBdepth) / (tokenAinput + tokenAdepth)) * (1 - swapfee);

// Cal Rt (price of A in B)
const Rt = (tokenAdepth: number, tokenBdepth: number) => tokenBdepth / tokenAdepth;

// Calc asset Price
const assetPrice = (initialPrice: number, pricemovePercentage: number) =>
  initialPrice * (1 + pricemovePercentage / 100);

// Calc TVL
const TVL = (
  tokenAdepth: number,
  tokenBdepth: number,
  priceA: number,
  priceB: number,
  pricemovementPercA: number,
  pricemovementPercB: number
) =>
  tokenAdepth * priceA * (1 + pricemovementPercA / 100) +
  tokenBdepth * priceB * (1 + pricemovementPercB / 100);

// Calc new Balance
function newBalance(tokeninputA: number, tokenBOutput: number, tokenAdepth: number, tokenBdepth: number, swap: boolean) {
  if (swap === false) {
    // if swap is false then A tokens are swapped for B tokens
    tokenAdepth += tokeninputA;
    tokenBdepth -= tokenBOutput;
  } else {
    // if swap is true then B tokens are swapped for A tokens
    tokenAdepth -= tokeninputA;
    tokenBdepth += tokenBOutput;
  }
  return { newTokenAdepth: tokenAdepth, newTokenBdepth: tokenBdepth };
}

// MAIN function to calculate impermanent loss
export function ILcalcSP(
  initialAdepth: number,
  initialBdepth: number,
  initialPriceA: number,
  initialPriceB: number,
  pricemovementPercA: number,
  pricemovementPercB: number,
  tradeSizePercentage: number,
  fixedFeePerc: number,
  SlipFeeBasesModelTrue: boolean
) {
  const poolBalance = {
    NewBalancePoolA: 0,
    NewBalancePoolB: 0,
  };

  const RtInitial = (initialBdepth / initialAdepth).toFixed(9); // get initial Rt value (price of asset A in B)
  const RtPumped = (
    assetPrice(initialPriceA, pricemovementPercA) /
    assetPrice(initialPriceB, pricemovementPercB)
  ).toFixed(9); // Get Rt when price movement occurs (pool depth A * token price A = pool depth B * token price B)
  let RtReturned = RtInitial; // Rt Returned will be used in loop
  poolBalance.NewBalancePoolA = initialAdepth;
  poolBalance.NewBalancePoolB = initialBdepth;
  const initialTVL = TVL(
    initialAdepth,
    initialBdepth,
    initialPriceA,
    initialPriceB,
    pricemovementPercA,
    pricemovementPercB
  ); // Get initial TVL
  let endTVL = 0;
  let IL = 0;
  const arrPoolbehaviour = [
    {
      TVL: TVL(
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        initialPriceA,
        initialPriceB,
        pricemovementPercA,
        pricemovementPercB
      ), // set initial pool behaviour array. If no trades happen this value will be returned
      BalancePoolA: poolBalance.NewBalancePoolA,
      BalancePoolB: poolBalance.NewBalancePoolB,
      rt: RtReturned,
      tokenInputA: 0,
      tokenOutputB: 0,
      IL: 0,
    },
  ];

  for (
    let i = 0;
    RtInitial > RtPumped ? RtReturned > RtPumped : RtReturned < RtPumped;
    i++
  ) {
    //do until actual Rt value is above( or below, depends of price movement direction) or equal to calculated pumped Rt
    let tokeninput = 0;
    let tokenOut = 0;
    let newPoolBalance = { newTokenAdepth: 0, newTokenBdepth: 0 };
    let swap = false;

    if (RtInitial > RtPumped) {
      // if pumped Rt is smaller than initial Rt then add A tokens and remove B tokens from pool
      swap = false;
      tokeninput = tradesize(
        poolBalance.NewBalancePoolA,
        tradeSizePercentage / 100
      );
      if (SlipFeeBasesModelTrue) {
        tokenOut = tokenBOutput(
          tokeninput,
          poolBalance.NewBalancePoolA,
          poolBalance.NewBalancePoolB
        );
      } else {
        tokenOut = tokenBOutputUS(
          tokeninput,
          poolBalance.NewBalancePoolA,
          poolBalance.NewBalancePoolB,
          fixedFeePerc / 100
        );
      }
      newPoolBalance = newBalance(
        tokeninput,
        tokenOut,
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        swap
      );
    } else if (RtInitial < RtPumped) {
      // if pumped Rt is bigger than initial Rt then add B tokens and remove A tokens from pool
      swap = true;
      tokeninput = tradesize(
        poolBalance.NewBalancePoolB,
        tradeSizePercentage / 100
      );
      tokenOut = tokenBOutput(
        tokeninput,
        poolBalance.NewBalancePoolB,
        poolBalance.NewBalancePoolA
      );
      if (SlipFeeBasesModelTrue) {
        tokenOut = tokenBOutput(
          tokeninput,
          poolBalance.NewBalancePoolB,
          poolBalance.NewBalancePoolA
        );
      } else {
        tokenOut = tokenBOutputUS(
          tokeninput,
          poolBalance.NewBalancePoolB,
          poolBalance.NewBalancePoolA,
          fixedFeePerc / 100
        );
      }
      newPoolBalance = newBalance(
        tokenOut,
        tokeninput,
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        swap
      );
    } else {
      break;
    }

    poolBalance.NewBalancePoolA = newPoolBalance.newTokenAdepth;
    poolBalance.NewBalancePoolB = newPoolBalance.newTokenBdepth;
    RtReturned = Rt(
      poolBalance.NewBalancePoolA,
      poolBalance.NewBalancePoolB
    ).toFixed(9);
    endTVL = TVL(
      poolBalance.NewBalancePoolA,
      poolBalance.NewBalancePoolB,
      initialPriceA,
      initialPriceB,
      pricemovementPercA,
      pricemovementPercB
    );
    arrPoolbehaviour[i] = {
      TVL: TVL(
        poolBalance.NewBalancePoolA,
        poolBalance.NewBalancePoolB,
        initialPriceA,
        initialPriceB,
        pricemovementPercA,
        pricemovementPercB
      ),
      BalancePoolA: poolBalance.NewBalancePoolA,
      BalancePoolB: poolBalance.NewBalancePoolB,
      rt: RtReturned,
      tokenInputA: tokeninput,
      tokenOutputB: tokenOut,
      IL: Math.round((endTVL / initialTVL - 1) * 10000) / 100,
    };
  }

  endTVL = TVL(
    poolBalance.NewBalancePoolA,
    poolBalance.NewBalancePoolB,
    initialPriceA,
    initialPriceB,
    pricemovementPercA,
    pricemovementPercB
  ); // get end TVL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IL = Math.round((endTVL / initialTVL - 1) * 10000) / 100; // TODO: Check if this is meant to be used? Its currently floating and not returned at all
  return arrPoolbehaviour;
}

// MAIN function to simulate multiple trades
export function multiTrade(
  initialAdepth: number,
  initialBdepth: number,
  initialPriceA: number,
  initialPriceB: number,
  pricemovementPercA: number[],
  pricemovementPercB: number[],
  tradeSizePercentages: number[],
  fixedFeePerc: number,
  SlipFeeBasesModelTrue: boolean,
  amountOfRepeatablePM: number
) {
  const arrReturnedValues = [];
  let returnedPoolCondition = [];
  const storeInitialAdepth = initialAdepth;
  const storeInitialBdepth = initialBdepth;
  let totalAmountOfTrades = 0;

  for (let i = 0; i < amountOfRepeatablePM; i++) {
    // do for amount of repeatable price movements
    returnedPoolCondition = ILcalcSP(
      initialAdepth,
      initialBdepth,
      initialPriceA,
      initialPriceB,
      pricemovementPercA[i] ?? 0,
      pricemovementPercB[i] ?? 0,
      tradeSizePercentages[i] ?? 0,
      fixedFeePerc,
      SlipFeeBasesModelTrue
    );
    arrReturnedValues.push(...returnedPoolCondition);
    initialAdepth =
      returnedPoolCondition[returnedPoolCondition.length - 1]?.BalancePoolA ?? 0; // update initial depth value after IL calculation of each individual repeatable price movement
    initialBdepth =
      returnedPoolCondition[returnedPoolCondition.length - 1]?.BalancePoolB ?? 0;
    totalAmountOfTrades = arrReturnedValues.length; // store the amount of trades needed to reach the pool balance after each individual PM
  }
  const initialTVL = TVL(
    storeInitialAdepth,
    storeInitialBdepth,
    initialPriceA,
    initialPriceB,
    pricemovementPercA[amountOfRepeatablePM - 1] ?? 0,
    pricemovementPercB[amountOfRepeatablePM - 1] ?? 0
  );
  const endTVL = TVL(
    arrReturnedValues[arrReturnedValues.length - 1]?.BalancePoolA ?? 0,
    arrReturnedValues[arrReturnedValues.length - 1]?.BalancePoolB ?? 0,
    initialPriceA,
    initialPriceB,
    pricemovementPercA[amountOfRepeatablePM - 1] ?? 0,
    pricemovementPercB[amountOfRepeatablePM - 1] ?? 0
  );
  const IL = ((endTVL / initialTVL - 1) * 10000) / 100;
  const text = [
    {
      text: '',
      value: [0],
    },
  ];
  text[0] = { text: "multi trade parameters", value: [0] };
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
    value: [totalAmountOfTrades],
  });
  text.push({ text: "IL(%) (+ is gain, - is loss) = ", value: [IL] });
  return { arrReturnedValues, IL, text };
}
