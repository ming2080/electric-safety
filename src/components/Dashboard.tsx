import React, { useState } from 'react';
import { 
  ShieldAlert, LayoutDashboard, FileText, Map, CheckSquare, Bot, LogOut, 
  Search, Plus, Filter, AlertTriangle, CheckCircle2, Clock, Zap, Cpu, 
  TrendingUp, Users, ChevronRight, Activity, RefreshCw, Eye, Calendar, CloudSun, UserCheck, ShieldCheck, ArrowLeft, BarChart3, Layers, Database, Sun, Wind, BatteryCharging, Factory, Home, FolderTree, ChevronDown, DollarSign, Send, Download, Building2, PieChart, ArrowUpRight, LineChart, Sliders
} from 'lucide-react';
import { HazardItem, SubstationNode, User, UserRole } from '../types';
import { 
  INITIAL_HAZARDS, MOCK_SUBSTATIONS, MOCK_USERS, 
  MOCK_CONSUMPTION_RESOURCES, MOCK_CONSUMPTION_LOAD_ITEMS, MOCK_MARKET_VARIETY_STATS, MOCK_SPOT_MARKET_CARDS, MOCK_LONG_TERM_CARDS, MOCK_MARKET_PUBLICATIONS, MOCK_SETTLEMENT_BILLS, MOCK_SETTLEMENT_DETAILS,
  ConsumptionResourceItem, MarketPublicationItem, MarketSettlementBill, MarketPublishCard, SettlementDetailItem
} from '../mockData';
import { HazardModal } from './HazardModal';
import { AiAssistantModal } from './AiAssistantModal';
import { EnergyMonitoringPage } from './EnergyMonitoringPage';
import { RealtimeMonitoringPage } from './RealtimeMonitoringPage';
import { FlexibleLoadPage } from './FlexibleLoadPage';
import { AlarmDisposalPage } from './AlarmDisposalPage';
import { WorkOrderPage } from './WorkOrderPage';
import { MarketTradingPage } from './MarketTradingPage';
import { MonthlySettlementPage } from './MonthlySettlementPage';
import { DailyClearingPage } from './DailyClearingPage';

