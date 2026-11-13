import { HazardItem, SubstationNode, User } from './types';

export const MOCK_USERS: Record<string, User> = {
  admin: {
    username: 'admin',
    name: '张总工',
    role: 'admin',
    roleLabel: '超级管理员',
    department: '生产技术部'
  },
  supervisor: {
    username: 'supervisor',
    name: '李监察',
    role: 'supervisor',
    roleLabel: '安全监察员',
    department: '安全监察部'
  },
  inspector: {
    username: 'inspector',
    name: '王工',
    role: 'inspector',
    roleLabel: '一线巡检员',
    department: '输电运检中心'
  }
};

export const INITIAL_HAZARDS: HazardItem[] = [
  {
    id: 'h-001',
    code: 'HD-2026-0891',
    title: '#3主变压器冷却器控制箱端子排严重发热温升超标',
    station: '500kV 滨海变电站',
    voltageLevel: '500kV',
    level: '重大隐患',
    status: '整改中',
    discoveredDate: '2026-10-12',
    deadline: '2026-10-20',
    responsiblePerson: '陈工',
    department: '变电运维一班',
    description: '红外测温发现#3主变冷却器电源端子接触电阻过大，温度达到84.5℃，存在跳闸及烧毁风险。',
    aiSuggestion: '建议立即安排负荷转移并对端子排进行停电消缺，更换弹簧压接端子并涂抹导电膏。',
    coordinates: { x: 32, y: 45 }
  },
  {
    id: 'h-002',
    code: 'HD-2026-0884',
    title: '500kV 榕城线 #104塔 跨越高速公路段绝缘子串污闪隐患',
    station: '500kV 榕城线',
    voltageLevel: '500kV',
    level: '较大隐患',
    status: '待整改',
    discoveredDate: '2026-10-14',
    deadline: '2026-10-28',
    responsiblePerson: '刘明',
    department: '输电运检三班',
    description: '沿海重污秽区域，该基杆塔绝缘子表面灰尘积聚较厚，近期大雾天气下极易引发污闪。',
    aiSuggestion: '建议使用带电水冲洗装置进行全面清洗，并加装防污闪辅助伞裙。',
    coordinates: { x: 58, y: 28 }
  },
  {
    id: 'h-003',
    code: 'HD-2026-0872',
    title: '220kV 科技园变电站 10kV母线室门窗密封不严防小动物网破损',
    station: '220kV 科技园变电站',
    voltageLevel: '220kV',
    level: '一般隐患',
    status: '复查验收',
    discoveredDate: '2026-10-10',
    deadline: '2026-10-16',
    responsiblePerson: '赵刚',
    department: '变电综合班',
    description: '电缆沟进线处挡鼠板破损，电缆夹层发现鼠迹，存在短路跳闸隐患。',
    aiSuggestion: '更换不锈钢防鼠网，封堵电缆进出孔洞，增设超声波驱鼠器。',
    coordinates: { x: 74, y: 62 }
  },
  {
    id: 'h-004',
    code: 'HD-2026-0850',
    title: '110kV 星火线 #45塔 保护区内违规堆放大棚彩钢瓦',
    station: '110kV 星火线',
    voltageLevel: '110kV',
    level: '重大隐患',
    status: '已闭环',
    discoveredDate: '2026-09-28',
    deadline: '2026-10-05',
    responsiblePerson: '周强',
    department: '线路监察组',
    description: '农户在输电线路下私自搭建轻钢彩钢大棚，大风天气易被吹起刮挂导线。',
    aiSuggestion: '联合地方城管部门下达隐患整改通知书，现场拆除违规彩钢瓦并开展电力安全法宣传。',
    coordinates: { x: 21, y: 78 }
  },
  {
    id: 'h-005',
    code: 'HD-2026-0831',
    title: '220kV 开发区变 2号主变中性点接地电阻柜腐蚀开裂',
    station: '220kV 开发区变',
    voltageLevel: '220kV',
    level: '较大隐患',
    status: '整改中',
    discoveredDate: '2026-10-08',
    deadline: '2026-10-25',
    responsiblePerson: '孙工',
    department: '变电试验班',
    description: '接地电阻柜箱体底部受潮锈蚀严重，雨水渗入可能导致主变单相接地保护失效。',
    aiSuggestion: '对箱体进行除锈防腐处理，更换硅橡胶密封条并加装底部防潮底座。',
    coordinates: { x: 82, y: 41 }
  }
];

