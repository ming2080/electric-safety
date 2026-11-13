import React, { useState } from 'react';
import { 
  DollarSign, CheckSquare, Search, Filter, RefreshCw, CheckCircle2, FileText, ArrowUpRight, ArrowDownRight, Layers, X, Download 
} from 'lucide-react';

interface MonthlySettlementPageProps {
  plantName: string;
  systemDateTime: string;
}

export const MonthlySettlementPage: React.FC<MonthlySettlementPageProps> = ({ plantName, systemDateTime }) => {
  const [settlementMonth, setSettlementMonth] = useState<string>('6月');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bill Modal State ("月结算对账单" Matching Screenshot)
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);
  const [activeBillItem, setActiveBillItem] = useState({
    code: '2309209392',
    name: '青海盐湖化工高载能总厂',
    type: '工业大用户',
    region: '区域一',
    account: '2399239293929329229',
    bank: '招商银行西宁分行城西支行',
    contact: '张伟鹏',
    phone: '139****8231',
    energy: '23,929.98 kW/h',
    revenue: '23,929.98 元',
    bonus: '3,929.98 元',
    total: '27,929.98 元 (贰万柒仟玖佰贰拾玖元玖角捌分)',
    period: '2026年10月'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Settlement detail items sorted descending
  const [settlements, setSettlements] = useState([
    { id: 1, code: '2323121212', name: '青海盐湖化工高载能总厂', type: '工业', hours: 18, trades: 3, energy: '3,257.12', profit: '2,398.09', bonus: '1,200.09', total: '3,598.18', status: '待生成' },
    { id: 2, code: '4323121122', name: '柴达木盆地智慧算力集群', type: '商业', hours: 4, trades: 1, energy: '1,122.31', profit: '2,398.09', bonus: '987.09', total: '3,385.18', status: '待生成' },
    { id: 3, code: '092298382', name: '格尔木畜牧居辛中心', type: '农业', hours: 12, trades: 4, energy: '7,892.09', profit: '2,398.09', bonus: '1,024.58', total: '3,422.67', status: '待确认' },
    { id: 4, code: '1209230932', name: '西宁经济开发区大数据中心', type: '科技', hours: 10, trades: 6, energy: '1,283.12', profit: '2,398.09', bonus: '456.09', total: '2,854.18', status: '待结算' },
    { id: 5, code: '2323121213', name: '青海绿能高载能车间', type: '工业', hours: 3, trades: 3, energy: '521.12', profit: '2,398.09', bonus: '1,200.09', total: '3,598.18', status: '已结算' },
    { id: 6, code: '4323121125', name: '青海云计算枢纽节点', type: '商业', hours: 23, trades: 10, energy: '3,452.42', profit: '2,398.09', bonus: '987.09', total: '3,385.18', status: '待生成' },
    { id: 7, code: '092298389', name: '共和县光伏配套农业基地', type: '农业', hours: 18, trades: 12, energy: '3,257.12', profit: '2,398.09', bonus: '1,024.58', total: '3,422.67', status: '待结算' },
    { id: 8, code: '1209230944', name: '青海省智能算力中心', type: '科技', hours: 4, trades: 6, energy: '1,122.31', profit: '2,398.09', bonus: '456.09', total: '2,854.18', status: '待确认' },
    { id: 9, code: '2323121219', name: '茫崖市特种冶炼厂', type: '工业', hours: 12, trades: 3, energy: '7,892.09', profit: '2,398.09', bonus: '1,200.09', total: '3,598.18', status: '待结算' },
    { id: 10, code: '4323121133', name: '德令哈储能产业园', type: '商业', hours: 10, trades: 1, energy: '1,283.12', profit: '2,398.09', bonus: '987.09', total: '3,385.18', status: '已结算' },
  ]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredSettlements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSettlements.map(s => s.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchGenerate = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量生成的对账条目');
      return;
    }
    setSettlements(settlements.map(s => selectedIds.includes(s.id) && s.status === '待生成' ? { ...s, status: '待确认' } : s));
    showToast(`已成功批量生成选中的 ${selectedIds.length} 个用户结算对账单`);
    setSelectedIds([]);
  };

  const handleBatchSettle = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量结算的对账条目');
      return;
    }
    setSettlements(settlements.map(s => selectedIds.includes(s.id) ? { ...s, status: '已结算' } : s));
    showToast(`已成功批量完成选中的 ${selectedIds.length} 个用户账单结算`);
    setSelectedIds([]);
  };

  const handleAction = (item: any, actionType: string) => {
    if (actionType === 'generate') {
      setSettlements(settlements.map(s => s.id === item.id ? { ...s, status: '待确认' } : s));
      showToast(`已成功为 [${item.name}] 生成月结对账单`);
    } else if (actionType === 'settle') {
      setSettlements(settlements.map(s => s.id === item.id ? { ...s, status: '已结算' } : s));
      showToast(`已成功完成 [${item.name}] 的账单清算与结算付款`);
    } else {
      setActiveBillItem({
        code: item.code,
        name: item.name,
        type: item.type + '用户',
        region: '区域一',
        account: '2399239293929329229',
        bank: '招商银行西宁分行城西支行',
        contact: '张伟鹏',
        phone: '139****8231',
        energy: item.energy + '0 kW/h',
        revenue: item.profit + ' 元',
        bonus: item.bonus + ' 元',
        total: item.total + ' 元 (贰万柒仟玖佰贰拾玖元玖角捌分)',
        period: '2026年10月'
      });
      setIsBillModalOpen(true);
    }
  };

  const filteredSettlements = settlements.filter(s => {
    if (statusFilter !== '全部' && s.status !== statusFilter) return false;
    if (searchQuery && !s.code.toLowerCase().includes(searchQuery.toLowerCase()) && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 月结算对账管理中心</h2>
              <span className="text-[11px] text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                财务清算与对账对付
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 当前结算月份: <span className="text-white font-bold">{settlementMonth}</span> · 账单清算遵从率: <span className="text-emerald-400 font-bold">100%</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('已刷新月结算对账凭证与财务数据')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新对账</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Bill Settlement Overview (6 Cards) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-sans">账单结算概况</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">结算月份:</span>
            <select 
              value={settlementMonth}
              onChange={(e) => setSettlementMonth(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-cyan-300 rounded-lg px-3 py-1 text-xs outline-none focus:border-cyan-400 font-mono"
            >
              <option value="6月">6月</option>
              <option value="7月">7月</option>
              <option value="8月">8月</option>
              <option value="9月">9月</option>
              <option value="10月">10月</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月出清量</div>
              <div className="text-lg font-bold text-white font-sans tabular-nums">3,234.13 <span className="text-[10px] text-slate-400 font-normal">MW</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-rose-400 flex items-center"><ArrowDownRight className="w-3 h-3" /> 较上月 1.23%</span>
              <span className="text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded">出清负荷</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月交易合同</div>
              <div className="text-lg font-bold text-white font-sans tabular-nums">45 <span className="text-[10px] text-slate-400 font-normal">个</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-rose-400 flex items-center"><ArrowDownRight className="w-3 h-3" /> 较上月 1.23%</span>
              <span className="text-amber-400 font-bold bg-amber-950 px-1.5 py-0.5 rounded">交易合同</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月参与交易用户</div>
              <div className="text-lg font-bold text-white font-sans tabular-nums">32 <span className="text-[10px] text-slate-400 font-normal">户</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-rose-400 flex items-center"><ArrowDownRight className="w-3 h-3" /> 较上月 1.23%</span>
              <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">交易用户</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月执行电量</div>
              <div className="text-lg font-bold text-cyan-300 font-sans tabular-nums">34,823.09 <span className="text-[10px] text-slate-400 font-normal">kW/h</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 33.52%</span>
              <span className="text-indigo-400 font-bold bg-indigo-950 px-1.5 py-0.5 rounded">执行电量</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月执行均价</div>
              <div className="text-lg font-bold text-amber-300 font-sans tabular-nums">2.98 <span className="text-[10px] text-slate-400 font-normal">元/kW/h</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 33.52%</span>
              <span className="text-purple-400 font-bold bg-purple-950 px-1.5 py-0.5 rounded">执行均价</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">当月结算费用</div>
              <div className="text-lg font-bold text-emerald-300 font-sans tabular-nums">32,323.14 <span className="text-[10px] text-slate-400 font-normal">元</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> 较上月 43.52%</span>
              <span className="text-rose-400 font-bold bg-rose-950 px-1.5 py-0.5 rounded">结算费用</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Bill Settlement Details */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-sans">账单结算明细 (按近期记录降序排列)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchGenerate}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>批量生成 ({selectedIds.length})</span>
            </button>
            <button
              onClick={handleBatchSettle}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>批量结算 ({selectedIds.length})</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">结算月份:</span>
            <span className="text-cyan-300 font-bold font-mono">{settlementMonth}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">账单状态:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
            >
              <option value="全部">全部状态</option>
              <option value="待生成">待生成</option>
              <option value="待确认">待确认</option>
              <option value="待结算">待结算</option>
              <option value="已结算">已结算</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="输入用电编号或用户名称搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setStatusFilter('全部'); setSearchQuery(''); setSelectedIds([]); }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
            >
              重置
            </button>
            <button 
              onClick={() => showToast('已成功应用对账筛选条件')}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs cursor-pointer font-medium"
            >
              确定
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredSettlements.length > 0 && selectedIds.length === filteredSettlements.length}
                    onChange={handleToggleSelectAll}
                    className="accent-cyan-400 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-semibold">序号</th>
                <th className="p-3 font-semibold">用电编号</th>
                <th className="p-3 font-semibold">用户名称</th>
                <th className="p-3 font-semibold">用户类型</th>
                <th className="p-3 font-semibold">本月调控时长 (h)</th>
                <th className="p-3 font-semibold">本月参与市场化交易</th>
                <th className="p-3 font-semibold">调控电量 (kW/h)</th>
                <th className="p-3 font-semibold">调控收益 (元)</th>
                <th className="p-3 font-semibold">奖励收益 (元)</th>
                <th className="p-3 font-semibold">总收益 (元)</th>
                <th className="p-3 font-semibold">账单状态</th>
                <th className="p-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSettlements.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="accent-cyan-400 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                  <td className="p-3 text-cyan-400 font-mono font-bold">{item.code}</td>
                  <td className="p-3 font-medium text-white font-sans">{item.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200 font-mono tabular-nums">{item.hours}h</td>
                  <td className="p-3 text-slate-300 font-mono tabular-nums">{item.trades} 次</td>
                  <td className="p-3 text-amber-300 font-mono tabular-nums font-bold">{item.energy}</td>
                  <td className="p-3 text-slate-200 font-mono tabular-nums">{item.profit}</td>
                  <td className="p-3 text-emerald-300 font-mono tabular-nums">{item.bonus}</td>
                  <td className="p-3 text-cyan-300 font-mono tabular-nums font-bold">{item.total}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      item.status === '待生成' ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80 animate-pulse' :
                      item.status === '待确认' ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' :
                      item.status === '待结算' ? 'bg-rose-950/60 text-rose-300 border-rose-800/80' :
                      'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                    }`}>
                      ● {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAction(item, 'generate')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] transition-colors border border-slate-700 cursor-pointer"
                      >
                        生成
                      </button>
                      <button
                        onClick={() => handleAction(item, 'settle')}
                        className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 rounded text-[10px] transition-colors border border-cyan-800 cursor-pointer"
                      >
                        结算
                      </button>
                      <button
                        onClick={() => handleAction(item, 'bill')}
                        className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 rounded text-[10px] transition-colors border border-amber-800 cursor-pointer font-medium"
                      >
                        账单
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* "月结算对账单" Modal (Matching Screenshot) */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">月结算对账单</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right font-mono text-[11px] text-slate-400">
                  <div className="tracking-widest font-bold text-cyan-300">2026101600001</div>
                  <div className="text-[9px] text-slate-500">SETTLEMENT BARCODE</div>
                </div>
                <button 
                  onClick={() => setIsBillModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-mono">
              {/* Section 1: 基本情况 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  基本情况 (Basic Information)
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">用户名称</div>
                    <div className="p-2.5 text-white font-medium border-r border-slate-800">{activeBillItem.name}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">用电编号</div>
                    <div className="p-2.5 text-cyan-300 font-mono">{activeBillItem.code}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">所属区域</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{activeBillItem.region}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">客户类型</div>
                    <div className="p-2.5 text-slate-200">{activeBillItem.type}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">收款账户</div>
                    <div className="p-2.5 text-slate-200 font-mono border-r border-slate-800">{activeBillItem.account}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">开户银行</div>
                    <div className="p-2.5 text-slate-200">{activeBillItem.bank}</div>
                  </div>
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">联系人</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{activeBillItem.contact}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">联系电话</div>
                    <div className="p-2.5 text-slate-200 font-mono">{activeBillItem.phone}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: 结算费用 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  结算费用摘要 (Settlement Fees Breakdown)
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">交易电量</div>
                    <div className="p-2.5 text-cyan-300 font-mono font-bold">{activeBillItem.energy}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">交易收益</div>
                    <div className="p-2.5 text-slate-200 font-mono">{activeBillItem.revenue}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">奖励收益</div>
                    <div className="p-2.5 text-emerald-300 font-mono">{activeBillItem.bonus}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">总计收益</div>
                    <div className="p-2.5 text-amber-300 font-mono font-bold">{activeBillItem.total}</div>
                  </div>
                  <div className="grid grid-cols-2 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">账期 (Billing Period)</div>
                    <div className="p-2.5 text-indigo-300 font-mono font-bold">{activeBillItem.period}</div>
                  </div>
                </div>
              </div>

              {/* Section 3: 交易明细 Table */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  交易与电量明细 (Transaction Details)
                </div>
                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-center text-[11px]">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <th className="p-2.5 border-r border-slate-800 font-semibold">合同类型</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">合同编号</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">执行日期</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">执行电量 (kW/h)</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">电价 (元/kW/h)</th>
                        <th className="p-2.5 font-semibold">费用 (元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                      {[
                        { type: '中长期', code: 'ZCQ20261016001', date: '10-16', energy: '322.98', price: '2.12', cost: '623.09' },
                        { type: '日前', code: 'RQ20261016002', date: '10-16', energy: '322.98', price: '2.12', cost: '623.09' },
                        { type: '日内', code: 'RN20261016003', date: '10-16', energy: '322.98', price: '2.12', cost: '623.09' },
                        { type: '月度', code: 'YD20261016004', date: '10-16', energy: '322.98', price: '2.12', cost: '623.09' },
                        { type: '中长期', code: 'ZCQ20261016005', date: '10-16', energy: '322.98', price: '2.12', cost: '623.09' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-2.5 border-r border-slate-800 text-cyan-300">{row.type}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-slate-300">{row.code}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-slate-400">{row.date}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-amber-300">{row.energy}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-slate-200">{row.price}</td>
                          <td className="p-2.5 font-mono text-emerald-300 font-bold">{row.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end shrink-0">
              <button 
                onClick={() => {
                  setIsBillModalOpen(false);
                  showToast(`已成功将 [${activeBillItem.name}] 的月结算对账单导出为 PDF/Excel！`);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>立即导出</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
