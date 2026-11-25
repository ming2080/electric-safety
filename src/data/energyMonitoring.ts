import {
  EnergyMonitoringRecord,
  EnergyTariffSegment,
  EnergyTrendPoint,
  EnergyWarningDay,
  EquipmentEfficiency
} from '../types';

/** 能耗监测历史明细：按时间降序排列，近期 10 条监测快照 */
export const ENERGY_MONITORING_RECORDS: EnergyMonitoringRecord[] = [
  {
    id: 'EM-20261016-01',
    time: '2026-10-16 15:30:00',
    circuit: '10kV 1# 进线动力母线',
    type: '生产动力用电',
    realtimeLoad: 1245.8,
    accumulatedKWh: 4892.5,
    powerFactor: 0.988,
    copRate: '98.5% (一级能效)',
    status: '正常运行',
    statusType: 'normal',
    warning: '无告警',
    advice: '负荷平稳，处峰段经济运行区'
  },
  {
    id: 'EM-20261016-02',
    time: '2026-10-16 14:15:00',
    circuit: '中央空调节能制冷机组 #2',
    type: '空调通风暖通',
    realtimeLoad: 485.2,
    accumulatedKWh: 2160.0,
    powerFactor: 0.952,
    copRate: '5.86 COP (超高效)',
    status: '高负荷预警',
    statusType: 'warning',
    warning: '接近额定功率 92%',
    advice: '建议开启 3# 备用辅机分担冷负荷'
  },
  {
    id: 'EM-20261016-03',
    time: '2026-10-16 12:40:00',
    circuit: '储能变流器仓 PCS-01',
    type: '储能充放调节',
    realtimeLoad: -500.0,
    accumulatedKWh: 1850.4,
    powerFactor: 0.999,
    copRate: '93.2% (综合转换)',
    status: '放电支撑中',
    statusType: 'normal',
    warning: '无告警',
    advice: '执行尖峰顶峰放电调度，削峰获益'
  },
  {
    id: 'EM-20261016-04',
    time: '2026-10-16 11:20:00',
    circuit: '分布式光伏集中并网柜 #3',
    type: '绿色新能源',
    realtimeLoad: 880.6,
    accumulatedKWh: 3410.2,
    powerFactor: 0.995,
    copRate: '98.8% (MPPT追踪)',
    status: '光伏顶峰发电',
    statusType: 'normal',
    warning: '无告警',
    advice: '辐照充足，园区自发自用率 100%'
  },
  {
    id: 'EM-20261016-05',
    time: '2026-10-16 09:50:00',
    circuit: '空压机动力联控总站',
    type: '动力辅助用能',
    realtimeLoad: 310.4,
    accumulatedKWh: 1280.6,
    powerFactor: 0.915,
    copRate: '87.4% (一般能效)',
    status: '轻度能效劣化',
    statusType: 'mild_alert',
    warning: '排气压力浮动超差 5%',
    advice: '检测管路压降，择机清洗进气滤网'
  },
  {
    id: 'EM-20261016-06',
    time: '2026-10-16 08:30:00',
    circuit: '超充桩智能配电岛 #A',
    type: '交通充电负荷',
    realtimeLoad: 640.0,
    accumulatedKWh: 1980.0,
    powerFactor: 0.982,
    copRate: '96.2% (整流效率)',
    status: '充电高峰',
    statusType: 'normal',
    warning: '无告警',
    advice: '柔性功率池动态分配中'
  },
  {
    id: 'EM-20261015-01',
    time: '2026-10-15 22:30:00',
    circuit: '储能仓电池舱 PACK-02',
    type: '夜间谷电储能',
    realtimeLoad: 500.0,
    accumulatedKWh: 3200.0,
    powerFactor: 0.998,
    copRate: '94.0% (充电充入)',
    status: '谷段充电',
    statusType: 'normal',
    warning: '无告警',
    advice: '0.31元低谷电价充能完成'
  },
  {
    id: 'EM-20261015-02',
    time: '2026-10-15 19:15:00',
    circuit: '精密恒温恒湿洁净车间回路',
    type: '关键生产保障',
    realtimeLoad: 720.5,
    accumulatedKWh: 4120.8,
    powerFactor: 0.978,
    copRate: '95.1% (一级能效)',
    status: '晚高峰平稳',
    statusType: 'normal',
    warning: '无告警',
    advice: '温湿度控制精度 ±0.2℃'
  },
  {
    id: 'EM-20261015-03',
    time: '2026-10-15 15:45:00',
    circuit: '循环冷却水塔变频泵组 #1',
    type: '动力水循环',
    realtimeLoad: 185.0,
    accumulatedKWh: 940.2,
    powerFactor: 0.920,
    copRate: '89.6% (二级能效)',
    status: '正常运行',
    statusType: 'normal',
    warning: '无告警',
    advice: '根据室外湿球温度动态调频'
  },
  {
    id: 'EM-20261014-01',
    time: '2026-10-14 16:20:00',
    circuit: '10kV 2# 备用自投母线',
    type: '备用保安回路',
    realtimeLoad: 12.4,
    accumulatedKWh: 85.0,
    powerFactor: 0.880,
    copRate: '90.0% (待机状态)',
    status: '热备用',
    statusType: 'normal',
    warning: '空载轻度无功',
    advice: '合闸无功补偿支路，提升功率因数'
  }
];

