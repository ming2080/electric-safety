import React, { useState } from 'react';
import { 
  Database, Search, Filter, RefreshCw, CheckCircle2, FileText, Calendar, X, ChevronRight, ChevronDown, Activity, DollarSign 
} from 'lucide-react';

interface DailyClearingPageProps {
  plantName: string;
  systemDateTime: string;
}

export const DailyClearingPage: React.FC<DailyClearingPageProps> = ({ plantName, systemDateTime }) => {
  const [varietyFilter, setVarietyFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('10-15 ~ 10-16');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Execution Details Modal State ("执行明细")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState({
    userNo: '2323121212',
    name: '青海盐湖化工高载能总厂',
    clearingPower: '3,421.9 kW',
    execPower: '1,421.9 kW',
    rate: '75.09%',
    price: '2.00~3.12 元/kW/h'
  });
  const [selectedContract, setSelectedContract] = useState<string>('YD2024080001');
  const [treeExpanded, setTreeExpanded] = useState<{ [key: string]: boolean }>({
    longTerm: true,
    monthly: true
  });

  // Generation Modal State ("月结算/日清分对账单生成" matching screenshot)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [generateRecord, setGenerateRecord] = useState({
    userNo: '2309209392',
    name: '电信大数据中心',
    type: '商业用户',
    region: '区域1',
    account: '2399239293929329229',
    bank: '招商银行XXX分行XX支行',
    contact: '张伟鹏',
    phone: '139****8231',
    energy: '23929.98 kW/h',
    revenue: '23929.98 元',
    bonus: '3929.98 元',
    total: '27929.98 元 (贰万柒仟玖佰贰拾玖元玖角捌分)',
    period: '2026年10月'
  });

  // Hourly slots for the column chart
  const hourlySlots = Array.from({ length: 23 }, (_, i) => ({
    hour: `${i + 1}点`,
    power: [0, 0, 0, 0, 45, 120, 250, 310, 390, 460, 500, 680, 550, 420, 250, 370, 310, 220, 80, 0, 0, 0, 0][i] || 0,
    isControl: i >= 13 && i <= 14
  }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDetailModal = (item: any) => {
    setSelectedRecord({
      userNo: item.userNo,
      name: item.name,
      clearingPower: item.clearingPower + ' kW',
      execPower: item.execPower + ' kW',
      rate: item.rate,
      price: item.price + ' 元/kW/h'
    });
    setIsDetailModalOpen(true);
  };

  const handleOpenGenerateModal = (item: any) => {
    setGenerateRecord({
      userNo: item.userNo,
      name: item.name,
      type: item.type + '用户',
      region: '区域1',
      account: '2399239293929329229',
      bank: '招商银行西宁分行城西支行',
      contact: '张伟鹏',
      phone: '139****8231',
      energy: item.execPower + ' kW/h',
      revenue: item.revenue + ' 元',
      bonus: '1,200.00 元',
      total: (parseFloat(item.revenue.replace(/,/g, '')) + 1200).toFixed(2) + ' 元',
      period: '2026年10月'
    });
    setIsGenerateModalOpen(true);
  };

  // Daily clearing items sorted descending by recent execution time
  const [clearings, setClearings] = useState([
    { id: 1, userNo: '2323121212', name: '青海盐湖化工高载能总厂', type: '工业', trades: 3, clearingPower: '2,000.09', execPower: '1,980.67', rate: '99.02%', startTime: '10-16 14:00', endTime: '10-16 15:00', price: '1.23~2.12', revenue: '2,398.09' },
    { id: 2, userNo: '4323121122', name: '柴达木盆地智慧算力集群', type: '商业', trades: 4, clearingPower: '1,098.13', execPower: '1,098.13', rate: '100%', startTime: '10-16 13:30', endTime: '10-16 14:30', price: '1.98', revenue: '2,398.09' },
    { id: 3, userNo: '092298382', name: '格尔木畜牧居辛中心', type: '农业', trades: 5, clearingPower: '709.89', execPower: '489.04', rate: '68.88%', startTime: '10-16 13:00', endTime: '10-16 14:00', price: '2.98', revenue: '2,398.09' },
    { id: 4, userNo: '1209230932', name: '西宁经济开发区大数据中心', type: '科技', trades: 3, clearingPower: '590.98', execPower: '590.98', rate: '100.00%', startTime: '10-16 12:30', endTime: '10-16 13:30', price: '1.23~4.14', revenue: '2,398.09' },
    { id: 5, userNo: '2323121213', name: '青海绿能高载能车间', type: '工业', trades: 3, clearingPower: '280.12', execPower: '210.12', rate: '75.00%', startTime: '10-16 11:45', endTime: '10-16 12:45', price: '3.00~3.56', revenue: '2,398.09' },
    { id: 6, userNo: '4323121125', name: '青海云计算枢纽节点', type: '商业', trades: 2, clearingPower: '980.45', execPower: '980.45', rate: '100.00%', startTime: '10-16 11:00', endTime: '10-16 12:00', price: '1.23~2.12', revenue: '2,398.09' },
    { id: 7, userNo: '092298389', name: '共和县光伏配套农业基地', type: '农业', trades: 1, clearingPower: '2,000.09', execPower: '1,980.67', rate: '99.02%', startTime: '10-16 10:30', endTime: '10-16 11:30', price: '1.23~2.12', revenue: '2,398.09' },
    { id: 8, userNo: '1209230944', name: '青海省智能算力中心', type: '科技', trades: 2, clearingPower: '1,098.13', execPower: '1,098.13', rate: '100%', startTime: '10-16 10:00', endTime: '10-16 11:00', price: '1.98', revenue: '2,398.09' },
    { id: 9, userNo: '23231219', name: '茫崖市特种冶炼厂', type: '工业', trades: 3, clearingPower: '709.89', execPower: '489.04', rate: '68.88%', startTime: '10-16 09:15', endTime: '10-16 10:15', price: '2.98', revenue: '2,398.09' },
    { id: 10, userNo: '4323121133', name: '德令哈储能产业园', type: '商业', trades: 4, clearingPower: '590.98', execPower: '598.98', rate: '100.00%', startTime: '10-16 08:30', endTime: '10-16 09:30', price: '1.23~4.14', revenue: '2,398.09' },
  ]);

  const filteredClearings = clearings.filter(c => {
    if (varietyFilter !== '全部' && c.type !== varietyFilter) return false;
    if (searchQuery && !c.userNo.toLowerCase().includes(searchQuery.toLowerCase()) && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 日清分数据管理中心</h2>
              <span className="text-[11px] text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                日前与日内高频清分核算
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 清分周期: <span className="text-white font-bold">{dateRange}</span> · 记录排序: <span className="text-emerald-400 font-bold">近期时间降序</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('已刷新日清分数据与日前电网清分底账')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新清分</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">清分日期:</span>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <input 
              type="text" 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none w-28 font-mono text-cyan-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">交易品种:</span>
          <select 
            value={varietyFilter} 
            onChange={(e) => setVarietyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部交易品种</option>
            <option value="工业">工业大用户</option>
            <option value="商业">商业算力</option>
            <option value="农业">农业负荷</option>
            <option value="科技">科技大数据</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="输入用户号或名称搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setVarietyFilter('全部'); setSearchQuery(''); setDateRange('10-15 ~ 10-16'); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
          >
            重置
          </button>
          <button 
            onClick={() => showToast('已成功应用日清分筛选条件')}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs cursor-pointer font-medium"
          >
            确定
          </button>
        </div>
      </div>

      {/* Daily Clearing Table (Sorted Descending by Recent Execution Start Time) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-sans">日清分数据明细表 (按近期执行时间降序排列)</h3>
          </div>
          <span className="text-[11px] text-slate-400">共筛选出 {filteredClearings.length} 条清分记录</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">序号</th>
                <th className="p-3 font-semibold">用户号</th>
                <th className="p-3 font-semibold">用户名称</th>
                <th className="p-3 font-semibold">用户类型</th>
                <th className="p-3 font-semibold">参与市场化交易</th>
                <th className="p-3 font-semibold">出清量 (kW)</th>
                <th className="p-3 font-semibold">执行量 (kW)</th>
                <th className="p-3 font-semibold">执行度</th>
                <th className="p-3 font-semibold">执行开始时间 ↓</th>
                <th className="p-3 font-semibold">执行结束时间</th>
                <th className="p-3 font-semibold">执行电价 (元/kW/h)</th>
                <th className="p-3 font-semibold">交易收益 (元)</th>
                <th className="p-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClearings.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                  <td className="p-3 text-cyan-400 font-mono font-bold">{item.userNo}</td>
                  <td className="p-3 font-medium text-white font-sans">{item.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 font-mono tabular-nums">{item.trades} 次</td>
                  <td className="p-3 text-slate-200 font-mono tabular-nums">{item.clearingPower}</td>
                  <td className="p-3 text-amber-300 font-mono tabular-nums font-bold">{item.execPower}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      parseFloat(item.rate) >= 95 ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80' :
                      parseFloat(item.rate) >= 80 ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80' :
                      'bg-amber-950/60 text-amber-300 border-amber-800/80'
                    }`}>
                      {item.rate}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{item.startTime}</td>
                  <td className="p-3 text-slate-400 font-mono">{item.endTime}</td>
                  <td className="p-3 text-purple-300 font-mono tabular-nums">{item.price}</td>
                  <td className="p-3 text-emerald-300 font-mono tabular-nums font-bold">{item.revenue}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenDetailModal(item)}
                        className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 rounded text-[10px] transition-colors border border-cyan-800 cursor-pointer font-medium"
                      >
                        执行明细
                      </button>
                      <button
                        onClick={() => handleOpenGenerateModal(item)}
                        className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 rounded text-[10px] transition-colors border border-amber-800 cursor-pointer font-medium"
                      >
                        生成
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* "执行明细" Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[92vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">
                  {selectedRecord.name}交易执行明细
                </h3>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/90 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center gap-6 font-mono text-[11px] shrink-0 text-slate-300">
              <span>用电编号: <strong className="text-cyan-300">{selectedRecord.userNo}</strong></span>
              <span>出清量: <strong className="text-amber-300">{selectedRecord.clearingPower}</strong></span>
              <span>执行量: <strong className="text-emerald-300">{selectedRecord.execPower}</strong></span>
              <span>执行度: <strong className="text-indigo-300">{selectedRecord.rate}</strong></span>
              <span>执行电价: <strong className="text-purple-300">{selectedRecord.price}</strong></span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-y-auto flex-1 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 lg:col-span-1 text-xs">
                <div className="text-cyan-300 font-bold mb-2 pb-2 border-b border-slate-800">合同与交易品种</div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setTreeExpanded({...treeExpanded, longTerm: !treeExpanded.longTerm})}
                    className="flex items-center gap-1.5 text-cyan-200 hover:text-white w-full text-left py-1 cursor-pointer font-medium"
                  >
                    {treeExpanded.longTerm ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>中长期交易</span>
                  </button>
                  {treeExpanded.longTerm && (
                    <div className="pl-4 space-y-1 border-l border-slate-800 ml-1.5 my-1">
                      <button 
                        onClick={() => setTreeExpanded({...treeExpanded, monthly: !treeExpanded.monthly})}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white w-full text-left py-1 cursor-pointer"
                      >
                        {treeExpanded.monthly ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>月度</span>
                      </button>
                      {treeExpanded.monthly && (
                        <div className="pl-4 space-y-1 border-l border-slate-800 ml-1.5 my-1 text-[11px]">
                          {['YD2024080001', 'YD2024070001', 'YD2024060001'].map(code => (
                            <button
                              key={code}
                              onClick={() => setSelectedContract(code)}
                              className={`w-full text-left px-2 py-1 rounded transition-colors cursor-pointer ${
                                selectedContract === code ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-slate-500 py-1 pl-4">月内</div>
                    </div>
                  )}
                </div>
                <div className="text-slate-400 py-1 font-medium">日前</div>
                <div className="text-slate-400 py-1 font-medium">日内</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 lg:col-span-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block"></span>
                    <span className="text-emerald-300 font-medium">该区域为负荷调控时段内 (14点 ~ 15点)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">当前合同: <strong className="text-cyan-300">{selectedContract}</strong></span>
                </div>

                <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-800 pb-2">
                  {hourlySlots.map((slot) => {
                    const heightPercent = Math.min(100, Math.max(12, (slot.power / 750) * 100));
                    return (
                      <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
                        <div className="absolute -top-9 bg-slate-900 border border-cyan-400 text-cyan-200 text-[10px] px-2 py-0.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                          {slot.hour}: {slot.power} kW {slot.isControl ? '(负荷调控中)' : ''}
                        </div>
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className={`w-full rounded-t transition-all duration-300 group-hover:brightness-125 shadow-md ${
                            slot.isControl 
                              ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-300 shadow-emerald-950' 
                              : 'bg-gradient-to-t from-cyan-700 via-cyan-500 to-amber-300 shadow-cyan-950'
                          }`}
                        ></div>
                        <span className="text-[9px] text-slate-400 transform -rotate-45 origin-top-left mt-2 block font-mono">{slot.hour}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                  <span>横轴: 每日 1点 至 23点 实时负荷与出清功率对照</span>
                  <span className="text-amber-300">● 动态高频调度曲线已同步</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end shrink-0">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "月结算对账单生成" Modal (Matching the Uploaded Screenshot exactly) */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[92vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">月结算对账单生成</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right font-mono text-[11px] text-slate-400">
                  <div className="tracking-widest font-bold text-cyan-300">2026101600001</div>
                  <div className="text-[9px] text-slate-500">BARCODE</div>
                </div>
                <button onClick={() => setIsGenerateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-mono">
              {/* Section 1: 基本情况 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  基本情况
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">用户名称</div>
                    <div className="p-2.5 text-white font-medium border-r border-slate-800">{generateRecord.name}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">用电编号</div>
                    <div className="p-2.5 text-cyan-300 font-mono">{generateRecord.userNo}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">所属区域</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{generateRecord.region}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">客户类型</div>
                    <div className="p-2.5 text-slate-200">{generateRecord.type}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">收款账户</div>
                    <div className="p-2.5 text-slate-200 font-mono border-r border-slate-800">{generateRecord.account}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">开户银行</div>
                    <div className="p-2.5 text-slate-200">{generateRecord.bank}</div>
                  </div>
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">联系人</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{generateRecord.contact}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">联系电话</div>
                    <div className="p-2.5 text-slate-200 font-mono">{generateRecord.phone}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: 结算费用 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  结算费用
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">交易电量</div>
                    <div className="p-2.5 text-cyan-300 font-mono font-bold">{generateRecord.energy}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">交易收益</div>
                    <div className="p-2.5 text-slate-200 font-mono">{generateRecord.revenue}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">奖励收益</div>
                    <div className="p-2.5 text-emerald-300 font-mono">{generateRecord.bonus}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">总计收益</div>
                    <div className="p-2.5 text-amber-300 font-mono font-bold">{generateRecord.total}</div>
                  </div>
                  <div className="grid grid-cols-2 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">账期</div>
                    <div className="p-2.5 text-slate-200 font-mono">{generateRecord.period}</div>
                  </div>
                </div>
              </div>

              {/* Section 3: 交易明细 (Sorted Descending by Recent Execution Date) */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  交易明细 (按近期时间降序排列)
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <th className="p-2.5 border-r border-slate-800 font-semibold">合同类型</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">合同编号</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">执行日期 ↓</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">执行电量 (kW/h)</th>
                        <th className="p-2.5 border-r border-slate-800 font-semibold">电价 (元/kW/h)</th>
                        <th className="p-2.5 font-semibold">费用 (元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {[
                        { type: '中长期', code: 'ZCQ2024070001', date: '10-16', energy: '322.98', price: '2.12', fee: '623.09' },
                        { type: '日前', code: 'RQ202408280001', date: '10-15', energy: '322.98', price: '2.12', fee: '623.09' },
                        { type: '日内', code: 'RN202408280001', date: '10-14', energy: '322.98', price: '2.12', fee: '623.09' },
                        { type: '月度', code: 'YD2024080001', date: '10-13', energy: '322.98', price: '2.12', fee: '623.09' },
                        { type: '中长期', code: 'ZCQ2024070002', date: '10-12', energy: '322.98', price: '2.12', fee: '623.09' },
                      ].map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-2.5 border-r border-slate-800 text-cyan-300 font-medium">{row.type}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-slate-300">{row.code}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-amber-300">{row.date}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-slate-200">{row.energy}</td>
                          <td className="p-2.5 border-r border-slate-800 font-mono text-purple-300">{row.price}</td>
                          <td className="p-2.5 font-mono text-emerald-300 font-bold">{row.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => {
                  showToast('已重置对账单生成表单数据');
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-slate-700"
              >
                重置
              </button>
              <button 
                onClick={() => {
                  setIsGenerateModalOpen(false);
                  showToast(`已成功为 [${generateRecord.name}] 生成并签署月结算对账单！`);
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
