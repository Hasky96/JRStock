import { data } from "autoprefixer";

export const trimResultSummary = ({
  test_start_date,
  test_end_date,
  asset,
  final_asset,
  final_earn,
  final_rate,
  avg_day_earn_rate,
  avg_year_earn_rate,
  market_over_rate,
  mdd,
  trading_days,
  win_lose_rate,
}) => {
  if (final_earn) {
    return {
      assetResult: [
        parseInt(asset).toLocaleString(),
        parseInt(final_asset).toLocaleString(),
        parseInt(final_earn).toLocaleString(),
        test_end_date,
        test_start_date,
        trading_days,
      ],
      profitResult: [
        final_rate,
        market_over_rate,
        win_lose_rate,
        avg_day_earn_rate,
        avg_year_earn_rate,
        mdd,
      ],
    };
  }
  return {
    assetResult: {},
  };
};

export const trimDaily = async (data) => {
  const lineChartData = [];
  const barChartData = [];

  await data.forEach(({ date, current_asset, day_earn }, index) => {
    lineChartData.push({ time: date, value: current_asset });
    barChartData.push({ time: date, value: day_earn });
  });

  return {
    lineChartData,
    barChartData,
  };
};

export const trimAnnually = async (data) => {
  const labels = [];
  const marketData = [];
  const backtestData = [];

  await data.forEach(({ year, year_rate, market_rate }, index) => {
    labels.push(year);
    marketData.push(market_rate);
    backtestData.push(year_rate);
  });

  return {
    labels,
    marketData,
    backtestData,
  };
};
