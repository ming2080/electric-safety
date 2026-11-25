export type UserRole = 'admin' | 'supervisor' | 'inspector';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  department: string;
}

export type HazardLevel = '重大隐患' | '较大隐患' | '一般隐患';
export type HazardStatus = '待整改' | '整改中' | '复查验收' | '已闭环';

export interface HazardItem {
  id: string;
  code: string;
  title: string;
  station: string;
  voltageLevel: string;
  level: HazardLevel;
  status: HazardStatus;
  discoveredDate: string;
  deadline: string;
  responsiblePerson: string;
  department: string;
  description: string;
  aiSuggestion?: string;
  coordinates: { x: number; y: number };
}

export interface SubstationNode {
  id: string;
  name: string;
  voltage: string;
  loadRate: number; // percentage
  temperature: number; // °C
  status: '正常' | '预警' | '危险';
  hazardsCount: number;
}

export type WorkOrderLevel = '紧急' | '严重' | '一般';
export type WorkOrderStatus = '待处理' | '已归档';

export interface WorkOrder {
  id: number;
  code: string;
  name: string;
  region: string;
  owner: string;
  level: WorkOrderLevel;
  alarmType: string;
  duration: string;
  disposalStatus: string;
  status: WorkOrderStatus;
  genTime: string;
  handleTime: string;
}

/** 厂站全景图上的建筑点位 */
export interface PanoramaBuilding {
  id: string;
  number: string;
  name: string;
  isOverload: boolean;
  p: string;
  e: string;
  pvBadge?: string;
  chargerBadge?: string;
  storageBadge?: string;
  x: number; // 百分比
  y: number; // 百分比
  pvPower: string;
  temp: string;
  note?: string;
}

/** 全景图上的变压器点位 */
export interface PanoramaTransformer {
  id: string;
  name: string;
  p: string;
  t: string;
  x: number;
  y: number;
  isWarning: boolean;
}

/** 全景图上的储能站 / 充电站徽标 */
export interface PanoramaFacility {
  name: string;
  type: 'storage' | 'charging';
  x: number;
  y: number;
}

/** 逐时用电量柱状图数据点 */
export interface HourlyConsumptionPoint {
  hour: string;
  today: number;
  tomorrow: number;
}

/** 实时负荷及预测曲线数据点 */
export interface RealtimeLoadPoint {
  time: string;
  today: number;
  tomorrow: number;
}

export type RealtimeAlarmLevel = '严重' | '紧急' | '一般';
export type RealtimeAlarmStatus = '未处置' | '已处置';

/** 厂站全景页底部故障告警流，按时间降序排列 */
export interface RealtimeAlarm {
  id: string;
  level: RealtimeAlarmLevel;
  status: RealtimeAlarmStatus;
  device: string;
  time: string;
  detail: string;
  action: string;
}

export type DisposalAlarmLevel = '紧急' | '严重' | '一般';
export type DisposalAlarmStatus = '未处置' | '已处置';

/** 告警处置页明细表中的一条告警记录，按发生时间降序排列 */
export interface DisposalAlarm {
  id: number;
  code: string;
  name: string;
  type: string;
  region: string;
  owner: string;
  level: DisposalAlarmLevel;
  alarmType: string;
  value: string;
  duration: string;
  status: DisposalAlarmStatus;
  time: string;
}

/** 告警类型概况卡片的一行统计 */
export interface AlarmTypeStat {
  label: string;
  percent: string;
  count: number;
  colorClass: string;
}

/** 告警设备类型卡片的一格统计 */
export interface AlarmDeviceTypeStat {
  label: string;
  count: number;
  colorClass: string;
}

/** 区域告警概况柱状图的一根柱 */
export interface RegionalAlarmBar {
  label: string;
  heightClass: string;
  colorClass: string;
}

export type FlexibleLoadZoneStatus = '正常运行' | '今日负荷过高';

/** 柔性负荷页 10kV 网架区域 */
export interface FlexibleLoadZone {
  id: number;
  name: string;
  /** 当前负荷（kW） */
  loadKw: number;
  /** 额定容量（kW） */
  capacityKw: number;
  status: FlexibleLoadZoneStatus;
  /** 接入智能终端数 */
  devices: number;
  /** 配电变压器台数 */
  transformers: number;
}

/** 故障处置工单弹窗的默认设备信息 */
export interface FlexibleLoadFaultDevice {
  name: string;
  code: string;
  region: string;
  customer: string;
  level: string;
  alarmType: string;
  time: string;
  duration: string;
  phenomenon: string;
  analysis: string;
  process: string;
  isResolved: '是' | '否';
  disposeTime: string;
  operator: string;
}

export type EnergyMonitoringRecordStatus = 'normal' | 'warning' | 'mild_alert' | 'critical';

/** 能耗监测页监测快照记录 */
export interface EnergyMonitoringRecord {
  id: string;
  time: string;
  circuit: string;
  type: string;
  /** 实时负荷（kW，负值表示放电/反向送电） */
  realtimeLoad: number;
  /** 累计用能（kWh） */
  accumulatedKWh: number;
  powerFactor: number;
  copRate: string;
  status: string;
  statusType: EnergyMonitoringRecordStatus;
  warning: string;
  advice: string;
}

/** 能耗趋势曲线点：日粒度含光伏消纳，月/年粒度不含 */
export interface EnergyTrendPoint {
  time: string;
  load: number;
  baseline: number;
  pv?: number;
  tag: string;
  peak?: boolean;
}

/** 能耗监测页设备能效监测条目 */
export interface EquipmentEfficiency {
  name: string;
  category: string;
  cop: number;
  copBenchmark: number;
  copStatus: string;
  loadRate: number;
  powerFactor: number;
  actualPower: string;
  dailyKWh: string;
  health: number;
  isWarning: boolean;
}

/** 能耗预警监测单日汇总 */
export interface EnergyWarningDay {
  date: string;
  critical: number;
  moderate: number;
  mild: number;
  totalOverloadKWh: number;
  status: string;
}

/** 尖峰平谷用电结构分段 */
export interface EnergyTariffSegment {
  name: string;
  pct: number;
  kwh: string;
  color: string;
  price: string;
}
