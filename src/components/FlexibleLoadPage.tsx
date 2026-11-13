import React, { useState } from 'react';
import { 
  Zap, Sliders, Activity, ShieldCheck, AlertTriangle, Play, RefreshCw, 
  CheckCircle2, ArrowUpRight, Cpu, BarChart3, Radio, Layers, X, FileText
} from 'lucide-react';

interface FlexibleLoadPageProps {
  plantName: string;
  systemDateTime: string;
}

export const FlexibleLoadPage: React.FC<FlexibleLoadPageProps> = ({ plantName, systemDateTime }) => {
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [targetPower, setTargetPower] = useState<number>(3200);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Work Order Modal State (Matching Screenshot)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDevice, setModalDevice] = useState({
    name: '#1~3 园区智能超级快充站',
    code: 'FDSB00001',
    region: '区域一',
    customer: '青海新能源高载能大用户',
    level: '严重',
    alarmType: '柔性负荷越限告警',
    time: '2026-10-16 15:10',
    duration: '45min',
    phenomenon: '区域柔性负荷短时冲击超限，主变负荷率瞬时达到 93.4%。',
    analysis: '晚高峰新能源充电负荷与工业电解车间负荷叠加，电网侧需进行柔性平抑。',
    process: '已下发柔性调控指令，对快充桩集群进行功率下调 400kW，负荷曲线恢复平稳。',
    isResolved: '是',
    disposeTime: '2026-10-16 15:25',
    operator: '张工 (调度值班员)'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExecuteDispatch = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      showToast(`已成功向 [${plantName} - #${selectedZone}区域] 下发 ${targetPower}kW 柔性调控指令`);
    }, 1200);
  };

  const zones = [
    { id: 1, name: '#1区域 (新能源充电站)', load: '980.5 kW', capacity: '1,500 kW', status: '正常运行', highLoad: false, devices: 12, transformers: 2 },
    { id: 2, name: '#2区域 (化工电解车间)', load: '2,450.0 kW', capacity: '3,000 kW', status: '今日负荷过高', highLoad: true, devices: 18, transformers: 3 },
    { id: 3, name: '#3区域 (综合办公楼)', load: '420.0 kW', capacity: '850 kW', status: '正常运行', highLoad: false, devices: 8, transformers: 1 },
    { id: 4, name: '#4区域 (智能立体仓储)', load: '1,150.0 kW', capacity: '1,200 kW', status: '今日负荷过高', highLoad: true, devices: 15, transformers: 2 },
    { id: 5, name: '#5区域 (生化曝气风机)', load: '720.0 kW', capacity: '900 kW', status: '正常运行', highLoad: false, devices: 10, transformers: 2 },
    { id: 6, name: '#6区域 (辅助生产车间)', load: '890.0 kW', capacity: '1,000 kW', status: '正常运行', highLoad: false, devices: 11, transformers: 2 },
    { id: 7, name: '#7区域 (综合动力站)', load: '610.0 kW', capacity: '800 kW', status: '正常运行', highLoad: false, devices: 9, transformers: 1 },
  ];

  const currentZoneData = zones.find(z => z.id === selectedZone) || zones[0];

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
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 柔性负荷与拓扑网架监测中心</h2>
              <span className="text-[11px] text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                10kV母线拓扑联控
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 全厂总负荷容量: <span className="text-white font-bold">7,220.5 kW</span> · 拓扑节点监控: <span className="text-emerald-400 font-bold">7个区域正常联通</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors border border-cyan-500 font-medium text-xs cursor-pointer shadow-md shadow-cyan-900/40"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>生成故障处置工单</span>
          </button>
          <button 
            onClick={() => showToast('已刷新10kV母线拓扑与各区域遥测状态')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新拓扑</span>
          </button>
        </div>
      </div>

      {/* Topology Legend & Overview Bar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm font-sans">10kV 厂区主母线及 7 大网架区域拓扑监控</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-500 inline-block"></span> 母线</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> 配线</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> 刀闸/手车</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/40 font-bold">今日负荷过高</span></span>
          </div>
        </div>

        {/* 7 Zones Interactive Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                selectedZone === zone.id 
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400' 
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {zone.highLoad && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-bl">
                  过高
                </div>
              )}
              <div>
                <div className="text-[11px] text-cyan-300 font-bold mb-1">#{zone.id} 区域</div>
                <div className="text-xs font-semibold truncate">{zone.name.split(' ')[1]}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{zone.load}</span>
                <span className={zone.highLoad ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{zone.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Zone Deep Dive & Flexible Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 font-sans">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{currentZoneData.name} — 柔性负荷网架调节控制台</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-2.5 py-1 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-700/60 rounded text-[11px] transition-colors cursor-pointer"
              >
                生成该区故障处置单
              </button>
              <span className={`text-[11px] px-2 py-0.5 rounded border ${currentZoneData.highLoad ? 'bg-amber-950/60 text-amber-300 border-amber-800' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'}`}>
                {currentZoneData.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">当前区域负荷</span>
              <div className="text-xl font-bold text-amber-300 font-sans mt-1">{currentZoneData.load}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">额定容量: {currentZoneData.capacity}</span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">配电变压器/开关</span>
              <div className="text-xl font-bold text-cyan-300 font-sans mt-1">{currentZoneData.transformers} 台主变</div>
              <span className="text-[10px] text-emerald-400 mt-1 block">● 刀闸与手车运行正常</span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">接入智能终端</span>
              <div className="text-xl font-bold text-indigo-300 font-sans mt-1">{currentZoneData.devices} 个</div>
              <span className="text-[10px] text-slate-500 mt-1 block">空调/充电桩/生产设备</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">目标柔性平抑/削峰功率 (kW):</span>
              <span className="text-cyan-300 font-bold text-base font-sans tabular-nums">{targetPower.toLocaleString()} kW</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="2500" 
              step="50"
              value={targetPower} 
              onChange={(e) => setTargetPower(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>200 kW (微调)</span>
              <span>1,200 kW (平衡)</span>
              <span>2,500 kW (最大极限)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400">
              目标区域: <span className="text-cyan-300 font-bold">{currentZoneData.name}</span> · 自动联动刀闸响应
            </div>
            <button
              onClick={handleExecuteDispatch}
              disabled={isExecuting}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isExecuting ? '下发调控中...' : `对 #${selectedZone} 区域下发柔性指令`}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 font-sans">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>区域子设备及告警详情</span>
              </h3>
              <span className="text-[11px] text-slate-400">实时遥测</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-medium">10kV 母线进线柜 #{selectedZone}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">电压: 10.2kV · 电流: 284.5A</div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">正常</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-medium">智能配电变压器 T{selectedZone}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">负荷率: 88.5% · 油温: 58°C</div>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">运行</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-medium">空调与生产负荷终端群</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">可中断潜力: 350.0 kW</div>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">可调</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-300/90 leading-relaxed">
            提示: 点击上方 #1~#7 区域卡片可切换网架分支，或随时点击“生成故障处置工单”按钮填写处置单。
          </div>
        </div>
      </div>

      {/* GENERATE FAULT DISPOSAL WORK ORDER MODAL (Matching Screenshot) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scaleIn text-xs">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">生成故障处置工单</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-[11px] text-slate-400">
                  <div className="tracking-widest font-bold text-cyan-300">2026101600001</div>
                  <div className="text-[9px] text-slate-500">BARCODE SERIAL</div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Section 1: 基本情况 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  基本情况 (Basic Information)
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">设备名称</div>
                    <div className="p-2.5 text-white font-medium col-span-1 border-r border-slate-800">{modalDevice.name}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">设备编号</div>
                    <div className="p-2.5 text-cyan-300 font-mono col-span-1">{modalDevice.code}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">所属区域</div>
                    <div className="p-2.5 text-slate-200 col-span-1 border-r border-slate-800">#{selectedZone} 区域 ({currentZoneData.name.split(' ')[1]})</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">所属客户</div>
                    <div className="p-2.5 text-slate-200 col-span-1">{modalDevice.customer}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">告警等级</div>
                    <div className="p-2.5 text-rose-400 font-bold col-span-1 border-r border-slate-800">{modalDevice.level}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">告警类型</div>
                    <div className="p-2.5 text-amber-300 col-span-1">{modalDevice.alarmType}</div>
                  </div>
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">告警时间</div>
                    <div className="p-2.5 text-slate-200 font-mono col-span-1 border-r border-slate-800">{systemDateTime}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 col-span-1">告警时长</div>
                    <div className="p-2.5 text-slate-200 font-mono col-span-1">45min</div>
                  </div>
                </div>
              </div>

              {/* Section 2: 故障处置 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  故障处置记录 (Fault Disposal & Response)
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden space-y-px bg-slate-800">
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">故障现象</div>
                    <div className="p-2.5 col-span-3">
                      <textarea 
                        value={modalDevice.phenomenon}
                        onChange={(e) => setModalDevice({...modalDevice, phenomenon: e.target.value})}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-400 resize-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">原因分析</div>
                    <div className="p-2.5 col-span-3">
                      <textarea 
                        value={modalDevice.analysis}
                        onChange={(e) => setModalDevice({...modalDevice, analysis: e.target.value})}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-400 resize-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">处置过程</div>
                    <div className="p-2.5 col-span-3">
                      <textarea 
                        value={modalDevice.process}
                        onChange={(e) => setModalDevice({...modalDevice, process: e.target.value})}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none focus:border-cyan-400 resize-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 bg-slate-950 items-center">
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">是否已解决</div>
                    <div className="p-3 col-span-3 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input 
                          type="radio" 
                          name="resolved" 
                          checked={modalDevice.isResolved === '是'} 
                          onChange={() => setModalDevice({...modalDevice, isResolved: '是'})}
                          className="accent-cyan-400"
                        />
                        <span>是</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input 
                          type="radio" 
                          name="resolved" 
                          checked={modalDevice.isResolved === '否'} 
                          onChange={() => setModalDevice({...modalDevice, isResolved: '否'})}
                          className="accent-cyan-400"
                        />
                        <span>否</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">处置时间</div>
                    <div className="p-2.5 col-span-1 border-r border-slate-800 flex items-center">
                      <input 
                        type="text" 
                        value={modalDevice.disposeTime}
                        onChange={(e) => setModalDevice({...modalDevice, disposeTime: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="p-3 bg-slate-900/60 text-slate-400 font-semibold col-span-1 flex items-center border-r border-slate-800">处置人员</div>
                    <div className="p-2.5 col-span-1 flex items-center">
                      <input 
                        type="text" 
                        value={modalDevice.operator}
                        onChange={(e) => setModalDevice({...modalDevice, operator: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-sans text-xs outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setModalDevice({
                    ...modalDevice,
                    phenomenon: '',
                    analysis: '',
                    process: ''
                  });
                  showToast('已重置处置工单填写内容');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              >
                重置
              </button>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  showToast(`故障处置工单 [2026101600001] 已成功生成并归档！`);
                }}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                确认生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