/** 能耗趋势：当日 24 小时曲线（2 小时一点，含光伏消纳） */
export const ENERGY_TREND_DAY: EnergyTrendPoint[] = [
  { time: '00:00', load: 1120, baseline: 1200, pv: 0, tag: '谷段' },
  { time: '02:00', load: 1080, baseline: 1150, pv: 0, tag: '谷段' },
  { time: '04:00', load: 1050, baseline: 1100, pv: 0, tag: '谷段' },
  { time: '06:00', load: 1250, baseline: 1280, pv: 40, tag: '平段' },
  { time: '08:00', load: 2450, baseline: 2500, pv: 280, tag: '平段' },
  { time: '10:00', load: 3890, baseline: 4100, pv: 650, tag: '尖峰' },
  { time: '12:00', load: 3620, baseline: 3800, pv: 890, tag: '平段' },
  { time: '14:00', load: 4850, baseline: 4920, pv: 740, tag: '尖峰', peak: true },
  { time: '16:00', load: 4210, baseline: 4350, pv: 360, tag: '峰段' },
  { time: '18:00', load: 3950, baseline: 4050, pv: 80, tag: '峰段' },
  { time: '20:00', load: 3200, baseline: 3300, pv: 0, tag: '平段' },
  { time: '22:00', load: 1850, baseline: 1950, pv: 0, tag: '谷段' }
];

/** 能耗趋势：当月各日走势 */
export const ENERGY_TREND_MONTH: EnergyTrendPoint[] = [
  { time: '10-01', load: 3120, baseline: 3250, tag: '国庆' },
  { time: '10-03', load: 2950, baseline: 3100, tag: '国庆' },
  { time: '10-05', load: 3340, baseline: 3400, tag: '恢复' },
  { time: '10-07', load: 3820, baseline: 3900, tag: '正常' },
  { time: '10-09', load: 4150, baseline: 4200, tag: '满负荷' },
  { time: '10-11', load: 4320, baseline: 4450, tag: '满负荷' },
  { time: '10-13', load: 4620, baseline: 4700, tag: '高产' },
  { time: '10-14', load: 4780, baseline: 4850, tag: '高产' },
  { time: '10-15', load: 4810, baseline: 4900, tag: '高产' },
  { time: '10-16', load: 4850, baseline: 4950, tag: '今日最新', peak: true }
];

/** 能耗趋势：当年各月走势 */
export const ENERGY_TREND_YEAR: EnergyTrendPoint[] = [
  { time: '01月', load: 3600, baseline: 3800, tag: '冬季' },
  { time: '03月', load: 3950, baseline: 4100, tag: '春季' },
  { time: '05月', load: 4200, baseline: 4300, tag: '复工' },
  { time: '07月', load: 5120, baseline: 5300, tag: '迎峰度夏', peak: true },
  { time: '08月', load: 4980, baseline: 5150, tag: '迎峰度夏' },
  { time: '09月', load: 4620, baseline: 4750, tag: '秋季' },
  { time: '10月', load: 4850, baseline: 4900, tag: '当前近期' }
];

/** 设备能效监测清单 */
export const EQUIPMENT_EFFICIENCY_LIST: EquipmentEfficiency[] = [
  {
    name: '中央冷水机组 #1',
    category: '制冷暖通',
    cop: 5.86,
    copBenchmark: 5.2,
    copStatus: '一级能效 (优)',
    loadRate: 78,
    powerFactor: 0.985,
    actualPower: '485.2 kW',
    dailyKWh: '3,880 kWh',
    health: 98,
    isWarning: false
  },
  {
    name: '中央冷水机组 #2',
    category: '制冷暖通',
    cop: 5.42,
    copBenchmark: 5.2,
    copStatus: '一级能效 (良)',
    loadRate: 85,
    powerFactor: 0.976,
    actualPower: '512.0 kW',
    dailyKWh: '4,100 kWh',
    health: 94,
    isWarning: false
  },
  {
    name: '离心式空压总机 #A',
    category: '压缩动力',
    cop: 4.12,
    copBenchmark: 4.5,
    copStatus: '二级能效 (关注)',
    loadRate: 91,
    powerFactor: 0.912,
    actualPower: '310.4 kW',
    dailyKWh: '2,480 kWh',
    health: 86,
    isWarning: true
  },
  {
    name: '储能变流升压舱 PCS-1',
    category: '储能转换',
    cop: 6.25,
    copBenchmark: 5.8,
    copStatus: '高效能 (优)',
    loadRate: 72,
    powerFactor: 0.999,
    actualPower: '500.0 kW',
    dailyKWh: '3,650 kWh',
    health: 99,
    isWarning: false
  },
  {
    name: '光伏逆变电控总柜',
    category: '清洁发电',
    cop: 6.50,
    copBenchmark: 6.0,
    copStatus: '转换率 98.8%',
    loadRate: 68,
    powerFactor: 0.995,
    actualPower: '880.6 kW',
    dailyKWh: '5,280 kWh',
    health: 97,
    isWarning: false
  },
  {
    name: '超级快充机架 #01',
    category: '智能充电',
    cop: 5.60,
    copBenchmark: 5.3,
    copStatus: '整流能效 96.2%',
    loadRate: 64,
    powerFactor: 0.982,
    actualPower: '640.0 kW',
    dailyKWh: '3,840 kWh',
    health: 95,
    isWarning: false
  }
];

