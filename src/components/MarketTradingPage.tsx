import React, { useState } from 'react';
import { 
  TrendingUp, Send, CheckCircle2, RefreshCw, BarChart3, Filter, Search, DollarSign, Activity, Layers, X, FileText 
} from 'lucide-react';

interface MarketTradingPageProps {
  plantName: string;
  systemDateTime: string;
}

export const MarketTradingPage: React.FC<MarketTradingPageProps> = ({ plantName, systemDateTime }) => {
  const [activeTab, setActiveTab] = useState<'demand' | 'clearing'>('demand');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Declaration Modal State ("我要申报")
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState<boolean>(false);
  const [selectedDemand, setSelectedDemand] = useState({
    id: 'XHSC070001',
    region: '西宁市需求区',
    subject: '用户申报',
    totalPower: '3,421.90 MW',
    variety: '月内现货与长协',
    dateRange: '10-11 ~ 10-21'
  });

  // User Declaration Details Modal State ("用户申报明细")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(0);

  const usersList = [
    { name: '青海盐湖化工高载能总厂', totalDeclare: '654.80 kW', price: '10.50 元', time: '2026-10-16 10:30' },
    { name: '西宁经济开发区大数据中心', totalDeclare: '520.40 kW', price: '9.80 元', time: '2026-10-16 10:15' },
    { name: '格尔木光储一体化新能源基站', totalDeclare: '480.20 kW', price: '10.20 元', time: '2026-10-16 09:50' },
    { name: '柴达木盆地智慧算力集群', totalDeclare: '710.00 kW', price: '9.90 元', time: '2026-10-16 09:30' },
    { name: '青海省电网负荷柔性聚合服务中心', totalDeclare: '890.50 kW', price: '10.80 元', time: '2026-10-16 09:00' },
  ];

  const baseTimeSlots = [
    '00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45',
    '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45',
    '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45',
    '06:00', '06:15', '06:30', '06:45', '07:00', '07:15'
  ];

  const getUserSlots = (userIndex: number) => {
    const multiplier = [1.0, 0.85, 0.92, 1.15, 1.3][userIndex] || 1.0;
    const priceBase = [2.32, 2.15, 2.45, 2.20, 2.55][userIndex] || 2.32;
    return baseTimeSlots.map((time, idx) => {
      const wave = Math.sin((idx / baseTimeSlots.length) * Math.PI * 2) * 18;
      const power = Math.max(10, (48 + wave) * multiplier).toFixed(2);
      const price = (priceBase + (idx % 3) * 0.05).toFixed(2);
      return { time, power, price };
    });
  };

  const currentDetailSlots = getUserSlots(selectedUserIndex);
  const currentUser = usersList[selectedUserIndex];

  // Time intervals for declaration grid (00:00 to 01:30)
  const timeSlots = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30'];
  const dates = ['10-11', '10-12', '10-13', '10-14', '10-15', '10-16', '10-17', '10-18', '10-19', '10-20', '10-21'];

  // Initialize declareGrid with uniquely varied data per cell instead of identical repeating values
  const [declareGrid, setDeclareGrid] = useState<{ [key: string]: { declarePower: string; declarePrice: string } }>(() => {
    const initial: { [key: string]: { declarePower: string; declarePrice: string } } = {};
    dates.forEach((d, dIdx) => {
      timeSlots.forEach((t, tIdx) => {
        const seed = (dIdx + 1) * (tIdx + 1);
        const powerVal = (120 + (seed % 45) + (tIdx * 0.6)).toFixed(2);
        const priceVal = (370 + (seed % 35) + (dIdx * 0.4)).toFixed(2);
        initial[`${d}-${t}`] = { declarePower: powerVal, declarePrice: priceVal };
      });
    });
    return initial;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDeclareModal = (item: any) => {
    setSelectedDemand({
      id: item.id,
      region: item.region,
      subject: '用户申报',
      totalPower: item.totalPower,
      variety: item.type + '交易',
      dateRange: '10-11 ~ 10-21'
    });
    setIsDeclareModalOpen(true);
  };

  const handleOpenDetailModal = (item: any) => {
    setSelectedDemand({
      id: item.id,
      region: item.region,
      subject: '用户申报',
      totalPower: item.totalPower,
      variety: item.type + '交易',
      dateRange: '2026-10-16'
    });
    setIsDetailModalOpen(true);
  };

  const [demands, setDemands] = useState([
    { id: 'XHSC070001', type: '日前', pushStatus: '已推送', region: '西宁市需求区', totalPower: '342.98 MW', date: '2026-10-16', method: '按量申报', status: '申报中' },
    { id: 'XHSC070002', type: '多月', pushStatus: '未推送', region: '海西州储能区', totalPower: '680.50 MW', date: '2026-10-18', method: '按量申报', status: '待发布' },
    { id: 'XHSC070003', type: '年度', pushStatus: '未推送', region: '全省网架区', totalPower: '1,450.20 MW', date: '2026-12-31', method: '比例申报', status: '草稿' },
    { id: 'XHSC070004', type: '日内', pushStatus: '已推送', region: '海东市负荷区', totalPower: '210.40 MW', date: '2026-10-16', method: '按量申报', status: '撮合中' },
    { id: 'XHSC070005', type: '日前', pushStatus: '已推送', region: '海南州光伏区', totalPower: '512.60 MW', date: '2026-10-17', method: '按量申报', status: '申报中' },
    { id: 'XHSC070006', type: '多月', pushStatus: '未推送', region: '玉树州清洁区', totalPower: '180.00 MW', date: '2026-11-01', method: '阶梯申报', status: '待发布' },
  ]);

  const [clearings, setClearings] = useState([
    { id: 'XHSC070001', type: '日前', execStatus: '待执行', subject: '用户申报', region: '西宁市需求区', clearingPower: '342.98 MW', declarePower: '432.12 MW', rate: '90.12%' },
    { id: 'XHSC070002', type: '日内', execStatus: '已执行', subject: '用户申报', region: '海东市负荷区', clearingPower: '210.40 MW', declarePower: '240.00 MW', rate: '87.65%' },
    { id: 'XHSC070003', type: '多月', execStatus: '待执行', subject: '厂站申报', region: '海南州光伏区', clearingPower: '512.60 MW', declarePower: '550.00 MW', rate: '93.20%' },
    { id: 'XHSC070004', type: '年度', execStatus: '已执行', subject: '厂站申报', region: '海西州储能区', clearingPower: '680.50 MW', declarePower: '720.00 MW', rate: '94.50%' },
    { id: 'XHSC070005', type: '日前', execStatus: '待执行', subject: '用户申报', region: '全省网架区', clearingPower: '1,450.20 MW', declarePower: '1,600.00 MW', rate: '90.64%' },
  ]);

  const handlePushAll = () => {
    setDemands(demands.map(d => ({ ...d, pushStatus: '已推送' })));
    showToast('已成功将市场发布需求批量推送至用户端');
  };

  return (
    <div className="space-y-6 text-xs font-mono text-slate-200 animate-fadeIn relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-cyan-950/95 border border-cyan-400/80 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-sans font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 市场化交易与出清中心</h2>
              <span className="text-[11px] text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                现货与中长期双轨交易
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 今日市场总出清规模: <span className="text-white font-bold">3,196.68 MW</span> · 申报遵从率: <span className="text-emerald-400 font-bold">91.8%</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePushAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors border border-cyan-400 font-medium text-xs cursor-pointer shadow-lg shadow-cyan-900/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>推送到用户端</span>
          </button>
          <button 
            onClick={() => showToast('已刷新市场化交易盘口与出清数据')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新盘口</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('demand')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === 'demand' 
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          市场发布需求管理 ({demands.length})
        </button>
        <button
          onClick={() => setActiveTab('clearing')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === 'clearing' 
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          市场出清结果与执行 ({clearings.length})
        </button>
      </div>

      {/* SECTION 1: Demand Release & Management */}
      {activeTab === 'demand' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400">交易类型过滤:</span>
              <select className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400">
                <option>全部交易类型</option>
                <option>日前现货</option>
                <option>多月长协</option>
                <option>年度长协</option>
              </select>
              <span className="text-slate-400">推送状态:</span>
              <select className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400">
                <option>全部状态</option>
                <option>已推送</option>
                <option>未推送</option>
              </select>
            </div>
            <div className="text-xs text-slate-400">
              近期申报周期: <span className="text-cyan-300 font-bold">2026-10-16</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demands.map(item => (
              <div key={item.id} className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">{item.type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${
                    item.pushStatus === '已推送' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {item.pushStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">需求区域</span>
                    <span className="text-slate-200 font-medium mt-0.5 block">{item.region}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">交易总量</span>
                    <span className="text-amber-300 font-bold font-mono mt-0.5 block">{item.totalPower}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">交易日期</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{item.date}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">申报方式</span>
                    <span className="text-cyan-300 mt-0.5 block">{item.method}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => handleOpenDetailModal(item)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-medium cursor-pointer underline underline-offset-4"
                  >
                    用户申报明细
                  </button>
                  <button 
                    onClick={() => handleOpenDeclareModal(item)}
                    className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-md shadow-cyan-900/30 cursor-pointer"
                  >
                    我要申报
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Clearing Results & Execution */}
      {activeTab === 'clearing' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400">执行状态过滤:</span>
              <select className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400">
                <option>全部执行类型</option>
                <option>待执行</option>
                <option>已执行</option>
              </select>
              <span className="text-slate-400">申报主体:</span>
              <select className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400">
                <option>全部主体</option>
                <option>用户申报</option>
                <option>厂站申报</option>
              </select>
            </div>
            <div className="text-xs text-slate-400">
              出清基准时间: <span className="text-emerald-300 font-bold">2026-10-16 (近期降序)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clearings.map(item => (
              <div key={item.id} className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl transition-all relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">{item.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      item.execStatus === '已执行' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {item.execStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">需求区域</span>
                    <span className="text-slate-200 font-medium mt-0.5 block">{item.region}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">出清总量</span>
                    <span className="text-cyan-300 font-bold font-mono mt-0.5 block">{item.clearingPower}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">申报总量</span>
                    <span className="text-slate-300 font-mono mt-0.5 block">{item.declarePower}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block">出清成交率</span>
                    <span className="text-emerald-400 font-bold font-mono mt-0.5 block">{item.rate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => showToast(`正在加载 [${item.id}] 出清结果与结算账单明细...`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
                  >
                    出清结果
                  </button>
                  <button 
                    onClick={() => showToast(`已启动 [${item.id}] 关联区域的柔性负荷联动调控`)}
                    className="px-3.5 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition-colors shadow-md shadow-amber-900/30 cursor-pointer"
                  >
                    负荷调控
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "我要申报" (Market Declaration Form Modal with Uniquely Varied Cell Data) */}
      {isDeclareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">
                  {selectedDemand.region}中长期交易需求申报
                </h3>
              </div>
              <button onClick={() => setIsDeclareModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-x-auto overflow-y-auto flex-1 font-mono">
              <table className="w-full text-center border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                    <th className="p-3 border-r border-slate-800 font-semibold sticky left-0 bg-slate-950 z-10 w-24">日期</th>
                    {timeSlots.map(t => (
                      <th key={t} colSpan={3} className="p-2 border-r border-slate-800 font-semibold text-cyan-300">{t}</th>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[10px]">
                    <th className="border-r border-slate-800 sticky left-0 bg-slate-900 z-10"></th>
                    {timeSlots.map(t => (
                      <React.Fragment key={`sub-${t}`}>
                        <th className="p-1.5 border-r border-slate-800/60 font-normal">需求量</th>
                        <th className="p-1.5 border-r border-slate-800/60 font-normal">申报量</th>
                        <th className="p-1.5 border-r border-slate-800 font-normal">申报价格</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dates.map((d) => (
                    <tr key={d} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-2.5 border-r border-slate-800 font-bold text-slate-200 sticky left-0 bg-slate-950 z-10">2026-{d}</td>
                      {timeSlots.map(t => {
                        const key = `${d}-${t}`;
                        const cell = declareGrid[key] || { declarePower: '132.45', declarePrice: '385.00' };
                        return (
                          <React.Fragment key={key}>
                            <td className="p-1.5 border-r border-slate-800/60 text-slate-400 font-mono">132.45</td>
                            <td className="p-1.5 border-r border-slate-800/60">
                              <input 
                                type="text" 
                                value={cell.declarePower} 
                                onChange={(e) => setDeclareGrid({...declareGrid, [key]: {...cell, declarePower: e.target.value}})} 
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400" 
                              />
                            </td>
                            <td className="p-1.5 border-r border-slate-800">
                              <input 
                                type="text" 
                                value={cell.declarePrice} 
                                onChange={(e) => setDeclareGrid({...declareGrid, [key]: {...cell, declarePrice: e.target.value}})} 
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center text-amber-300 font-mono text-xs outline-none focus:border-cyan-400" 
                              />
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => {
                  const initial: { [key: string]: { declarePower: string; declarePrice: string } } = {};
                  dates.forEach((d, dIdx) => {
                    timeSlots.forEach((t, tIdx) => {
                      const seed = (dIdx + 2) * (tIdx + 3);
                      initial[`${d}-${t}`] = {
                        declarePower: (125 + (seed % 50)).toFixed(2),
                        declarePrice: (375 + (seed % 40)).toFixed(2)
                      };
                    });
                  });
                  setDeclareGrid(initial);
                  showToast('已重新生成中长期申报网格各项数据');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              >
                重置
              </button>
              <button 
                onClick={() => {
                  setIsDeclareModalOpen(false);
                  showToast(`成功提交 [${selectedDemand.region}] 中长期交易需求申报数据！`);
                }}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                确认申报
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "用户申报明细" (User Declaration Details Modal) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[92vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">{selectedDemand.region}日前交易需求明细</h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="text-cyan-300 font-bold">交易需求负荷曲线趋势图 (kW) — {currentUser.name}</span>
                  <span className="text-amber-300 font-mono text-[10px]">平滑样条曲线 (Smooth Spline Curve)</span>
                </div>
                <div className="h-56 w-full relative pt-2 px-2 border-b border-slate-800 pb-2">
                  <svg className="w-full h-44 overflow-visible" viewBox="0 0 800 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="40" x2="800" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="800" y2="80" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="800" y2="120" stroke="#1e293b" strokeDasharray="4 4" />
                    <path 
                      d={`M 0 160 ${currentDetailSlots.map((s, i) => `L ${(i / (currentDetailSlots.length - 1)) * 800} ${140 - (Number(s.power) / 80) * 120}`).join(' ')} L 800 160 Z`} 
                      fill="url(#curveGradient)" 
                    />
                    <path 
                      d={`M ${currentDetailSlots.map((s, i) => `${(i / (currentDetailSlots.length - 1)) * 800},${140 - (Number(s.power) / 80) * 120}`).join(' L ')}`} 
                      fill="none" 
                      stroke="#22d3ee" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                    />
                    {currentDetailSlots.map((s, i) => {
                      const cx = (i / (currentDetailSlots.length - 1)) * 800;
                      const cy = 140 - (Number(s.power) / 80) * 120;
                      return (
                        <circle key={i} cx={cx} cy={cy} r="3.5" className="fill-amber-300 stroke-slate-950 stroke-2 hover:scale-150 transition-transform cursor-pointer">
                          <title>{s.time}: {s.power} kW</title>
                        </circle>
                      );
                    })}
                  </svg>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 font-mono px-1">
                    {currentDetailSlots.filter((_, i) => i % 4 === 0).map(s => (
                      <span key={s.time}>{s.time}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 lg:col-span-1">
                  <div className="text-slate-400 font-semibold text-[11px] border-b border-slate-800 pb-2">申报用户列表</div>
                  <div className="space-y-1.5">
                    {usersList.map((u, idx) => (
                      <button key={u.name} onClick={() => setSelectedUserIndex(idx)} className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-between border ${selectedUserIndex === idx ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200' : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white'}`}>
                        <span className="truncate">{u.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 lg:col-span-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
                    <span>当前用户: <strong className="text-white">{currentUser.name}</strong></span>
                    <span>总申报量: <strong className="text-cyan-300 font-mono">{currentUser.totalDeclare}</strong></span>
                  </div>
                  <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                    <table className="w-full text-center border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                          <th className="p-2.5 border-r border-slate-800">时间点</th><th className="p-2.5 border-r border-slate-800">申报量(kW)</th><th className="p-2.5 border-r border-slate-800">申报价格(元)</th>
                          <th className="p-2.5 border-r border-slate-800">时间点</th><th className="p-2.5 border-r border-slate-800">申报量(kW)</th><th className="p-2.5 border-r border-slate-800">申报价格(元)</th>
                          <th className="p-2.5 border-r border-slate-800">时间点</th><th className="p-2.5 border-r border-slate-800">申报量(kW)</th><th className="p-2.5">申报价格(元)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {Array.from({ length: Math.ceil(currentDetailSlots.length / 3) }).map((_, rowIdx) => {
                          const slot1 = currentDetailSlots[rowIdx * 3];
                          const slot2 = currentDetailSlots[rowIdx * 3 + 1];
                          const slot3 = currentDetailSlots[rowIdx * 3 + 2];
                          return (
                            <tr key={`row-${rowIdx}`} className="hover:bg-slate-800/30 transition-colors">
                              <td className="p-2 border-r border-slate-800 text-slate-300">{slot1?.time || '-'}</td><td className="p-2 border-r border-slate-800 text-cyan-300">{slot1?.power || '-'}</td><td className="p-2 border-r border-slate-800 text-amber-300">{slot1?.price || '-'}</td>
                              <td className="p-2 border-r border-slate-800 text-slate-300">{slot2?.time || '-'}</td><td className="p-2 border-r border-slate-800 text-cyan-300">{slot2?.power || '-'}</td><td className="p-2 border-r border-slate-800 text-amber-300">{slot2?.price || '-'}</td>
                              <td className="p-2 border-r border-slate-800 text-slate-300">{slot3?.time || '-'}</td><td className="p-2 border-r border-slate-800 text-cyan-300">{slot3?.power || '-'}</td><td className="p-2 text-amber-300">{slot3?.price || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium">汇总上报</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