export const MOCK_SUBSTATIONS: SubstationNode[] = [
  { id: 'sub-1', name: '500kV 滨海变电站', voltage: '500kV', loadRate: 78.4, temperature: 42.1, status: '预警', hazardsCount: 2 },
  { id: 'sub-2', name: '500kV 榕城变电站', voltage: '500kV', loadRate: 64.2, temperature: 36.0, status: '正常', hazardsCount: 0 },
  { id: 'sub-3', name: '220kV 科技园变电', voltage: '220kV', loadRate: 85.9, temperature: 39.5, status: '正常', hazardsCount: 1 },
  { id: 'sub-4', name: '220kV 开发区变电', voltage: '220kV', loadRate: 91.3, temperature: 48.2, status: '危险', hazardsCount: 2 },
  { id: 'sub-5', name: '110kV 城西变电站', voltage: '110kV', loadRate: 55.0, temperature: 34.2, status: '正常', hazardsCount: 0 },
  { id: 'sub-6', name: '110kV 港口变电站', voltage: '110kV', loadRate: 70.1, temperature: 38.8, status: '正常', hazardsCount: 1 }
];

export interface ConsumptionLoadItem {
  id: number;
  code: string;
  name: string;
  adjustableLoad: number; // 可调负荷 (kW)
  responseLoad: number; // 响应负荷 (kW)
  remainingLoad: number; // 剩余可调负荷 (kW)
  settlementEnergy: number; // 本月结算电量 (kWh / MWh)
  settlementFee: number; // 本月结算电费 (元)
}

export const MOCK_CONSUMPTION_LOAD_ITEMS: ConsumptionLoadItem[] = [
  {
    id: 1,
    code: '0942293992',
    name: '西宁特钢电炉可中断负荷资源#1',
    adjustableLoad: 987.90,
    responseLoad: 321.98,
    remainingLoad: 665.92,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 2,
    code: '12198238291',
    name: '盐湖化工第2电解车间柔性调峰终端',
    adjustableLoad: 719.12,
    responseLoad: 421.09,
    remainingLoad: 298.03,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 3,
    code: '23823818911',
    name: '德令哈高新多晶硅铸锭负荷控制中心',
    adjustableLoad: 432.09,
    responseLoad: 123.98,
    remainingLoad: 308.11,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 4,
    code: '0939293239',
    name: '西宁超算中心算力负荷调配站',
    adjustableLoad: 352.09,
    responseLoad: 178.09,
    remainingLoad: 174.00,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 5,
    code: '9732992382',
    name: '柴达木重型装备制造电力调峰终端',
    adjustableLoad: 332.10,
    responseLoad: 123.09,
    remainingLoad: 209.01,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 6,
    code: '5458983832',
    name: '海东零碳产业园铝合金压铸负荷点',
    adjustableLoad: 284.09,
    responseLoad: 98.12,
    remainingLoad: 185.97,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 7,
    code: '1129823828',
    name: '青藏冷链物流智联网低谷充电站',
    adjustableLoad: 243.09,
    responseLoad: 123.09,
    remainingLoad: 120.00,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 8,
    code: '6504595935',
    name: '同德县清洁能效聚合用户#2',
    adjustableLoad: 212.09,
    responseLoad: 56.09,
    remainingLoad: 156.00,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 9,
    code: '2039293922',
    name: '共和县智慧农业灌溉可控负荷组',
    adjustableLoad: 158.09,
    responseLoad: 10.09,
    remainingLoad: 148.00,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 10,
    code: '3238298382',
    name: '湟源县商业楼宇中央空调VPP资源',
    adjustableLoad: 142.50,
    responseLoad: 48.20,
    remainingLoad: 94.30,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  },
  {
    id: 11,
    code: '0939293567',
    name: '贵南县高能耗数据机房备份电源',
    adjustableLoad: 120.00,
    responseLoad: 38.10,
    remainingLoad: 81.90,
    settlementEnergy: 2332.98,
    settlementFee: 12131.12
  }
];

export interface MarketVarietyStatItem {
  category: string; // 日前, 日内, 月内, 多月, 年度
  bidSubjects: number; // 申报主体数
  clearSubjects: number; // 出清主体数
  executeSubjects: number; // 执行主体数
  publishLoad: number; // 发布负荷 (mW)
  bidLoad: number; // 申报负荷 (mW)
  clearLoad: number; // 出清负荷 (mW)
  executeLoad: number; // 执行负荷 (mW)
  settlementFee: number; // 结算电费 (万元)
}

