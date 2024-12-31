import { Currency } from 'src/about-plan/plandetail/plandetail.entity';

/**
 * 총 비용을 다른 통화로 변환하는 로직
 * @param totalExpenses 기존 총 비용 (KRW 기준)
 * @param fromCurrency 기존 통화
 * @param toCurrency 변환할 통화
 * @returns 변환된 총 비용
 */
export function convertTotalExpenses(
  totalExpenses: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): number {
  const exchangeRates = {
    USD: 1,
    KRW: 1350,
    EUR: 0.92,
    JPY: 145,
  };

  const convertedExpenses =
    totalExpenses * (exchangeRates[toCurrency] / exchangeRates[fromCurrency]);

  return parseFloat(convertedExpenses.toFixed(2)); // 소수점 2자리까지 반올림
}
