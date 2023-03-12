import { configureStore } from '@reduxjs/toolkit'
import swapReducer from './swapStore'

export const store = configureStore({
  reducer: {
    swap: swapReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {swap: swapState, web3: web3State, etc: etcState ...}
export type AppDispatch = typeof store.dispatch