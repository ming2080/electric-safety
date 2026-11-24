import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Search, Filter,
  FileText, Clock, BarChart3, PieChart, Activity, ChevronDown, CheckSquare
} from 'lucide-react';

import {
  ALARM_DEVICE_TYPE_STATS,
  ALARM_TYPE_STATS,
  ALARM_TYPE_TOTAL,
  DISPOSAL_ALARMS,
  REGIONAL_ALARM_BARS,
  summarizeAlarmDisposal
} from '../data/alarmDisposal';
import { DisposalAlarm } from '../types';

interface AlarmDisposalPageProps {
  plantName: string;
  systemDateTime: string;
}

export const AlarmDisposalPage: React.FC<AlarmDisposalPageProps> = ({ plantName, systemDateTime }) => {
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('全部');
  const [alarmLevelFilter, setAlarmLevelFilter] = useState<string>('全部');
  const [disposalStatusFilter, setDisposalStatusFilter] = useState<string>('全部');
  const [regionFilter, setRegionFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Alarm list sorted descending by occurrence time
  const [alarms, setAlarms] = useState<DisposalAlarm[]>(DISPOSAL_ALARMS);

  // 页眉与处置概况数字由告警数据实时汇总，生成处置单后随之更新
  const disposalSummary = summarizeAlarmDisposal(alarms);

  const handleGenerateOrder = (id: number, name: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, status: '已处置' } : a));
    showToast(`已成功为设备 [${name}] 生成告警处置工单，状态已更新为已处置`);
  };

  const filteredAlarms = alarms.filter(a => {
    if (deviceTypeFilter !== '全部' && a.type !== deviceTypeFilter) return false;
    if (alarmLevelFilter !== '全部' && a.level !== alarmLevelFilter) return false;
    if (disposalStatusFilter !== '全部' && a.status !== disposalStatusFilter) return false;
    if (regionFilter !== '全部' && a.region !== regionFilter) return false;
    if (searchQuery && !a.code.toLowerCase().includes(searchQuery.toLowerCase()) && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 故障告警与智能处置中心</h2>
              <span className="text-[11px] text-rose-400 px-2 py-0.5 bg-rose-950/80 border border-rose-800/60 rounded-md">
                实时监控中
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 当前未处置告警: <span className="text-rose-400 font-bold">{disposalSummary.pending} 个</span> · 已处置完成率: <span className="text-emerald-400 font-bold">{disposalSummary.completionRate}%</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('已刷新故障告警实时流与监测数据')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新告警流</span>
          </button>
        </div>
      </div>

      {/* Top 4 Overview Cards (Matching Screenshot Analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Alarm Type Overview */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-white">告警类型概况</span>
            <span className="text-[10px] text-cyan-400">总数: {ALARM_TYPE_TOTAL}个</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {ALARM_TYPE_STATS.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center"><span className="text-slate-300">{stat.label} ({stat.percent})</span><span className={`${stat.colorClass} font-bold`}>{stat.count}个</span></div>
            ))}
          </div>
        </div>

        {/* Card 2: Device Type Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-white">告警设备类型</span>
            <span className="text-[10px] text-cyan-400">设备监测分布</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            {ALARM_DEVICE_TYPE_STATS.map((stat) => (
              <div key={stat.label} className="p-2 bg-slate-950 rounded-lg border border-slate-800"><div className={`${stat.colorClass} font-bold text-sm`}>{stat.count}</div>{stat.label}</div>
            ))}
          </div>
        </div>

        {/* Card 3: Disposal Status Overview */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-white">处置情况概况</span>
            <span className="text-[10px] text-emerald-400">{disposalSummary.disposed}个已处置 / {disposalSummary.pending}个未处置</span>
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[11px]"><span className="text-slate-400">已处理比例</span><span className="text-emerald-400 font-bold">{disposalSummary.completionRate}%</span></div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${disposalSummary.completionRate}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-1">
              <span>紧急: {disposalSummary.pendingByLevel['紧急']}个</span>
              <span>严重: {disposalSummary.pendingByLevel['严重']}个</span>
              <span>一般: {disposalSummary.pendingByLevel['一般']}个</span>
            </div>
          </div>
        </div>

        {/* Card 4: Regional Alarm Overview */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-white">区域告警概况 (#1~#7)</span>
            <span className="text-[10px] text-amber-400">重点关注 #1,#3,#4</span>
          </div>
          <div className="flex justify-between items-end h-16 pt-2">
            {REGIONAL_ALARM_BARS.map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-3 rounded-t ${bar.colorClass} ${bar.heightClass}`}></div>
                <span className="text-[9px] text-slate-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">设备类型:</span>
          <select 
            value={deviceTypeFilter} 
            onChange={(e) => setDeviceTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="发电设备">发电设备</option>
            <option value="储能设备">储能设备</option>
            <option value="充电设备">充电设备</option>
            <option value="空调">空调</option>
            <option value="计量设备">计量设备</option>
            <option value="调控设备">调控设备</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">告警等级:</span>
          <select 
            value={alarmLevelFilter} 
            onChange={(e) => setAlarmLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="紧急">紧急</option>
            <option value="严重">严重</option>
            <option value="一般">一般</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">处置状态:</span>
          <select 
            value={disposalStatusFilter} 
            onChange={(e) => setDisposalStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="未处置">未处置</option>
            <option value="已处置">已处置</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">所在区域:</span>
          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="区域一">区域一</option>
            <option value="区域二">区域二</option>
            <option value="区域三">区域三</option>
            <option value="区域四">区域四</option>
            <option value="区域五">区域五</option>
            <option value="区域六">区域六</option>
            <option value="区域七">区域七</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="输入设备编号或名称搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setDeviceTypeFilter('全部'); setAlarmLevelFilter('全部'); setDisposalStatusFilter('全部'); setRegionFilter('全部'); setSearchQuery(''); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
          >
            重置
          </button>
          <button 
            onClick={() => showToast('已应用告警筛选条件')}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs cursor-pointer font-medium shadow-md shadow-cyan-900/30"
          >
            确定
          </button>
        </div>
      </div>

      {/* Alarm Detailed Table (Sorted Descending by Occurrence Time) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-white text-sm font-sans">故障告警明细表 (按发生时间降序排列)</h3>
          </div>
          <span className="text-[11px] text-slate-400">共筛选出 {filteredAlarms.length} 条告警记录</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">序号</th>
                <th className="p-3 font-semibold">设备编号</th>
                <th className="p-3 font-semibold">告警设备名称</th>
                <th className="p-3 font-semibold">设备类型</th>
                <th className="p-3 font-semibold">所在区域</th>
                <th className="p-3 font-semibold">资产归属</th>
                <th className="p-3 font-semibold">告警等级</th>
                <th className="p-3 font-semibold">告警类型</th>
                <th className="p-3 font-semibold">测值/阈值</th>
                <th className="p-3 font-semibold">告警时长</th>
                <th className="p-3 font-semibold">处置状态</th>
                <th className="p-3 font-semibold">发生时间 ↓</th>
                <th className="p-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlarms.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                  <td className="p-3 text-cyan-400 font-mono">{item.code}</td>
                  <td className="p-3 font-medium text-white font-mono">{item.name}</td>
                  <td className="p-3 text-slate-300">{item.type}</td>
                  <td className="p-3 text-slate-300">{item.region}</td>
                  <td className="p-3 text-slate-400">{item.owner}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      item.level === '紧急' ? 'bg-rose-950/60 text-rose-300 border-rose-800/80' :
                      item.level === '严重' ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' :
                      'bg-indigo-950/60 text-indigo-300 border-indigo-800/80'
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200">{item.alarmType}</td>
                  <td className="p-3 text-amber-300 font-mono">{item.value}</td>
                  <td className="p-3 text-slate-400 font-mono">{item.duration}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      item.status === '未处置' ? 'bg-rose-950/60 text-rose-400 border-rose-800/80 animate-pulse' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{item.time}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleGenerateOrder(item.id, item.name)}
                      disabled={item.status === '已处置'}
                      className={`px-3 py-1 rounded text-[11px] font-medium transition-colors border cursor-pointer ${
                        item.status === '已处置' 
                          ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed' 
                          : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-800 shadow-sm'
                      }`}
                    >
                      {item.status === '已处置' ? '已生成处置单' : '生成处置单'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
