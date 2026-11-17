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