interface DashboardProps {
  currentUserRole: UserRole;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentUserRole, onLogout }) => {
  // Perspective Mode: 电网侧 vs 电厂侧
  const [perspectiveMode, setPerspectiveMode] = useState<'grid' | 'plant'>('grid');

  // Plant Side Menu States (电厂侧左侧菜单)
  const [plantSubTab, setPlantSubTab] = useState<string>('overview');
  const [selectedPlantName, setSelectedPlantName] = useState<string>('共和新能源光伏电站#1');
  const [plantMenuExpanded, setPlantMenuExpanded] = useState<{ [key: string]: boolean }>({
    energy_diag: true,
    resources: true,
    settlement: true
  });

  // Top Tabs
  const [topTab, setTopTab] = useState<'overview' | 'operation' | 'market' | 'ledger'>('overview');
  
  // Sub-tabs for 运行管理: 发电资源监测 | 用电资源管理
  const [operationSubTab, setOperationSubTab] = useState<'generation' | 'consumption'>('generation');
  
  // Sub-tabs for 电力市场 (Req 7): 统计分析 | 市场发布 | 结算管理
  const [marketSubTab, setMarketSubTab] = useState<'stat' | 'publish' | 'settlement'>('stat');

  const [currentRegion, setCurrentRegion] = useState<string>('全省');
  const [selectedMonth, setSelectedMonth] = useState('10月');

  const [marketDate, setMarketDate] = useState('2026-10-15');
  const [systemDateTime, setSystemDateTime] = useState('2026-10-16 10:56');
  
  // Modals state
  const [selectedResourceModal, setSelectedResourceModal] = useState<any | null>(null);
  const [selectedConsumptionModal, setSelectedConsumptionModal] = useState<ConsumptionResourceItem | null>(null);
  const [selectedMarketPubModal, setSelectedMarketPubModal] = useState<MarketPublicationItem | null>(null);
  const [selectedPublishCardModal, setSelectedPublishCardModal] = useState<MarketPublishCard | null>(null);
  const [selectedSettlementBillModal, setSelectedSettlementBillModal] = useState<MarketSettlementBill | null>(null);
  
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeType, setNewNoticeType] = useState<'市场公告' | '交易规则' | '出清结果' | '预测信息'>('市场公告');
  const [newNoticeSummary, setNewNoticeSummary] = useState('');
  const [marketPubList, setMarketPubList] = useState<MarketPublicationItem[]>(MOCK_MARKET_PUBLICATIONS);

  const [detailTimeMode, setDetailTimeMode] = useState<'day' | 'month' | 'year'>('day');
  const [detailDate, setDetailDate] = useState('2026-10-16');
  const [typeMetricMode, setTypeMetricMode] = useState<'count' | 'capacity'>('count');
  const [marketChartType, setMarketChartType] = useState<'bar' | 'area'>('bar');
  const [activeSettlementIdx, setActiveSettlementIdx] = useState<number>(9);

  // Filter states
  const [hazards, setHazards] = useState<HazardItem[]>(INITIAL_HAZARDS);
  const [substations, setSubstations] = useState<SubstationNode[]>(MOCK_SUBSTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [consumptionSearch, setConsumptionSearch] = useState('');
  const [consumptionRiskFilter, setConsumptionRiskFilter] = useState<string>('all');
  const [pubSearchQuery, setPubSearchQuery] = useState('');
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<string>('all');

  const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
  const [editingHazard, setEditingHazard] = useState<HazardItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // 用电资源管理 Prototype States
  const [vppTreeCity, setVppTreeCity] = useState<string>('全省');
  const [vppSortField, setVppSortField] = useState<'adjustableLoad' | 'responseLoad' | 'remainingLoad' | 'settlementEnergy' | 'settlementFee'>('adjustableLoad');
  const [vppSortDir, setVppSortDir] = useState<'asc' | 'desc'>('desc');
  const [vppCurveMode, setVppCurveMode] = useState<'day' | 'month' | 'year'>('day');
  const [vppCurveDate, setVppCurveDate] = useState('2026-10-16');

  // 统计分析 Prototype States
  const [statSortField, setStatSortField] = useState<'clearLoad' | 'publishLoad' | 'bidLoad' | 'executeLoad' | 'settlementFee'>('clearLoad');
  const [statSortDir, setStatSortDir] = useState<'asc' | 'desc'>('desc');
  const [hoveredVarietyIndex, setHoveredVarietyIndex] = useState<number | null>(0);

  // 市场发布 Prototype Card States
  const [pubSpotTypeFilter, setPubSpotTypeFilter] = useState<string>('全部');
  const [pubSpotMethodFilter, setPubSpotMethodFilter] = useState<string>('全部');
  const [pubLongTermTypeFilter, setPubLongTermTypeFilter] = useState<string>('全部');
  const [pubLongTermMethodFilter, setPubLongTermMethodFilter] = useState<string>('全部');
  const [pubSelectedCardIds, setPubSelectedCardIds] = useState<string[]>([]);
  const [spotCardsList, setSpotCardsList] = useState(MOCK_SPOT_MARKET_CARDS);
  const [longTermCardsList, setLongTermCardsList] = useState(MOCK_LONG_TERM_CARDS);
  const [pubToastMsg, setPubToastMsg] = useState<string | null>(null);
  const [pubViewStyle, setPubViewStyle] = useState<'table' | 'kanban' | 'timeline'>('table');

  // 结算管理 Prototype States
  const [settlementMonth, setSettlementMonth] = useState<string>('2026-10');
  const [settlementCategoryFilter, setSettlementCategoryFilter] = useState<string>('全部');
  const [settlementPlantTypeFilter, setSettlementPlantTypeFilter] = useState<string>('全部');
  const [settlementRegionFilter, setSettlementRegionFilter] = useState<string>('全部');

  const currentUser = MOCK_USERS[currentUserRole] || MOCK_USERS.admin;
  const monthNum = parseInt(selectedMonth) || 10;

  const topLedData = {
    adjustable: (6200 + monthNum * 105.4).toFixed(2),
    response: (3100 + monthNum * 85.2).toFixed(2),
    remaining: (2700 + monthNum * 58.1).toFixed(2)
  };

  const getRegionalHazards = (baseCount: number) => {
    return baseCount + (monthNum - 5) * 12;
  };

  const getDetailChartData = () => {
    if (detailTimeMode === 'day') {
      return [
        { time: '00:00', val: 55 }, { time: '02:00', val: 70 }, { time: '04:00', val: 68 },
        { time: '06:00', val: 112 }, { time: '08:00', val: 145 }, { time: '10:00', val: 130 },
        { time: '12:00', val: 125 }, { time: '14:00', val: 140 }, { time: '16:00', val: 135 },
        { time: '18:00', val: 120 }, { time: '20:00', val: 95 }, { time: '22:00', val: 75 }
      ];
    } else if (detailTimeMode === 'month') {
      return [
        { time: '1月', val: 80 }, { time: '2月', val: 75 }, { time: '3月', val: 88 },
        { time: '4月', val: 92 }, { time: '5月', val: 105 }, { time: '6月', val: 118 },
        { time: '7月', val: 125 }, { time: '8月', val: 130 }, { time: '9月', val: 122 },
        { time: '10月', val: 140 }
      ];
    } else {
      return [
        { time: '2025年', val: 1380 }, { time: '2026年', val: 1520 }
      ];
    }
  };

  const dynamicRegions = [
    { name: '西宁市', hazards: getRegionalHazards(412), risk: '低风险', status: '正常', x: 45, y: 35 },
    { name: '海东市', hazards: getRegionalHazards(137), risk: '中风险', status: '预警', x: 62, y: 44 },
    { name: '海西州', hazards: getRegionalHazards(645), risk: '高风险', status: '严控', x: 28, y: 55 },
    { name: '海南州', hazards: getRegionalHazards(198), risk: '低风险', status: '正常', x: 52, y: 65 },
    { name: '果洛州', hazards: getRegionalHazards(142), risk: '低风险', status: '正常', x: 68, y: 78 },
  ];

  const marketOverviewData = [
    { time: '00:00', publish: 439.32, clearing: 239.32, execute: 339.32 },
    { time: '04:00', publish: 412.50, clearing: 260.10, execute: 350.20 },
    { time: '08:00', publish: 458.80, clearing: 345.40, execute: 382.90 },
    { time: '12:00', publish: 472.10, clearing: 395.60, execute: 415.40 },
    { time: '16:00', publish: 430.40, clearing: 310.00, execute: 365.10 },
    { time: '20:00', publish: 455.20, clearing: 320.80, execute: 390.60 },
  ];

  const settlementData = [
    { month: '1月', energy: 620.4, fee: 215.2 },
    { month: '2月', energy: 580.1, fee: 201.8 },
    { month: '3月', energy: 710.8, fee: 248.5 },
    { month: '4月', energy: 830.2, fee: 290.4 },
    { month: '5月', energy: 920.6, fee: 320.1 },
    { month: '6月', energy: 890.3, fee: 310.7 },
    { month: '7月', energy: 1050.5, fee: 368.2 },
    { month: '8月', energy: 1120.9, fee: 390.6 },
    { month: '9月', energy: 989.1, fee: 345.3 },
    { month: '10月', energy: 1040.8, fee: 362.5 },
  ];

  const generationResources = [
    { id: 1, code: '0942293992', name: '共和分布式光伏电站#1', capacity: 5145.56, predicted: 987.90, actual: 321.98 },
    { id: 2, code: '23823818911', name: '德令哈风电储能一体化', capacity: 4283.75, predicted: 432.09, actual: 123.98 },
    { id: 3, code: '9732992382', name: '柴达木光热发电示范基地', capacity: 3321.78, predicted: 332.10, actual: 123.09 },
    { id: 4, code: '2039293922', name: '青海湖畔分散式风电', capacity: 1589.09, predicted: 158.09, actual: 10.09 },
    { id: 5, code: '12198238291', name: '格尔木光伏产业园电站', capacity: 7198.90, predicted: 719.12, actual: 421.09 },
    { id: 6, code: '1129823828', name: '黄河上游梯级水电光伏', capacity: 2400.78, predicted: 243.09, actual: 123.09 },
    { id: 7, code: '3238298382', name: '大通河畔小型水电站群', capacity: 9145.56, predicted: 987.23, actual: 498.09 },
    { id: 8, code: '5458983832', name: '湟源县农光互补发电站', capacity: 2283.75, predicted: 284.09, actual: 98.12 },
    { id: 9, code: '6504595935', name: '同德县清洁能源汇集站', capacity: 2321.78, predicted: 212.09, actual: 56.09 },
    { id: 10, code: '0939293239', name: '兴海县光伏扶贫电站群', capacity: 3521.78, predicted: 352.09, actual: 178.09 },
    { id: 11, code: '0939293567', name: '贵南县风电综合示范区', capacity: 9293.98, predicted: 987.09, actual: 378.12 },
  ];

  const marketBiddingRecords = [
    { subject: '海南州光伏联盟', type: '日内现货', bidQty: 12500, bidPrice: 382.00, clearQty: 11800, clearPrice: 380.50, status: '已完全成交', period: '10:00 - 12:00' },
    { subject: '西宁特钢虚拟电厂', type: '调峰辅助服务', bidQty: 8500, bidPrice: 420.00, clearQty: 8500, clearPrice: 418.00, status: '已完全成交', period: '14:00 - 16:00' },
    { subject: '德令哈储能电站', type: '备用容量', bidQty: 5000, bidPrice: 360.00, clearQty: 4200, clearPrice: 360.00, status: '部分成交', period: '18:00 - 20:00' },
    { subject: '盐湖化工能效终端', type: '中长期合同', bidQty: 25000, bidPrice: 375.50, clearQty: 25000, clearPrice: 375.50, status: '已完全成交', period: '00:00 - 24:00' },
    { subject: '格尔木光伏产业园', type: '日内现货', bidQty: 18000, bidPrice: 395.00, clearQty: 15200, clearPrice: 388.00, status: '部分成交', period: '12:00 - 14:00' },
  ];

  const handleSaveHazard = (saved: HazardItem) => {
    const exists = hazards.some(h => h.id === saved.id);
    if (exists) {
      setHazards(hazards.map(h => h.id === saved.id ? saved : h));
    } else {
      setHazards([saved, ...hazards]);
    }
    setIsHazardModalOpen(false);
    setEditingHazard(null);
  };

  const handleDeleteHazard = (id: string) => {
    if (confirm('确认删除该项电力安全隐患记录吗？')) {
      setHazards(hazards.filter(h => h.id !== id));
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle) return;
    const item: MarketPublicationItem = {
      id: `pub-${Date.now()}`,
      code: `GG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newNoticeTitle,
      type: newNoticeType,
      department: '电力交易与安全监管处',
      publishDate: '2026-10-16',
      effectiveDate: '2026-10-16',
      status: '生效中',
      summary: newNoticeSummary || '针对近期电网运行与隐患消缺要求发布最新的交易规则与考核通知。'
    };
    setMarketPubList([item, ...marketPubList]);
    setIsNewNoticeModalOpen(false);
    setNewNoticeTitle('');
    setNewNoticeSummary('');
  };

  const energyPoints = settlementData.map((d, i) => `${16 + i * 32},${Math.round(72 - ((d.energy - 500) / 700) * 52)}`);
  const feePoints = settlementData.map((d, i) => `${16 + i * 32},${Math.round(72 - ((d.fee - 180) / 240) * 52)}`);
  const energyPathD = `M ${energyPoints.join(' L ')}`;
  const energyAreaD = `M ${energyPoints[0]} L ${energyPoints.join(' L ')} L 304,78 L 16,78 Z`;
  const feePathD = `M ${feePoints.join(' L ')}`;

  const energyPointsWide = settlementData.map((d, i) => `${40 + i * 80},${Math.round(90 - ((d.energy - 500) / 700) * 70)}`);
  const feePointsWide = settlementData.map((d, i) => `${40 + i * 80},${Math.round(90 - ((d.fee - 180) / 240) * 70)}`);
  const energyPathDWide = `M ${energyPointsWide.join(' L ')}`;
  const energyAreaDWide = `M ${energyPointsWide[0]} L ${energyPointsWide.join(' L ')} L 760,100 L 40,100 Z`;
  const feePathDWide = `M ${feePointsWide.join(' L ')}`;

  const activeSettlement = settlementData[activeSettlementIdx] || settlementData[9];

  // Filtered Consumption Resources
  const filteredConsumptionList = MOCK_CONSUMPTION_RESOURCES.filter(cr => {
    const matchSearch = cr.name.includes(consumptionSearch) || cr.code.includes(consumptionSearch) || cr.category.includes(consumptionSearch);
    const matchRisk = consumptionRiskFilter === 'all' || cr.hazardStatus === consumptionRiskFilter;
    return matchSearch && matchRisk;
  });

  // Filtered Settlement Bills
  const filteredSettlementBills = MOCK_SETTLEMENT_BILLS.filter(sb => {
    return settlementStatusFilter === 'all' || sb.status === settlementStatusFilter;
  });

  // Filtered Publications
  const filteredPubs = marketPubList.filter(p => {
    return p.title.includes(pubSearchQuery) || p.code.includes(pubSearchQuery) || p.type.includes(pubSearchQuery);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-20 bg-slate-900/95 border-b border-cyan-500/30 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-xl">
        
        {/* Left Branding & Main Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white">电力安全隐患监管平台</h1>
              <p className="text-[10px] text-cyan-400">Power Safety Hazard Supervision Platform</p>
            </div>
          </div>

          {perspectiveMode === 'grid' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => { setTopTab('overview'); setCurrentRegion('全省'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  topTab === 'overview'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>全景概览</span>
              </button>
              
              {/* 运行管理 下拉 / 按钮 */}
              <div className="relative group">
                <button
                  onClick={() => setTopTab('operation')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    topTab === 'operation'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>运行管理 ▾</span>
                </button>
                
                <div className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50 backdrop-blur-md">
                  <button
                    onClick={() => { setTopTab('operation'); setOperationSubTab('generation'); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      topTab === 'operation' && operationSubTab === 'generation' ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>发电资源监测</span>
                  </button>
                  <button
                    onClick={() => { setTopTab('operation'); setOperationSubTab('consumption'); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      topTab === 'operation' && operationSubTab === 'consumption' ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Factory className="w-3.5 h-3.5 text-cyan-400" />
                    <span>用电资源管理</span>
                  </button>
                </div>
              </div>

              {/* 电力市场 下拉 / 按钮 */}
              <div className="relative group">
                <button
                  onClick={() => setTopTab('market')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    topTab === 'market'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>电力市场 ▾</span>
                </button>

                <div className="absolute top-full left-0 mt-1 w-44 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50 backdrop-blur-md">
                  <button
                    onClick={() => { setTopTab('market'); setMarketSubTab('stat'); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      topTab === 'market' && marketSubTab === 'stat' ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                    <span>统计分析</span>
                  </button>
                  <button
                    onClick={() => { setTopTab('market'); setMarketSubTab('publish'); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      topTab === 'market' && marketSubTab === 'publish' ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>市场发布</span>
                  </button>
                  <button
                    onClick={() => { setTopTab('market'); setMarketSubTab('settlement'); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      topTab === 'market' && marketSubTab === 'settlement' ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>结算管理</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setTopTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  topTab === 'ledger'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>数据台账</span>
              </button>
            </nav>
          )}
        </div>

        {/* Center/Right Perspective Mode Switcher: 电网侧 vs 电厂侧 */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-[10px] text-slate-400 font-medium px-2">视角模式:</span>
          <button
            onClick={() => setPerspectiveMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              perspectiveMode === 'grid'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>电网侧</span>
          </button>
          <button
            onClick={() => setPerspectiveMode('plant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              perspectiveMode === 'plant'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>电厂侧</span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white flex items-center justify-end gap-1">
              <span>{currentUser.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentUser.roleLabel}
              </span>
            </span>
            <span className="text-[10px] text-slate-400">{currentUser.department}</span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 transition-colors cursor-pointer"
            title="退出系统"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mode Status Ribbon */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${perspectiveMode === 'grid' ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`}></span>
            <span>当前视角: <strong className={perspectiveMode === 'grid' ? 'text-cyan-300' : 'text-amber-300'}>{perspectiveMode === 'grid' ? '电网侧 (省级调度与安全监控中心)' : '电厂侧 (发电厂站设备与发包交易中心)'}</strong></span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">系统时间: <strong className="font-mono text-slate-200">{systemDateTime}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/80 text-[11px]">
            ● 电网频率: 50.01 Hz
          </span>
          <span className="text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/80 text-[11px]">
            用电负荷: 8,420 MW
          </span>
        </div>
      </div>

      {/* Main Content Area: Conditional Perspective Rendering */}
      {perspectiveMode === 'plant' ? (
        <div className="flex-1 flex max-w-[1920px] w-full mx-auto animate-fadeIn">
          {/* 电厂侧 - 按截图生成左侧菜单栏 (Left Sidebar Navigation) */}
          <aside className="w-64 bg-slate-900/95 border-r border-amber-500/30 flex flex-col justify-between shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto p-4 backdrop-blur-md shadow-2xl z-30">
            <div className="space-y-4">
              {/* Plant Side Header & Switcher */}
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white">电厂侧控制台</h2>
                    <p className="text-[10px] text-amber-400 font-mono">Power Plant Operations</p>
                  </div>
                </div>
                <select
                  value={selectedPlantName}
                  onChange={(e) => setSelectedPlantName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="共和新能源光伏电站#1">共和新能源光伏电站#1 (5,145 kW)</option>
                  <option value="德令哈风电储能一体化">德令哈风电储能一体化 (4,283 kW)</option>
                  <option value="柴达木光热示范基地">柴达木光热示范基地 (3,321 kW)</option>
                  <option value="格尔木光伏产业园">格尔木光伏产业园 (7,198 kW)</option>
                </select>
              </div>

              {/* Navigation Links List (Matching Screenshot Menu) */}
              <nav className="space-y-1 text-xs">
                {/* 1. 全景概览 */}
                <button
                  onClick={() => setPlantSubTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    plantSubTab === 'overview'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-amber-400" />
                    <span>全景概览</span>
                  </div>
                  {plantSubTab === 'overview' && <ChevronRight className="w-4 h-4" />}
                </button>

                {/* 2. 能耗监测与诊断 Group */}
                <div>
                  <button
                    onClick={() => setPlantMenuExpanded(prev => ({ ...prev, energy_diag: !prev.energy_diag }))}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 font-bold">
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      <span>能耗监测与诊断</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${plantMenuExpanded.energy_diag ? 'rotate-180' : ''}`} />
                  </button>

                  {plantMenuExpanded.energy_diag && (
                    <div className="pl-6 space-y-1 mt-1 border-l border-slate-800 ml-4">
                      {[
                        { id: 'energy_monitoring', label: '能耗监测分析', icon: Activity },
                        { id: 'energy_diagnosis', label: '能效诊断分析与策略', icon: PieChart },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPlantSubTab(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs cursor-pointer ${
                            plantSubTab === item.id
                              ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. 资源监控 Group (Matching Screenshot) */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    onClick={() => setPlantMenuExpanded(prev => ({ ...prev, resources: !prev.resources }))}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-white hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0">
                        <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">资源监控</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${plantMenuExpanded.resources ? 'rotate-180' : ''}`} />
                  </button>

                  {plantMenuExpanded.resources && (
                    <div className="bg-[#0b2440] py-1.5 space-y-0.5">
                      {[
                        { id: 'realtime_monitoring', label: '运行实时监测' },
                        { id: 'flexible_load', label: '柔性负荷调控' },
                        { id: 'alarm_disposal', label: '故障告警与处置' },
                        { id: 'work_order', label: '处置工单管理' },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPlantSubTab(item.id)}
                          className={`w-full text-left pl-10 pr-4 py-2 text-[13px] transition-all cursor-pointer block ${
                            plantSubTab === item.id
                              ? 'bg-[#143d6b] text-cyan-300 font-bold border-l-4 border-cyan-400'
                              : 'text-slate-200 hover:text-white hover:bg-[#113459]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. 市场化交易 Top-Level */}
                <button
                  onClick={() => setPlantSubTab('market_trading')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    plantSubTab === 'market_trading'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>市场化交易</span>
                  </div>
                  {plantSubTab === 'market_trading' && <ChevronRight className="w-4 h-4" />}
                </button>

                {/* 5. 财务结算 Group */}
                <div>
                  <button
                    onClick={() => setPlantMenuExpanded(prev => ({ ...prev, settlement: !prev.settlement }))}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 font-bold">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>财务结算</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${plantMenuExpanded.settlement ? 'rotate-180' : ''}`} />
                  </button>

                  {plantMenuExpanded.settlement && (
                    <div className="pl-6 space-y-1 mt-1 border-l border-slate-800 ml-4">
                      {[
                        { id: 'monthly_settlement', label: '月结算对账管理', icon: FileText },
                        { id: 'daily_clearing', label: '日清分数据管理', icon: Clock },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPlantSubTab(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs cursor-pointer ${
                            plantSubTab === item.id
                              ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Sidebar Bottom Live Telemetry Card */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs mt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">电站运行状态:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  正常发电中
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">实时发电机组出力:</span>
                <span className="font-mono text-amber-300 font-bold">3,210.5 kW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">机组综合负荷率:</span>
                <span className="font-mono text-cyan-300 font-bold">62.4%</span>
              </div>
            </div>
          </aside>

          {/* Right Main Area for Plant Side */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Top Status Banner for Plant Side */}
            <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedPlantName}</span>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono font-normal">
                      ● 在线并网运行
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    调度编号: <span className="font-mono text-cyan-300">QH-GRID-PLANT-09422</span> | 交流并网电压: <span className="font-mono text-amber-300">110kV</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                  基准时间: {systemDateTime}
                </span>
                <button
                  onClick={() => setPlantSubTab('day_ahead')}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer transition-all"
                >
                  前往日前申报 ↗
                </button>
              </div>
            </div>

            {/* Plant Main Views based on plantSubTab */}
            {plantSubTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* 3-Column Cyber Power Plant Overview Grid (Matching Screenshot) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* LEFT COLUMN: Resource Overview + Green Carbon + Comprehensive Revenue (span 3) */}
                  <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
                    
                    {/* Card 1: 资源概览 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                        <h3 className="font-bold text-xs text-white">资源概览</h3>
                      </div>

                      <div className="space-y-2.5 text-[11px] font-mono">
                        {/* 光伏 */}
                        <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-amber-400 font-bold">
                            <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> 光伏</span>
                            <span className="text-slate-400 font-normal">面积: 740m²</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-300">
                            <span>组件容量: <strong className="text-amber-300">12012kWp</strong></span>
                            <span>装机容量: <strong className="text-white">11200kW/h</strong></span>
                          </div>
                        </div>

                        {/* 储能 & 充电站 */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                            <span className="text-cyan-400 font-bold block flex items-center gap-1"><BatteryCharging className="w-3 h-3" /> 储能</span>
                            <span className="text-slate-400 block mt-1">额定功率</span>
                            <span className="text-cyan-300 font-bold">8000kW</span>
                          </div>
                          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80">
                            <span className="text-emerald-400 font-bold block flex items-center gap-1"><Zap className="w-3 h-3" /> 充电站</span>
                            <span className="text-slate-400 block mt-1">功率 300kW</span>
                            <span className="text-emerald-300 font-bold">枪数: 24个</span>
                          </div>
                        </div>

                        {/* 用户 */}
                        <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
                          <span className="text-purple-400 font-bold flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 用户</span>
                          <span className="text-slate-300">总用户: <strong className="text-white">154个</strong></span>
                          <span className="text-purple-300">签约: <strong className="text-purple-300">89个</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: 绿色节碳 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <h3 className="font-bold text-xs text-white">绿色节碳</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                        {/* Gauge 1: 等效减碳 */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                              <circle cx="40" cy="40" r="32" stroke="#06b6d4" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="50" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                              <span className="text-sm font-extrabold text-cyan-300">571.23</span>
                              <span className="text-[9px] text-slate-400">(吨)</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-300 mt-2 font-semibold">等效减碳</span>
                        </div>

                        {/* Gauge 2: 等效植树 */}
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                              <circle cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="70" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                              <span className="text-sm font-extrabold text-emerald-300">2.90</span>
                              <span className="text-[9px] text-slate-400">(万棵)</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-300 mt-2 font-semibold">等效植树</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: 综合收益分析 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                        <h3 className="font-bold text-xs text-white">综合收益分析</h3>
                      </div>

                      {/* Donut Chart Ring */}
                      <div className="relative h-28 flex items-center justify-center my-1">
                        <div className="w-24 h-24 rounded-full border-8 border-slate-800 border-t-amber-400 border-r-cyan-400 border-b-emerald-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          <span className="text-base font-extrabold text-amber-300 font-mono">42.09</span>
                          <span className="text-[9px] text-slate-400 font-mono">(万元)</span>
                        </div>
                      </div>
                      <p className="text-center text-[11px] text-slate-400 font-mono -mt-1 mb-2">累计总收益</p>

                      {/* 4 Bottom Breakdown Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-cyan-400">储能</span>
                          <span className="text-white font-bold">9.09万元</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-amber-400">光伏上网</span>
                          <span className="text-white font-bold">23.71万元</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-emerald-400">充电站</span>
                          <span className="text-white font-bold">2.25万元</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                          <span className="text-purple-400">市场交易</span>
                          <span className="text-white font-bold">11.09万元</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* CENTER COLUMN: Cyber Topology Architecture Hub (span 6) */}
                  <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Background Grid Pattern Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                    {/* Top Hub: 电网 Tower Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="px-5 py-2 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-500/50 rounded-xl text-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <span className="text-xs font-extrabold text-cyan-300 tracking-wider">⚡ 电 网</span>
                      </div>

                      {/* Floating Grid Metrics Box */}
                      <div className="mt-2 flex items-center justify-center gap-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 font-mono text-[11px]">
                        <div><span className="text-slate-400">累计推送: </span><strong className="text-cyan-300">9123.35 kW</strong></div>
                        <div><span className="text-slate-400">累计结算电量: </span><strong className="text-amber-300">7828.35 mW/h</strong></div>
                        <div><span className="text-slate-400">累计结算电费: </span><strong className="text-emerald-300">0128.35 万元</strong></div>
                      </div>
                    </div>

                    {/* Connecting Vertical Line 1 */}
                    <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-500 to-amber-500 mx-auto my-1 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>

                    {/* Center Hub Sphere: 某某零碳工业园 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-900/80 via-slate-900 to-amber-900/80 border-2 border-cyan-400/80 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] relative">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-1">
                          <Building2 className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-wide">某某零碳工业园</span>
                      </div>

                      {/* Floating Park Metrics Box */}
                      <div className="mt-2 flex items-center justify-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                        <div><span className="text-slate-400">累计响应: </span><strong className="text-cyan-300">1128.35 mW/h</strong></div>
                        <div><span className="text-slate-400">响应收益: </span><strong className="text-emerald-300">0028.35 万元</strong></div>
                      </div>
                    </div>

                    {/* Connecting Vertical Line 2 Splitting into 5 branches */}
                    <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-cyan-500 mx-auto my-1"></div>

                    {/* Bottom 5 Connected Cards */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-2 text-[10px] font-mono">
                      
                      {/* Node 1: 发电资源 */}
                      <div className="bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-center hover:border-amber-500/60 transition-colors">
                        <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg mx-auto w-fit mb-1">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-white text-[11px]">发电资源</div>
                        <div className="text-slate-400">实时功率 <span className="text-cyan-300 font-bold block">89.09kW</span></div>
                        <div className="text-slate-400">本月发电 <span className="text-amber-300 font-bold block">83.23mW/h</span></div>
                        <div className="text-slate-400 pt-1 border-t border-slate-800/80">功率因数 <span className="text-emerald-300 font-bold">0.98</span></div>
                        <div className="text-slate-400">减碳量 <span className="text-teal-300 font-bold">45.2吨</span></div>
                      </div>

                      {/* Node 2: 储能站 */}
                      <div className="bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-center hover:border-cyan-500/60 transition-colors">
                        <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg mx-auto w-fit mb-1">
                          <BatteryCharging className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-white text-[11px]">储能站</div>
                        <div className="text-slate-400">实时功率 <span className="text-cyan-300 font-bold block">89.09kW</span></div>
                        <div className="text-slate-400">本月充/放 <span className="text-amber-300 font-bold block">43.2/63.2M</span></div>
                        <div className="text-slate-400 pt-1 border-t border-slate-800/80">SOC荷电 <span className="text-cyan-300 font-bold">85.4%</span></div>
                        <div className="text-slate-400">循环效率 <span className="text-emerald-300 font-bold">92.5%</span></div>
                      </div>

                      {/* Node 3: 充电站 */}
                      <div className="bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-center hover:border-emerald-500/60 transition-colors">
                        <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg mx-auto w-fit mb-1">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-white text-[11px]">充电站</div>
                        <div className="text-slate-400">实时功率 <span className="text-cyan-300 font-bold block">89.09kW</span></div>
                        <div className="text-slate-400">本月用电 <span className="text-emerald-300 font-bold block">43.23mW/h</span></div>
                        <div className="text-slate-400 pt-1 border-t border-slate-800/80">有序充电率 <span className="text-amber-300 font-bold">94.2%</span></div>
                        <div className="text-slate-400">闲置枪数 <span className="text-blue-300 font-bold">12/24</span></div>
                      </div>

                      {/* Node 4: 工商业用户 */}
                      <div className="bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-center hover:border-blue-500/60 transition-colors">
                        <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg mx-auto w-fit mb-1">
                          <Factory className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-white text-[11px]">工商业用户</div>
                        <div className="text-slate-400">签约客户 <span className="text-blue-300 font-bold block">21个</span></div>
                        <div className="text-slate-400">本月用电 <span className="text-amber-300 font-bold block">243.23MWh</span></div>
                        <div className="text-slate-400 pt-1 border-t border-slate-800/80">柔性调节 <span className="text-cyan-300 font-bold">450kW</span></div>
                        <div className="text-slate-400">负荷满足率 <span className="text-emerald-300 font-bold">98.5%</span></div>
                      </div>

                      {/* Node 5: 居民用户 */}
                      <div className="bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl space-y-1 text-center hover:border-purple-500/60 transition-colors">
                        <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg mx-auto w-fit mb-1">
                          <Home className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-white text-[11px]">居民用户</div>
                        <div className="text-slate-400">签约客户 <span className="text-purple-300 font-bold block">5个台区</span></div>
                        <div className="text-slate-400">本月用电 <span className="text-cyan-300 font-bold block">743.23MWh</span></div>
                        <div className="text-slate-400 pt-1 border-t border-slate-800/80">三相不平衡 <span className="text-amber-300 font-bold">0.8%</span></div>
                        <div className="text-slate-400">台区负荷率 <span className="text-emerald-300 font-bold">58.2%</span></div>
                      </div>

                    </div>

                  </div>

                  {/* RIGHT COLUMN: 3 Trend Charts with Recent Dates (span 3) */}
                  <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
                    
                    {/* Chart 1: 用电趋势分析 (kW/h) */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                          <h3 className="font-bold text-xs text-white">用电趋势分析 <span className="text-[10px] text-slate-400 font-normal">(kW/h)</span></h3>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">峰值 600.45</span>
                      </div>

                      <div className="relative w-full h-36 bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        {/* SVG Area Chart with Gridlines & Y-Axis */}
                        <div className="relative flex-1 w-full">
                          <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="chart1Grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Gridlines */}
                            <line x1="25" y1="15" x2="315" y2="15" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="40" x2="315" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="65" x2="315" y2="65" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="85" x2="315" y2="85" stroke="#334155" />

                            {/* Y-Axis Ticks */}
                            <text x="20" y="18" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">600</text>
                            <text x="20" y="43" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">400</text>
                            <text x="20" y="68" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">200</text>
                            <text x="20" y="88" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">0</text>

                            {/* Area Fill & Line */}
                            <path d="M 30 85 L 30 50 Q 75 20, 120 60 T 210 25 T 310 35 L 310 85 Z" fill="url(#chart1Grad)" />
                            <path d="M 30 50 Q 75 20, 120 60 T 210 25 T 310 35" fill="none" stroke="#f59e0b" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />

                            {/* Data points */}
                            <circle cx="30" cy="50" r="3" fill="#f59e0b" />
                            <circle cx="75" cy="28" r="3" fill="#f59e0b" />
                            <circle cx="120" cy="60" r="3" fill="#f59e0b" />
                            <circle cx="165" cy="45" r="3" fill="#f59e0b" />
                            <circle cx="210" cy="25" r="4" fill="#f59e0b" className="animate-pulse" />
                            <circle cx="255" cy="55" r="3" fill="#f59e0b" />
                            <circle cx="310" cy="35" r="3" fill="#f59e0b" />

                            {/* Peak Callout Badge */}
                            <g transform="translate(210, 12)">
                              <rect x="-24" y="-10" width="48" height="13" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" />
                              <text x="0" y="-1" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">600.45</text>
                            </g>
                          </svg>
                        </div>

                        <div className="flex justify-between text-[8px] text-slate-500 font-mono pt-1 border-t border-slate-800/80 pl-6">
                          <span>10-16</span><span>10-14</span><span>10-12</span><span>10-10</span><span>10-08</span><span>10-06</span><span>10-04</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 2: 本月储能充放电趋势 (kW/h) */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                          <h3 className="font-bold text-xs text-white">本月储能充放电趋势 <span className="text-[10px] text-slate-400 font-normal">(kW/h)</span></h3>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-400 rounded"></span>放电</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-emerald-400 rounded"></span>充电</span>
                        </div>
                      </div>

                      <div className="relative w-full h-36 bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        {/* Floating Tooltip Card matching 2026-10-16 */}
                        <div className="absolute top-2 right-3 bg-slate-900/95 border border-slate-700/80 rounded-lg p-1.5 text-[9px] font-mono shadow-xl z-10 space-y-0.5 pointer-events-none">
                          <div className="text-slate-400 font-bold">2026-10-16</div>
                          <div className="text-amber-300">放电 410.12 kW/h</div>
                          <div className="text-emerald-300">充电 410.22 kW/h</div>
                        </div>

                        <div className="relative flex-1 w-full">
                          <svg viewBox="0 0 320 90" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="chargeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Gridlines */}
                            <line x1="25" y1="15" x2="315" y2="15" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="40" x2="315" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="65" x2="315" y2="65" stroke="#1e293b" strokeDasharray="3 3" />
                            <line x1="25" y1="85" x2="315" y2="85" stroke="#334155" />

                            {/* Y-Axis Ticks */}
                            <text x="20" y="18" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">600</text>
                            <text x="20" y="43" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">400</text>
                            <text x="20" y="68" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">200</text>
                            <text x="20" y="88" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="end">0</text>

                            {/* 放电 (Amber Area & Line) */}
                            <path d="M 30 85 L 30 45 Q 75 20, 120 55 T 210 30 T 310 65 L 310 85 Z" fill="url(#dischargeGrad)" />
                            <path d="M 30 45 Q 75 20, 120 55 T 210 30 T 310 65" fill="none" stroke="#f59e0b" strokeWidth="2" />

                            {/* 充电 (Emerald Area & Line) */}
                            <path d="M 30 85 L 30 65 Q 75 35, 120 70 T 210 45 T 310 25 L 310 85 Z" fill="url(#chargeGrad)" />
                            <path d="M 30 65 Q 75 35, 120 70 T 210 45 T 310 25" fill="none" stroke="#10b981" strokeWidth="2" />

                            {/* Glowing Active Points */}
                            <circle cx="30" cy="45" r="3" fill="#f59e0b" />
                            <circle cx="30" cy="65" r="3" fill="#10b981" />
                          </svg>
                        </div>

                        <div className="flex justify-between text-[8px] text-slate-500 font-mono pt-1 border-t border-slate-800/80 pl-6">
                          <span>10-16</span><span>10-14</span><span>10-12</span><span>10-10</span><span>10-08</span><span>10-06</span><span>10-04</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 3: 本月资源发电趋势 (kW/h) */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                          <h3 className="font-bold text-xs text-white">本月资源发电趋势 <span className="text-[10px] text-slate-400 font-normal">(kW/h)</span></h3>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">最高 600.45</span>
                      </div>

                      <div className="relative w-full h-36 bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                        {/* High-Tech Cyan & Emerald Glowing Bar Chart with Y-Axis */}
                        <div className="relative flex-1 w-full flex items-end">
                          {/* Y-Axis Grid Lines & Numbers Layer */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
                            <div className="border-b border-slate-800/80 flex items-center justify-between">
                              <span className="text-[7px] text-slate-600 font-mono -mt-2">600</span>
                            </div>
                            <div className="border-b border-slate-800/60 flex items-center justify-between">
                              <span className="text-[7px] text-slate-600 font-mono -mt-2">400</span>
                            </div>
                            <div className="border-b border-slate-800/60 flex items-center justify-between">
                              <span className="text-[7px] text-slate-600 font-mono -mt-2">200</span>
                            </div>
                            <div className="border-b border-slate-700 flex items-center justify-between">
                              <span className="text-[7px] text-slate-600 font-mono -mt-2">0</span>
                            </div>
                          </div>

                          {/* Bars Layer */}
                          <div className="relative z-10 w-full pl-6 h-full flex items-end justify-between gap-1.5 pt-3">
                            {[
                              { val: 350, date: '10-16' },
                              { val: 480, date: '10-15' },
                              { val: 550, date: '10-14' },
                              { val: 420, date: '10-13' },
                              { val: 510, date: '10-12' },
                              { val: 460, date: '10-11' },
                              { val: 600.45, date: '10-10', peak: true },
                              { val: 390, date: '10-09' },
                              { val: 450, date: '10-08' },
                              { val: 520, date: '10-07' },
                              { val: 490, date: '10-06' },
                              { val: 380, date: '10-05' }
                            ].map((item, i) => {
                              const pct = Math.min(100, Math.max(10, (item.val / 600.45) * 100));
                              return (
                                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer">
                                  {/* Hover Tooltip */}
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-cyan-500/80 text-[8px] font-mono text-cyan-300 px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-20 pointer-events-none">
                                    {item.date}: {item.val} kW/h
                                  </div>

                                  {/* Peak callout label on max bar */}
                                  {item.peak && (
                                    <span className="absolute -top-4 text-[7px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-1 rounded border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                                      600.45
                                    </span>
                                  )}

                                  {/* Bar container */}
                                  <div
                                    style={{ height: `${pct}%` }}
                                    className={`w-full rounded-t transition-all duration-300 relative overflow-hidden ${
                                      item.peak
                                        ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-teal-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
                                        : 'bg-gradient-to-t from-cyan-900/80 via-cyan-600/70 to-emerald-400/80 group-hover:from-cyan-700 group-hover:to-cyan-300'
                                    }`}
                                  >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-cyan-200/90 rounded-t shadow-[0_0_4px_#5eead4]"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex justify-between text-[8px] text-slate-500 font-mono pt-1 border-t border-slate-800/80 pl-6">
                          <span>10-16</span><span>10-14</span><span>10-12</span><span>10-10</span><span>10-08</span><span>10-06</span><span>10-04</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Specific Energy Monitoring SubTab View (Matches Screenshot) */}
            {plantSubTab === 'energy_monitoring' && (
              <EnergyMonitoringPage plantName={selectedPlantName} />
            )}

            {/* Specific Realtime Panorama Monitoring View (Matches Screenshot 厂站全景监测) */}
            {plantSubTab === 'realtime_monitoring' && (
              <RealtimeMonitoringPage plantName={selectedPlantName} />
            )}

            {/* Specific Flexible Load Regulation View */}
            {plantSubTab === 'flexible_load' && (
              <FlexibleLoadPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Specific Alarm Disposal View */}
            {plantSubTab === 'alarm_disposal' && (
              <AlarmDisposalPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Specific Work Order Management View */}
            {plantSubTab === 'work_order' && (
              <WorkOrderPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Specific Market Trading View */}
            {plantSubTab === 'market_trading' && (
              <MarketTradingPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Specific Monthly Settlement View */}
            {plantSubTab === 'monthly_settlement' && (
              <MonthlySettlementPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Specific Daily Clearing View */}
            {plantSubTab === 'daily_clearing' && (
              <DailyClearingPage plantName={selectedPlantName} systemDateTime={systemDateTime} />
            )}

            {/* Other Plant SubTab Views */}
            {plantSubTab !== 'overview' && plantSubTab !== 'energy_monitoring' && plantSubTab !== 'realtime_monitoring' && plantSubTab !== 'flexible_load' && plantSubTab !== 'alarm_disposal' && plantSubTab !== 'work_order' && plantSubTab !== 'market_trading' && plantSubTab !== 'monthly_settlement' && plantSubTab !== 'daily_clearing' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">
                        {selectedPlantName} - {
                          plantSubTab === 'energy_monitoring' ? '能耗监测分析' :
                          plantSubTab === 'energy_diagnosis' ? '能效诊断分析与策略' :
                          plantSubTab === 'realtime_monitoring' ? '运行实时监测' :
                          plantSubTab === 'flexible_load' ? '柔性负荷调控' :
                          plantSubTab === 'alarm_disposal' ? '故障告警与处置' :
                          plantSubTab === 'work_order' ? '处置工单管理' :
                          plantSubTab === 'market_trading' ? '市场化交易' :
                          plantSubTab === 'monthly_settlement' ? '月结算对账管理' :
                          plantSubTab === 'daily_clearing' ? '日清分数据管理' :
                          plantSubTab === 'user_resource' ? '用户资源管理' :
                          plantSubTab === 'device_ledger' ? '设备台账管理' :
                          plantSubTab === 'data_collection' ? '数据采集管理' :
                          plantSubTab === 'pv_plant' ? '光伏电站实时监测' :
                          plantSubTab === 'wind_plant' ? '风力发电站实时监测' :
                          plantSubTab === 'storage_plant' ? '储能与水力站监测' :
                          plantSubTab === 'units' ? '机组实时运行参数' :
                          plantSubTab === 'forecast' ? '功率预测与计划对比' :
                          plantSubTab === 'alerts' ? '设备告警与隐患处置' :
                          plantSubTab === 'day_ahead' ? '日前现货市场申报' :
                          plantSubTab === 'intraday' ? '日内现货交易盘口' :
                          plantSubTab === 'ancillary' ? '辅助服务 (调峰/调频) 申报' :
                          plantSubTab === 'clearing_res' ? '出清与成交结果查看' :
                          plantSubTab === 'settlement_bills' ? '电厂侧电子结算账单' :
                          plantSubTab === 'revenue' ? '收益偏差与考核分析' : '业务数据详情查看'
                        }
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        最新更新时间: {systemDateTime} | 状态: <span className="text-emerald-400 font-bold">数据同步正常</span> | 时间降序排列
                      </p>
                    </div>
                  </div>
                </div>

                {/* SubTab Specific Detailed Content with Recent Dates Descending */}
                <div className="space-y-6 text-xs font-mono">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">电站当前总出力:</span>
                      <div className="font-mono text-2xl font-bold text-amber-300 mt-1">3,210.5 kW</div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">● 占额定容量 62.4%</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">最新出清结算单价:</span>
                      <div className="font-mono text-2xl font-bold text-emerald-300 mt-1">384.20 元/MWh</div>
                      <span className="text-[10px] text-slate-400 mt-1 block">实时节点 LMP 电价</span>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">近期考核违约罚金:</span>
                      <div className="font-mono text-2xl font-bold text-cyan-300 mt-1">0.00 元</div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">遵从率 100% 无扣罚</span>
                    </div>
                  </div>

                  {/* Dynamic Recent Records Table for this SubTab (Time sorted DESC) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <h4 className="font-bold text-white text-xs flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <span>近期业务记录与历史明细表 (按时间降序排列)</span>
                      </h4>
                      <span className="text-[11px] text-amber-400">近期数据更新</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <th className="p-2.5 font-semibold">记录时间 ↓</th>
                            <th className="p-2.5 font-semibold">单据编号</th>
                            <th className="p-2.5 font-semibold">业务项目</th>
                            <th className="p-2.5 font-semibold">申报/实际电量</th>
                            <th className="p-2.5 font-semibold">出清/结算单价</th>
                            <th className="p-2.5 font-semibold">当单金额</th>
                            <th className="p-2.5 font-semibold">处理状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {[
                            { time: '2026-10-16 15:00', code: 'REC-20261016-09', title: '日前现货出清/日内调峰', power: '320.0 kW', price: '385.00 元/MWh', total: '123,200.00 元', status: '已生效结算' },
                            { time: '2026-10-16 11:00', code: 'REC-20261016-04', title: '高峰时段电能消纳', power: '450.0 kW', price: '392.50 元/MWh', total: '176,625.00 元', status: '已生效结算' },
                            { time: '2026-10-15 18:00', code: 'REC-20261015-88', title: '晚高峰充放电调度', power: '280.0 kW', price: '378.00 元/MWh', total: '105,840.00 元', status: '已归档' },
                            { time: '2026-10-15 12:00', code: 'REC-20261015-42', title: '辅助服务调峰响应', power: '200.0 kW', price: '415.00 元/MWh', total: '83,000.00 元', status: '已归档' },
                            { time: '2026-10-14 17:00', code: 'REC-20261014-71', title: '日内现货盘口出清', power: '300.0 kW', price: '382.00 元/MWh', total: '114,600.00 元', status: '已归档' }
                          ].map((r, i) => (
                            <tr key={i} className="hover:bg-slate-900/50">
                              <td className="p-2.5 text-amber-300 font-bold">{r.time}</td>
                              <td className="p-2.5 text-slate-300">{r.code}</td>
                              <td className="p-2.5 text-white">{r.title}</td>
                              <td className="p-2.5 text-cyan-300">{r.power}</td>
                              <td className="p-2.5 text-emerald-300">{r.price}</td>
                              <td className="p-2.5 text-emerald-400 font-bold">{r.total}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* Standard Grid Side Main Content */
        <main className="flex-1 p-6 space-y-6 max-w-[1920px] mx-auto w-full">

        {/* TAB 1: PANORAMA OVERVIEW */}
        {topTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Row Grid: Left Top (Type Ratio + Power Market), Center Top (Map Overview), Right Top (Virtual Power Plant Generation) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Top Column (span 3): Type Ratio + Power Market Overview */}
              <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                
                {/* Card 1: 类型占比情况 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                      <h3 className="font-bold text-xs text-white">类型占比情况</h3>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setTypeMetricMode('count')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${typeMetricMode === 'count' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400'}`}
                      >
                        按数量
                      </button>
                      <button
                        onClick={() => setTypeMetricMode('capacity')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${typeMetricMode === 'capacity' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400'}`}
                      >
                        按容量
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">发电型资源</div>
                      <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">
                        {typeMetricMode === 'count' ? '40个' : '1,353 MW'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">用电型资源</div>
                      <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                        {typeMetricMode === 'count' ? '28个' : '822 MW'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: 电力市场概况 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                      <h3 className="font-bold text-xs text-white">电力市场概况</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 font-mono">
                        {marketDate} 📅
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-[10px]">
                    <span className="text-slate-400">分时曲线</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>发布</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>出清</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>执行</span>
                      <button
                        onClick={() => setMarketChartType(marketChartType === 'bar' ? 'area' : 'bar')}
                        className="ml-1 px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {marketChartType === 'bar' ? '折线图' : '柱状图'}
                      </button>
                    </div>
                  </div>

                  {marketChartType === 'bar' ? (
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2 flex-1 flex flex-col justify-end">
                      <div className="relative w-full h-28 flex items-end justify-between px-2 pt-2 border-b border-slate-800">
                        {marketOverviewData.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center group relative h-full justify-end flex-1">
                            <div className="absolute -top-12 bg-slate-900 border border-slate-700 text-[9px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-30 pointer-events-none">
                              <div className="text-rose-400">发布: {item.publish}</div>
                              <div className="text-cyan-400">出清: {item.clearing}</div>
                              <div className="text-emerald-400">执行: {item.execute}</div>
                            </div>
                            <div className="flex items-end gap-0.5 h-full">
                              <div className="w-1.5 bg-rose-500 rounded-t-sm" style={{ height: `${(item.publish / 500) * 100}%` }}></div>
                              <div className="w-1.5 bg-cyan-400 rounded-t-sm" style={{ height: `${(item.clearing / 500) * 100}%` }}></div>
                              <div className="w-1.5 bg-emerald-400 rounded-t-sm" style={{ height: `${(item.execute / 500) * 100}%` }}></div>
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1 scale-90">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 relative flex-1 flex flex-col justify-between">
                      <div className="relative w-full h-28">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="area-publish" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="area-clearing" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="area-execute" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0 50 Q 50 20, 100 40 T 200 30 T 300 60 L 300 80 L 0 80 Z" fill="url(#area-publish)" />
                          <path d="M 0 65 Q 50 40, 100 55 T 200 45 T 300 20 L 300 80 L 0 80 Z" fill="url(#area-clearing)" />
                          <path d="M 0 35 Q 50 60, 100 25 T 200 60 T 300 40 L 300 80 L 0 80 Z" fill="url(#area-execute)" />
                          <path d="M 0 50 Q 50 20, 100 40 T 200 30 T 300 60" fill="none" stroke="#f43f5e" strokeWidth="2" />
                          <path d="M 0 65 Q 50 40, 100 55 T 200 45 T 300 20" fill="none" stroke="#06b6d4" strokeWidth="2" />
                          <path d="M 0 35 Q 50 60, 100 25 T 200 60 T 300 40" fill="none" stroke="#10b981" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 pt-1">
                        <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Center Top Column (span 6): Map Overview Card */}
              <div className="lg:col-span-6 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between overflow-hidden h-full">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                    <h3 className="font-bold text-sm text-white tracking-wide">
                      {currentRegion === '全省' ? '全省综合概览地图' : `${currentRegion}综合概览`}
                    </h3>
                  </div>

                  {currentRegion !== '全省' ? (
                    <button
                      onClick={() => setCurrentRegion('全省')}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                    >
                      查看全省
                    </button>
                  ) : (
                    <div className="text-[11px] text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">当前已选: {selectedMonth}</div>
                  )}
                </div>

                <div className="relative flex-1 min-h-[220px] flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 my-1">
                  <svg className="w-full h-full max-w-xs opacity-85" viewBox="0 0 400 350" fill="none">
                    <path d={currentRegion === '全省' ? "M 100 80 Q 200 40, 300 90 T 320 250 Q 200 320, 100 250 Q 50 150, 100 80 Z" : "M 140 40 Q 240 20, 310 100 T 330 240 Q 250 320, 150 280 Q 80 200, 140 40 Z"} fill="#0f172a" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" />
                  </svg>

                  {currentRegion === '全省' ? (
                    <>
                      {/* Left Side Blank Area: 3 Dynamic Fields from topLedData */}
                      <div className="absolute left-3 top-3 z-20 space-y-2 pointer-events-none">
                        <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-44">
                          <span className="text-[10px] text-cyan-300 font-bold px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-800">全省</span>
                          <div>
                            <div className="text-[10px] text-slate-400">可调负荷 (mW)</div>
                            <div className="text-sm font-bold text-cyan-300 font-mono tracking-wider">{topLedData.adjustable}</div>
                          </div>
                        </div>
                        <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-44">
                          <div className="text-[10px] text-slate-400">响应负荷 (mW)</div>
                          <div className="text-sm font-bold text-amber-300 font-mono tracking-wider">{topLedData.response}</div>
                        </div>
                        <div className="bg-slate-900/90 border border-emerald-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-44">
                          <div className="text-[10px] text-slate-400">剩余可调 (mW)</div>
                          <div className="text-sm font-bold text-emerald-300 font-mono tracking-wider">{topLedData.remaining}</div>
                        </div>
                      </div>

                      {dynamicRegions.map((reg, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentRegion(reg.name)}
                          className="absolute px-2.5 py-1.5 rounded-lg bg-slate-900/95 border border-slate-700 hover:border-cyan-400 text-[11px] font-bold text-white transition-all cursor-pointer shadow-lg"
                          style={{ top: `${reg.y}%`, left: `${reg.x}%` }}
                        >
                          {reg.name} ({reg.hazards}项)
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Left Side Blank Area: 3 Fields from Screenshot */}
                      <div className="absolute left-3 top-3 z-25 space-y-2 pointer-events-none">
                        <div className="bg-slate-900/90 border border-cyan-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-36">
                          <div className="text-[10px] text-slate-400">可调负荷 (mW)</div>
                          <div className="text-sm font-bold text-cyan-300 font-mono tracking-wider">6284.92</div>
                        </div>
                        <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-36">
                          <div className="text-[10px] text-slate-400">响应负荷 (mW)</div>
                          <div className="text-sm font-bold text-amber-300 font-mono tracking-wider">3194.92</div>
                        </div>
                        <div className="bg-slate-900/90 border border-emerald-500/40 p-2 rounded-xl shadow-lg backdrop-blur-md w-36">
                          <div className="text-[10px] text-slate-400">剩余可调 (mW)</div>
                          <div className="text-sm font-bold text-emerald-300 font-mono tracking-wider">2793.42</div>
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 z-25 w-60 bg-slate-900/95 border border-cyan-400 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                        <div className="text-xs font-bold text-cyan-300 mb-1">📌 {currentRegion} {selectedMonth} 运营概况</div>
                        <div className="space-y-1 text-[11px] text-slate-200">
                          <div className="flex items-center justify-between"><span>总电厂:</span><span className="font-mono text-cyan-300">5个</span></div>
                          <div className="flex items-center justify-between"><span>新增隐患:</span><span className="font-mono text-amber-300">2个</span></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative z-10 grid grid-cols-12 gap-1 mt-2 pt-2 border-t border-slate-800">
                  {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedMonth === m
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Top Column (span 3): Virtual Power Plant (Generation) */}
              <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-xs text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                    <span>虚拟电厂响应情况 (发电型)</span>
                  </h3>
                  <span className="text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    3个电厂
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">实时出力对比</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400"></span>可调 (kW)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-400"></span>响应 (kW)</span>
                  </div>
                </div>

                <div className="flex-1 min-h-[160px] bg-slate-950/80 rounded-xl p-3 flex flex-col justify-between border border-slate-800">
                  <div className="relative w-full flex-1 flex items-end justify-between px-1 pt-4 border-b border-slate-800">
                    {[
                      { time: '06:00', adj: 420, resp: 310 },
                      { time: '06:30', adj: 480, resp: 380 },
                      { time: '07:00', adj: 520, resp: 450 },
                      { time: '07:30', adj: 490, resp: 410 },
                      { time: '08:15', adj: 560, resp: 490 },
                      { time: '08:45', adj: 530, resp: 460 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center group relative h-full justify-end flex-1">
                        <div className="absolute -top-10 bg-slate-900 border border-slate-700 text-[9px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-30 pointer-events-none">
                          <div className="text-amber-400">可调: {item.adj}</div>
                          <div className="text-cyan-400">响应: {item.resp}</div>
                        </div>
                        <div className="flex items-end gap-1 h-full">
                          <div
                            className="w-2 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm transition-all hover:brightness-125 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                            style={{ height: `${(item.adj / 600) * 100}%` }}
                          ></div>
                          <div
                            className="w-2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all hover:brightness-125 shadow-[0_0_6px_rgba(6,182,212,0.5)]"
                            style={{ height: `${(item.resp / 600) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 scale-90">{item.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 px-1 pt-1">
                    <span>06:00 早高峰</span>
                    <span>08:45 稳定运行</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row Grid: Left Bottom (Transaction Settlement, extended span 9), Right Bottom (Virtual Power Plant Load) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left & Center Bottom Card (span 9): 交易结算概况 (覆盖扩展) */}
              <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative h-full flex flex-col justify-between">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    <h3 className="font-bold text-sm text-white tracking-wide">交易结算概况</h3>
                    <span className="text-[11px] text-slate-400 ml-2 font-normal hidden sm:inline">全省电力交易结算数据与全周期趋势图</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-300 font-mono">
                      当前月份: {activeSettlement.month}
                    </span>
                    <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 px-2.5 py-1 rounded-lg font-mono">
                      结算完成率 100%
                    </span>
                  </div>
                </div>

                {/* Summary Metric Strip - 4 Stat Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
                      <span>当月结算电量</span>
                    </div>
                    <div className="font-mono font-extrabold text-cyan-300 text-base mt-1">
                      {activeSettlement.energy.toFixed(1)} <span className="text-[10px] text-slate-400 font-sans font-normal">MWh</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></span>
                      <span>当月结算电费</span>
                    </div>
                    <div className="font-mono font-extrabold text-amber-300 text-base mt-1">
                      {activeSettlement.fee.toFixed(1)} <span className="text-[10px] text-slate-400 font-sans font-normal">万元</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                      <span>综合结算均价</span>
                    </div>
                    <div className="font-mono font-extrabold text-emerald-300 text-base mt-1">
                      {((activeSettlement.fee * 10000) / activeSettlement.energy).toFixed(0)} <span className="text-[10px] text-slate-400 font-sans font-normal">元/MWh</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]"></span>
                      <span>年度累计总电量</span>
                    </div>
                    <div className="font-mono font-extrabold text-blue-300 text-base mt-1">
                      {settlementData.reduce((acc, curr) => acc + curr.energy, 0).toFixed(0)} <span className="text-[10px] text-slate-400 font-sans font-normal">MWh</span>
                    </div>
                  </div>
                </div>

                {/* Wide Dual-Axis Spline Trend & Gradient Area Chart */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 relative flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-1 rounded bg-cyan-400"></span>结算电量趋势 (MWh)</span>
                      <span className="flex items-center gap-1 ml-2"><span className="w-2.5 h-1 rounded bg-amber-400"></span>结算电费趋势 (万元)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 hidden md:inline">提示: 悬停/点击月份节点可切换查看具体账单</span>
                  </div>

                  <div className="relative w-full h-28">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 800 110" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="settlement-energy-grad-wide" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="40" y1="20" x2="760" y2="20" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="60" x2="760" y2="60" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                      <line x1="40" y1="100" x2="760" y2="100" stroke="#334155" strokeWidth="1" />

                      <line
                        x1={40 + activeSettlementIdx * 80}
                        y1="10"
                        x2={40 + activeSettlementIdx * 80}
                        y2="100"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="opacity-75"
                      />

                      <path d={energyAreaDWide} fill="url(#settlement-energy-grad-wide)" />
                      <path d={energyPathDWide} fill="none" stroke="#06b6d4" strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <path d={feePathDWide} fill="none" stroke="#f59e0b" strokeWidth="2.5" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />

                      {settlementData.map((d, i) => {
                        const cx = 40 + i * 80;
                        const cyEnergy = Math.round(90 - ((d.energy - 500) / 700) * 70);
                        const cyFee = Math.round(90 - ((d.fee - 180) / 240) * 70);
                        const isActive = activeSettlementIdx === i;

                        return (
                          <g key={i} className="cursor-pointer" onClick={() => setActiveSettlementIdx(i)} onMouseEnter={() => setActiveSettlementIdx(i)}>
                            <circle
                              cx={cx}
                              cy={cyEnergy}
                              r={isActive ? 5.5 : 3.5}
                              fill="#06b6d4"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            <circle
                              cx={cx}
                              cy={cyFee}
                              r={isActive ? 6 : 4}
                              fill="#f59e0b"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            <rect
                              x={cx - 35}
                              y="0"
                              width="70"
                              height="110"
                              fill="transparent"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="grid grid-cols-10 gap-1 pt-2 border-t border-slate-800/80">
                    {settlementData.map((d, i) => (
                      <button
                        key={d.month}
                        onClick={() => setActiveSettlementIdx(i)}
                        className={`py-1.5 text-[10px] font-mono rounded-lg transition-all text-center cursor-pointer ${
                          activeSettlementIdx === i
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50 shadow-md shadow-emerald-500/20 scale-105'
                            : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
                        }`}
                      >
                        {d.month}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Bottom Card (span 3): 虚拟电厂响应情况 (用电型) */}
              <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-xs text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                    <span>虚拟电厂响应情况 (用电型)</span>
                  </h3>
                  <span className="text-[10px] text-purple-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    10个大户
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">负荷与剩余容量</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-400"></span>可调</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400"></span>响应</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400"></span>剩余</span>
                  </div>
                </div>

                <div className="flex-1 min-h-[140px] bg-slate-950/80 rounded-xl p-3 flex flex-col justify-between border border-slate-800">
                  <div className="relative w-full flex-1 flex items-end justify-between px-1 pt-4 border-b border-slate-800">
                    {[
                      { time: '06:00', load: 380, resp: 290, remain: 150 },
                      { time: '06:30', load: 430, resp: 340, remain: 120 },
                      { time: '07:00', load: 490, resp: 390, remain: 95 },
                      { time: '07:30', load: 460, resp: 360, remain: 110 },
                      { time: '08:15', load: 510, resp: 420, remain: 80 },
                      { time: '08:45', load: 480, resp: 390, remain: 100 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center group relative h-full justify-end flex-1">
                        <div className="absolute -top-14 bg-slate-900 border border-slate-700 text-[9px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-30 pointer-events-none">
                          <div className="text-purple-400">可调: {item.load}</div>
                          <div className="text-amber-400">响应: {item.resp}</div>
                          <div className="text-emerald-400">剩余: {item.remain}</div>
                        </div>
                        <div className="flex items-end gap-0.5 h-full">
                          <div
                            className="w-1.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm transition-all hover:brightness-125"
                            style={{ height: `${(item.load / 600) * 100}%` }}
                          ></div>
                          <div
                            className="w-1.5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm transition-all hover:brightness-125"
                            style={{ height: `${(item.resp / 600) * 100}%` }}
                          ></div>
                          <div
                            className="w-1.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all hover:brightness-125"
                            style={{ height: `${(item.remain / 600) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 scale-90">{item.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 px-1 pt-1">
                    <span>06:00 用电高峰</span>
                    <span>08:45 负荷平稳</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: OPERATION MANAGEMENT (运行管理) */}
        {topTab === 'operation' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Sub-menu bar for 运行管理 */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">运行管理子菜单:</span>
                <button
                  onClick={() => setOperationSubTab('generation')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    operationSubTab === 'generation'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>发电资源监测</span>
                </button>
                <button
                  onClick={() => setOperationSubTab('consumption')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    operationSubTab === 'consumption'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Factory className="w-4 h-4 text-cyan-400" />
                  <span>用电资源管理</span>
                </button>
              </div>
              <span className="text-xs text-cyan-400 font-mono">
                {operationSubTab === 'generation' ? '当前页面: 发电侧电站实时出力与设备排查' : '当前页面: 用电侧工业大户负荷与隐患监测'}
              </span>
            </div>

            {/* Sub-view 1: 发电资源监测 */}
            {operationSubTab === 'generation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <h3 className="font-bold text-xs text-white flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                        <span>各区域发电型虚拟电厂情况</span>
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 font-mono">2026-10 📅</span>
                        <span>(单位: 个)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-300 px-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]"></span>总数</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>新增</span>
                      </div>
                      <span className="text-[10px] text-cyan-400/80 font-mono">双维极光柱矩阵</span>
                    </div>

                    {/* New Chart Style: Vertical Step Segmented Columns with Dual Gradient Glow */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="grid grid-cols-4 gap-2 items-end h-36 pt-4 pb-1 border-b border-slate-800/60">
                        {[
                          { city: '西宁市', total: 30, newCount: 3, max: 50 },
                          { city: '海东市', total: 40, newCount: 3, max: 50 },
                          { city: '海西州', total: 50, newCount: 10, max: 50 },
                          { city: '海南州', total: 32, newCount: 5, max: 50 },
                        ].map((item, idx) => {
                          const totalPct = Math.round((item.total / item.max) * 100);
                          const newPct = Math.round((item.newCount / 15) * 100);
                          return (
                            <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-pointer relative">
                              {/* Hover Tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 border border-cyan-500/50 text-[10px] px-2 py-0.5 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none text-slate-200">
                                <span className="text-cyan-300 font-bold">{item.city}</span>: 总数{item.total}个 / 新增{item.newCount}个
                              </div>

                              {/* Dual Vertical Columns */}
                              <div className="flex items-end gap-1.5 h-28 w-full justify-center">
                                {/* Total Column */}
                                <div className="w-3.5 bg-slate-900 rounded-t border border-cyan-500/30 flex flex-col justify-end overflow-hidden h-full relative">
                                  <div 
                                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                                    style={{ height: `${totalPct}%` }}
                                  >
                                    <div className="w-full h-1 bg-white/40"></div>
                                  </div>
                                </div>

                                {/* New Column */}
                                <div className="w-3.5 bg-slate-900 rounded-t border border-amber-500/30 flex flex-col justify-end overflow-hidden h-full relative">
                                  <div 
                                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                    style={{ height: `${newPct}%` }}
                                  >
                                    <div className="w-full h-1 bg-white/40"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Numbers */}
                              <div className="mt-1.5 text-center">
                                <div className="text-[11px] font-bold font-mono text-cyan-300 leading-none">{item.total}</div>
                                <div className="text-[9px] font-mono text-amber-400 mt-0.5">+{item.newCount}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* City Labels underneath */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                        {['西宁市', '海东市', '海西州', '海南州'].map((city, idx) => (
                          <div key={idx} className="text-slate-300 font-bold bg-slate-900/90 py-1 rounded border border-slate-800/80">
                            {city}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-xs text-white flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                        <span>虚拟电厂内电源类型概况</span>
                      </h3>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-cyan-300">2026-10 ▾</span>
                    </div>

                    <div className="flex items-center justify-center py-4 relative">
                      <div className="w-32 h-32 rounded-full border-8 border-cyan-500 border-t-amber-400 border-r-blue-500 flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <span className="text-xs font-bold text-white">40个</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 pt-2 border-t border-slate-800 text-center">
                      <div><span className="w-2 h-2 rounded bg-cyan-400 inline-block mr-1"></span>分布式光伏 (16个)</div>
                      <div><span className="w-2 h-2 rounded bg-amber-400 inline-block mr-1"></span>小型风电 (14个)</div>
                      <div><span className="w-2 h-2 rounded bg-blue-500 inline-block mr-1"></span>小型水力 (10个)</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-white flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                        <span>资源容量概况</span>
                      </h3>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-cyan-300">2026-10-16 📅</span>
                        <span className="text-slate-400">(单位: mW)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center py-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300">
                          1353.09
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2">装机总量</span>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 flex items-center justify-center text-xs font-bold text-amber-300">
                          1353.09
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2">预测出力</span>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center text-xs font-bold text-emerald-300">
                          1353.09
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2">实测出力</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table & Directory */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-xs text-white flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-cyan-400" />
                        <span>行政区域与虚拟电厂目录</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-between cursor-pointer">
                        <span>🌐 全省</span>
                        <span>▾</span>
                      </div>
                      <div className="pl-4 space-y-1 pt-1">
                        {['西宁市', '海东市', '海西州', '海南州'].map((city, idx) => (
                          <div key={idx} className="p-2 rounded-lg hover:bg-slate-800/60 flex items-center justify-between cursor-pointer text-slate-400 hover:text-white">
                            <span className="flex items-center gap-1.5"><span>📁</span> {city}</span>
                            <span className="text-[10px] text-cyan-400">3个电厂</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-white flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                        <span>发电资源明细及出力实时监测台账</span>
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">共 11 条记录</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/80 text-slate-400 text-xs border-b border-slate-800">
                            <th className="py-3 px-4 font-semibold">序号</th>
                            <th className="py-3 px-4 font-semibold">资源编号</th>
                            <th className="py-3 px-4 font-semibold">资源名称</th>
                            <th className="py-3 px-4 font-semibold">装机容量 (mW)</th>
                            <th className="py-3 px-4 font-semibold">本月出力预测 (mW)</th>
                            <th className="py-3 px-4 font-semibold">实测出力 (mW)</th>
                            <th className="py-3 px-4 font-semibold text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs">
                          {generationResources.map((res) => (
                            <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4 font-mono text-slate-400">{res.id}</td>
                              <td className="py-3 px-4 font-mono text-cyan-400">{res.code}</td>
                              <td className="py-3 px-4 font-bold text-white">{res.name}</td>
                              <td className="py-3 px-4 text-slate-300 font-mono">{res.capacity}</td>
                              <td className="py-3 px-4 text-cyan-300 font-mono">{res.predicted}</td>
                              <td className="py-3 px-4 text-emerald-300 font-mono">{res.actual}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setSelectedResourceModal(res)}
                                  className="px-3 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 ml-auto cursor-pointer"
                                >
                                  <Activity className="w-3.5 h-3.5" />
                                  <span>响应明细</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view 2: 用电资源管理 (Matching EXACT Prototype Screenshot) */}
            {operationSubTab === 'consumption' && (
              <div className="space-y-6">
                
                {/* Top Row: Left Card (各地市虚拟电厂概况) & Right Card (用电资源负荷曲线) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Top Left Card: 各地市虚拟电厂概况 */}
                  <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                        <h3 className="font-bold text-xs text-white">各地市虚拟电厂概况</h3>
                      </div>

                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 font-mono">
                          2026-10 📅
                        </span>
                        <span className="text-slate-500">(单位: 个)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-slate-300 px-1">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-cyan-400"></span>总数</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-amber-400"></span>新增</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs flex-1">
                      {[
                        { city: '西宁市', total: 30, newCount: 3 },
                        { city: '海东市', total: 40, newCount: 3 },
                        { city: '海西州', total: 50, newCount: 10 },
                        { city: '海南州', total: 32, newCount: 5 },
                        { city: '果洛州', total: 28, newCount: 2 },
                        { city: '玉树州', total: 24, newCount: 1 },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-300 font-bold text-[11px] w-12">{item.city}</span>
                          <div className="flex-1 mx-2 space-y-1">
                            <div className="h-1.5 bg-cyan-500/20 rounded-full overflow-hidden">
                              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(item.total / 60) * 100}%` }}></div>
                            </div>
                            <div className="h-1 bg-amber-500/20 rounded-full overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(item.newCount / 12) * 100}%` }}></div>
                            </div>
                          </div>
                          <div className="text-right text-[10px] font-mono">
                            <div className="text-cyan-300 font-bold">{item.total}</div>
                            <div className="text-amber-400">{item.newCount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Right Card: 用电资源负荷曲线 */}
                  <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
                    {(() => {
                      // Get current dataset based on vppCurveMode ('day' | 'month' | 'year')
                      let items = [
                        { label: '00:00', adj: 110, resp: 52 },
                        { label: '02:00', adj: 112, resp: 52 },
                        { label: '04:00', adj: 128, resp: 64 },
                        { label: '06:00', adj: 185, resp: 122 },
                        { label: '08:00', adj: 245, resp: 198 },
                        { label: '10:00', adj: 285, resp: 235 },
                        { label: '12:00', adj: 225, resp: 178 },
                        { label: '14:00', adj: 260, resp: 215 },
                        { label: '16:00', adj: 218, resp: 175 },
                        { label: '18:00', adj: 192, resp: 152 },
                        { label: '20:00', adj: 168, resp: 128 },
                        { label: '22:00', adj: 145, resp: 110 },
                      ];
                      let unit = 'kW';
                      let maxVal = 320;

                      if (vppCurveMode === 'month') {
                        unit = 'kWh';
                        maxVal = 10000;
                        items = [
                          { label: '1月', adj: 3200, resp: 1800 },
                          { label: '2月', adj: 3500, resp: 2100 },
                          { label: '3月', adj: 4200, resp: 2800 },
                          { label: '4月', adj: 5100, resp: 3600 },
                          { label: '5月', adj: 6400, resp: 4800 },
                          { label: '6月', adj: 7200, resp: 5500 },
                          { label: '7月', adj: 8800, resp: 6400 },
                          { label: '8月', adj: 8500, resp: 6200 },
                          { label: '9月', adj: 7100, resp: 5100 },
                          { label: '10月', adj: 6800, resp: 4900 },
                        ];
                      } else if (vppCurveMode === 'year') {
                        unit = '万kWh';
                        maxVal = 150000;
                        items = [
                          { label: '2025年', adj: 112000, resp: 82000 },
                          { label: '2026年', adj: 128000, resp: 96000 },
                        ];
                      }

                      // Generate SVG path coordinates
                      const svgWidth = 680;
                      const svgHeight = 110;
                      const paddingX = 30;
                      const usableWidth = svgWidth - paddingX * 2;
                      const stepX = items.length > 1 ? usableWidth / (items.length - 1) : usableWidth;

                      const pts = items.map((it, idx) => {
                        const x = paddingX + idx * stepX;
                        const yAdj = svgHeight - (it.adj / maxVal) * 90 - 10;
                        const yResp = svgHeight - (it.resp / maxVal) * 90 - 10;
                        return { x, yAdj, yResp, label: it.label, adj: it.adj, resp: it.resp };
                      });

                      const adjPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yAdj.toFixed(1)}`).join(' ');
                      const adjAreaPath = `${adjPath} L ${pts[pts.length - 1].x.toFixed(1)} ${svgHeight} L ${pts[0].x.toFixed(1)} ${svgHeight} Z`;

                      const respPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yResp.toFixed(1)}`).join(' ');
                      const respAreaPath = `${respPath} L ${pts[pts.length - 1].x.toFixed(1)} ${svgHeight} L ${pts[0].x.toFixed(1)} ${svgHeight} Z`;

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                              <h3 className="font-bold text-xs text-white">用电资源负荷曲线</h3>
                              <span className="text-[10px] text-cyan-400/90 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                {vppCurveMode === 'day' ? '日度高精采样' : vppCurveMode === 'month' ? '月度电能趋势' : '年度规模攀升'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px]">
                              {/* Switch buttons: 按日, 按月, 按年 */}
                              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                                <button
                                  onClick={() => setVppCurveMode('day')}
                                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-colors ${vppCurveMode === 'day' ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-400 hover:text-white'}`}
                                >
                                  按日
                                </button>
                                <button
                                  onClick={() => setVppCurveMode('month')}
                                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-colors ${vppCurveMode === 'month' ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-400 hover:text-white'}`}
                                >
                                  按月
                                </button>
                                <button
                                  onClick={() => setVppCurveMode('year')}
                                  className={`px-2.5 py-0.5 rounded cursor-pointer transition-colors ${vppCurveMode === 'year' ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-400 hover:text-white'}`}
                                >
                                  按年
                                </button>
                              </div>

                              {vppCurveMode === 'day' && (
                                <input
                                  type="date"
                                  value={vppCurveDate}
                                  onChange={(e) => setVppCurveDate(e.target.value)}
                                  className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 focus:outline-none cursor-pointer"
                                />
                              )}
                              {vppCurveMode === 'month' && (
                                <input
                                  type="month"
                                  defaultValue="2026-10"
                                  className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 focus:outline-none cursor-pointer"
                                />
                              )}
                              {vppCurveMode === 'year' && (
                                <select className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 focus:outline-none cursor-pointer">
                                  <option value="2026">2026年</option>
                                  <option value="2025">2025年</option>
                                </select>
                              )}

                              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300 cursor-pointer">
                                全省 ▾
                              </span>

                              <span className="text-slate-500 ml-1">(单位: {unit})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-4 text-[10px] text-slate-300 px-1">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>可调负荷 ({unit})</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>响应负荷 ({unit})</span>
                          </div>

                          {/* New High-Tech Dual Area Spline & Histogram Pillar Combo Chart */}
                          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 relative flex-1 flex flex-col justify-between min-h-[175px]">
                            <div className="relative w-full h-36">
                              <svg className="w-full h-full overflow-visible" viewBox="0 0 680 110" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="vppAdjGlowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                                  </linearGradient>
                                  <linearGradient id="vppRespGlowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>

                                {/* Background Grid lines */}
                                <line x1="10" y1="20" x2="670" y2="20" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                                <line x1="10" y1="60" x2="670" y2="60" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                                <line x1="10" y1="100" x2="670" y2="100" stroke="#334155" strokeWidth="1" />

                                {/* Background Pillars for Mode Visual Differentiation */}
                                {pts.map((p, i) => (
                                  <g key={`bar-${i}`}>
                                    <rect
                                      x={p.x - 4}
                                      y={p.yAdj}
                                      width="8"
                                      height={110 - p.yAdj}
                                      fill="#f59e0b"
                                      opacity="0.12"
                                      rx="2"
                                    />
                                    <rect
                                      x={p.x - 2}
                                      y={p.yResp}
                                      width="4"
                                      height={110 - p.yResp}
                                      fill="#10b981"
                                      opacity="0.2"
                                      rx="1"
                                    />
                                  </g>
                                ))}

                                {/* Area Fill Path 可调 (Amber Glow) */}
                                <path d={adjAreaPath} fill="url(#vppAdjGlowGrad)" />

                                {/* Area Fill Path 响应 (Emerald Glow) */}
                                <path d={respAreaPath} fill="url(#vppRespGlowGrad)" />

                                {/* Line Path 可调 (Amber) */}
                                <path
                                  d={adjPath}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="2.5"
                                  className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                                />

                                {/* Line Path 响应 (Emerald) */}
                                <path
                                  d={respPath}
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                />

                                {/* Glowing Nodes with Hover Tooltips */}
                                {pts.map((pt, i) => (
                                  <g key={`pt-${i}`} className="group cursor-pointer">
                                    <circle cx={pt.x} cy={pt.yAdj} r="4" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
                                    <circle cx={pt.x} cy={pt.yResp} r="3.5" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />

                                    {/* Hover Card Tooltip */}
                                    <foreignObject x={Math.min(Math.max(pt.x - 40, 0), 600)} y={Math.max(pt.yAdj - 45, 0)} width="85" height="40" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      <div className="bg-slate-900/95 border border-amber-500/50 rounded px-1.5 py-1 text-[9px] text-white shadow-xl">
                                        <div className="font-bold text-cyan-300">{pt.label}</div>
                                        <div className="text-amber-400">可调: {pt.adj}</div>
                                        <div className="text-emerald-400">响应: {pt.resp}</div>
                                      </div>
                                    </foreignObject>
                                  </g>
                                ))}
                              </svg>
                            </div>

                            {/* Dynamic X-Axis Labels directly matching the active mode */}
                            <div className="flex justify-between text-[9px] text-slate-400 pt-1.5 border-t border-slate-800/80 px-1 font-mono">
                              {pts.map((pt, i) => (
                                <span key={i} className="text-center font-bold">{pt.label}</span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                </div>

                {/* Bottom Row: Left Tree & Right Table matching EXACT screenshot layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Bottom Left Panel: 行政区域与虚拟电厂树形目录 */}
                  <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <FolderTree className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs text-white">行政区域与虚拟电厂目录</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <label className="flex items-center gap-2 font-bold text-cyan-300 cursor-pointer p-1.5 rounded hover:bg-slate-800/60">
                        <input
                          type="checkbox"
                          checked={vppTreeCity === '全省'}
                          onChange={() => setVppTreeCity('全省')}
                          className="accent-cyan-500 rounded"
                        />
                        <span>🌐 全省</span>
                      </label>

                      <div className="pl-4 space-y-1.5">
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 font-semibold text-slate-200 cursor-pointer p-1 rounded hover:bg-slate-800/60">
                            <input
                              type="checkbox"
                              checked={vppTreeCity === '西宁市'}
                              onChange={() => setVppTreeCity('西宁市')}
                              className="accent-cyan-500 rounded"
                            />
                            <span>📁 西宁市</span>
                          </label>

                          <div className="pl-5 space-y-1 text-[11px] text-slate-400">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                              <input type="checkbox" className="accent-cyan-500 rounded" defaultChecked />
                              <span>西宁特钢虚拟电厂</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                              <input type="checkbox" className="accent-cyan-500 rounded" />
                              <span>盐湖化工虚拟电厂</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                              <input type="checkbox" className="accent-cyan-500 rounded" />
                              <span>高新超算虚拟电厂</span>
                            </label>
                          </div>
                        </div>

                        {['海东市', '海西州', '海南州', '果洛州', '玉树州'].map((city) => (
                          <label key={city} className="flex items-center gap-2 text-slate-400 cursor-pointer p-1 rounded hover:bg-slate-800/60 hover:text-white">
                            <input
                              type="checkbox"
                              checked={vppTreeCity === city}
                              onChange={() => setVppTreeCity(city)}
                              className="accent-cyan-500 rounded"
                            />
                            <span>📁 {city}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right Panel: Exact Prototype Table sorted Descending */}
                  <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                        <h3 className="font-bold text-xs text-white">用电资源负荷与结算台账</h3>
                        <span className="text-[10px] text-cyan-400 ml-2 font-mono">已按降序排列 (点击表头可切换排序)</span>
                      </div>

                      <div className="text-xs text-slate-400 font-mono">共 11 条数据记录</div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/90 text-slate-400 text-xs border-b border-slate-800">
                            <th className="py-3 px-4 font-semibold text-center w-12">序号</th>
                            <th className="py-3 px-4 font-semibold">资源编号</th>
                            <th className="py-3 px-4 font-semibold">资源名称</th>

                            <th
                              onClick={() => {
                                setVppSortField('adjustableLoad');
                                setVppSortDir(vppSortField === 'adjustableLoad' && vppSortDir === 'desc' ? 'asc' : 'desc');
                              }}
                              className="py-3 px-4 font-semibold cursor-pointer hover:text-cyan-300 select-none"
                            >
                              <div className="flex items-center gap-1">
                                <span>可调负荷 (kW)</span>
                                <span className={vppSortField === 'adjustableLoad' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {vppSortField === 'adjustableLoad' ? (vppSortDir === 'desc' ? '▼' : '▲') : '↕'}
                                </span>
                              </div>
                            </th>

                            <th
                              onClick={() => {
                                setVppSortField('responseLoad');
                                setVppSortDir(vppSortField === 'responseLoad' && vppSortDir === 'desc' ? 'asc' : 'desc');
                              }}
                              className="py-3 px-4 font-semibold cursor-pointer hover:text-cyan-300 select-none"
                            >
                              <div className="flex items-center gap-1">
                                <span>响应负荷 (kW)</span>
                                <span className={vppSortField === 'responseLoad' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {vppSortField === 'responseLoad' ? (vppSortDir === 'desc' ? '▼' : '▲') : '↕'}
                                </span>
                              </div>
                            </th>

                            <th
                              onClick={() => {
                                setVppSortField('remainingLoad');
                                setVppSortDir(vppSortField === 'remainingLoad' && vppSortDir === 'desc' ? 'asc' : 'desc');
                              }}
                              className="py-3 px-4 font-semibold cursor-pointer hover:text-cyan-300 select-none"
                            >
                              <div className="flex items-center gap-1">
                                <span>剩余可调负荷 (kW)</span>
                                <span className={vppSortField === 'remainingLoad' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {vppSortField === 'remainingLoad' ? (vppSortDir === 'desc' ? '▼' : '▲') : '↕'}
                                </span>
                              </div>
                            </th>

                            <th
                              onClick={() => {
                                setVppSortField('settlementEnergy');
                                setVppSortDir(vppSortField === 'settlementEnergy' && vppSortDir === 'desc' ? 'asc' : 'desc');
                              }}
                              className="py-3 px-4 font-semibold cursor-pointer hover:text-cyan-300 select-none"
                            >
                              <div className="flex items-center gap-1">
                                <span>本月结算电量</span>
                                <span className={vppSortField === 'settlementEnergy' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {vppSortField === 'settlementEnergy' ? (vppSortDir === 'desc' ? '▼' : '▲') : '↕'}
                                </span>
                              </div>
                            </th>

                            <th
                              onClick={() => {
                                setVppSortField('settlementFee');
                                setVppSortDir(vppSortField === 'settlementFee' && vppSortDir === 'desc' ? 'asc' : 'desc');
                              }}
                              className="py-3 px-4 font-semibold cursor-pointer hover:text-cyan-300 select-none"
                            >
                              <div className="flex items-center gap-1">
                                <span>本月结算电费</span>
                                <span className={vppSortField === 'settlementFee' ? 'text-cyan-400 font-bold' : 'text-slate-600'}>
                                  {vppSortField === 'settlementFee' ? (vppSortDir === 'desc' ? '▼' : '▲') : '↕'}
                                </span>
                              </div>
                            </th>

                            <th className="py-3 px-4 font-semibold text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs font-mono">
                          {[...MOCK_CONSUMPTION_LOAD_ITEMS]
                            .sort((a, b) => {
                              const factor = vppSortDir === 'desc' ? -1 : 1;
                              return (a[vppSortField] - b[vppSortField]) * factor;
                            })
                            .map((item, index) => (
                              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                                <td className="py-3 px-4 text-cyan-400">{item.code}</td>
                                <td className="py-3 px-4 text-white font-sans font-bold">{item.name}</td>
                                <td className="py-3 px-4 text-amber-300 font-bold">{item.adjustableLoad.toFixed(2)}</td>
                                <td className="py-3 px-4 text-cyan-300 font-bold">{item.responseLoad.toFixed(2)}</td>
                                <td className="py-3 px-4 text-emerald-300 font-bold">{item.remainingLoad.toFixed(2)}</td>
                                <td className="py-3 px-4 text-slate-200">{item.settlementEnergy.toFixed(2)}</td>
                                <td className="py-3 px-4 text-slate-200">{item.settlementFee.toFixed(2)}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => setSelectedResourceModal(item)}
                                    className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>响应明细</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 3: POWER MARKET (电力市场 - Req 7 with 3 Sub-menus: 统计分析 | 市场发布 | 结算管理) */}
        {topTab === 'market' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Sub-menu bar for 电力市场 */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">电力市场子菜单:</span>
                <button
                  onClick={() => setMarketSubTab('stat')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    marketSubTab === 'stat'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  <span>统计分析</span>
                </button>

                <button
                  onClick={() => setMarketSubTab('publish')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    marketSubTab === 'publish'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>市场发布</span>
                </button>

                <button
                  onClick={() => setMarketSubTab('settlement')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    marketSubTab === 'settlement'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>结算管理</span>
                </button>
              </div>

              <span className="text-xs text-cyan-400 font-mono">
                基准交割日期: {marketDate}
              </span>
            </div>

            {/* Sub-menu 1: 统计分析 (Matching EXACT Prototype Screenshot) */}
            {marketSubTab === 'stat' && (
              <div className="space-y-6">
                
                {/* Section 1: 月度市场交易分析概况 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                      <h3 className="font-bold text-sm text-white tracking-wide">月度市场交易分析概况</h3>
                    </div>
                    <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-cyan-300 font-mono text-xs cursor-pointer">
                      2026-10 📅
                    </span>
                  </div>

                  {/* 7 Metric Cards Grid across the top matching screenshot */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3">
                    
                    {/* Card 1: 市场发布 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>市场发布</span>
                        <FileText className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="font-mono font-extrabold text-white text-base mt-2">
                        1023.45 <span className="text-[10px] text-slate-400 font-normal">mW</span>
                      </div>
                      <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                        <span>较上月 4.98%</span>
                        <span>↗</span>
                      </div>
                    </div>

                    {/* Card 2: 申报负荷 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>申报负荷</span>
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-mono font-extrabold text-cyan-300 text-base mt-2">
                        420.09 <span className="text-[10px] text-slate-400 font-normal">mW</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
                        <span className="text-emerald-400">环比 14.98% ↗</span>
                        <span className="text-slate-400">申报主体: 32个</span>
                      </div>
                    </div>

                    {/* Card 3: 出清负荷 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>出清负荷</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="font-mono font-extrabold text-emerald-300 text-base mt-2">
                        345.12 <span className="text-[10px] text-slate-400 font-normal">mW</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
                        <span className="text-rose-400">环比 14.98% ↘</span>
                        <span className="text-slate-400">出清主体: 25个</span>
                      </div>
                    </div>

                    {/* Card 4: 执行负荷 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>执行负荷</span>
                        <Activity className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="font-mono font-extrabold text-blue-300 text-base mt-2">
                        345.12 <span className="text-[10px] text-slate-400 font-normal">mW</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
                        <span className="text-emerald-400">环比 4.98% ↗</span>
                        <span className="text-slate-400">出清主体: 25个</span>
                      </div>
                    </div>

                    {/* Card 5: 结算电量 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>结算电量</span>
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-mono font-extrabold text-cyan-400 text-base mt-2">
                        321.90 <span className="text-[10px] text-slate-400 font-normal">mW/h</span>
                      </div>
                      <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                        <span>较上月 4.98%</span>
                        <span>↘</span>
                      </div>
                    </div>

                    {/* Card 6: 结算电费 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>结算电费</span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="font-mono font-extrabold text-emerald-300 text-base mt-2">
                        432.09 <span className="text-[10px] text-slate-400 font-normal">万元</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                        <span>较上月 4.98%</span>
                        <span>↗</span>
                      </div>
                    </div>

                    {/* Card 7: 结算均价 */}
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>结算均价</span>
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="font-mono font-extrabold text-amber-300 text-base mt-2">
                        1.34 <span className="text-[10px] text-slate-400 font-normal">元/mW/h</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                        <span>较上月 4.98%</span>
                        <span>↗</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Section 2: 月度各品种市场交易分析 (全新平滑渐变面积流图 & 品种环形仪表盘) */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                      <h3 className="font-bold text-sm text-white tracking-wide">月度各品种市场交易分析 (平滑渐变面积流与主体环形表达)</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-cyan-300 font-mono cursor-pointer">
                        2026-10 📅
                      </span>
                    </div>
                  </div>

                  {/* Top Variety Donut / Gauge Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {MOCK_MARKET_VARIETY_STATS.map((item, idx) => {
                      const clearRatio = Math.round((item.clearLoad / item.publishLoad) * 100);
                      const isHovered = hoveredVarietyIndex === idx;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredVarietyIndex(idx)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                            isHovered
                              ? 'bg-slate-800/90 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
                            <span className="font-bold text-xs text-white">{item.category}交易</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                              出清率 {clearRatio}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="space-y-1 text-[10px]">
                              <div className="text-slate-400">
                                申报/出清: <strong className="text-amber-300 font-mono">{item.bidSubjects}/{item.clearSubjects}</strong>个
                              </div>
                              <div className="text-slate-400">
                                出清负荷: <strong className="text-emerald-400 font-mono">{item.clearLoad.toFixed(0)}</strong>mW
                              </div>
                            </div>

                            {/* Ring Progress SVG */}
                            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="3"
                                  strokeDasharray="88"
                                  strokeDashoffset={Math.max(0, 88 - (88 * clearRatio) / 100)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-[8px] font-mono font-bold text-white">{clearRatio}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Multi-legend Row */}
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>发布负荷 (mW)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>申报负荷 (mW)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>出清负荷 (mW)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>执行负荷 (mW)</span>
                  </div>

                  {/* Gradient Spline Flow Chart */}
                  <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 relative space-y-2 overflow-hidden">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>(负荷流量 mW)</span>
                      <span>(品种坐标: 日前 → 日内 → 月内 → 多月 → 年度)</span>
                    </div>

                    <div className="relative w-full h-64 pt-2 border-b border-slate-800">
                      {/* Y Grid Lines */}
                      <div className="absolute inset-0 pt-2 flex flex-col justify-between pointer-events-none opacity-20 text-[9px] text-slate-400">
                        <div className="border-b border-slate-600 w-full">2200 mW</div>
                        <div className="border-b border-slate-600 w-full">1650 mW</div>
                        <div className="border-b border-slate-600 w-full">1100 mW</div>
                        <div className="border-b border-slate-600 w-full">550 mW</div>
                        <div className="border-b border-slate-600 w-full">0 mW</div>
                      </div>

                      {/* SVG Gradient Spline Curve Canvas */}
                      <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible relative z-10">
                        <defs>
                          <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="clearGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Spline Area Fills */}
                        <path
                          d="M 80 129 C 140 129, 180 185, 240 185 C 300 185, 340 105, 400 105 C 460 105, 500 155, 560 155 C 620 155, 660 67, 720 67 L 720 200 L 80 200 Z"
                          fill="url(#pubGrad)"
                        />
                        <path
                          d="M 80 138 C 140 138, 180 187, 240 187 C 300 187, 340 114, 400 114 C 460 114, 500 160, 560 160 C 620 160, 660 78, 720 78 L 720 200 L 80 200 Z"
                          fill="url(#bidGrad)"
                        />

                        {/* Spline Lines: 发布 (Cyan) */}
                        <path
                          d="M 80 129 C 140 129, 180 185, 240 185 C 300 185, 340 105, 400 105 C 460 105, 500 155, 560 155 C 620 155, 660 67, 720 67"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        />

                        {/* Spline Lines: 申报 (Amber) */}
                        <path
                          d="M 80 138 C 140 138, 180 187, 240 187 C 300 187, 340 114, 400 114 C 460 114, 500 160, 560 160 C 620 160, 660 78, 720 78"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                        />

                        {/* Spline Lines: 出清 (Lime) */}
                        <path
                          d="M 80 148 C 140 148, 180 191, 240 191 C 300 191, 340 124, 400 124 C 460 124, 500 165, 560 165 C 620 165, 660 87, 720 87"
                          fill="none"
                          stroke="#84cc16"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />

                        {/* Spline Lines: 执行 (Emerald) */}
                        <path
                          d="M 80 150 C 140 150, 180 192, 240 192 C 300 192, 340 125, 400 125 C 460 125, 500 166, 560 166 C 620 166, 660 89, 720 89"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        />

                        {/* Interactive Variety Node Points */}
                        {[
                          { x: 80, pub: 1245.8, bid: 1120.5, clear: 980.2, exec: 950.0, yPub: 129, yBid: 138, yClear: 148, yExec: 150 },
                          { x: 240, pub: 480.2, bid: 450.0, clear: 390.5, exec: 385.0, yPub: 185, yBid: 187, yClear: 191, yExec: 192 },
                          { x: 400, pub: 1580.0, bid: 1450.0, clear: 1320.0, exec: 1310.0, yPub: 105, yBid: 114, yClear: 124, yExec: 125 },
                          { x: 560, pub: 890.0, bid: 820.0, clear: 750.0, exec: 745.0, yPub: 155, yBid: 160, yClear: 165, yExec: 166 },
                          { x: 720, pub: 2100.0, bid: 1950.0, clear: 1820.0, exec: 1800.0, yPub: 67, yBid: 78, yClear: 87, yExec: 89 }
                        ].map((pt, idx) => {
                          const isHovered = hoveredVarietyIndex === idx;
                          return (
                            <g
                              key={idx}
                              onMouseEnter={() => setHoveredVarietyIndex(idx)}
                              className="cursor-pointer group"
                            >
                              {/* Hover Guideline */}
                              {isHovered && (
                                <line x1={pt.x} y1="10" x2={pt.x} y2="200" stroke="#cbd5e1" strokeDasharray="3 3" opacity="0.6" />
                              )}

                              {/* Nodes */}
                              <circle cx={pt.x} cy={pt.yPub} r="4" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
                              <circle cx={pt.x} cy={pt.yBid} r="4" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
                              <circle cx={pt.x} cy={pt.yClear} r="3.5" fill="#84cc16" stroke="#0f172a" strokeWidth="1.5" />
                              <circle cx={pt.x} cy={pt.yExec} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />

                              {/* Interactive Tooltip Card */}
                              {isHovered && (
                                <foreignObject x={pt.x > 500 ? pt.x - 210 : pt.x + 15} y="15" width="200" height="150" className="overflow-visible">
                                  <div className="bg-slate-900/95 border border-amber-400/80 rounded-xl p-3 shadow-2xl text-[11px] backdrop-blur-md text-white space-y-1.5 animate-fadeIn">
                                    <div className="font-bold text-amber-300 border-b border-slate-800 pb-1">
                                      2026年10月 ({MOCK_MARKET_VARIETY_STATS[idx].category})
                                    </div>
                                    <div className="space-y-1 text-slate-200">
                                      <div className="flex justify-between"><span>发布负荷:</span><strong className="text-cyan-300 font-mono">{pt.pub.toFixed(2)} mW</strong></div>
                                      <div className="flex justify-between"><span>申报负荷:</span><strong className="text-amber-300 font-mono">{pt.bid.toFixed(2)} mW</strong></div>
                                      <div className="flex justify-between"><span>出清负荷:</span><strong className="text-lime-300 font-mono">{pt.clear.toFixed(2)} mW</strong></div>
                                      <div className="flex justify-between"><span>执行负荷:</span><strong className="text-emerald-300 font-mono">{pt.exec.toFixed(2)} mW</strong></div>
                                      <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                                        <span>主体数(申/出):</span>
                                        <span className="text-amber-400 font-bold">{MOCK_MARKET_VARIETY_STATS[idx].bidSubjects} / {MOCK_MARKET_VARIETY_STATS[idx].clearSubjects} 个</span>
                                      </div>
                                    </div>
                                  </div>
                                </foreignObject>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* X-Axis Variety Labels */}
                    <div className="flex justify-between text-xs font-bold text-slate-300 px-12 pt-1">
                      {MOCK_MARKET_VARIETY_STATS.map((item, idx) => (
                        <span
                          key={idx}
                          onMouseEnter={() => setHoveredVarietyIndex(idx)}
                          className={`cursor-pointer transition-colors ${
                            hoveredVarietyIndex === idx ? 'text-amber-400 scale-110' : 'hover:text-cyan-300'
                          }`}
                        >
                          {item.category}交易
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Sub-menu 2: 市场发布 (全新高科技指挥中心多风格展示) */}
            {marketSubTab === 'publish' && (() => {
              const filteredSpotCards = spotCardsList
                .filter((c) => {
                  if (pubSpotTypeFilter !== '全部' && c.typeTag !== pubSpotTypeFilter) return false;
                  if (pubSpotMethodFilter !== '全部' && c.bidMethod !== pubSpotMethodFilter) return false;
                  return true;
                })
                .sort((a, b) => b.totalVolume - a.totalVolume);

              const filteredLongTermCards = longTermCardsList
                .filter((c) => {
                  if (pubLongTermTypeFilter !== '全部' && c.typeTag !== pubLongTermTypeFilter) return false;
                  if (pubLongTermMethodFilter !== '全部' && c.bidMethod !== pubLongTermMethodFilter) return false;
                  return true;
                })
                .sort((a, b) => b.totalVolume - a.totalVolume);

              const toggleSelectCard = (id: string) => {
                setPubSelectedCardIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                );
              };

              const handleBatchPushToPlant = () => {
                setSpotCardsList((prev) => prev.map((c) => ({ ...c, pushed: true })));
                setLongTermCardsList((prev) => prev.map((c) => ({ ...c, pushed: true })));
                setPubToastMsg('已将选中的交易需求成功一键推送至厂站端系统！');
                setTimeout(() => setPubToastMsg(null), 3000);
                setPubSelectedCardIds([]);
              };

              const handleSinglePush = (id: string, isSpot: boolean) => {
                if (isSpot) {
                  setSpotCardsList((prev) => prev.map((c) => (c.id === id ? { ...c, pushed: true } : c)));
                } else {
                  setLongTermCardsList((prev) => prev.map((c) => (c.id === id ? { ...c, pushed: true } : c)));
                }
                setPubToastMsg('该交易发布需求已成功推送至厂站端！');
                setTimeout(() => setPubToastMsg(null), 3000);
              };

              return (
                <div className="space-y-6">

                  {/* Toast Notification */}
                  {pubToastMsg && (
                    <div className="p-3 bg-cyan-950/90 border border-cyan-500 rounded-xl text-cyan-300 text-xs font-bold flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>{pubToastMsg}</span>
                      </div>
                      <button onClick={() => setPubToastMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
                    </div>
                  )}

                  {/* Top Header & Style Switcher Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                        <h2 className="font-extrabold text-base text-white tracking-wide">电力市场发布调度中心</h2>
                      </div>

                      {/* Date Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono">
                        <span>2026-10-16</span>
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      </div>

                      {/* Pipeline Count Badges */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800 text-[11px]">
                          • 发布 20项
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-800 text-[11px]">
                          • 申报 20项
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-lime-950/90 text-lime-300 border border-lime-800 text-[11px]">
                          • 出清 18项
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-[11px]">
                          • 执行 10项
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Style Mode Selector */}
                      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => setPubViewStyle('table')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                            pubViewStyle === 'table' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>高精台账</span>
                        </button>
                        <button
                          onClick={() => setPubViewStyle('kanban')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                            pubViewStyle === 'kanban' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>智能看板</span>
                        </button>
                        <button
                          onClick={() => setPubViewStyle('timeline')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                            pubViewStyle === 'timeline' ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>时序节点</span>
                        </button>
                      </div>

                      {/* Push Button */}
                      <button
                        onClick={handleBatchPushToPlant}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>推送至厂站端</span>
                      </button>
                    </div>
                  </div>

                  {/* STYLE 1: 高精数据台账视图 (Table Ledger Mode) */}
                  {pubViewStyle === 'table' && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Section A: 日前、日内 现货市场发布台账 */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                            <h3 className="font-bold text-sm text-white">日前、日内现货交易发布台账</h3>
                            <span className="text-[10px] text-cyan-400 font-mono ml-2">已按交易总量降序排列</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span>交易类型:</span>
                              <select
                                value={pubSpotTypeFilter}
                                onChange={(e) => setPubSpotTypeFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none"
                              >
                                <option value="全部">全部类型</option>
                                <option value="日前">日前</option>
                                <option value="日内">日内</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span>交易方式:</span>
                              <select
                                value={pubSpotMethodFilter}
                                onChange={(e) => setPubSpotMethodFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none"
                              >
                                <option value="全部">全部方式</option>
                                <option value="按量">按量</option>
                                <option value="按价">按价</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-950/80 text-slate-400 text-xs border-b border-slate-800">
                                <th className="py-3 px-4 font-semibold w-12 text-center">序号</th>
                                <th className="py-3 px-4 font-semibold">需求编号</th>
                                <th className="py-3 px-4 font-semibold">交易类型</th>
                                <th className="py-3 px-4 font-semibold">需求区域</th>
                                <th className="py-3 px-4 font-semibold">交易总量 (mW)</th>
                                <th className="py-3 px-4 font-semibold">容量对比配额</th>
                                <th className="py-3 px-4 font-semibold">交易时间/日期</th>
                                <th className="py-3 px-4 font-semibold">申报方式</th>
                                <th className="py-3 px-4 font-semibold">推送状态</th>
                                <th className="py-3 px-4 font-semibold text-right">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-xs font-mono">
                              {filteredSpotCards.map((item, idx) => {
                                const percent = Math.min(100, Math.round((item.totalVolume / 1500) * 100));
                                return (
                                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                                    <td
                                      onClick={() => setSelectedPublishCardModal(item)}
                                      className="py-3 px-4 font-bold text-cyan-400 hover:text-cyan-200 hover:underline cursor-pointer"
                                      title="点击查看负荷需求明细图表"
                                    >
                                      {item.code}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                        item.typeTag === '日前' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-lime-950 text-lime-300 border border-lime-800'
                                      }`}>
                                        {item.typeTag}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-sans font-bold text-white">{item.region}</td>
                                    <td className="py-3 px-4 font-extrabold text-cyan-300 text-sm">{item.totalVolume.toFixed(2)}</td>
                                    <td className="py-3 px-4 w-36">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                            style={{ width: `${percent}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono">{percent}%</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">{item.timeSpan}</td>
                                    <td className="py-3 px-4 font-sans text-amber-300 font-bold">{item.bidMethod}</td>
                                    <td className="py-3 px-4">
                                      {item.pushed ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                          已推送厂站
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                                          待推送
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                      <button
                                        onClick={() => setSelectedPublishCardModal(item)}
                                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[11px] font-sans font-bold mr-1.5 transition-all cursor-pointer"
                                      >
                                        查看明细
                                      </button>
                                      {!item.pushed ? (
                                        <button
                                          onClick={() => handleSinglePush(item.id, true)}
                                          className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-sans font-bold transition-all cursor-pointer"
                                        >
                                          推送厂站
                                        </button>
                                      ) : (
                                        <span className="text-slate-500 text-[11px] font-sans">完成</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Section B: 中长期 交易合约发布台账 */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
                            <h3 className="font-bold text-sm text-white">中长期交易合约发布台账</h3>
                            <span className="text-[10px] text-amber-400 font-mono ml-2">已按交易总量降序排列</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span>交易类型:</span>
                              <select
                                value={pubLongTermTypeFilter}
                                onChange={(e) => setPubLongTermTypeFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-amber-300 focus:outline-none"
                              >
                                <option value="全部">全部类型</option>
                                <option value="月内">月内</option>
                                <option value="多月">多月</option>
                                <option value="年度">年度</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span>交易方式:</span>
                              <select
                                value={pubLongTermMethodFilter}
                                onChange={(e) => setPubLongTermMethodFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-amber-300 focus:outline-none"
                              >
                                <option value="全部">全部方式</option>
                                <option value="按量">按量</option>
                                <option value="按月按量">按月按量</option>
                                <option value="按价">按价</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-950/80 text-slate-400 text-xs border-b border-slate-800">
                                <th className="py-3 px-4 font-semibold w-12 text-center">序号</th>
                                <th className="py-3 px-4 font-semibold">合约编号</th>
                                <th className="py-3 px-4 font-semibold">交易类型</th>
                                <th className="py-3 px-4 font-semibold">需求区域</th>
                                <th className="py-3 px-4 font-semibold">交易总量 (mW)</th>
                                <th className="py-3 px-4 font-semibold">容量对比配额</th>
                                <th className="py-3 px-4 font-semibold">合约履约时间</th>
                                <th className="py-3 px-4 font-semibold">申报方式</th>
                                <th className="py-3 px-4 font-semibold">推送状态</th>
                                <th className="py-3 px-4 font-semibold text-right">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-xs font-mono">
                              {filteredLongTermCards.map((item, idx) => {
                                const percent = Math.min(100, Math.round((item.totalVolume / 4000) * 100));
                                return (
                                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                                    <td
                                      onClick={() => setSelectedPublishCardModal(item)}
                                      className="py-3 px-4 font-bold text-amber-400 hover:text-amber-200 hover:underline cursor-pointer"
                                      title="点击查看负荷需求明细图表"
                                    >
                                      {item.code}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                        item.typeTag === '月内' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                        item.typeTag === '多月' ? 'bg-lime-950 text-lime-300 border border-lime-800' :
                                        'bg-blue-950 text-blue-300 border border-blue-800'
                                      }`}>
                                        {item.typeTag}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-sans font-bold text-white">{item.region}</td>
                                    <td className="py-3 px-4 font-extrabold text-amber-300 text-sm">{item.totalVolume.toFixed(2)}</td>
                                    <td className="py-3 px-4 w-36">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                          <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                            style={{ width: `${percent}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono">{percent}%</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">{item.timeSpan}</td>
                                    <td className="py-3 px-4 font-sans text-amber-300 font-bold">{item.bidMethod}</td>
                                    <td className="py-3 px-4">
                                      {item.pushed ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                          已推送厂站
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                                          待推送
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                      <button
                                        onClick={() => setSelectedPublishCardModal(item)}
                                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-[11px] font-sans font-bold mr-1.5 transition-all cursor-pointer"
                                      >
                                        查看明细
                                      </button>
                                      {!item.pushed ? (
                                        <button
                                          onClick={() => handleSinglePush(item.id, false)}
                                          className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-[11px] font-sans font-bold transition-all cursor-pointer"
                                        >
                                          推送厂站
                                        </button>
                                      ) : (
                                        <span className="text-slate-500 text-[11px] font-sans">完成</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STYLE 2: 智能看板视图 (Kanban Cards Grid Mode) */}
                  {pubViewStyle === 'kanban' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Section 1 Kanban */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                            <span>日前、日内 现货交易需求卡片</span>
                          </h3>
                          <span className="text-xs text-cyan-400 font-mono">按交易总量降序</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredSpotCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setSelectedPublishCardModal(card)}
                              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 shadow-lg space-y-3 relative group cursor-pointer transition-all hover:scale-[1.02]"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <span className="font-mono font-bold text-cyan-400 text-xs hover:underline">{card.code}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  card.typeTag === '日前' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-lime-950 text-lime-300 border border-lime-800'
                                }`}>
                                  {card.typeTag}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-slate-400">需求区域</div>
                                  <div className="font-bold text-white text-sm mt-0.5">{card.region}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] text-slate-400">交易总量</div>
                                  <div className="font-mono font-extrabold text-cyan-300 text-base">{card.totalVolume.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">mW</span></div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                                <span className="text-slate-400">时间: <strong className="text-slate-200 font-mono">{card.timeSpan}</strong></span>
                                <span className="text-cyan-400 text-[11px] font-bold underline">查看负荷明细 🔍</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 2 Kanban */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
                            <span>中长期 交易合约需求卡片</span>
                          </h3>
                          <span className="text-xs text-amber-400 font-mono">按交易总量降序</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredLongTermCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setSelectedPublishCardModal(card)}
                              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 shadow-lg space-y-3 relative group cursor-pointer transition-all hover:scale-[1.02]"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <span className="font-mono font-bold text-amber-400 text-xs hover:underline">{card.code}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  card.typeTag === '月内' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                  card.typeTag === '多月' ? 'bg-lime-950 text-lime-300 border border-lime-800' :
                                  'bg-blue-950 text-blue-300 border border-blue-800'
                                }`}>
                                  {card.typeTag}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-slate-400">需求区域</div>
                                  <div className="font-bold text-white text-sm mt-0.5">{card.region}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] text-slate-400">交易总量</div>
                                  <div className="font-mono font-extrabold text-amber-300 text-base">{card.totalVolume.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">mW</span></div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                                <span className="text-slate-400">履约期: <strong className="text-slate-200 font-mono">{card.timeSpan}</strong></span>
                                <span className="text-amber-400 text-[11px] font-bold underline">查看负荷明细 🔍</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STYLE 3: 时序节点调度视图 (Timeline Flow Mode) */}
                  {pubViewStyle === 'timeline' && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          <h3 className="font-bold text-sm text-white">2026年10月 交易发布履约时间节点轨道</h3>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">按时间时段与交割序列排序</span>
                      </div>

                      <div className="relative pl-6 space-y-6 border-l-2 border-cyan-500/40">
                        {filteredSpotCards.concat(filteredLongTermCards).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedPublishCardModal(item)}
                            className="relative group flex items-start gap-4 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            {/* Glowing Timeline Dot */}
                            <div className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-cyan-300 text-xs hover:underline">{item.code}</span>
                                <span className="font-bold text-white text-sm">{item.region}</span>
                                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 text-[10px] font-bold">
                                  {item.typeTag}
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-xs text-slate-400 pt-1 font-mono">
                                <span>交易时间窗口: <strong className="text-white">{item.timeSpan}</strong></span>
                                <span>申报方式: <strong className="text-amber-400">{item.bidMethod}</strong></span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-mono font-extrabold text-cyan-300 text-base">{item.totalVolume.toFixed(2)} mW</div>
                              <span className="text-[10px] text-cyan-400 font-bold underline">查看负荷明细 🔍</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* Sub-menu 3: 结算管理 (Matching EXACT Prototype Screenshot Layout & Data) */}
            {marketSubTab === 'settlement' && (() => {
              // Filter & Sort MOCK_SETTLEMENT_DETAILS strictly descending by settlementFee
              const filteredSettlementList = MOCK_SETTLEMENT_DETAILS
                .filter((item) => {
                  if (settlementCategoryFilter !== '全部' && item.category !== settlementCategoryFilter) return false;
                  if (settlementPlantTypeFilter !== '全部' && item.plantType !== settlementPlantTypeFilter) return false;
                  if (settlementRegionFilter !== '全部' && !item.region.includes(settlementRegionFilter)) return false;
                  return true;
                })
                .sort((a, b) => b.settlementFee - a.settlementFee);

              return (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* 1. Top Section: 结算概况 Card Header with 7 KPI Summary Cards */}
                  <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                    {/* Header Title with Date Badge */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                        <h3 className="font-extrabold text-base text-white tracking-wide">结算概况</h3>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300">
                        <span>{settlementMonth}</span>
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    </div>

                    {/* 7 Horizontal Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {/* Card 1: 执行负荷 (mW) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>执行负荷 (mW)</span>
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-white">112132.56</div>
                        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span>较上月23.23%</span>
                          <TrendingUp className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Card 2: 结算电量 (mW/h) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>结算电量 (mW/h)</span>
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-cyan-300">13234.13</div>
                        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span>较上月1.23%</span>
                          <TrendingUp className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Card 3: 结算电费 (元) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>结算电费 (元)</span>
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-emerald-300">9446.54</div>
                        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span>较上月11.23%</span>
                          <TrendingUp className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Card 4: 结算均价 (元/mW/h) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>结算均价 (元/mW/h)</span>
                          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                            <BarChart3 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-blue-300">13234.13</div>
                        <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                          <span>较上月3.52%</span>
                          <span className="text-[9px]">↘</span>
                        </div>
                      </div>

                      {/* Card 5: 中长期电费 (万元) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>中长期电费 (万元)</span>
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-white">9446.54</div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">
                          结算电量45923.12mW/h
                        </div>
                      </div>

                      {/* Card 6: 日前电费 (万元) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>日前电费 (万元)</span>
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-amber-300">9446.54</div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">
                          结算电量45923.12mW/h
                        </div>
                      </div>

                      {/* Card 7: 日内电费 (万元) */}
                      <div className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3 space-y-2 relative group transition-all">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>日内电费 (万元)</span>
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="font-mono font-extrabold text-lg text-amber-300">9446.54</div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">
                          结算电量45923.12mW/h
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Section: 结算明细 Table Block */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-0">
                    
                    {/* Table Header Bar with Filters */}
                    <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-cyan-400 rounded-full"></span>
                        <h3 className="font-bold text-sm text-white">结算明细</h3>
                        <span className="text-[10px] text-cyan-400 font-mono ml-2">已按结算电费降序排列 ⬇️</span>
                      </div>

                      {/* Filter Dropdowns matching screenshot */}
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        {/* 结算月份 */}
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                          <span>结算月份:</span>
                          <input
                            type="month"
                            value={settlementMonth}
                            onChange={(e) => setSettlementMonth(e.target.value)}
                            className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none cursor-pointer"
                          />
                        </div>

                        {/* 结算品种 */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span>结算品种:</span>
                          <select
                            value={settlementCategoryFilter}
                            onChange={(e) => setSettlementCategoryFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none cursor-pointer"
                          >
                            <option value="全部">全部</option>
                            <option value="中长期">中长期</option>
                            <option value="日前">日前</option>
                            <option value="日内">日内</option>
                          </select>
                        </div>

                        {/* 电厂类型 */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span>电厂类型:</span>
                          <select
                            value={settlementPlantTypeFilter}
                            onChange={(e) => setSettlementPlantTypeFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none cursor-pointer"
                          >
                            <option value="全部">全部</option>
                            <option value="用电型">用电型</option>
                            <option value="发电型">发电型</option>
                          </select>
                        </div>

                        {/* 交易区域 */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span>交易区域:</span>
                          <select
                            value={settlementRegionFilter}
                            onChange={(e) => setSettlementRegionFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-cyan-300 focus:outline-none cursor-pointer"
                          >
                            <option value="全部">全部</option>
                            <option value="福州">福州区域</option>
                            <option value="厦门">厦门区域</option>
                            <option value="泉州">泉州区域</option>
                            <option value="漳州">漳州区域</option>
                            <option value="莆田">莆田区域</option>
                            <option value="龙岩">龙岩区域</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* High-Precision Settlement Ledger Table matching exact columns */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/90 text-slate-400 text-xs border-b border-slate-800">
                            <th className="py-3.5 px-4 font-semibold text-center w-12">序号</th>
                            <th className="py-3.5 px-4 font-semibold">电厂编号</th>
                            <th className="py-3.5 px-4 font-semibold">电厂名称</th>
                            <th className="py-3.5 px-4 font-semibold">电厂类型</th>
                            <th className="py-3.5 px-4 font-semibold">交易品种</th>
                            <th className="py-3.5 px-4 font-semibold">交易合同编号</th>
                            <th className="py-3.5 px-4 font-semibold">交易区域</th>
                            <th className="py-3.5 px-4 font-semibold">结算电量 (mW/h)</th>
                            <th className="py-3.5 px-4 font-semibold">结算电费 (元)</th>
                            <th className="py-3.5 px-4 font-semibold">结算均价 (元/mW/h)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs font-mono">
                          {filteredSettlementList.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                              <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-3.5 px-4 font-bold text-cyan-400">{item.plantCode}</td>
                              <td className="py-3.5 px-4 font-sans font-bold text-white">{item.plantName}</td>
                              <td className="py-3.5 px-4 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.plantType === '用电型' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}>
                                  {item.plantType}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-sans">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.category === '中长期' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                  item.category === '日前' ? 'bg-lime-950 text-lime-300 border border-lime-800' :
                                  'bg-blue-950 text-blue-300 border border-blue-800'
                                }`}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300">{item.contractCode}</td>
                              <td className="py-3.5 px-4 font-sans text-slate-200">{item.region}</td>
                              <td className="py-3.5 px-4 font-extrabold text-cyan-300">{item.settlementVolume.toFixed(2)}</td>
                              <td className="py-3.5 px-4 font-extrabold text-emerald-300 text-sm">{item.settlementFee.toFixed(2)}</td>
                              <td className="py-3.5 px-4 text-amber-300 font-bold">{item.avgPrice.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 4: HAZARD LEDGER (数据台账) */}
        {topTab === 'ledger' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索隐患标题、变电站或编号..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">全部级别</option>
                  <option value="重大隐患">🔴 重大隐患</option>
                  <option value="较大隐患">🟠 较大隐患</option>
                  <option value="一般隐患">🟡 一般隐患</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>AI 智能消缺对策</span>
                </button>

                <button
                  onClick={() => { setEditingHazard(null); setIsHazardModalOpen(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>登记新隐患</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 text-xs border-b border-slate-700">
                      <th className="py-3.5 px-4 font-semibold">隐患编号</th>
                      <th className="py-3.5 px-4 font-semibold">隐患标题与缺陷描述</th>
                      <th className="py-3.5 px-4 font-semibold">所属变电站</th>
                      <th className="py-3.5 px-4 font-semibold">隐患级别</th>
                      <th className="py-3.5 px-4 font-semibold">整改状态</th>
                      <th className="py-3.5 px-4 font-semibold">整改期限</th>
                      <th className="py-3.5 px-4 font-semibold">责任人</th>
                      <th className="py-3.5 px-4 font-semibold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {hazards.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">{h.code}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{h.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{h.description}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 text-xs">{h.station}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            h.level === '重大隐患' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                            h.level === '较大隐患' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                            'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                          }`}>
                            {h.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            h.status === '已闭环' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                            h.status === '整改中' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                            h.status === '复查验收' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-300">{h.deadline}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-300">{h.responsiblePerson} ({h.department})</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditingHazard(h); setIsHazardModalOpen(true); }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteHazard(h.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-xs transition-colors"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
      )}

      {/* Resource Response Detail Modal */}
      {selectedResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {selectedResourceModal.name} - 资源响应明细
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">编号: {selectedResourceModal.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResourceModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailTimeMode('day')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    detailTimeMode === 'day' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  按日
                </button>
                <button
                  onClick={() => setDetailTimeMode('month')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    detailTimeMode === 'month' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  按月
                </button>
                
                <input
                  type="date"
                  value={detailDate}
                  onChange={(e) => setDetailDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs px-3 py-1.5 rounded-lg text-cyan-300 focus:outline-none cursor-pointer"
                />
              </div>

              <div className="text-xs text-slate-300">
                当日实测总出力: <strong className="text-cyan-400 font-mono text-sm">1,298.98 kW</strong>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>(单位: kW)</span>
                <span className="text-cyan-400 font-semibold">实时出力柱状分布图</span>
              </div>

              <div className="h-64 w-full flex items-end justify-between gap-1.5 pt-8 px-3 border-b border-slate-800 relative bg-slate-900/40">
                {getDetailChartData().map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                    <div className="absolute -top-10 bg-slate-900 border border-cyan-500 text-cyan-300 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl z-30 pointer-events-none">
                      {bar.time} - {(bar.val * 2.1).toFixed(2)} kW
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-300 rounded-t hover:from-cyan-500 hover:to-cyan-200 transition-all shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
                      style={{ height: `${Math.min(bar.val * 0.7, 95)}%`, minHeight: '16px' }}
                    ></div>
                    <span className="text-[9px] text-slate-400 scale-75 origin-top truncate">{bar.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedResourceModal(null)}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer transition-all"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Consumption Load Detail Modal */}
      {selectedConsumptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Factory className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {selectedConsumptionModal.name} - 24小时负荷与隐患分析
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">企业编号: {selectedConsumptionModal.code} | 行业: {selectedConsumptionModal.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConsumptionModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">合同签约容量:</span>
                <div className="font-mono text-cyan-300 font-bold text-sm mt-0.5">{selectedConsumptionModal.contractCapacity.toLocaleString()} kW</div>
              </div>
              <div>
                <span className="text-slate-400">实时负荷峰值:</span>
                <div className="font-mono text-amber-300 font-bold text-sm mt-0.5">{selectedConsumptionModal.realtimeLoad.toLocaleString()} kW</div>
              </div>
              <div>
                <span className="text-slate-400">可中断调峰能力:</span>
                <div className="font-mono text-emerald-300 font-bold text-sm mt-0.5">{selectedConsumptionModal.adjustableCapacity.toLocaleString()} kW</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300">24小时实时负荷分布图 (kW)</div>
              <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-800">
                {[110, 120, 140, 180, 240, 220, 250, 230, 210, 190, 160, 130].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t"
                      style={{ height: `${(val / 260) * 100}%` }}
                    ></div>
                    <span className="text-[9px] text-slate-500 mt-1">{idx * 2}:00</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span>隐患责任人: {selectedConsumptionModal.contactPerson} ({selectedConsumptionModal.phone})</span>
              <span>最近排查日期: <strong className="text-cyan-400 font-mono">{selectedConsumptionModal.lastInspectDate}</strong></span>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setSelectedConsumptionModal(null)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Market Publication Modal */}
      {selectedMarketPubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedMarketPubModal.title}</h3>
                  <p className="text-xs text-amber-400 font-mono">编号: {selectedMarketPubModal.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMarketPubModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>发布类型: <strong className="text-amber-300">{selectedMarketPubModal.type}</strong></span>
                <span>发布部门: <strong className="text-cyan-300">{selectedMarketPubModal.department}</strong></span>
              </div>
              <div className="flex justify-between font-mono text-slate-400">
                <span>发布日期: {selectedMarketPubModal.publishDate}</span>
                <span>生效日期: {selectedMarketPubModal.effectiveDate}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-200 space-y-2">
              <div className="font-bold text-white">公告与细则内容摘要:</div>
              <p>{selectedMarketPubModal.summary}</p>
              <p className="text-slate-400 pt-2 border-t border-slate-800/80">
                本规则由省电力交易中心与安全监察部门联合制定，所有市场交易参与主体需严格遵守上述关于安全隐患消缺与履约考核的要求。
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedMarketPubModal(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Publish Card Detail Modal (Matching Prototype Screenshot Frame & Custom New Chart Style) */}
      {selectedPublishCardModal && (() => {
        const rawPoints = [
          { time: '2026-10-16 00:00', val: 80.00, bidVal: 78.50, devRatio: '+1.9%' },
          { time: '2026-10-16 00:15', val: 95.00, bidVal: 94.20, devRatio: '+0.8%' },
          { time: '2026-10-16 00:30', val: 110.00, bidVal: 108.60, devRatio: '+1.3%' },
          { time: '2026-10-16 00:45', val: 125.40, bidVal: 124.00, devRatio: '+1.1%' },
          { time: '2026-10-16 01:00', val: 115.00, bidVal: 113.80, devRatio: '+1.0%' },
          { time: '2026-10-16 01:15', val: 92.00, bidVal: 91.10, devRatio: '+0.9%' },
          { time: '2026-10-16 01:30', val: 78.00, bidVal: 77.20, devRatio: '+1.0%' },
          { time: '2026-10-16 01:45', val: 88.00, bidVal: 87.00, devRatio: '+1.1%' },
          { time: '2026-10-16 02:00', val: 112.00, bidVal: 110.50, devRatio: '+1.3%' },
          { time: '2026-10-16 02:15', val: 135.12, bidVal: 133.80, devRatio: '+0.9%' }, // Peak
          { time: '2026-10-16 02:30', val: 118.00, bidVal: 116.50, devRatio: '+1.2%' },
          { time: '2026-10-16 02:45', val: 82.00, bidVal: 81.00, devRatio: '+1.2%' },
          { time: '2026-10-16 03:00', val: 58.20, bidVal: 57.50, devRatio: '+1.2%' },
          { time: '2026-10-16 03:15', val: 75.00, bidVal: 74.10, devRatio: '+1.2%' },
          { time: '2026-10-16 03:30', val: 105.00, bidVal: 103.80, devRatio: '+1.1%' },
          { time: '2026-10-16 03:45', val: 122.00, bidVal: 120.50, devRatio: '+1.2%' },
          { time: '2026-10-16 04:00', val: 118.50, bidVal: 117.00, devRatio: '+1.3%' },
          { time: '2026-10-16 04:15', val: 95.00, bidVal: 93.80, devRatio: '+1.2%' },
          { time: '2026-10-16 04:30', val: 82.00, bidVal: 81.20, devRatio: '+1.0%' },
          { time: '2026-10-16 04:45', val: 78.00, bidVal: 77.00, devRatio: '+1.3%' },
          { time: '2026-10-16 05:00', val: 92.00, bidVal: 90.80, devRatio: '+1.3%' },
          { time: '2026-10-16 05:15', val: 108.00, bidVal: 106.50, devRatio: '+1.4%' },
          { time: '2026-10-16 05:30', val: 106.00, bidVal: 104.80, devRatio: '+1.1%' },
          { time: '2026-10-16 05:45', val: 101.00, bidVal: 99.80, devRatio: '+1.2%' },
          { time: '2026-10-16 06:30', val: 96.00, bidVal: 95.10, devRatio: '+0.9%' }
        ];

        // Strict Descending Order by 需求负荷 (mW)
        const sortedPoints = [...rawPoints].sort((a, b) => b.val - a.val);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            {/* Cyberpunk Beveled Frame with Glow Outline matching screenshot */}
            <div className="relative w-full max-w-5xl bg-slate-950 border-2 border-cyan-400 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.4)] space-y-5 text-white overflow-hidden">
              
              {/* Close Button [X] */}
              <button
                onClick={() => setSelectedPublishCardModal(null)}
                className="absolute right-5 top-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer z-20"
              >
                ✕
              </button>

              {/* Title Centered */}
              <div className="space-y-2 text-center pt-2">
                <h2 className="text-xl font-extrabold text-white tracking-widest uppercase flex items-center justify-center gap-2">
                  <span className="w-2.5 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                  <span>{selectedPublishCardModal.region}{selectedPublishCardModal.typeTag}负荷需求明细</span>
                </h2>

                {/* Subheader Metadata Row */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono border-b border-slate-800 pb-3">
                  <div>交易编号: <strong className="text-cyan-400 font-bold">{selectedPublishCardModal.code}</strong></div>
                  <div>发布总量: <strong className="text-cyan-400 font-bold">{selectedPublishCardModal.totalVolume.toFixed(2)} mW</strong></div>
                  <div>市场品种: <strong className="text-cyan-400 font-bold">{selectedPublishCardModal.typeTag}</strong></div>
                  <div>申报方式: <strong className="text-amber-300 font-bold">{selectedPublishCardModal.bidMethod}</strong></div>
                  <div>交易日期: <strong className="text-cyan-400 font-bold">2026-10-16</strong></div>
                </div>
              </div>

              {/* Chart Section (New Chart Style: 分时阶梯负荷配额矩阵与多色频率分布柱图) */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-4">
                    <span>(单位: mW)</span>
                    <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span>高峰负荷 (&ge;115mW)</span>
                    <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>平段负荷</span>
                    <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span>低谷负荷 (&le;75mW)</span>
                  </div>
                  <span className="text-amber-400 font-bold flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    实时负荷峰值: 135.12 mW (2026-10-16 02:15)
                  </span>
                </div>

                {/* New Style Chart Container: Segmented Step-Histogram with Floating Peak Badges */}
                <div className="relative w-full h-60 pt-4 px-2 border-b border-slate-800 flex items-end justify-between gap-1.5 bg-slate-950/60 rounded-xl">
                  {rawPoints.map((pt, i) => {
                    const isPeak = pt.val >= 115;
                    const isValley = pt.val <= 75;
                    const isMax = pt.val === 135.12;
                    const barHeightPercent = Math.min(100, Math.max(12, (pt.val / 140) * 100));

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10">
                        {/* Hover Tooltip Card */}
                        <div className="absolute -top-12 bg-slate-900 border border-cyan-400 text-cyan-300 text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl z-30 font-mono">
                          <div>{pt.time}</div>
                          <div>需求: <strong className="text-white">{pt.val.toFixed(2)} mW</strong></div>
                          <div>出清: <strong className="text-amber-300">{pt.bidVal.toFixed(2)} mW</strong></div>
                        </div>

                        {/* Peak Badge for Max Value */}
                        {isMax && (
                          <div className="absolute -top-7 bg-amber-500 text-slate-950 font-mono font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-lg border border-white animate-bounce whitespace-nowrap z-20">
                            峰值 135.12
                          </div>
                        )}

                        {/* Histogram Bar Column */}
                        <div
                          className={`w-full rounded-t transition-all duration-300 relative group-hover:brightness-125 ${
                            isPeak
                              ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                              : isValley
                              ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                              : 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-blue-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                          }`}
                          style={{ height: `${barHeightPercent}%` }}
                        >
                          {/* Inner Overlay Line */}
                          <div className="w-full h-1 bg-white/60 rounded-t"></div>
                        </div>

                        <span className="text-[8px] text-slate-400 font-mono mt-1 scale-90 truncate w-full text-center">
                          {pt.time.slice(11)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>



              {/* Bottom Footer Actions */}
              <div className="flex items-center justify-end pt-1 border-t border-slate-800">
                <button
                  onClick={() => setSelectedPublishCardModal(null)}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
                >
                  关闭明细窗口
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* New Notice Modal */}
      {isNewNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">发布新电力市场通告</h3>
              <button
                onClick={() => setIsNewNoticeModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">通告标题</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="请输入市场规则或出清通告标题..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">发布类型</label>
                <select
                  value={newNoticeType}
                  onChange={(e: any) => setNewNoticeType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="市场公告">市场公告</option>
                  <option value="交易规则">交易规则</option>
                  <option value="出清结果">出清结果</option>
                  <option value="预测信息">预测信息</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">通告摘要与考核要求</label>
                <textarea
                  rows={3}
                  value={newNoticeSummary}
                  onChange={(e) => setNewNoticeSummary(e.target.value)}
                  placeholder="请输入详细的履约与安全消缺细则摘要..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer"
                >
                  确认发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settlement Bill Detail Modal */}
      {selectedSettlementBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {selectedSettlementBillModal.participantName} - 电力结算账单
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">账单编号: {selectedSettlementBillModal.billNo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSettlementBillModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">实际交割电量:</span>
                <div className="font-mono text-cyan-300 font-bold text-sm mt-0.5">{selectedSettlementBillModal.deliveryEnergy.toLocaleString()} MWh</div>
              </div>
              <div>
                <span className="text-slate-400">合同均价:</span>
                <div className="font-mono text-amber-300 font-bold text-sm mt-0.5">{selectedSettlementBillModal.contractPrice.toFixed(2)} 元/MWh</div>
              </div>
              <div>
                <span className="text-slate-400">隐患违规扣款:</span>
                <div className="font-mono text-rose-400 font-bold text-sm mt-0.5">-{selectedSettlementBillModal.hazardDeduction.toLocaleString()} 元</div>
              </div>
              <div>
                <span className="text-slate-400">最终结算费:</span>
                <div className="font-mono text-emerald-300 font-bold text-sm mt-0.5">{selectedSettlementBillModal.totalSettlementFee.toLocaleString()} 万元</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between"><span>结算月份: {selectedSettlementBillModal.month}</span><span>主体类型: {selectedSettlementBillModal.participantType}</span></div>
              <div className="flex justify-between font-mono"><span>出账日期: {selectedSettlementBillModal.settlementDate}</span><span>复核状态: {selectedSettlementBillModal.status}</span></div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setSelectedSettlementBillModal(null)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer transition-all"
              >
                关闭账单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Hazard and AI */}
      {isHazardModalOpen && (
        <HazardModal
          hazard={editingHazard}
          onClose={() => { setIsHazardModalOpen(false); setEditingHazard(null); }}
          onSave={handleSaveHazard}
        />
      )}

      {isAiModalOpen && (
        <AiAssistantModal
          hazards={hazards}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}
    </div>
  );
};
