import {
  HourlyConsumptionPoint,
  PanoramaBuilding,
  PanoramaFacility,
  PanoramaTransformer,
  RealtimeAlarm,
  RealtimeAlarmLevel,
  RealtimeLoadPoint
} from '../types';

/** 全景图上的建筑点位数据 */
export const PANORAMA_BUILDINGS: PanoramaBuilding[] = [
  {
    id: 'b1',
    number: '#1',
    name: '1# 智能综合生产大楼',
    isOverload: false,
    p: '311.98 kW',
    e: '123.98 kW/h',
    pvBadge: '分布式光伏',
    chargerBadge: '#2充电站',
    x: 17, // percentage
    y: 58,
    pvPower: '85.4 kW',
    temp: '24.2 ℃'
  },
  {
    id: 'b2',
    number: '#2',
    name: '2# 精密机加工智能车间',
    isOverload: false,
    p: '311.98 kW',
    e: '123.98 kW/h',
    pvBadge: '分布式光伏',
    x: 35,
    y: 62,
    pvPower: '92.0 kW',
    temp: '23.8 ℃'
  },
  {
    id: 'b3',
    number: '#3',
    name: '3# 仓储物流与分拣中心',
    isOverload: false,
    p: '311.98 kW',
    e: '123.98 kW/h',
    chargerBadge: '#1充电站',
    x: 55,
    y: 55,
    pvPower: '0 kW',
    temp: '22.5 ℃'
  },
  {
    id: 'b4',
    number: '#4',
    name: '4# 重载装配集成厂房 (负荷超限区)',
    isOverload: true,
    p: '8311.98 kW',
    e: '10311.98 kW/h',
    pvBadge: '分布式光伏',
    x: 72,
    y: 48,
    pvPower: '420.5 kW',
    temp: '32.1 ℃',
    note: '超出区域近三日平均负荷 28%'
  },
  {
    id: 'b5',
    number: '#5',
    name: '5# 核心动力生产动力总站 (负荷超限区)',
    isOverload: true,
    p: '8311.98 kW',
    e: '10311.98 kW/h',
    pvBadge: '分布式光伏',
    x: 30,
    y: 30,
    pvPower: '510.2 kW',
    temp: '34.5 ℃',
    note: '超出区域近三日平均负荷 35%'
  },
  {
    id: 'b6',
    number: '#6',
    name: '6# 动力辅助与冷却泵房',
    isOverload: false,
    p: '311.98 kW',
    e: '123.98 kW/h',
    storageBadge: '#2储能站',
    x: 27,
    y: 16,
    pvPower: '45.0 kW',
    temp: '21.0 ℃'
  },
  {
    id: 'b7',
    number: '#7',
    name: '7# 研发实验与质检大楼',
    isOverload: false,
    p: '311.98 kW',
    e: '12.98 kW/h',
    pvBadge: '分布式光伏',
    chargerBadge: '#3充电站',
    x: 43,
    y: 13,
    pvPower: '110.8 kW',
    temp: '23.0 ℃'
  },
  {
    id: 'b8',
    number: '#8',
    name: '8# 数据中心与智控运营中心',
    isOverload: false,
    p: '311.98 kW',
    e: '123.98 kW/h',
    storageBadge: '#1储能站',
    x: 54,
    y: 14,
    pvPower: '78.5 kW',
    temp: '20.5 ℃'
  }
];

/** 全景图上的变压器点位数据 */
export const PANORAMA_TRANSFORMERS: PanoramaTransformer[] = [
  {
    id: 'tf-10kv',
    name: '10kV变压器',
    p: '311.98 kW',
    t: '45℃',
    x: 17,
    y: 28,
    isWarning: true
  },
  {
    id: 'tf-06kv',
    name: '0.6kV变压器',
    p: '311.98 kW',
    t: '45℃',
    x: 64,
    y: 10,
    isWarning: false
  },
  {
    id: 'tf-110kv',
    name: '110kV变压器',
    p: '311.98 kW',
    t: '45℃',
    x: 88,
    y: 52,
    isWarning: true
  }
];

/** 全景图上的储能站 / 充电站徽标数据 */
export const PANORAMA_FACILITIES: PanoramaFacility[] = [
  { name: '#1储能站', type: 'storage', x: 52, y: 22 },
  { name: '#2储能站', type: 'storage', x: 24, y: 14 },
  { name: '#4储能站', type: 'storage', x: 91, y: 68 },
  { name: '#1充电站', type: 'charging', x: 55, y: 68 },
  { name: '#2充电站', type: 'charging', x: 19, y: 69 },
  { name: '#3充电站', type: 'charging', x: 39, y: 15 }
];

