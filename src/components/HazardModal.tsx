import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Calendar, User, MapPin } from 'lucide-react';
import { HazardItem, HazardLevel, HazardStatus } from '../types';

interface HazardModalProps {
  hazard?: HazardItem | null;
  onClose: () => void;
  onSave: (hazard: HazardItem) => void;
}

export const HazardModal: React.FC<HazardModalProps> = ({ hazard, onClose, onSave }) => {
  const [title, setTitle] = useState(hazard?.title || '');
  const [station, setStation] = useState(hazard?.station || '500kV 滨海变电站');
  const [voltageLevel, setVoltageLevel] = useState(hazard?.voltageLevel || '500kV');
  const [level, setLevel] = useState<HazardLevel>(hazard?.level || '较大隐患');
  const [status, setStatus] = useState<HazardStatus>(hazard?.status || '待整改');
  const [deadline, setDeadline] = useState(hazard?.deadline || '2026-10-30');
  const [responsiblePerson, setResponsiblePerson] = useState(hazard?.responsiblePerson || '张工');
  const [department, setDepartment] = useState(hazard?.department || '变电运维班');
  const [description, setDescription] = useState(hazard?.description || '');
  const [aiSuggestion, setAiSuggestion] = useState(hazard?.aiSuggestion || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHazard: HazardItem = {
      id: hazard?.id || `h-${Date.now()}`,
      code: hazard?.code || `HD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      station,
      voltageLevel,
      level,
      status,
      discoveredDate: hazard?.discoveredDate || new Date().toISOString().split('T')[0],
      deadline,
      responsiblePerson,
      department,
      description,
      aiSuggestion: aiSuggestion || '建议立即开展红外测温与负荷监测，制定专项消缺方案。',
      coordinates: hazard?.coordinates || { x: Math.floor(20 + Math.random() * 60), y: Math.floor(20 + Math.random() * 60) }
    };
    onSave(newHazard);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {hazard ? '编辑电力安全隐患信息' : '登记新电力安全隐患'}
              </h3>
              <p className="text-xs text-slate-400">{hazard ? `编号: ${hazard.code}` : '录入电网设备隐患及风险台账'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-cyan-300">隐患标题 / 缺陷描述</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：#3主变冷却器端子排发热严重"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">所属变电站 / 线路</label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="例如：500kV 滨海变电站"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">电压等级</label>
              <select
                value={voltageLevel}
                onChange={(e) => setVoltageLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="500kV">500kV 超高压</option>
                <option value="220kV">220kV 高压</option>
                <option value="110kV">110kV 高压</option>
                <option value="35kV">35kV 及以下</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">隐患级别</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as HazardLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="重大隐患">🔴 重大隐患</option>
                <option value="较大隐患">🟠 较大隐患</option>
                <option value="一般隐患">🟡 一般隐患</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">当前状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as HazardStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="待整改">待整改</option>
                <option value="整改中">整改中</option>
                <option value="复查验收">复查验收</option>
                <option value="已闭环">已闭环</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">整改截止日期</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyan-300">责任人 / 班组</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  placeholder="责任人"
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="所属班组"
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-cyan-300">详细现象及现场描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="详细记录隐患的设备部位、现象、测试数据及潜在后果..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-cyan-300 flex items-center justify-between">
                <span>AI 专家消缺建议</span>
                <span className="text-[11px] text-cyan-400">支持智能推荐</span>
              </label>
              <textarea
                value={aiSuggestion}
                onChange={(e) => setAiSuggestion(e.target.value)}
                rows={2}
                placeholder="AI 辅助生成的整改对策..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              保存隐患信息
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
