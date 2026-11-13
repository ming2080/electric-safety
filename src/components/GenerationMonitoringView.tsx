import React, { useState } from 'react';
import {
  Sun,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronRight,
  Thermometer,
  Gauge,
  ArrowUpRight,
  Flame,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

interface GenerationMonitoringViewProps {
  plantName: string;
}

export const GenerationMonitoringView: React.FC<GenerationMonitoringViewProps> = ({ plantName }) => {
  const [selectedZone, setSelectedZone] = useState<string>('区域1屋顶光伏');
  const [treeExpanded, setTreeExpanded] = useState<{ [key: string]: boolean }>({
    pv: true,
    wind: false
  });
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-16');
  const [timeRangeType, setTimeRangeType] = useState<'day' | 'month' | 'year' | 'total'>('day');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 24-hour slots (1点 to 23点) matching screenshot
  const hoursList = Array.from({ length: 23 }, (_, i) => `${i + 1}点`);
  const powerCurveData = [0, 0, 45, 120, 250, 380, 520, 710, 840, 950, 780, 620, 450, 310, 210, 120, 40, 10, 0, 0, 0, 0, 0];
  const revenueBarData = [0, 0, 12, 35, 75, 120, 180, 250, 320, 410, 520, 680, 590, 450, 320, 210, 130, 45, 10, 0, 0, 0, 0];

  // Inverter equipment telemetry sorted descending by recent time
  const normalInverters = [
    { status: '正常', sn: '6T2339033497', name: 'INV-6T2339033497', rated: '40.000 kW', active: '8.804 kW', daily: '31.57 kWh', total: '4.2万kWh' },
    { status: '正常', sn: '6T2339045937', name: 'INV-6T2339045937', rated: '40.000 kW', active: '8.804 kW', daily: '23.57 kWh', total: '4.2万kWh' },
    { status: '正常', sn: 'TA2350054328', name: 'INV-TA2350054328', rated: '40.000 kW', active: '8.804 kW', daily: '31.57 kWh', total: '4.2万kWh' },
  ];

  const abnormalInverters = [
    { status: '异常', sn: '6T2339033497', name: 'INV-6T2339033497', rated: '40.000 kW', active: '0.00kW', daily: '12.00 kWh', total: '4.2万kWh' },
    { status: '正常', sn: '6T2339045937', name: 'INV-6T2339045937', rated: '40.000 kW', active: '8.804 kW', daily: '23.57 kWh', total: '4.2万kWh' },
    { status: '正常', sn: 'TA2350054328', name: 'INV-TA2350054328', rated: '40.000 kW', active: '8.804 kW', daily: '31.57 kWh', total: '4.2万kWh' },
  ];

  return (
    <div className="space-y-6 text-xs font-mono text-slate-200 animate-fadeIn relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-cyan-950/95 border border-cyan-400/80 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* 1. 监测综合信息 (Top 6 Summary Cards matching screenshot) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-2 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
          <h3 className="font-bold text-white text-sm font-sans tracking-wide">监测综合信息</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当前总装机容量</div>
              <div className="text-lg font-bold text-cyan-300 font-sans tabular-nums">13234.13 <span className="text-[10px] text-slate-400 font-normal">mW</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 1.23%</span>
              <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">装机容量</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当前出力设备数</div>
              <div className="text-lg font-bold text-white font-sans tabular-nums">56 <span className="text-[10px] text-slate-400 font-normal">个</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">总设备数58个</span>
              <span className="text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">出力设备</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当前实时功率</div>
              <div className="text-lg font-bold text-amber-300 font-sans tabular-nums">9446.54 <span className="text-[10px] text-slate-400 font-normal">mW</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 11.23%</span>
              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">发电功率</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">今日发电量</div>
              <div className="text-lg font-bold text-cyan-300 font-sans tabular-nums">13234.13 <span className="text-[10px] text-slate-400 font-normal">kW/h</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-rose-400 flex items-center">较昨日 3.52% ↓</span>
              <span className="text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">日发电量</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">本月发电量</div>
              <div className="text-lg font-bold text-emerald-300 font-sans tabular-nums">2346.54 <span className="text-[10px] text-slate-400 font-normal">mW/h</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 33.52%</span>
              <span className="text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">月发电量</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">本年度发电量</div>
              <div className="text-lg font-bold text-yellow-300 font-sans tabular-nums">12245.09 <span className="text-[10px] text-slate-400 font-normal">mW/h</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上年 43.52%</span>
              <span className="text-yellow-500 font-bold bg-yellow-950 px-2 py-0.5 rounded border border-yellow-800">年发电量</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 资源发电监测 Main Workspace (Left Tree + Right Dashboard Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Tree Sidebar (span 3) */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="font-bold text-white text-xs">资源发电监测</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">实时遥测</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button 
              onClick={() => setSelectedZone('全部')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${
                selectedZone === '全部' ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              全部
            </button>

            {/* 光伏发电 Group */}
            <div>
              <button 
                onClick={() => setTreeExpanded({...treeExpanded, pv: !treeExpanded.pv})}
                className="flex items-center justify-between w-full px-3 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5 text-amber-400" /> 光伏发电</span>
                {treeExpanded.pv ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {treeExpanded.pv && (
                <div className="pl-5 space-y-1 mt-1 border-l border-slate-800 ml-3">
                  {[
                    '区域1屋顶光伏', '区域2屋顶光伏', '区域3屋顶光伏',
                    '区域1屋顶光伏', '区域2屋顶光伏', '区域3屋顶光伏'
                  ].map((zone, idx) => {
                    const uniqueKey = `${zone}-${idx}`;
                    return (
                      <button
                        key={uniqueKey}
                        onClick={() => setSelectedZone(zone)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          selectedZone === zone ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        {zone}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 风力发电 Group */}
            <div>
              <button 
                onClick={() => setTreeExpanded({...treeExpanded, wind: !treeExpanded.wind})}
                className="flex items-center justify-between w-full px-3 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-cyan-400" /> 风力发电</span>
                {treeExpanded.wind ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Panel (span 9) */}
        <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          
          {/* Header Bar matching screenshot */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <span>#{selectedZone}</span>
                <span className="text-amber-300 font-mono text-xs bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                  ☀ 辐照度 45.89 W/m²
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <span>装机容量: <strong className="text-white">159kW</strong></span>
              <span>上网电价: <strong className="text-amber-300">0.6603元/度</strong></span>
              <span>并网类型: <strong className="text-cyan-300">自发自用余电上网</strong></span>
              <span>并网日期: <strong className="text-emerald-300">2026-10-16</strong></span>
            </div>
          </div>

          {/* Gauges & Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            {/* 2 Circular Gauge Cards */}
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {/* Gauge 1: 实时功率 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <div className="font-bold text-cyan-300 font-mono text-xs">122.23<span className="text-[9px] block text-slate-400">kW</span></div>
                </div>
                <span className="text-slate-400 text-[11px] mt-2 font-medium">实时功率</span>
              </div>

              {/* Gauge 2: 今日发电量 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/30 border-t-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <div className="font-bold text-amber-300 font-mono text-xs">232.23<span className="text-[9px] block text-slate-400">kWh</span></div>
                </div>
                <span className="text-slate-400 text-[11px] mt-2 font-medium">今日发电量</span>
              </div>
            </div>

            {/* 3 Right-Side Metric Cards matching screenshot */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">2,955.49</span>
                <span className="text-white text-xs font-bold block">本月发电量 (kWh)</span>
                <div className="pt-1 border-t border-slate-900 text-[10px] text-cyan-300">955.49 元 (本月预估收益)</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-cyan-300 text-[10px] block font-bold">1.31 万kWh</span>
                <span className="text-white text-xs font-bold block">本年发电量 (万kWh)</span>
                <div className="pt-1 border-t border-slate-900 text-[10px] text-amber-300">2,955.49 元 (本年预估收益)</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-300 text-[10px] block font-bold">13.31 万kWh</span>
                <span className="text-white text-xs font-bold block">累计发电量 (万kWh)</span>
                <div className="pt-1 border-t border-slate-900 text-[10px] text-emerald-400">52,955.49 元 (累计收益)</div>
              </div>
            </div>
          </div>

          {/* Date Picker & Range Selector */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">日期:</span>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-cyan-300">
                <Calendar className="w-3.5 h-3.5" />
                <input 
                  type="text" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent outline-none w-24 font-mono text-cyan-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['day', 'month', 'year', 'total'] as const).map((mode) => {
                const label = mode === 'day' ? '日' : mode === 'month' ? '月' : mode === 'year' ? '年' : '总';
                return (
                  <button
                    key={mode}
                    onClick={() => setTimeRangeType(mode)}
                    className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                      timeRangeType === mode ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Charts Row matching screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chart 1: 发电量 (kW/h) Curve */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-cyan-300 font-bold text-xs">发电量 (kW/h)</div>
              <div className="h-44 w-full relative pt-2 px-1 border-b border-slate-800 pb-2">
                <svg className="w-full h-32 overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={`M 0 120 ${powerCurveData.map((val, i) => `L ${(i / (powerCurveData.length - 1)) * 600} ${110 - (val / 1000) * 100}`).join(' ')} L 600 120 Z`} 
                    fill="url(#genGrad)" 
                  />
                  <path 
                    d={`M ${powerCurveData.map((val, i) => `${(i / (powerCurveData.length - 1)) * 600},${110 - (val / 1000) * 100}`).join(' L ')}`} 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="2.5" 
                  />
                </svg>
                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 font-mono">
                  {hoursList.filter((_, idx) => idx % 3 === 0).map(h => <span key={h}>{h}</span>)}
                </div>
              </div>
            </div>

            {/* Chart 2: 预估收益 (元) Column Bar Chart */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-amber-300 font-bold text-xs">预估收益 (元)</div>
              <div className="h-44 w-full flex items-end justify-between gap-1 pt-2 px-1 border-b border-slate-800 pb-2">
                {revenueBarData.map((val, idx) => {
                  const hPct = Math.min(100, Math.max(10, (val / 700) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div style={{ height: `${hPct}%` }} className="w-full bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t shadow"></div>
                      <span className="text-[8px] text-slate-400 transform -rotate-45 origin-top-left mt-1 block">{idx % 3 === 0 ? hoursList[idx] : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 设备发电监测 Tables (Bottom Two Tables matching screenshot) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]"></span>
            <h3 className="font-bold text-white text-sm font-sans tracking-wide">设备发电监测 (按近期时间降序排列)</h3>
          </div>
          <span className="text-[11px] text-slate-400">逆变器群实时遥测状态监控</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Table 1: Normal Inverter Group */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-cyan-300 flex items-center justify-between">
              <span>主路正常并网逆变器组</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">● 运行正常</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="p-2.5">状态</th>
                    <th className="p-2.5">逆变器SN</th>
                    <th className="p-2.5">逆变器名称</th>
                    <th className="p-2.5">额定功率</th>
                    <th className="p-2.5">实时功率</th>
                    <th className="p-2.5">当日发电量</th>
                    <th className="p-2.5">累计发电量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {normalInverters.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">正常</span></td>
                      <td className="p-2.5 font-mono text-cyan-300">{inv.sn}</td>
                      <td className="p-2.5 font-mono text-slate-300">{inv.name}</td>
                      <td className="p-2.5 font-mono text-slate-300">{inv.rated}</td>
                      <td className="p-2.5 font-mono text-amber-300 font-bold">{inv.active}</td>
                      <td className="p-2.5 font-mono text-slate-200">{inv.daily}</td>
                      <td className="p-2.5 font-mono text-emerald-300">{inv.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Abnormal / Other Inverter Group */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>支路告警或降额运行逆变器组</span>
              <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded">● 注意监控</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="p-2.5">状态</th>
                    <th className="p-2.5">逆变器SN</th>
                    <th className="p-2.5">逆变器名称</th>
                    <th className="p-2.5">额定功率</th>
                    <th className="p-2.5">实时功率</th>
                    <th className="p-2.5">当日发电量</th>
                    <th className="p-2.5">累计发电量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {abnormalInverters.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] ${inv.status === '异常' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>{inv.status}</span></td>
                      <td className="p-2.5 font-mono text-cyan-300">{inv.sn}</td>
                      <td className="p-2.5 font-mono text-slate-300">{inv.name}</td>
                      <td className="p-2.5 font-mono text-slate-300">{inv.rated}</td>
                      <td className="p-2.5 font-mono text-amber-300 font-bold">{inv.active}</td>
                      <td className="p-2.5 font-mono text-slate-200">{inv.daily}</td>
                      <td className="p-2.5 font-mono text-emerald-300">{inv.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