/** 逐时用电量 (kWh)，今日 / 明日双柱 */
export const HOURLY_CONSUMPTION_DATA: HourlyConsumptionPoint[] = [
  { hour: '1点', today: 180, tomorrow: 160 },
  { hour: '2点', today: 210, tomorrow: 190 },
  { hour: '3点', today: 220, tomorrow: 200 },
  { hour: '4点', today: 320, tomorrow: 280 },
  { hour: '5点', today: 410, tomorrow: 360 },
  { hour: '6点', today: 520, tomorrow: 480 },
  { hour: '7点', today: 590, tomorrow: 540 },
  { hour: '8点', today: 640, tomorrow: 590 },
  { hour: '9点', today: 680, tomorrow: 620 },
  { hour: '10点', today: 720, tomorrow: 680 },
  { hour: '11点', today: 850, tomorrow: 790 },
  { hour: '12点', today: 760, tomorrow: 710 },
  { hour: '13点', today: 740, tomorrow: 700 },
  { hour: '14点', today: 720, tomorrow: 690 },
  { hour: '15点', today: 690, tomorrow: 650 }
];

/** 实时负荷及预测 (kW)，今日 / 明日双曲线 */
export const REALTIME_LOAD_DATA: RealtimeLoadPoint[] = [
  { time: '06:00', today: 180, tomorrow: 150 },
  { time: '06:15', today: 210, tomorrow: 200 },
  { time: '06:30', today: 140, tomorrow: 220 },
  { time: '06:45', today: 110, tomorrow: 180 },
  { time: '07:00', today: 150, tomorrow: 210 },
  { time: '07:15', today: 210, tomorrow: 240 },
  { time: '07:30', today: 260, tomorrow: 200 },
  { time: '08:15', today: 210, tomorrow: 330 },
  { time: '08:30', today: 280, tomorrow: 360 },
  { time: '08:45', today: 220, tomorrow: 300 },
  { time: '09:00', today: 180, tomorrow: 280 },
  { time: '09:15', today: 160, tomorrow: 260 }
];

/** 故障告警流，按时间降序排列 */
export const REALTIME_ALARMS: RealtimeAlarm[] = [
  {
    id: 'ALM-20261016-01',
    level: '严重',
    status: '未处置',
    device: '#1光伏#48442逆变器无电网',
    time: '2026-10-16 15:35:12',
    detail: '检测到并网交流接触器断开，逆变器孤岛保护触发，已脱网。',
    action: '需运维人员到场检测交流侧微断与防孤岛保护装置'
  },
  {
    id: 'ALM-20261016-02',
    level: '紧急',
    status: '未处置',
    device: '#2储能站#34834电池堆温度过高',
    time: '2026-10-16 14:20:45',
    detail: 'BMS 监测到电池簇 #3 模块4最高单体温度达 48.5℃ (上限阈值 45℃)。',
    action: '已自动下调充放电功率至 30%，液冷机组启动强冷循环'
  },
  {
    id: 'ALM-20261016-03',
    level: '一般',
    status: '已处置',
    device: '#3充电站#34834充电桩信号中断',
    time: '2026-10-16 11:15:30',
    detail: '通信采集网关 4G 心跳超时，已自动切换以太网备用信道。',
    action: '信号已恢复正常，通信握手时延 14ms'
  },
  {
    id: 'ALM-20261016-04',
    level: '紧急',
    status: '已处置',
    device: '#3充电站#34834充电桩信号中断',
    time: '2026-10-16 09:40:18',
    detail: '充电桩主控板通讯总线丢包率超出 5%，已重启主控协处理器。',
    action: '故障已清除，自检通过重新上线'
  },
  {
    id: 'ALM-20261015-01',
    level: '紧急',
    status: '已处置',
    device: '#3充电站#34834充电桩信号中断',
    time: '2026-10-15 22:10:05',
    detail: '夜间例行通信压力测试偶发掉线，已完成协议栈热补丁修复。',
    action: '已闭环归档'
  }
];

export interface RealtimeMonitoringSummary {
  buildingTotal: number;
  overloadBuildings: number;
  warningTransformers: number;
  alarmTotal: number;
  unresolvedAlarms: number;
  byLevel: Record<RealtimeAlarmLevel, number>;
}

/** 由全景监测数据汇总统计，图例与告警面板数字随数据实时变化 */
export function summarizeRealtimeMonitoring(
  buildings: PanoramaBuilding[],
  transformers: PanoramaTransformer[],
  alarms: RealtimeAlarm[]
): RealtimeMonitoringSummary {
  const byLevel: Record<RealtimeAlarmLevel, number> = { '紧急': 0, '严重': 0, '一般': 0 };
  let unresolvedAlarms = 0;
  for (const a of alarms) {
    byLevel[a.level] += 1;
    if (a.status === '未处置') unresolvedAlarms += 1;
  }
  return {
    buildingTotal: buildings.length,
    overloadBuildings: buildings.filter((b) => b.isOverload).length,
    warningTransformers: transformers.filter((t) => t.isWarning).length,
    alarmTotal: alarms.length,
    unresolvedAlarms,
    byLevel
  };
}
