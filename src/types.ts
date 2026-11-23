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
