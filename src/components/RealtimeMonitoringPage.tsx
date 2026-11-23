import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  BatteryCharging,
  Sun,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Maximize2,
  RefreshCw,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';

import { GenerationMonitoringView } from './GenerationMonitoringView';
import {
  HOURLY_CONSUMPTION_DATA,
  PANORAMA_BUILDINGS,
  PANORAMA_FACILITIES,
  PANORAMA_TRANSFORMERS,
  REALTIME_ALARMS,
  REALTIME_LOAD_DATA,
  summarizeRealtimeMonitoring
} from '../data/realtimeMonitoring';
import { PanoramaBuilding, RealtimeAlarm } from '../types';

interface RealtimeMonitoringPageProps {
  plantName: string;
  initialSubView?: 'panorama' | 'generation' | 'storage' | 'charging';
}

export const RealtimeMonitoringPage: React.FC<RealtimeMonitoringPageProps> = ({ plantName, initialSubView = 'generation' }) => {
  // Top Sub-Tabs matching screenshot: 厂站全景监测 | 发电资源监测 | 储能站监测 | 充电资源监测
  const [activeSubView, setActiveSubView] = useState<'panorama' | 'generation' | 'storage' | 'charging'>(initialSubView);
  const [selectedBuilding, setSelectedBuilding] = useState<PanoramaBuilding | null>(null);
  const [selectedAlarm, setSelectedAlarm] = useState<RealtimeAlarm | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 全景监测数据抽离为数据模块，页内只保留展示逻辑
  const buildings = PANORAMA_BUILDINGS;
  const transformers = PANORAMA_TRANSFORMERS;
  const facilities = PANORAMA_FACILITIES;
  const hourlyConsumptionData = HOURLY_CONSUMPTION_DATA;
  const realTimeLoadData = REALTIME_LOAD_DATA;
  const alarmList = REALTIME_ALARMS;

  // 图例与告警面板的统计数字由数据实时汇总
  const monitoringSummary = summarizeRealtimeMonitoring(buildings, transformers, alarmList);

  return (
    <div className="space-y-4 text-white font-sans animate-fadeIn">
      {/* 1. Top Sub-Navigation Tabs matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('panorama')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'panorama'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                : 'bg-slate-950/80 text-cyan-300 border border-cyan-800/60 hover:border-cyan-500 hover:text-white'
            }`}
          >
            厂站全景监测
          </button>
          <button
            onClick={() => setActiveSubView('generation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'generation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                : 'bg-slate-950/80 text-cyan-300 border border-cyan-800/60 hover:border-cyan-500 hover:text-white'
            }`}
          >
            发电资源监测
          </button>
          <button
            onClick={() => setActiveSubView('storage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'storage'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                : 'bg-slate-950/80 text-cyan-300 border border-cyan-800/60 hover:border-cyan-500 hover:text-white'
            }`}
          >
            储能站监测
          </button>
          <button
            onClick={() => setActiveSubView('charging')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'charging'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                : 'bg-slate-950/80 text-cyan-300 border border-cyan-800/60 hover:border-cyan-500 hover:text-white'
            }`}
          >
            充电资源监测
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono pr-2">
          <span className="text-slate-400">当前园区: <strong className="text-white">{plantName}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            实时三维遥信直采正常
          </span>
        </div>
      </div>

      {/* Sub-View Content Routing */}
      {activeSubView === 'generation' && (
        <GenerationMonitoringView plantName={plantName} />
      )}

      {activeSubView === 'panorama' && (
        <>
          {/* 2. Main 3D Campus Panorama Map Canvas */}
          <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#071322]">
        {/* Dark Isometric Campus Landscape Background with Grid and Cyber Energy Lines */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(12, 38, 70, 0.9) 0%, rgba(5, 16, 30, 0.98) 100%), linear-gradient(to right, rgba(20, 50, 80, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 50, 80, 0.15) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px'
          }}
        ></div>

        {/* Stylized Campus Roads & Buildings Layout via SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            {/* Overload Red Polygon Glow Gradient */}
            <radialGradient id="redOverloadGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.25" />
            </radialGradient>
            {/* Normal Blue Polygon Glow */}
            <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
            </radialGradient>
            {/* Storage Cyan Glow */}
            <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          {/* Perimeter Campus Roads */}
          <path d="M 50,560 L 950,560 L 920,40 L 80,40 Z" fill="none" stroke="#1e3a5f" strokeWidth="24" strokeLinejoin="round" opacity="0.6" />
          <path d="M 480,560 L 480,40" fill="none" stroke="#1e3a5f" strokeWidth="16" opacity="0.6" />
          <path d="M 50,300 L 950,300" fill="none" stroke="#1e3a5f" strokeWidth="14" opacity="0.4" />

          {/* Building #1 Polygon */}
          <polygon points="80,360 240,360 250,530 80,530" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Building #2 Polygon */}
          <polygon points="260,380 470,380 470,530 260,530" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Building #3 Polygon */}
          <polygon points="500,240 580,240 580,510 500,510" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Building #4 Polygon (OVERLOAD RED AREA) */}
          <polygon points="600,240 850,240 860,530 610,530" fill="url(#redOverloadGlow)" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" className="animate-pulse" />
          {/* Building #5 Polygon (OVERLOAD RED AREA) */}
          <polygon points="170,220 470,220 460,350 160,350" fill="url(#redOverloadGlow)" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" className="animate-pulse" />
          {/* Building #6 Polygon */}
          <polygon points="280,60 380,60 380,190 280,190" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Building #7 Polygon */}
          <polygon points="400,60 470,60 470,190 400,190" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Building #8 Polygon */}
          <polygon points="490,60 570,60 570,190 490,190" fill="url(#blueGlow)" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />

          {/* Storage Station #4 at bottom right */}
          <polygon points="870,440 970,470 940,560 860,550" fill="url(#cyanGlow)" stroke="#06b6d4" strokeWidth="2" />
        </svg>

        {/* Top-Left Legend Overlay matching screenshot */}
        <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-red-600 rounded-sm shadow-[0_0_8px_#ef4444]"></span>
            <span className="text-white font-semibold">超出区域近三日平均负荷</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-amber-500 rounded-sm shadow-[0_0_8px_#f59e0b]"></span>
            <span className="text-white font-semibold">发生告警</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-red-600 rounded-sm shadow-[0_0_8px_#ef4444]"></span>
            <span className="text-white font-semibold">负荷超限建筑 {monitoringSummary.overloadBuildings} 栋 / 共 {monitoringSummary.buildingTotal} 栋</span>
          </div>
        </div>

        {/* Overlay Pins, Cards, and Badges for each Building matching screenshot */}
        {buildings.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            onClick={() => setSelectedBuilding(b)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group transition-transform hover:scale-105"
          >
            {/* White Pin with Number matching screenshot */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-slate-200">
                {b.number}
              </div>

              {/* Status Card matching screenshot: RED for #4 & #5, BLUE for others */}
              <div
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold shadow-xl flex flex-col gap-0.5 min-w-[125px] ${
                  b.isOverload
                    ? 'bg-red-600/90 text-white border-red-400 shadow-[0_0_18px_rgba(239,68,68,0.7)]'
                    : 'bg-blue-600/90 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${b.isOverload ? 'bg-red-800' : 'bg-blue-800'}`}>P</span>
                  <span>{b.p}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${b.isOverload ? 'bg-red-800' : 'bg-blue-800'}`}>E</span>
                  <span>{b.e}</span>
                </div>
              </div>
            </div>

            {/* Distributed PV Yellow Badge on Roof */}
            {b.pvBadge && (
              <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded bg-yellow-400/90 text-slate-950 font-black text-[10px] border border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.6)]">
                {b.pvBadge}
              </div>
            )}
          </div>
        ))}

        {/* Transformers matching screenshot */}
        {transformers.map((tf) => (
          <div
            key={tf.id}
            style={{ left: `${tf.x}%`, top: `${tf.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 font-mono text-xs cursor-pointer group"
          >
            {/* Orange Icon */}
            <div className="p-1 rounded bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_#f59e0b]">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-1 rounded">{tf.name}</div>
              <div className="bg-blue-600/90 border border-blue-400 rounded px-2 py-0.5 text-white font-bold text-[10px] shadow-lg flex items-center gap-1">
                <span>P {tf.p}</span>
                <span className="text-cyan-200">| T {tf.t}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Storage Station & Charging Badges matching screenshot */}
        {facilities.map((fac, i) => (
          <div
            key={i}
            style={{ left: `${fac.x}%`, top: `${fac.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded font-bold text-[10px] font-mono border shadow-md ${
              fac.type === 'storage'
                ? 'bg-cyan-900/90 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                : 'bg-emerald-900/90 text-emerald-200 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            }`}
          >
            {fac.name}
          </div>
        ))}
      </div>

      {/* 3. Bottom 3 Analytical Panels matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: 逐时用电量 (kW/h) - Double bar chart (今日 cyan, 明日 yellow) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span> 今日
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]"></span> 明日
              </span>
            </div>
            <div className="px-3 py-0.5 bg-blue-900/60 text-cyan-200 border border-blue-500/50 rounded-lg text-xs font-black tracking-wide">
              逐时用电量
            </div>
            <span className="text-[10px] text-slate-400 font-mono">(kW/h)</span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 flex items-end justify-between gap-1 relative overflow-x-auto">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-2 inset-y-2 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-slate-600">
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>1000</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>800</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>600</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>400</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>200</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>0</span></div>
            </div>

            {/* Bars for each hour */}
            {hourlyConsumptionData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 gap-0.5 group">
                <div className="w-full flex items-end justify-center gap-0.5 h-32">
                  {/* Today Cyan Bar */}
                  <div
                    style={{ height: `${(d.today / 1000) * 100}%` }}
                    className="w-1.5 sm:w-2 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t shadow-[0_0_4px_#22d3ee] group-hover:brightness-125 transition-all"
                  ></div>
                  {/* Tomorrow Yellow Bar */}
                  <div
                    style={{ height: `${(d.tomorrow / 1000) * 100}%` }}
                    className="w-1.5 sm:w-2 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-t shadow-[0_0_4px_#facc15] group-hover:brightness-125 transition-all"
                  ></div>
                </div>
                <span className="text-[8px] font-mono text-slate-400 group-hover:text-white transition-colors">{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: 实时负荷及预测 (kW) - Dual line curves */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span> 今日
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span> 明日
              </span>
            </div>
            <div className="px-3 py-0.5 bg-blue-900/60 text-cyan-200 border border-blue-500/50 rounded-lg text-xs font-black tracking-wide">
              实时负荷及预测
            </div>
            <span className="text-[10px] text-slate-400 font-mono">(kW)</span>
          </div>

          {/* SVG Line Canvas */}
          <div className="h-44 bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 relative">
            <div className="absolute inset-x-2 inset-y-2 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-slate-600">
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>400</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>300</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>200</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>100</span></div>
              <div className="border-b border-slate-800/60 w-full flex justify-between"><span>0</span></div>
            </div>

            <svg className="w-full h-32 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              {/* Today Cyan Line */}
              {(() => {
                const pts = realTimeLoadData.map((d, i) => {
                  const x = (i / (realTimeLoadData.length - 1)) * 380 + 10;
                  const y = 115 - (d.today / 400) * 105;
                  return `${x},${y}`;
                });
                return <path d={`M ${pts.join(' L ')}`} fill="none" stroke="#22d3ee" strokeWidth="2.5" className="filter drop-shadow-[0_0_6px_#22d3ee]" />;
              })()}

              {/* Tomorrow Yellow Line */}
              {(() => {
                const pts = realTimeLoadData.map((d, i) => {
                  const x = (i / (realTimeLoadData.length - 1)) * 380 + 10;
                  const y = 115 - (d.tomorrow / 400) * 105;
                  return `${x},${y}`;
                });
                return <path d={`M ${pts.join(' L ')}`} fill="none" stroke="#f59e0b" strokeWidth="2.5" className="filter drop-shadow-[0_0_6px_#f59e0b]" />;
              })()}
            </svg>

            {/* X-axis time marks */}
            <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
              {realTimeLoadData.filter((_, i) => i % 2 === 0).map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: 故障告警 (Fault Alarm) - Recent Times Descending */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs text-rose-300 font-bold font-mono">活动告警流</span>
            </div>
            <div className="px-3 py-0.5 bg-blue-900/60 text-cyan-200 border border-blue-500/50 rounded-lg text-xs font-black tracking-wide">
              故障告警
            </div>
            <span className="text-[10px] text-amber-400 font-mono">时间降序 ↓ · 未处置 {monitoringSummary.unresolvedAlarms} 条 / 共 {monitoringSummary.alarmTotal} 条</span>
          </div>

          {/* Alarm Rows matching screenshot */}
          <div className="h-44 bg-slate-950/70 rounded-xl p-2 border border-slate-800/80 overflow-y-auto space-y-1.5 font-mono text-xs">
            {alarmList.map((al) => (
              <div
                key={al.id}
                onClick={() => setSelectedAlarm(al)}
                className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                  {/* Severity Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                      al.level === '严重'
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : al.level === '紧急'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    }`}
                  >
                    {al.level}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                      al.status === '未处置'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    {al.status}
                  </span>

                  {/* Device Text */}
                  <span className="text-white text-[11px] truncate group-hover:text-cyan-300 transition-colors">
                    {al.device}
                  </span>
                </div>

                {/* Timestamp (Recent Descending) */}
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {al.time.slice(5, 16)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )}

      {/* Storage SubView Fallback/View */}
      {activeSubView === 'storage' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <BatteryCharging className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">储能电站实时运行监测</h3>
          <p className="text-slate-400 text-xs font-mono max-w-lg mx-auto">
            1#~4# 磷酸铁锂储能仓运行正常 · 总储能容量 2.5 MWh · 当前综合 SOC 84.5% · 处于平段待机/峰段顶峰支撑模式
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveSubView('generation')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              切换至【发电资源监测】
            </button>
            <button
              onClick={() => setActiveSubView('panorama')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer font-bold"
            >
              返回【厂站全景监测】
            </button>
          </div>
        </div>
      )}

      {/* Charging SubView Fallback/View */}
      {activeSubView === 'charging' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">充电资源实时监测</h3>
          <p className="text-slate-400 text-xs font-mono max-w-lg mx-auto">
            1#~3# 园区智能充电站 · 24把直流快充枪运行正常 · 实时充电总功率 640.0 kW · 动态有序充电负荷柔性平抑中
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveSubView('generation')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              切换至【发电资源监测】
            </button>
            <button
              onClick={() => setActiveSubView('panorama')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer font-bold"
            >
              返回【厂站全景监测】
            </button>
          </div>
        </div>
      )}

      {/* Building Detail Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center">
                  {selectedBuilding.number}
                </div>
                <h4 className="text-sm font-bold text-white">{selectedBuilding.name}</h4>
              </div>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">实时负荷功率 (P):</span>
                <span className={`font-bold ${selectedBuilding.isOverload ? 'text-red-400 text-sm' : 'text-cyan-300 text-sm'}`}>
                  {selectedBuilding.p}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">累计能耗 (E):</span>
                <span className="text-emerald-400 font-bold">{selectedBuilding.e}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">分布式光伏出力:</span>
                <span className="text-yellow-400 font-bold">{selectedBuilding.pvPower}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">室内/机房温度:</span>
                <span className="text-white font-bold">{selectedBuilding.temp}</span>
              </div>
              {selectedBuilding.note && (
                <div className="p-2 rounded bg-red-950/60 border border-red-800/80 text-red-300 text-[11px] font-bold">
                  ⚠️ {selectedBuilding.note}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedBuilding(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showToast(`已对 ${selectedBuilding.name} 成功触发负荷柔性调控指令！`);
                  setSelectedBuilding(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer"
              >
                下发调控指令
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alarm Detail Modal */}
      {selectedAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h4 className="text-sm font-bold text-white">故障告警处置工单</h4>
              </div>
              <button
                onClick={() => setSelectedAlarm(null)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">告警编号:</span>
                <span className="text-slate-200">{selectedAlarm.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">告警时间:</span>
                <span className="text-amber-400 font-bold">{selectedAlarm.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">告警设备:</span>
                <span className="text-white font-bold">{selectedAlarm.device}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">告警级别:</span>
                <span className={`font-bold ${selectedAlarm.level === '严重' ? 'text-red-400' : 'text-amber-400'}`}>{selectedAlarm.level}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                {selectedAlarm.detail}
              </div>
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-[11px]">
                处置建议: {selectedAlarm.action}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlarm(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  showToast(`已成功针对 ${selectedAlarm.device} 生成现场运维处置工单！`);
                  setSelectedAlarm(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
              >
                生成处置工单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 font-bold text-xs shadow-2xl backdrop-blur-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
