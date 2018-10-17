import { createReducer, createLeaf } from 'redux-action-helper'

import {
  SAFE_REDEEM_ORDER_STARTED,
  SAFE_REDEEM_ORDER_SUCCEEDED,
  SAFE_REDEEM_ORDER_FAILED,
} from './actions'

const initialState = {
  running: false,
  response: null,
  error: null,
}

const safeRedeemOrderStarted = createLeaf(SAFE_REDEEM_ORDER_STARTED, (state, action) => ({
  ...state,
  running: true,
  response: null,
  error: null,
}))

const safeRedeemOrderSucceeded = createLeaf(SAFE_REDEEM_ORDER_SUCCEEDED, (state, action) => ({
  ...state,
  running: false,
  response: action.payload,
}))

const safeRedeemOrderFailed = createLeaf(SAFE_REDEEM_ORDER_FAILED, (state, action) => ({
  ...state,
  running: false,
  error: action.payload,
}))

export default createReducer(initialState, {
  safeRedeemOrderStarted,
  safeRedeemOrderSucceeded,
  safeRedeemOrderFailed,
});