export const MOCK_MARKET_VARIETY_STATS: MarketVarietyStatItem[] = [
  {
    category: '日内',
    bidSubjects: 32,
    clearSubjects: 30,
    executeSubjects: 30,
    publishLoad: 1345.23,
    bidLoad: 1300.23,
    clearLoad: 1190.23,
    executeLoad: 1130.23,
    settlementFee: 512.80
  },
  {
    category: '日前',
    bidSubjects: 28,
    clearSubjects: 26,
    executeSubjects: 25,
    publishLoad: 1120.50,
    bidLoad: 1080.00,
    clearLoad: 1020.10,
    executeLoad: 950.40,
    settlementFee: 432.09
  },
  {
    category: '年度',
    bidSubjects: 24,
    clearSubjects: 22,
    executeSubjects: 20,
    publishLoad: 920.00,
    bidLoad: 890.50,
    clearLoad: 840.20,
    executeLoad: 780.00,
    settlementFee: 360.50
  },
  {
    category: '月内',
    bidSubjects: 20,
    clearSubjects: 18,
    executeSubjects: 18,
    publishLoad: 750.40,
    bidLoad: 710.20,
    clearLoad: 680.00,
    executeLoad: 620.30,
    settlementFee: 290.10
  },
  {
    category: '多月',
    bidSubjects: 16,
    clearSubjects: 15,
    executeSubjects: 14,
    publishLoad: 680.00,
    bidLoad: 620.00,
    clearLoad: 580.00,
    executeLoad: 540.00,
    settlementFee: 245.80
  }
];

export interface MarketPublishCard {
  id: string;
  code: string;
  typeTag: '日前' | '日内' | '月内' | '多月' | '年度';
  pushed: boolean;
  region: string;
  totalVolume: number; // mW
  timeSpan: string;
  bidMethod: '按量' | '按价' | '按月按量';
}

export const MOCK_SPOT_MARKET_CARDS: MarketPublishCard[] = [
  { id: 'sc-01', code: 'XHSC070001', typeTag: '日前', pushed: true, region: '西宁电网', totalVolume: 1250.00, timeSpan: '10-16', bidMethod: '按量' },
  { id: 'sc-02', code: 'XHSC070002', typeTag: '日内', pushed: true, region: '海西特区', totalVolume: 980.50, timeSpan: '08:00~12:00', bidMethod: '按价' },
  { id: 'sc-03', code: 'XHSC070003', typeTag: '日前', pushed: true, region: '海南园区', totalVolume: 850.00, timeSpan: '10-16', bidMethod: '按量' },
  { id: 'sc-04', code: 'XHSC070004', typeTag: '日内', pushed: false, region: '海东负荷', totalVolume: 720.00, timeSpan: '14:00~18:00', bidMethod: '按价' },
  { id: 'sc-05', code: 'XHSC070005', typeTag: '日前', pushed: true, region: '果洛能效', totalVolume: 540.80, timeSpan: '10-16', bidMethod: '按量' },
  { id: 'sc-06', code: 'XHSC070006', typeTag: '日内', pushed: false, region: '玉树枢纽', totalVolume: 420.00, timeSpan: '18:00~22:00', bidMethod: '按价' },
  { id: 'sc-07', code: 'XHSC070007', typeTag: '日前', pushed: true, region: '福州变电', totalVolume: 342.98, timeSpan: '10-16', bidMethod: '按量' },
  { id: 'sc-08', code: 'XHSC070008', typeTag: '日内', pushed: false, region: '榕城微网', totalVolume: 210.50, timeSpan: '00:00~04:00', bidMethod: '按价' },
];

