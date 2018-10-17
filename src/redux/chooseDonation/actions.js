export const CHOOSE_DONATION = 'CHOOSE_DONATION'
export const CHOOSE_DONATION_STARTED = 'CHOOSE_DONATION_STARTED'
export const CHOOSE_DONATION_SUCCEEDED = 'CHOOSE_DONATION_SUCCEEDED'
export const CHOOSE_DONATION_FAILED = 'CHOOSE_DONATION_FAILED'

export const chooseDonation = (data) => ({
  type: CHOOSE_DONATION,
  payload: data,
})