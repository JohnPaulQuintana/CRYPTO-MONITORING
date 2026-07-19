import { useState, useMemo, useCallback, memo } from "react";
import { useTrends } from "../hooks/useTrends";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  Globe,
  Calendar,
  Filter,
} from "lucide-react";

// Memoized chart component to prevent unnecessary re-renders
const ChartRenderer = memo(({ data, chartType, timeRange, filterDataByTimeRange }: any) => {
  const filteredData = useMemo(() => filterDataByTimeRange(data), [data, timeRange]);
  
  const formatTime = useCallback((value: string) => {
    const date = new Date(value);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }, []);

  const formatFullDateTime = useCallback((value: string) => {
    const date = new Date(value);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, []);

  const ChartComponent = useMemo(() => {
    return chartType === "line"
      ? LineChart
      : chartType === "bar"
        ? BarChart
        : AreaChart;
  }, [chartType]);

  const DataComponent = useMemo(() => {
    return chartType === "line" ? Line : chartType === "bar" ? Bar : Area;
  }, [chartType]);

  // Memoize tooltip content
  const TooltipContent = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-4 min-w-[220px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">
              {formatFullDateTime(label)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Exchange Rate</span>
              <span className="text-sm font-semibold text-slate-900">
                ${dataPoint.exchange_rate?.toFixed(4)}
              </span>
            </div>
            {dataPoint.volume && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Volume</span>
                <span className="text-sm font-semibold text-slate-900">
                  {dataPoint.volume}
                </span>
              </div>
            )}
            {dataPoint.high && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">High</span>
                <span className="text-sm font-semibold text-emerald-600">
                  ${dataPoint.high.toFixed(4)}
                </span>
              </div>
            )}
            {dataPoint.low && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Low</span>
                <span className="text-sm font-semibold text-rose-600">
                  ${dataPoint.low.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  }, [formatFullDateTime]);

  // Memoize chart data to prevent re-renders
  const chartData = useMemo(() => filteredData, [filteredData]);

  return (
    <ChartComponent data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis
        dataKey="date"
        tickFormatter={formatTime}
        stroke="#94a3b8"
        fontSize={12}
        interval={Math.floor(chartData.length / 10)}
        tick={{ dy: 5 }}
      />
      <YAxis stroke="#94a3b8" fontSize={12} width={60} />
      <Tooltip
        wrapperStyle={{ 
          zIndex: 1000,
          pointerEvents: 'none'
        }}
        position={{ y: 0 }}
        content={TooltipContent}
      />
      <DataComponent
        type="monotone"
        dataKey="exchange_rate"
        stroke="#059669"
        strokeWidth={chartType === "line" ? 3 : 2}
        fill={chartType === "area" ? "url(#gradient)" : "transparent"}
        dot={chartType === "line"}
        activeDot={{ r: 6, fill: "#059669" }}
        isAnimationActive={false}
      />
      {chartType === "area" && (
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
    </ChartComponent>
  );
});

ChartRenderer.displayName = 'ChartRenderer';

// Memoized Metric Card
const MetricCard = memo(({ title, value, icon: Icon, subtitle, color = "emerald" }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <Icon className={`w-5 h-5 text-${color}-600`} />
    </div>
    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
  </div>
));

MetricCard.displayName = 'MetricCard';

export default function TrendDashboard() {
  const { trends, loading } = useTrends();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("1M");

  const brands = Object.keys(trends);
  const activeBrand = selectedBrand || brands[0] || "";
  const cryptos = Object.keys(trends[activeBrand] || {});
  const activeCrypto = selectedCrypto || cryptos[0] || "";
  const currencies = trends[activeBrand]?.[activeCrypto] || {};

  // Memoize filter function
  const filterDataByTimeRange = useCallback((data: any[]) => {
    if (timeRange === "ALL") return data;
    
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case "1M":
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoff;
    });
  }, [timeRange]);

  // Calculate metrics with useMemo and debounced updates
  const metrics = useMemo(() => {
    const entries = Object.entries(currencies);
    let total = 0;
    let highest = 0;
    let lowest = Infinity;
    let changes: Record<string, number> = {};

    entries.forEach(([currency, data]) => {
      const filteredData = filterDataByTimeRange(data);
      const values = filteredData.map((d: any) => d.exchange_rate);

      if (values.length === 0) return;

      const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      const current = values[values.length - 1];
      const previous = values[values.length - 2] || current;

      let change = 0;
      if (previous !== 0) {
        const rawChange = ((current - previous) / previous) * 100;
        change = Math.max(-100, Math.min(100, rawChange));
      }

      total += avg;
      if (max > highest) highest = max;
      if (min < lowest) lowest = min;
      changes[currency] = Number(change.toFixed(2));
    });

    return {
      avgRate: entries.length ? total / entries.length : 0,
      highest,
      lowest: lowest === Infinity ? 0 : lowest,
      changes,
      totalCurrencies: entries.length,
    };
  }, [currencies, filterDataByTimeRange]);

  // Memoized helper functions
  const getChangeColor = useCallback((change: number) => {
    if (change > 0) return "text-emerald-600";
    if (change < 0) return "text-rose-600";
    return "text-slate-500";
  }, []);

  const getChangeBgColor = useCallback((change: number) => {
    if (change > 0) return "bg-emerald-50 border-emerald-200";
    if (change < 0) return "bg-rose-50 border-rose-200";
    return "bg-slate-50 border-slate-200";
  }, []);

  const getChangeIcon = useCallback((change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  }, []);

  // Handle brand change with useCallback
  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedCrypto("");
  }, []);

  // Handle crypto change with useCallback
  const handleCryptoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrypto(e.target.value);
  }, []);

  // Handle time range change with useCallback
  const handleTimeRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as any);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading market trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6 lg:px-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Sticky Main Header */}
        <div className="sticky top-0 z-50 bg-emerald-700/10 backdrop-blur-lg rounded-2xl border border-emerald-200/50 shadow-sm p-4 mb-8 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Activity className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Crypto Market Pulse
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4" />
                    Real-time exchange rate analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100 rounded-xl p-1">
                {(["area", "line", "bar"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      chartType === type
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-white/50"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-700 text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                >
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                  <option value="ALL">All Time</option>
                </select>
              </div>

              <select
                value={activeBrand}
                onChange={handleBrandChange}
                className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-700 text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                value={activeCrypto}
                onChange={handleCryptoChange}
                className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-700 text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              >
                {cryptos.map((crypto) => (
                  <option key={crypto} value={crypto}>
                    {crypto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Average Rate"
            value={`$${metrics.avgRate.toFixed(4)}`}
            icon={DollarSign}
            subtitle="Across all currencies"
          />
          <MetricCard
            title="Highest Rate"
            value={`$${metrics.highest.toFixed(4)}`}
            icon={TrendingUp}
            subtitle="Peak value"
            color="emerald"
          />
          <MetricCard
            title="Lowest Rate"
            value={`$${metrics.lowest.toFixed(4)}`}
            icon={TrendingDown}
            subtitle="Minimum value"
            color="rose"
          />
          <MetricCard
            title="Coverage"
            value={metrics.totalCurrencies}
            icon={BarChart3}
            subtitle="Active currencies"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Object.entries(currencies).map(([currency, data]) => {
            const filteredData = filterDataByTimeRange(data);
            const change = metrics.changes[currency] || 0;
            const isPositive = change >= 0;
            const currentRate = filteredData[filteredData.length - 1]?.exchange_rate || 0;

            return (
              <div
                key={currency}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="sticky top-0 z-10 bg-emerald-700/10 backdrop-blur-sm border-b border-emerald-200/50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {currency}
                      </h2>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getChangeBgColor(change)}`}
                      >
                        {getChangeIcon(change)}
                        <span className={getChangeColor(change)}>
                          {change !== 0
                            ? `${isPositive ? "+" : ""}${change.toFixed(2)}%`
                            : "0.00%"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          Current Rate
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          ${currentRate.toFixed(4)}
                        </p>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          {timeRange === "ALL" ? "Change" : `${timeRange} Change`}
                        </p>
                        <p
                          className={`text-base font-bold ${getChangeColor(change)}`}
                        >
                          {change !== 0
                            ? `${isPositive ? "+" : ""}${change.toFixed(2)}%`
                            : "0.00%"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4">
                  <div className="h-[340px] overflow-x-auto custom-scroll">
                    <div className="min-w-[2000px] h-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <ChartRenderer
                          data={data}
                          chartType={chartType}
                          timeRange={timeRange}
                          filterDataByTimeRange={filterDataByTimeRange}
                        />
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-200 pt-6">
          <p className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            Data updates every 5 minutes • All rates are indicative
          </p>
        </div>
      </div>
    </div>
  );
}