export const MOCK_LONG_TERM_CARDS: MarketPublishCard[] = [
  { id: 'lc-01', code: 'ZCQ070001', typeTag: '年度', pushed: true, region: '全省电网', totalVolume: 3500.00, timeSpan: '2026全周期', bidMethod: '按月按量' },
  { id: 'lc-02', code: 'ZCQ070002', typeTag: '多月', pushed: true, region: '海西重工', totalVolume: 2450.00, timeSpan: '10.01~12.31', bidMethod: '按月按量' },
  { id: 'lc-03', code: 'ZCQ070003', typeTag: '月内', pushed: true, region: '西宁特钢', totalVolume: 1890.00, timeSpan: '10.01~10.31', bidMethod: '按量' },
  { id: 'lc-04', code: 'ZCQ070004', typeTag: '多月', pushed: true, region: '海东工业', totalVolume: 1320.00, timeSpan: '10.01~11.30', bidMethod: '按月按量' },
  { id: 'lc-05', code: 'ZCQ070005', typeTag: '月内', pushed: false, region: '海南新能源', totalVolume: 980.00, timeSpan: '10.01~10.31', bidMethod: '按量' },
  { id: 'lc-06', code: 'ZCQ070006', typeTag: '年度', pushed: true, region: '果洛风光', totalVolume: 650.00, timeSpan: '2026全周期', bidMethod: '按月按量' },
  { id: 'lc-07', code: 'ZCQ070007', typeTag: '月内', pushed: true, region: '玉树水电', totalVolume: 480.00, timeSpan: '10.01~10.31', bidMethod: '按量' },
  { id: 'lc-08', code: 'ZCQ070008', typeTag: '多月', pushed: false, region: '德令哈高新', totalVolume: 342.98, timeSpan: '10.01~11.30', bidMethod: '按月按量' },
];

export interface ConsumptionResourceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  contractCapacity: number; // kW
  realtimeLoad: number; // kW
  adjustableCapacity: number; // kW
  hazardStatus: '无隐患' | '一般缺陷' | '重大风险' | '整改中';
  lastInspectDate: string;
  contactPerson: string;
  phone: string;
}

export const MOCK_CONSUMPTION_RESOURCES: ConsumptionResourceItem[] = [
  {
    id: 'cr-01',
    code: 'YD-2026-901',
    name: '青海西宁钢铁集团有限责任公司',
    category: '冶金工业',
    contractCapacity: 150000,
    realtimeLoad: 124500,
    adjustableCapacity: 35000,
    hazardStatus: '无隐患',
    lastInspectDate: '2026-10-15',
    contactPerson: '张经理',
    phone: '138****9123'
  },
  {
    id: 'cr-02',
    code: 'YD-2026-902',
    name: '青海盐湖工业股份有限公司第2电解厂',
    category: '化工用电',
    contractCapacity: 280000,
    realtimeLoad: 238000,
    adjustableCapacity: 62000,
    hazardStatus: '一般缺陷',
    lastInspectDate: '2026-10-14',
    contactPerson: '王工',
    phone: '139****8821'
  },
  {
    id: 'cr-03',
    code: 'YD-2026-903',
    name: '西宁高新技术产业开发区超算中心',
    category: '高新负荷',
    contractCapacity: 95000,
    realtimeLoad: 82000,
    adjustableCapacity: 18000,
    hazardStatus: '无隐患',
    lastInspectDate: '2026-10-16',
    contactPerson: '李主管',
    phone: '137****5678'
  },
  {
    id: 'cr-04',
    code: 'YD-2026-904',
    name: '海东市零碳产业园区多晶硅熔炼厂',
    category: '制造加工',
    contractCapacity: 180000,
    realtimeLoad: 156000,
    adjustableCapacity: 45000,
    hazardStatus: '整改中',
    lastInspectDate: '2026-10-12',
    contactPerson: '赵总',
    phone: '135****3412'
  },
  {
    id: 'cr-05',
    code: 'YD-2026-905',
    name: '海西柴达木重型装备机电制造厂',
    category: '制造加工',
    contractCapacity: 72000,
    realtimeLoad: 58000,
    adjustableCapacity: 15000,
    hazardStatus: '无隐患',
    lastInspectDate: '2026-10-13',
    contactPerson: '孙工',
    phone: '136****9988'
  },
  {
    id: 'cr-06',
    code: 'YD-2026-906',
    name: '青藏高原农牧产品冷链物流枢纽基地',
    category: '商业冷链',
    contractCapacity: 45000,
    realtimeLoad: 32000,
    adjustableCapacity: 12000,
    hazardStatus: '无隐患',
    lastInspectDate: '2026-10-15',
    contactPerson: '刘主任',
    phone: '133****2211'
  }
];

export interface MarketPublicationItem {
  id: string;
  code: string;
  title: string;
  type: '市场公告' | '交易规则' | '出清结果' | '预测信息';
  department: string;
  publishDate: string;
  effectiveDate: string;
  status: '生效中' | '已截止' | '草稿';
  summary: string;
}

