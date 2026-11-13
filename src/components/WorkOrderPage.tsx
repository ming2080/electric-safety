import React, { useState } from 'react';
import { 
  FileText, CheckSquare, Search, Filter, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert, X, Wrench, ShieldCheck 
} from 'lucide-react';

interface WorkOrderPageProps {
  plantName: string;
  systemDateTime: string;
}

export const WorkOrderPage: React.FC<WorkOrderPageProps> = ({ plantName, systemDateTime }) => {
  const [levelFilter, setLevelFilter] = useState<string>('全部');
  const [regionFilter, setRegionFilter] = useState<string>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fault Disposal Work Order Processing Modal State ("故障处置工单处理" Matching Screenshot)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState({
    id: 1,
    code: '2024082400001',
    name: '这是设备名称',
    deviceNo: 'FDSB00001',
    region: '区域1',
    customer: '这是客户名称',
    level: '严重',
    alarmType: '设备欠压',
    alarmTime: '2026-10-16 14:30',
    duration: '45min',
    phenomenon: '三相电压0V',
    reason: '无电网',
    processSteps: '1.确认电网是否正常连接。\n2.确认连接的电缆是否正常。\n3.如果市电连接都正常，则需要联系设备厂商运维人员',
    resolved: '是',
    handleTime: '2026-10-16 15:10',
    operator: '张伟鹏'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Work orders sorted descending by recent generation time
  const [workOrders, setWorkOrders] = useState([
    { id: 1, code: '202610160001', name: 'CDZ000001', region: '区域一', owner: '这是用户名称', level: '紧急', alarmType: '温度过高', duration: '30min', disposalStatus: '已处置', status: '待处理', genTime: '2026-10-16 15:10', handleTime: '-' },
    { id: 2, code: '202610160002', name: 'CDZ000002', region: '区域二', owner: '这是用户名称', level: '严重', alarmType: '设备功率比低', duration: '30min', disposalStatus: '已处置', status: '待处理', genTime: '2026-10-16 14:45', handleTime: '-' },
    { id: 3, code: '202610160003', name: 'CDZ000003', region: '区域一', owner: '这是用户名称', level: '一般', alarmType: '设备欠压', duration: '30min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 14:20', handleTime: '2026-10-16 14:50' },
    { id: 4, code: '202610160004', name: 'CDZ000004', region: '区域三', owner: '这是用户名称', level: '紧急', alarmType: '设备欠压', duration: '60min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 13:05', handleTime: '2026-10-16 13:40' },
    { id: 5, code: '202610160005', name: 'CDZ000005', region: '区域四', owner: '这是用户名称', level: '严重', alarmType: '数据未采集', duration: '30min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 12:15', handleTime: '2026-10-16 12:45' },
    { id: 6, code: '202610160006', name: 'CDZ000002', region: '区域五', owner: '这是用户名称', level: '严重', alarmType: '温度过高', duration: '15min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 11:30', handleTime: '2026-10-16 11:50' },
    { id: 7, code: '202610160007', name: 'CDZ000003', region: '区域六', owner: '这是用户名称', level: '一般', alarmType: '设备负载', duration: '30min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 10:20', handleTime: '2026-10-16 10:55' },
    { id: 8, code: '202610160008', name: 'CDZ000004', region: '区域七', owner: '这是用户名称', level: '一般', alarmType: '温度过高', duration: '45min', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-16 09:50', handleTime: '2026-10-16 10:30' },
    { id: 9, code: '202610150009', name: 'CDZ000005', region: '区域三', owner: '这是用户名称', level: '一般', alarmType: '数据未采集', duration: '1d', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-15 18:00', handleTime: '2026-10-15 19:30' },
    { id: 10, code: '202610150010', name: 'CDZ000002', region: '区域二', owner: '这是用户名称', level: '一般', alarmType: '数据未采集', duration: '2d', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-15 14:10', handleTime: '2026-10-15 16:00' },
    { id: 11, code: '202610150011', name: 'CDZ000003', region: '区域一', owner: '这是用户名称', level: '一般', alarmType: '数据未采集', duration: '1.5h', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-15 10:00', handleTime: '2026-10-15 11:30' },
  ]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchProcess = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要批量处理的工单');
      return;
    }
    setWorkOrders(workOrders.map(o => selectedIds.includes(o.id) ? { ...o, status: '已归档', handleTime: systemDateTime } : o));
    showToast(`已成功批量处理并归档选中的 ${selectedIds.length} 个工单`);
    setSelectedIds([]);
  };

  const handleOpenProcessModal = (item: any) => {
    setActiveOrder({
      id: item.id,
      code: item.code,
      name: item.name,
      deviceNo: 'FDSB0000' + item.id,
      region: item.region,
      customer: item.owner,
      level: item.level,
      alarmType: item.alarmType,
      alarmTime: item.genTime,
      duration: item.duration,
      phenomenon: item.alarmType === '设备欠压' ? '三相电压0V' : '设备温度异常超标',
      reason: item.alarmType === '设备欠压' ? '无电网供电波动' : '散热风机堵转',
      processSteps: '1.确认电网是否正常连接。\n2.确认连接的电缆是否正常。\n3.如果市电连接都正常，则需要联系设备厂商运维人员',
      resolved: '是',
      handleTime: systemDateTime,
      operator: '张伟鹏'
    });
    setIsProcessModalOpen(true);
  };

  const handleArchiveOrder = () => {
    setWorkOrders(workOrders.map(o => o.id === activeOrder.id ? { ...o, status: '已归档', handleTime: systemDateTime } : o));
    setIsProcessModalOpen(false);
    showToast(`工单 [${activeOrder.code}] 已成功归档处理！`);
  };

  const filteredOrders = workOrders.filter(o => {
    if (levelFilter !== '全部' && o.level !== levelFilter) return false;
    if (regionFilter !== '全部' && o.region !== regionFilter) return false;
    if (statusFilter !== '全部' && o.status !== statusFilter) return false;
    if (searchQuery && !o.code.toLowerCase().includes(searchQuery.toLowerCase()) && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white font-sans">{plantName} — 处置工单管理中心</h2>
              <span className="text-[11px] text-cyan-400 px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded-md">
                工单全生命周期追踪
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              系统时间: {systemDateTime} · 待处理工单: <span className="text-rose-400 font-bold">2 个</span> · 已归档工单: <span className="text-emerald-400 font-bold">9 个</span> (按近期降序排列)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showToast('已刷新工单管理列表与最新状态')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 font-medium text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新列表</span>
          </button>
        </div>
      </div>

      {/* Top Batch Action & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center gap-3">
        <button
          onClick={handleBatchProcess}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>批量处理 ({selectedIds.length})</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">告警等级:</span>
          <select 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="紧急">紧急</option>
            <option value="严重">严重</option>
            <option value="一般">一般</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">告警区域:</span>
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

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">状态:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-cyan-400"
          >
            <option value="全部">全部</option>
            <option value="待处理">待处理</option>
            <option value="已归档">已归档</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="输入编号或设备名称搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setLevelFilter('全部'); setRegionFilter('全部'); setStatusFilter('全部'); setSearchQuery(''); setSelectedIds([]); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
          >
            重置
          </button>
          <button 
            onClick={() => showToast('已成功应用工单筛选条件')}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs cursor-pointer font-medium"
          >
            确定
          </button>
        </div>
      </div>

      {/* Work Order Detailed Table (Sorted Descending by Recent Generation Time) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-sans">处置工单管理列表 (按近期生成时间降序排列)</h3>
          </div>
          <span className="text-[11px] text-slate-400">共筛选出 {filteredOrders.length} 条工单</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                    onChange={handleToggleSelectAll}
                    className="accent-cyan-400 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-semibold">序号</th>
                <th className="p-3 font-semibold">编号</th>
                <th className="p-3 font-semibold">告警设备名称</th>
                <th className="p-3 font-semibold">告警区域</th>
                <th className="p-3 font-semibold">设备资产归属</th>
                <th className="p-3 font-semibold">告警等级</th>
                <th className="p-3 font-semibold">告警类型</th>
                <th className="p-3 font-semibold">告警时长</th>
                <th className="p-3 font-semibold">告警处置状态</th>
                <th className="p-3 font-semibold">状态</th>
                <th className="p-3 font-semibold">生成时间 ↓</th>
                <th className="p-3 font-semibold">处理时间</th>
                <th className="p-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((item, index) => (
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
                  <td className="p-3 font-medium text-white font-mono">{item.name}</td>
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
                  <td className="p-3 text-slate-400 font-mono">{item.duration}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                      {item.disposalStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      item.status === '待处理' ? 'bg-rose-950/60 text-rose-400 border-rose-800/80 animate-pulse font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{item.genTime}</td>
                  <td className="p-3 text-slate-400 font-mono">{item.handleTime}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenProcessModal(item)}
                      className={`px-3 py-1 rounded text-[11px] font-medium transition-colors border cursor-pointer ${
                        item.status === '待处理' 
                          ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border-cyan-700 shadow-sm' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.status === '待处理' ? '处理' : '查看'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* "故障处置工单处理" Modal (Matching Screenshot Exactly) */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scaleIn text-xs flex flex-col max-h-[92vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans tracking-wide">故障处置工单处理</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 text-[10px] animate-pulse">● 未处理</span>
                  <div className="text-right text-[11px] text-slate-400">
                    <div className="tracking-widest font-bold text-cyan-300">{activeOrder.code}</div>
                    <div className="text-[9px] text-slate-500">BARCODE</div>
                  </div>
                </div>
                <button onClick={() => setIsProcessModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
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
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">设备名称</div>
                    <div className="p-2.5 text-white font-medium border-r border-slate-800">{activeOrder.name}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">设备编号</div>
                    <div className="p-2.5 text-cyan-300 font-mono">{activeOrder.deviceNo}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">所属区域</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{activeOrder.region}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">所属客户</div>
                    <div className="p-2.5 text-slate-200">{activeOrder.customer}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">告警等级</div>
                    <div className="p-2.5 text-rose-400 font-bold border-r border-slate-800">{activeOrder.level}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">告警类型</div>
                    <div className="p-2.5 text-amber-300">{activeOrder.alarmType}</div>
                  </div>
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">告警时间</div>
                    <div className="p-2.5 text-slate-200 border-r border-slate-800">{activeOrder.alarmTime}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800">告警时长</div>
                    <div className="p-2.5 text-cyan-300 font-mono">{activeOrder.duration}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: 故障处置 */}
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider border-l-2 border-cyan-400 pl-2">
                  故障处置
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-[11px]">
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">故障现象</div>
                    <div className="p-2.5 text-slate-200 col-span-3">{activeOrder.phenomenon}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">原因分析</div>
                    <div className="p-2.5 text-slate-200 col-span-3">{activeOrder.reason}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">处置过程</div>
                    <div className="p-2.5 text-slate-300 col-span-3 whitespace-pre-line leading-relaxed">{activeOrder.processSteps}</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">是否已解决</div>
                    <div className="p-2.5 text-slate-200 col-span-3 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="resolved" defaultChecked className="accent-cyan-400" />
                        <span className="text-emerald-300 font-medium">是</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="resolved" className="accent-cyan-400" />
                        <span className="text-slate-400">否</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 bg-slate-950">
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">处置时间</div>
                    <div className="p-2.5 text-cyan-300 font-mono border-r border-slate-800">{activeOrder.handleTime}</div>
                    <div className="p-2.5 bg-slate-900/60 text-slate-400 font-semibold border-r border-slate-800 flex items-center">处置人员</div>
                    <div className="p-2.5 text-white font-medium">{activeOrder.operator}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={handleArchiveOrder}
                className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
              >
                确认归档
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
