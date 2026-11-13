import React, { useState } from 'react';
import {
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Sliders,
  BarChart2,
  PieChart as PieIcon,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Clock,
  Gauge,
  Info
} from 'lucide-react';

interface EnergyMonitoringProps {
  plantName: string;
}

export const EnergyMonitoringPage: React.FC<EnergyMonitoringProps> = ({ plantName }) => {
  // Filters & State
  const [timeGranularity, setTimeGranularity] = useState<'day' | 'month' | 'year'>('day');
  const [selectedMedium, setSelectedMedium] = useState<'all' | 'electricity' | 'cooling' | 'pv_self' | 'storage'>('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState<'all' | 'chiller' | 'compressor' | 'pcs' | 'pv_inv' | 'charger'>('all');
  const [warningFilter, setWarningFilter] = useState<'all' | 'critical' | 'moderate' | 'mild'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [efficiencyMetricMode, setEfficiencyMetricMode] = useState<'cop' | 'load_rate' | 'power_factor'>('cop');
  const [warningMetricMode, setWarningMetricMode] = useState<'count' | 'overload_kwh'>('count');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; time: string; value: number; type: string } | null>(null);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<any | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Recent Dates Descending Record Items (Strictly recent 2026-10-16 downwards)
  const monitoringRecords = [
    {
      id: 'EM-20261016-01',
      time: '2026-10-16 15:30:00',
      circuit: '10kV 1# 进线动力母线',
      type: '生产动力用电',
      realtimeLoad: 1245.8,
      accumulatedKWh: 4892.5,
      powerFactor: 0.988,
      copRate: '98.5% (一级能效)',
      status: '正常运行',
      statusType: 'normal',
      warning: '无告警',
      advice: '负荷平稳，处峰段经济运行区'
    },
    {
      id: 'EM-20261016-02',
      time: '2026-10-16 14:15:00',
      circuit: '中央空调节能制冷机组 #2',
      type: '空调通风暖通',
      realtimeLoad: 485.2,
      accumulatedKWh: 2160.0,
      powerFactor: 0.952,
      copRate: '5.86 COP (超高效)',
      status: '高负荷预警',
      statusType: 'warning',
      warning: '接近额定功率 92%',
      advice: '建议开启 3# 备用辅机分担冷负荷'
    },
    {
      id: 'EM-20261016-03',
      time: '2026-10-16 12:40:00',
      circuit: '储能变流器仓 PCS-01',
      type: '储能充放调节',
      realtimeLoad: -500.0,
      accumulatedKWh: 1850.4,
      powerFactor: 0.999,
      copRate: '93.2% (综合转换)',
      status: '放电支撑中',
      statusType: 'normal',
      warning: '无告警',
      advice: '执行尖峰顶峰放电调度，削峰获益'
    },
    {
      id: 'EM-20261016-04',
      time: '2026-10-16 11:20:00',
      circuit: '分布式光伏集中并网柜 #3',
      type: '绿色新能源',
      realtimeLoad: 880.6,
      accumulatedKWh: 3410.2,
      powerFactor: 0.995,
      copRate: '98.8% (MPPT追踪)',
      status: '光伏顶峰发电',
      statusType: 'normal',
      warning: '无告警',
      advice: '辐照充足，园区自发自用率 100%'
    },
    {
      id: 'EM-20261016-05',
      time: '2026-10-16 09:50:00',
      circuit: '空压机动力联控总站',
      type: '动力辅助用能',
      realtimeLoad: 310.4,
      accumulatedKWh: 1280.6,
      powerFactor: 0.915,
      copRate: '87.4% (一般能效)',
      status: '轻度能效劣化',
      statusType: 'mild_alert',
      warning: '排气压力浮动超差 5%',
      advice: '检测管路压降，择机清洗进气滤网'
    },
    {
      id: 'EM-20261016-06',
      time: '2026-10-16 08:30:00',
      circuit: '超充桩智能配电岛 #A',
      type: '交通充电负荷',
      realtimeLoad: 640.0,
      accumulatedKWh: 1980.0,
      powerFactor: 0.982,
      copRate: '96.2% (整流效率)',
      status: '充电高峰',
      statusType: 'normal',
      warning: '无告警',
      advice: '柔性功率池动态分配中'
    },
    {
      id: 'EM-20261015-01',
      time: '2026-10-15 22:30:00',
      circuit: '储能仓电池舱 PACK-02',
      type: '夜间谷电储能',
      realtimeLoad: 500.0,
      accumulatedKWh: 3200.0,
      powerFactor: 0.998,
      copRate: '94.0% (充电充入)',
      status: '谷段充电',
      statusType: 'normal',
      warning: '无告警',
      advice: '0.31元低谷电价充能完成'
    },
    {
      id: 'EM-20261015-02',
      time: '2026-10-15 19:15:00',
      circuit: '精密恒温恒湿洁净车间回路',
      type: '关键生产保障',
      realtimeLoad: 720.5,
      accumulatedKWh: 4120.8,
      powerFactor: 0.978,
      copRate: '95.1% (一级能效)',
      status: '晚高峰平稳',
      statusType: 'normal',
      warning: '无告警',
      advice: '温湿度控制精度 ±0.2℃'
    },
    {
      id: 'EM-20261015-03',
      time: '2026-10-15 15:45:00',
      circuit: '循环冷却水塔变频泵组 #1',
      type: '动力水循环',
      realtimeLoad: 185.0,
      accumulatedKWh: 940.2,
      powerFactor: 0.920,
      copRate: '89.6% (二级能效)',
      status: '正常运行',
      statusType: 'normal',
      warning: '无告警',
      advice: '根据室外湿球温度动态调频'
    },
    {
      id: 'EM-20261014-01',
      time: '2026-10-14 16:20:00',
      circuit: '10kV 2# 备用自投母线',
      type: '备用保安回路',
      realtimeLoad: 12.4,
      accumulatedKWh: 85.0,
      powerFactor: 0.880,
      copRate: '90.0% (待机状态)',
      status: '热备用',
      statusType: 'normal',
      warning: '空载轻度无功',
      advice: '合闸无功补偿支路，提升功率因数'
    }
  ];

  const filteredRecords = monitoringRecords.filter(r => {
    if (warningFilter === 'critical' && r.statusType !== 'critical') return false;
    if (warningFilter === 'moderate' && r.statusType !== 'warning') return false;
    if (warningFilter === 'mild' && r.statusType !== 'mild_alert') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return r.circuit.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Chart 1: Energy Trend Data (Hour breakdown for day, day breakdown for month, month for year)
  const trendDataDay = [
    { time: '00:00', load: 1120, baseline: 1200, pv: 0, tag: '谷段' },
    { time: '02:00', load: 1080, baseline: 1150, pv: 0, tag: '谷段' },
    { time: '04:00', load: 1050, baseline: 1100, pv: 0, tag: '谷段' },
    { time: '06:00', load: 1250, baseline: 1280, pv: 40, tag: '平段' },
    { time: '08:00', load: 2450, baseline: 2500, pv: 280, tag: '平段' },
    { time: '10:00', load: 3890, baseline: 4100, pv: 650, tag: '尖峰' },
    { time: '12:00', load: 3620, baseline: 3800, pv: 890, tag: '平段' },
    { time: '14:00', load: 4850, baseline: 4920, pv: 740, tag: '尖峰', peak: true },
    { time: '16:00', load: 4210, baseline: 4350, pv: 360, tag: '峰段' },
    { time: '18:00', load: 3950, baseline: 4050, pv: 80, tag: '峰段' },
    { time: '20:00', load: 3200, baseline: 3300, pv: 0, tag: '平段' },
    { time: '22:00', load: 1850, baseline: 1950, pv: 0, tag: '谷段' },
  ];

  const trendDataMonth = [
    { time: '10-01', load: 3120, baseline: 3250, tag: '国庆' },
    { time: '10-03', load: 2950, baseline: 3100, tag: '国庆' },
    { time: '10-05', load: 3340, baseline: 3400, tag: '恢复' },
    { time: '10-07', load: 3820, baseline: 3900, tag: '正常' },
    { time: '10-09', load: 4150, baseline: 4200, tag: '满负荷' },
    { time: '10-11', load: 4320, baseline: 4450, tag: '满负荷' },
    { time: '10-13', load: 4620, baseline: 4700, tag: '高产' },
    { time: '10-14', load: 4780, baseline: 4850, tag: '高产' },
    { time: '10-15', load: 4810, baseline: 4900, tag: '高产' },
    { time: '10-16', load: 4850, baseline: 4950, tag: '今日最新', peak: true }
  ];

  const trendDataYear = [
    { time: '01月', load: 3600, baseline: 3800, tag: '冬季' },
    { time: '03月', load: 3950, baseline: 4100, tag: '春季' },
    { time: '05月', load: 4200, baseline: 4300, tag: '复工' },
    { time: '07月', load: 5120, baseline: 5300, tag: '迎峰度夏', peak: true },
    { time: '08月', load: 4980, baseline: 5150, tag: '迎峰度夏' },
    { time: '09月', load: 4620, baseline: 4750, tag: '秋季' },
    { time: '10月', load: 4850, baseline: 4900, tag: '当前近期' }
  ];

  const activeTrendData = timeGranularity === 'day' ? trendDataDay : timeGranularity === 'month' ? trendDataMonth : trendDataYear;
  const maxTrendVal = Math.max(...activeTrendData.map(d => Math.max(d.load, d.baseline))) * 1.15;

  // Chart 2: Equipment Efficiency Monitoring (设备能效监测) with 3D/Segmented glowing bar blocks
  const equipmentEfficiencyList = [
    {
      name: '中央冷水机组 #1',
      category: '制冷暖通',
      cop: 5.86,
      copBenchmark: 5.2,
      copStatus: '一级能效 (优)',
      loadRate: 78,
      powerFactor: 0.985,
      actualPower: '485.2 kW',
      dailyKWh: '3,880 kWh',
      health: 98,
      isWarning: false
    },
    {
      name: '中央冷水机组 #2',
      category: '制冷暖通',
      cop: 5.42,
      copBenchmark: 5.2,
      copStatus: '一级能效 (良)',
      loadRate: 85,
      powerFactor: 0.976,
      actualPower: '512.0 kW',
      dailyKWh: '4,100 kWh',
      health: 94,
      isWarning: false
    },
    {
      name: '离心式空压总机 #A',
      category: '压缩动力',
      cop: 4.12,
      copBenchmark: 4.5,
      copStatus: '二级能效 (关注)',
      loadRate: 91,
      powerFactor: 0.912,
      actualPower: '310.4 kW',
      dailyKWh: '2,480 kWh',
      health: 86,
      isWarning: true
    },
    {
      name: '储能变流升压舱 PCS-1',
      category: '储能转换',
      cop: 6.25,
      copBenchmark: 5.8,
      copStatus: '高效能 (优)',
      loadRate: 72,
      powerFactor: 0.999,
      actualPower: '500.0 kW',
      dailyKWh: '3,650 kWh',
      health: 99,
      isWarning: false
    },
    {
      name: '光伏逆变电控总柜',
      category: '清洁发电',
      cop: 6.50,
      copBenchmark: 6.0,
      copStatus: '转换率 98.8%',
      loadRate: 68,
      powerFactor: 0.995,
      actualPower: '880.6 kW',
      dailyKWh: '5,280 kWh',
      health: 97,
      isWarning: false
    },
    {
      name: '超级快充机架 #01',
      category: '智能充电',
      cop: 5.60,
      copBenchmark: 5.3,
      copStatus: '整流能效 96.2%',
      loadRate: 64,
      powerFactor: 0.982,
      actualPower: '640.0 kW',
      dailyKWh: '3,840 kWh',
      health: 95,
      isWarning: false
    }
  ];

  // Chart 3: Energy Consumption Warning & Monitoring (能耗预警监测)
  // Multi-bar chart: Recent dates (descending: 10-16, 10-15, 10-14, 10-13, 10-12, 10-11, 10-10)
  const warningMonitorData = [
    { date: '10-16', critical: 0, moderate: 1, mild: 2, totalOverloadKWh: 42.5, status: '今日受控' },
    { date: '10-15', critical: 0, moderate: 0, mild: 1, totalOverloadKWh: 18.0, status: '轻微偏离' },
    { date: '10-14', critical: 1, moderate: 2, mild: 3, totalOverloadKWh: 115.8, status: '已闭环处置' },
    { date: '10-13', critical: 0, moderate: 1, mild: 2, totalOverloadKWh: 38.2, status: '已闭环处置' },
    { date: '10-12', critical: 0, moderate: 0, mild: 1, totalOverloadKWh: 12.0, status: '正常' },
    { date: '10-11', critical: 0, moderate: 2, mild: 2, totalOverloadKWh: 56.4, status: '已闭环处置' },
    { date: '10-10', critical: 1, moderate: 1, mild: 4, totalOverloadKWh: 128.0, status: '已闭环处置' }
  ];

  // Energy Tariff Breakdown (尖峰平谷)
  const tariffStructure = [
    { name: '尖峰时段 (10:00-12:00, 14:00-19:00)', pct: 28.5, kwh: '36,608 kWh', color: '#ef4444', price: '1.24 元/kWh' },
    { name: '高峰时段 (08:00-10:00, 19:00-22:00)', pct: 31.2, kwh: '40,076 kWh', color: '#f59e0b', price: '0.98 元/kWh' },
    { name: '平段时段 (12:00-14:00, 22:00-23:00)', pct: 21.8, kwh: '28,002 kWh', color: '#06b6d4', price: '0.65 元/kWh' },
    { name: '低谷时段 (23:00-次日07:00)', pct: 18.5, kwh: '23,764 kWh', color: '#10b981', price: '0.31 元/kWh' }
  ];

  return (
    <div className="space-y-6 text-white font-sans animate-fadeIn">
      {/* 1. Header Filter Bar & Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-wide text-white flex items-center gap-2">
                能耗监测分析
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono font-normal">
                  实时数据流 · 智能物联
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
              <span>当前监测站点: <strong className="text-amber-400">{plantName}</strong></span>
              <span>|</span>
              <span>数据更新频次: 1s 边缘直采</span>
              <span>|</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 监测拓扑链路健全
              </span>
            </p>
          </div>
        </div>

        {/* Global Controls & Granularity */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Time Granularity Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTimeGranularity('day')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeGranularity === 'day'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              按日
            </button>
            <button
              onClick={() => setTimeGranularity('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeGranularity === 'month'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              按月
            </button>
            <button
              onClick={() => setTimeGranularity('year')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                timeGranularity === 'year'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              按年
            </button>
          </div>

          {/* Quick Date Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>2026-10-16 (近期最新)</span>
          </div>

          {/* Refresh & Export */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="刷新数据"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => alert('已将近期能耗监测明细数据成功导出为 Excel (EM-Export-20261016.xlsx)')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Core KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: 今日综合能耗 */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>今日累计综合能耗</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-300 font-mono tracking-tight">128,450.8</span>
            <span className="text-xs text-slate-400 font-mono">kWh</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/70 pt-2 text-slate-400">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> 环比 -4.2%
            </span>
            <span className="text-slate-500">节能率 5.6%</span>
          </div>
        </div>

        {/* KPI 2: 实时用电负荷 */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>实时总用电负荷</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300 font-mono tracking-tight">4,218.6</span>
            <span className="text-xs text-slate-400 font-mono">kW</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/70 pt-2 text-slate-400">
            <span className="text-amber-400">峰值 4,850.2 kW (14:15)</span>
            <span className="text-slate-400 font-bold">负荷率 71%</span>
          </div>
        </div>

        {/* KPI 3: 尖峰平谷电费成本 */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>今日预估用能电费</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-300 font-mono tracking-tight">86,340.2</span>
            <span className="text-xs text-slate-400 font-mono">元</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/70 pt-2 text-slate-400">
            <span className="text-emerald-400">移峰填谷节约 ¥14,250</span>
            <span className="text-emerald-300 font-bold">优化 14.1%</span>
          </div>
        </div>

        {/* KPI 4: 综合能效比 COP / 评分 */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>综合能效评分 (COP)</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-300 font-mono tracking-tight">96.4</span>
            <span className="text-xs text-blue-400 font-bold">卓越 (优)</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/70 pt-2 text-slate-400">
            <span className="text-blue-400">行业基准 88.5 分</span>
            <span className="text-cyan-300 font-bold">减碳 68.4 t</span>
          </div>
        </div>

        {/* KPI 5: 预警与异常处置 */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>近期能耗预警监控</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-300 font-mono tracking-tight">3</span>
            <span className="text-xs text-slate-400 font-mono">起监测事件</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/70 pt-2 text-slate-400">
            <span className="text-amber-400">中度 1 / 轻微 2</span>
            <span className="text-emerald-400 font-bold">100% 受控处置</span>
          </div>
        </div>
      </div>

      {/* 3. Main Center Row: Multi-dimensional Trend Curve & Tariff Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Span 8: Energy Consumption Trend Curve (SVG Rich Chart) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              <h3 className="font-extrabold text-sm text-white">
                能耗运行趋势分析 ({timeGranularity === 'day' ? '当日24小时曲线' : timeGranularity === 'month' ? '当月各日走势' : '当年各月走势'})
              </h3>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_#06b6d4]"></span>
                <span className="text-slate-300">实际负荷 (kW)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-500 border-t border-dashed border-slate-400"></span>
                <span className="text-slate-400">基准预测</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500/40 border border-emerald-400 rounded-sm"></span>
                <span className="text-emerald-400">光伏消纳</span>
              </div>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="relative w-full h-64 bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
            {/* Background Grid Lines & Y-Axis Labels */}
            <div className="absolute inset-x-8 inset-y-6 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-500">
              {[5000, 4000, 3000, 2000, 1000, 0].map(v => (
                <div key={v} className="flex items-center w-full">
                  <span className="w-10 text-right pr-2 text-slate-500">{v}</span>
                  <div className="flex-1 border-b border-slate-800/60"></div>
                </div>
              ))}
            </div>

            {/* SVG Path Render */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="loadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#0891b2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pvAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path for Load */}
              {(() => {
                const points = activeTrendData.map((d, i) => {
                  const x = 50 + (i / (activeTrendData.length - 1)) * 520;
                  const y = 185 - (d.load / maxTrendVal) * 165;
                  return `${x},${y}`;
                });
                const dArea = `M 50,185 L ${points.join(' L ')} L ${50 + 520},185 Z`;
                const dLine = `M ${points.join(' L ')}`;

                // Baseline path
                const basePoints = activeTrendData.map((d, i) => {
                  const x = 50 + (i / (activeTrendData.length - 1)) * 520;
                  const y = 185 - (d.baseline / maxTrendVal) * 165;
                  return `${x},${y}`;
                });
                const dBase = `M ${basePoints.join(' L ')}`;

                return (
                  <>
                    <path d={dArea} fill="url(#loadAreaGradient)" />
                    <path d={dBase} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />
                    <path d={dLine} fill="none" stroke="#22d3ee" strokeWidth="2.5" className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />

                    {/* Peak Point Glowing Bubble */}
                    {activeTrendData.map((d, i) => {
                      if (!d.peak) return null;
                      const x = 50 + (i / (activeTrendData.length - 1)) * 520;
                      const y = 185 - (d.load / maxTrendVal) * 165;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="6" fill="#f59e0b" className="animate-ping opacity-75" />
                          <circle cx={x} cy={y} r="4" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
                          <rect x={x - 42} y={y - 28} width="84" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                          <text x={x} y={y - 14} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            最高峰: {d.load}
                          </text>
                        </g>
                      );
                    })}

                    {/* Data Points */}
                    {activeTrendData.map((d, i) => {
                      const x = 50 + (i / (activeTrendData.length - 1)) * 520;
                      const y = 185 - (d.load / maxTrendVal) * 165;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#0891b2"
                          stroke="#a5f3fc"
                          strokeWidth="1.5"
                          className="hover:r-5 cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint({ x, y, time: d.time, value: d.load, type: d.tag })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                style={{ left: `${(hoveredPoint.x / 600) * 100}%`, top: '15%' }}
                className="absolute z-20 -translate-x-1/2 bg-slate-900 border border-cyan-500/80 rounded-lg p-2 text-xs shadow-2xl pointer-events-none font-mono"
              >
                <div className="text-cyan-300 font-bold">{hoveredPoint.time} ({hoveredPoint.type})</div>
                <div className="text-white mt-0.5">负荷功率: <strong className="text-amber-400">{hoveredPoint.value} kW</strong></div>
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] text-slate-400 font-mono px-12 pt-1 border-t border-slate-800">
            {activeTrendData.map((d, i) => (
              <span key={i} className="hover:text-cyan-300 transition-colors">{d.time}</span>
            ))}
          </div>
        </div>

        {/* Right Span 4: 尖峰平谷用电结构与能耗占比 */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
              <h3 className="font-extrabold text-sm text-white">尖峰平谷用电结构</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">阶梯时段定价</span>
          </div>

          {/* Radial Bar / Circular representation */}
          <div className="flex items-center justify-center p-2">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="12" />
                {/* 尖峰 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="12"
                  strokeDasharray={`${28.5 * 2.38} 238`}
                  strokeDashoffset="0"
                />
                {/* 高峰 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray={`${31.2 * 2.38} 238`}
                  strokeDashoffset={`-${28.5 * 2.38}`}
                />
                {/* 平段 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="12"
                  strokeDasharray={`${21.8 * 2.38} 238`}
                  strokeDashoffset={`-${(28.5 + 31.2) * 2.38}`}
                />
                {/* 低谷 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${18.5 * 2.38} 238`}
                  strokeDashoffset={`-${(28.5 + 31.2 + 21.8) * 2.38}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-mono">谷段占比</span>
                <span className="text-xl font-black text-emerald-400 font-mono">18.5%</span>
                <span className="text-[9px] text-slate-500">移峰目标 25%</span>
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-2 text-xs font-mono">
            {tariffStructure.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: t.color }}></span>
                  <span className="text-slate-300 text-[11px] truncate max-w-[150px]">{t.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{t.pct}%</div>
                  <div className="text-[10px] text-slate-400">{t.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: Chart 2 (设备能效监测) & Chart 3 (能耗预警监测) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Span 6: 设备能效监测 (Equipment Energy Efficiency Monitoring with 3D glowing bar blocks) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <h3 className="font-extrabold text-sm text-white">设备能效监测</h3>
            </div>

            {/* Toggle metric modes */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setEfficiencyMetricMode('cop')}
                className={`px-2 py-0.5 rounded cursor-pointer ${efficiencyMetricMode === 'cop' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                COP/综合能效
              </button>
              <button
                onClick={() => setEfficiencyMetricMode('load_rate')}
                className={`px-2 py-0.5 rounded cursor-pointer ${efficiencyMetricMode === 'load_rate' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                负荷率 (%)
              </button>
              <button
                onClick={() => setEfficiencyMetricMode('power_factor')}
                className={`px-2 py-0.5 rounded cursor-pointer ${efficiencyMetricMode === 'power_factor' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                功率因数
              </button>
            </div>
          </div>

          {/* 3D-styled Glowing Bar Blocks */}
          <div className="space-y-3.5">
            {equipmentEfficiencyList.map((eq, i) => {
              const displayVal =
                efficiencyMetricMode === 'cop' ? eq.cop :
                efficiencyMetricMode === 'load_rate' ? eq.loadRate : eq.powerFactor;
              const maxVal =
                efficiencyMetricMode === 'cop' ? 7.0 :
                efficiencyMetricMode === 'load_rate' ? 100 : 1.0;
              const barPercent = Math.min(100, Math.round((Number(displayVal) / maxVal) * 100));

              return (
                <div key={i} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{eq.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {eq.category}
                      </span>
                      {eq.isWarning && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> 能效关注
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{eq.copStatus}</span>
                      <strong className="text-emerald-300 font-mono text-sm">
                        {efficiencyMetricMode === 'cop' ? `${eq.cop} COP` :
                         efficiencyMetricMode === 'load_rate' ? `${eq.loadRate}%` : `${eq.powerFactor}`}
                      </strong>
                    </div>
                  </div>

                  {/* 3D Segmented Glowing Bar */}
                  <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      style={{ width: `${barPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 relative ${
                        eq.isWarning
                          ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                          : 'bg-gradient-to-r from-teal-600 via-emerald-400 to-cyan-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      }`}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 rounded-full blur-[1px]"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>当前运行负荷: {eq.actualPower}</span>
                    <span>今日用电: {eq.dailyKWh}</span>
                    <span>健康度: <strong className="text-emerald-400">{eq.health}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Span 6: 能耗预警监测 (Energy Consumption Warning & Monitoring Multi-bar chart) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-4 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              <h3 className="font-extrabold text-sm text-white">能耗预警监测 (近7日频次与越限)</h3>
            </div>

            {/* Toggle metric */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setWarningMetricMode('count')}
                className={`px-2 py-0.5 rounded cursor-pointer ${warningMetricMode === 'count' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'}`}
              >
                事件频次
              </button>
              <button
                onClick={() => setWarningMetricMode('overload_kwh')}
                className={`px-2 py-0.5 rounded cursor-pointer ${warningMetricMode === 'overload_kwh' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'}`}
              >
                越限电量 (kWh)
              </button>
            </div>
          </div>

          {/* Warning Multi-bar Chart with Legend */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> 严重越限
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> 中度预警
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-cyan-500 rounded-sm"></span> 轻微提醒
                </span>
              </div>
              <span className="text-slate-500">安全警戒阈值: 2 次/日</span>
            </div>

            {/* Bar columns per date */}
            <div className="h-56 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex items-end justify-between gap-3 relative">
              {/* Threshold line */}
              <div className="absolute inset-x-4 top-1/3 border-b border-dashed border-rose-500/40 pointer-events-none flex items-center justify-end">
                <span className="text-[9px] text-rose-400 font-mono -translate-y-2 pr-2">阈值警戒线</span>
              </div>

              {warningMonitorData.map((d, i) => {
                const totalEvents = d.critical + d.moderate + d.mild;
                const barHeight = warningMetricMode === 'count'
                  ? Math.min(100, (totalEvents / 6) * 100)
                  : Math.min(100, (d.totalOverloadKWh / 150) * 100);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {warningMetricMode === 'count' ? `${totalEvents}次` : `${d.totalOverloadKWh}k`}
                    </div>

                    {/* Stacked Bar Container */}
                    <div className="w-full max-w-[28px] h-36 bg-slate-900 rounded-t flex flex-col-reverse overflow-hidden border border-slate-800">
                      {/* Mild (Cyan) */}
                      <div
                        style={{ height: `${(d.mild / (totalEvents || 1)) * barHeight}%` }}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 transition-all"
                      ></div>
                      {/* Moderate (Amber) */}
                      <div
                        style={{ height: `${(d.moderate / (totalEvents || 1)) * barHeight}%` }}
                        className="w-full bg-amber-500 hover:bg-amber-400 transition-all"
                      ></div>
                      {/* Critical (Rose) */}
                      <div
                        style={{ height: `${(d.critical / (totalEvents || 1)) * barHeight}%` }}
                        className="w-full bg-rose-500 hover:bg-rose-400 transition-all shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                      ></div>
                    </div>

                    {/* Date label */}
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>今日 (10-16) 预警事件均在 15分钟内完成自动闭环调度</span>
            </div>
            <span className="text-emerald-400 font-bold">闭环率 100%</span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Detailed Data Table: 按近期时间降序排列 (Desc) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                能耗监测历史明细表
                <span className="text-xs text-amber-400 font-mono font-normal">
                  (按时间降序排列 ↓ 最新近期)
                </span>
              </h3>
            </div>
          </div>

          {/* Search & Warning Filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索回路/设备/类型..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 text-xs font-mono"
              />
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setWarningFilter('all')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${warningFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                全部
              </button>
              <button
                onClick={() => setWarningFilter('moderate')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${warningFilter === 'moderate' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                高负荷/预警
              </button>
              <button
                onClick={() => setWarningFilter('mild')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${warningFilter === 'mild' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400'}`}
              >
                能效关注
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">记录时间 ↓</th>
                <th className="p-3 font-semibold">单据编号</th>
                <th className="p-3 font-semibold">监测回路 / 设备</th>
                <th className="p-3 font-semibold">能耗类型</th>
                <th className="p-3 font-semibold text-right">实时负荷 (kW)</th>
                <th className="p-3 font-semibold text-right">累计用能 (kWh)</th>
                <th className="p-3 font-semibold">功率因数</th>
                <th className="p-3 font-semibold">能效评级 (COP)</th>
                <th className="p-3 font-semibold">预警处置状态</th>
                <th className="p-3 font-semibold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-amber-300 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{r.time}</span>
                  </td>
                  <td className="p-3 text-slate-400">{r.id}</td>
                  <td className="p-3 text-white font-medium">{r.circuit}</td>
                  <td className="p-3 text-cyan-300">{r.type}</td>
                  <td className="p-3 text-right font-bold text-amber-300">{r.realtimeLoad} kW</td>
                  <td className="p-3 text-right font-bold text-emerald-300">{r.accumulatedKWh} kWh</td>
                  <td className="p-3 text-slate-300">{r.powerFactor}</td>
                  <td className="p-3 text-blue-300 font-semibold">{r.copRate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                        r.statusType === 'warning'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : r.statusType === 'mild_alert'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedDetailRecord(r)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      诊断详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
          <span>显示近期 10 条最新监测快照 (已按时间降序实时排序)</span>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer">
              上一页
            </button>
            <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded font-bold">1</span>
            <button className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white cursor-pointer">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* 6. Diagnostic Detail Modal */}
      {selectedDetailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-extrabold text-white">能耗诊断明细卡</h4>
              </div>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">单据编号:</span>
                  <div className="text-white font-bold">{selectedDetailRecord.id}</div>
                </div>
                <div>
                  <span className="text-slate-400">记录时间:</span>
                  <div className="text-amber-400 font-bold">{selectedDetailRecord.time}</div>
                </div>
                <div>
                  <span className="text-slate-400">监测回路:</span>
                  <div className="text-cyan-300 font-bold">{selectedDetailRecord.circuit}</div>
                </div>
                <div>
                  <span className="text-slate-400">用能类型:</span>
                  <div className="text-slate-200">{selectedDetailRecord.type}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400">实时负荷:</span>
                  <div className="text-amber-300 font-bold text-sm">{selectedDetailRecord.realtimeLoad} kW</div>
                </div>
                <div>
                  <span className="text-slate-400">累计能耗:</span>
                  <div className="text-emerald-300 font-bold text-sm">{selectedDetailRecord.accumulatedKWh} kWh</div>
                </div>
                <div>
                  <span className="text-slate-400">功率因数:</span>
                  <div className="text-cyan-300 font-bold text-sm">{selectedDetailRecord.powerFactor}</div>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-1.5">
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>智能能效诊断结论与处置策略</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedDetailRecord.advice}</p>
                <div className="text-slate-400 text-[11px] pt-1">
                  当前诊断评价: <strong className="text-white">{selectedDetailRecord.copRate}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  alert(`已成功针对 ${selectedDetailRecord.circuit} 发送负荷优化调度工单！`);
                  setSelectedDetailRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              >
                下发调优策略
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