/** 能耗预警监测：近 7 日频次与越限（按日期降序，首条为当日） */
export const ENERGY_WARNING_MONITOR: EnergyWarningDay[] = [
  { date: '10-16', critical: 0, moderate: 1, mild: 2, totalOverloadKWh: 42.5, status: '今日受控' },
  { date: '10-15', critical: 0, moderate: 0, mild: 1, totalOverloadKWh: 18.0, status: '轻微偏离' },
  { date: '10-14', critical: 1, moderate: 2, mild: 3, totalOverloadKWh: 115.8, status: '已闭环处置' },
  { date: '10-13', critical: 0, moderate: 1, mild: 2, totalOverloadKWh: 38.2, status: '已闭环处置' },
  { date: '10-12', critical: 0, moderate: 0, mild: 1, totalOverloadKWh: 12.0, status: '正常' },
  { date: '10-11', critical: 0, moderate: 2, mild: 2, totalOverloadKWh: 56.4, status: '已闭环处置' },
  { date: '10-10', critical: 1, moderate: 1, mild: 4, totalOverloadKWh: 128.0, status: '已闭环处置' }
];

/** 尖峰平谷用电结构（阶梯时段定价） */
export const ENERGY_TARIFF_STRUCTURE: EnergyTariffSegment[] = [
  { name: '尖峰时段 (10:00-12:00, 14:00-19:00)', pct: 28.5, kwh: '36,608 kWh', color: '#ef4444', price: '1.24 元/kWh' },
  { name: '高峰时段 (08:00-10:00, 19:00-22:00)', pct: 31.2, kwh: '40,076 kWh', color: '#f59e0b', price: '0.98 元/kWh' },
  { name: '平段时段 (12:00-14:00, 22:00-23:00)', pct: 21.8, kwh: '28,002 kWh', color: '#06b6d4', price: '0.65 元/kWh' },
  { name: '低谷时段 (23:00-次日07:00)', pct: 18.5, kwh: '23,764 kWh', color: '#10b981', price: '0.31 元/kWh' }
];

export interface EnergyWarningSummary {
  /** 当日日期 */
  date: string;
  /** 当日预警事件总数 */
  totalEvents: number;
  /** 严重越限数 */
  critical: number;
  /** 中度预警数 */
  moderate: number;
  /** 轻微提醒数 */
  mild: number;
  /** 当日越限总电量（kWh） */
  totalOverloadKWh: number;
  /** 当日处置状态 */
  status: string;
}

/** 由预警监测数据汇总当日预警概况：页眉 KPI 的事件数与分级数随当日数据实时变化 */
export function summarizeEnergyWarnings(days: EnergyWarningDay[]): EnergyWarningSummary {
  const today = days[0];
  if (!today) {
    return { date: '', totalEvents: 0, critical: 0, moderate: 0, mild: 0, totalOverloadKWh: 0, status: '' };
  }
  return {
    date: today.date,
    totalEvents: today.critical + today.moderate + today.mild,
    critical: today.critical,
    moderate: today.moderate,
    mild: today.mild,
    totalOverloadKWh: today.totalOverloadKWh,
    status: today.status
  };
}

export interface TariffDonutSegment {
  /** 分段名称 */
  name: string;
  /** 占比（%） */
  pct: number;
  /** 分段颜色 */
  color: string;
  /** 环形描边实线长度（周长按 r=38 折算，每 1% 对应 2.38） */
  dashLength: number;
  /** 环形描边起始偏移（前面分段累计占比折算） */
  dashOffset: number;
}

/** 由尖峰平谷结构数据算出环形图各段描边长度与偏移，环形图不再硬编码占比 */
export function tariffDonutSegments(segments: EnergyTariffSegment[]): TariffDonutSegment[] {
  let cumulativePct = 0;
  return segments.map((s) => {
    const segment = {
      name: s.name,
      pct: s.pct,
      color: s.color,
      dashLength: s.pct * 2.38,
      dashOffset: -cumulativePct * 2.38
    };
    cumulativePct += s.pct;
    return segment;
  });
}

/** 低谷时段占比（%），用于环形图中心数值；找不到时返回 0 */
export function valleyTariffPct(segments: EnergyTariffSegment[]): number {
  const valley = segments.find((s) => s.name.startsWith('低谷时段'));
  return valley ? valley.pct : 0;
}
