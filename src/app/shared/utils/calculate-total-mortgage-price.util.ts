const REPAYMENT_PER_YEAR: number = 0.02;
const MONTHS_NUMBER: number  = 12;

export default function calculateTotalMortgagePrice(currentAffordPrice: number, debitInterest: number ): number {
  return Math.round(currentAffordPrice / ((debitInterest + REPAYMENT_PER_YEAR) / MONTHS_NUMBER));
}