export const MOCK_MARKET_PUBLICATIONS: MarketPublicationItem[] = [
  {
    id: 'pub-01',
    code: 'GG-2026-1008',
    title: '关于开展2026年10月下旬全省电力现货市场日内出清规则修订的公告',
    type: '市场公告',
    department: '电力交易中心出清部',
    publishDate: '2026-10-15',
    effectiveDate: '2026-10-16',
    status: '生效中',
    summary: '明确新能源高占比时段调频辅助服务报价上限与安全隐患联动考核标准。'
  },
  {
    id: 'pub-02',
    code: 'GG-2026-1007',
    title: '2026年10月第2周电力中长期合约撮合出清结果通告',
    type: '出清结果',
    department: '电力结算与审计室',
    publishDate: '2026-10-14',
    effectiveDate: '2026-10-14',
    status: '生效中',
    summary: '全省总成交电量 1,842.50 GWh，加权平均出清电价为 382.40 元/MWh。'
  },
  {
    id: 'pub-03',
    code: 'GG-2026-1005',
    title: '电网安全运行隐患排查与电力市场协同履约考核规则(2026年试行版)',
    type: '交易规则',
    department: '省能源局安全监管处',
    publishDate: '2026-10-08',
    effectiveDate: '2026-10-10',
    status: '生效中',
    summary: '规范存在重大隐患未按期闭环电站的市场交易出清限制与偏差惩罚细则。'
  },
  {
    id: 'pub-04',
    code: 'GG-2026-1002',
    title: '2026年第四季度全省电力供需余缺与峰谷调节预警预测报告',
    type: '预测信息',
    department: '调度控制中心调度处',
    publishDate: '2026-10-01',
    effectiveDate: '2026-10-01',
    status: '生效中',
    summary: '预测冬季高峰负荷增长 6.8%，建议虚拟电厂储备不低于 850MW 可调容量。'
  }
];

export interface MarketSettlementBill {
  id: string;
  billNo: string;
  participantName: string;
  participantType: '发电侧' | '用电侧' | '虚拟电厂聚合商';
  month: string;
  deliveryEnergy: number; // MWh
  contractPrice: number; // 元/MWh
  hazardDeduction: number; // 元
  rewardSubsidy: number; // 元
  totalSettlementFee: number; // 万元
  status: '已结算' | '待复核' | '处理中';
  settlementDate: string;
}

export const MOCK_SETTLEMENT_BILLS: MarketSettlementBill[] = [
  {
    id: 'st-101',
    billNo: 'JS-2026-10-001',
    participantName: '海南州光伏发电机组大联盟',
    participantType: '发电侧',
    month: '2026年10月',
    deliveryEnergy: 42500.80,
    contractPrice: 378.50,
    hazardDeduction: 12500.00,
    rewardSubsidy: 35000.00,
    totalSettlementFee: 1610.88,
    status: '已结算',
    settlementDate: '2026-10-15'
  },
  {
    id: 'st-102',
    billNo: 'JS-2026-10-002',
    participantName: '西宁钢铁集团虚拟电厂聚合体',
    participantType: '用电侧',
    month: '2026年10月',
    deliveryEnergy: 38200.50,
    contractPrice: 392.00,
    hazardDeduction: 0.00,
    rewardSubsidy: 58000.00,
    totalSettlementFee: 1503.26,
    status: '已结算',
    settlementDate: '2026-10-15'
  },
  {
    id: 'st-103',
    billNo: 'JS-2026-10-003',
    participantName: '德令哈风能新能源发电有限公司',
    participantType: '发电侧',
    month: '2026年10月',
    deliveryEnergy: 29800.00,
    contractPrice: 365.00,
    hazardDeduction: 48000.00,
    rewardSubsidy: 12000.00,
    totalSettlementFee: 1084.10,
    status: '待复核',
    settlementDate: '2026-10-14'
  },
  {
    id: 'st-104',
    billNo: 'JS-2026-10-004',
    participantName: '青海盐湖化工能效负荷管理终端',
    participantType: '用电侧',
    month: '2026年10月',
    deliveryEnergy: 51200.40,
    contractPrice: 388.20,
    hazardDeduction: 18000.00,
    rewardSubsidy: 42000.00,
    totalSettlementFee: 1989.98,
    status: '已结算',
    settlementDate: '2026-10-12'
  },
  {
    id: 'st-105',
    billNo: 'JS-2026-10-005',
    participantName: '黄河上游水电与光储一体化运维中心',
    participantType: '虚拟电厂聚合商',
    month: '2026年10月',
    deliveryEnergy: 64100.00,
    contractPrice: 380.00,
    hazardDeduction: 0.00,
    rewardSubsidy: 95000.00,
    totalSettlementFee: 2445.30,
    status: '处理中',
    settlementDate: '2026-10-10'
  }
];

export interface SettlementDetailItem {
  id: string;
  plantCode: string;
  plantName: string;
  plantType: '用电型' | '发电型';
  category: '中长期' | '日前' | '日内';
  contractCode: string;
  region: string;
  settlementVolume: number; // mW/h
  settlementFee: number; // 元
  avgPrice: number; // 元/mW/h
  month: string;
}

export const MOCK_SETTLEMENT_DETAILS: SettlementDetailItem[] = [
  {
    id: 'sd-01',
    plantCode: 'XNDC000001',
    plantName: '福州鼓楼智慧虚拟电厂',
    plantType: '用电型',
    category: '中长期',
    contractCode: 'ZCQ000001',
    region: '福州区域',
    settlementVolume: 8542.00,
    settlementFee: 85420.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-02',
    plantCode: 'XNDC000002',
    plantName: '厦门思明智能虚拟电厂',
    plantType: '发电型',
    category: '日前',
    contractCode: 'RQ000001',
    region: '厦门区域',
    settlementVolume: 7920.50,
    settlementFee: 79205.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-03',
    plantCode: 'XNDC000003',
    plantName: '泉州丰泽工业能效电厂',
    plantType: '用电型',
    category: '日内',
    contractCode: 'RN000001',
    region: '泉州区域',
    settlementVolume: 7210.00,
    settlementFee: 72100.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-04',
    plantCode: 'XNDC000004',
    plantName: '漳州龙文清洁发电厂',
    plantType: '发电型',
    category: '中长期',
    contractCode: 'ZCQ000002',
    region: '漳州区域',
    settlementVolume: 6850.20,
    settlementFee: 68502.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-05',
    plantCode: 'XNDC000005',
    plantName: '莆田涵江负荷调峰电厂',
    plantType: '用电型',
    category: '中长期',
    contractCode: 'ZCQ000003',
    region: '莆田区域',
    settlementVolume: 6320.00,
    settlementFee: 63200.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-06',
    plantCode: 'XNDC000006',
    plantName: '龙岩新罗地热发电站',
    plantType: '发电型',
    category: '日前',
    contractCode: 'RQ000002',
    region: '龙岩区域',
    settlementVolume: 5890.00,
    settlementFee: 58900.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-07',
    plantCode: 'XNDC000007',
    plantName: '三明梅列钢铁高新电厂',
    plantType: '用电型',
    category: '日内',
    contractCode: 'RN000002',
    region: '三明区域',
    settlementVolume: 5420.80,
    settlementFee: 54208.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-08',
    plantCode: 'XNDC000008',
    plantName: '南平建阳风光互补发电厂',
    plantType: '发电型',
    category: '中长期',
    contractCode: 'ZCQ000004',
    region: '南平区域',
    settlementVolume: 4980.00,
    settlementFee: 49800.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-09',
    plantCode: 'XNDC000009',
    plantName: '宁德蕉城储能微电网',
    plantType: '用电型',
    category: '中长期',
    contractCode: 'ZCQ000005',
    region: '宁德区域',
    settlementVolume: 4323.09,
    settlementFee: 43230.09,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-10',
    plantCode: 'XNDC000010',
    plantName: '福州仓山零碳园区电厂',
    plantType: '发电型',
    category: '日前',
    contractCode: 'RQ000003',
    region: '福州区域',
    settlementVolume: 3890.00,
    settlementFee: 38900.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-11',
    plantCode: 'XNDC000011',
    plantName: '厦门湖里高新负荷中心',
    plantType: '用电型',
    category: '日内',
    contractCode: 'RN000003',
    region: '厦门区域',
    settlementVolume: 3250.00,
    settlementFee: 32500.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-12',
    plantCode: 'XNDC000012',
    plantName: '泉州晋江新能源发电站',
    plantType: '发电型',
    category: '中长期',
    contractCode: 'ZCQ000006',
    region: '泉州区域',
    settlementVolume: 2760.40,
    settlementFee: 27604.00,
    avgPrice: 10.00,
    month: '2026-10'
  },
  {
    id: 'sd-13',
    plantCode: 'XNDC000013',
    plantName: '漳州台商区综合用电厂',
    plantType: '用电型',
    category: '中长期',
    contractCode: 'ZCQ000007',
    region: '漳州区域',
    settlementVolume: 2150.00,
    settlementFee: 21500.00,
    avgPrice: 10.00,
    month: '2026-10'
  }
];

