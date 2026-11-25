import {
  FlexibleLoadFaultDevice,
  FlexibleLoadZone
} from '../types';

/** 10kV 网架区域：负荷与容量以 kW 数值存放，展示时再格式化 */
export const FLEXIBLE_LOAD_ZONES: FlexibleLoadZone[] = [
  { id: 1, name: '#1区域 (新能源充电站)', loadKw: 980.5, capacityKw: 1500, status: '正常运行', devices: 12, transformers: 2 },
  { id: 2, name: '#2区域 (化工电解车间)', loadKw: 2450.0, capacityKw: 3000, status: '今日负荷过高', devices: 18, transformers: 3 },
  { id: 3, name: '#3区域 (综合办公楼)', loadKw: 420.0, capacityKw: 850, status: '正常运行', devices: 8, transformers: 1 },
  { id: 4, name: '#4区域 (智能立体仓储)', loadKw: 1150.0, capacityKw: 1200, status: '今日负荷过高', devices: 15, transformers: 2 },
  { id: 5, name: '#5区域 (生化曝气风机)', loadKw: 720.0, capacityKw: 900, status: '正常运行', devices: 10, transformers: 2 },
  { id: 6, name: '#6区域 (辅助生产车间)', loadKw: 890.0, capacityKw: 1000, status: '正常运行', devices: 11, transformers: 2 },
  { id: 7, name: '#7区域 (综合动力站)', loadKw: 610.0, capacityKw: 800, status: '正常运行', devices: 9, transformers: 1 },
];

/** 故障处置工单弹窗的默认设备信息（打开弹窗时预填） */
export const DEFAULT_FAULT_DEVICE: FlexibleLoadFaultDevice = {
  name: '#1~3 园区智能超级快充站',
  code: 'FDSB00001',
  region: '区域一',
  customer: '青海新能源高载能大用户',
  level: '严重',
  alarmType: '柔性负荷越限告警',
  time: '2026-10-16 15:10',
  duration: '45min',
  phenomenon: '区域柔性负荷短时冲击超限，主变负荷率瞬时达到 93.4%。',
  analysis: '晚高峰新能源充电负荷与工业电解车间负荷叠加，电网侧需进行柔性平抑。',
  process: '已下发柔性调控指令，对快充桩集群进行功率下调 400kW，负荷曲线恢复平稳。',
  isResolved: '是',
  disposeTime: '2026-10-16 15:25',
  operator: '张工 (调度值班员)'
};

/** 功率数值格式化为「2,450.0 kW」形式，保留一位小数 */
export function formatKw(value: number): string {
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`;
}

export interface FlexibleLoadSummary {
  /** 网架区域总数 */
  zoneCount: number;
  /** 全厂总负荷（kW，各区域负荷之和） */
  totalLoadKw: number;
  /** 全厂总容量（kW，各区域容量之和） */
  totalCapacityKw: number;
  /** 今日负荷过高区域数 */
  highLoadCount: number;
  /** 今日负荷过高区域编号 */
  highLoadZoneIds: number[];
}

/** 由区域数据汇总页眉概况：总负荷、区域数与过高区域随区域数据实时变化 */
export function summarizeFlexibleLoad(zones: FlexibleLoadZone[]): FlexibleLoadSummary {
  let totalLoadKw = 0;
  let totalCapacityKw = 0;
  const highLoadZoneIds: number[] = [];
  for (const z of zones) {
    totalLoadKw += z.loadKw;
    totalCapacityKw += z.capacityKw;
    if (z.status === '今日负荷过高') {
      highLoadZoneIds.push(z.id);
    }
  }
  return {
    zoneCount: zones.length,
    totalLoadKw,
    totalCapacityKw,
    highLoadCount: highLoadZoneIds.length,
    highLoadZoneIds
  };
}

/** 区域主变负荷率（百分比数值，保留一位小数），由该区域负荷与容量算出 */
export function zoneLoadRate(zone: FlexibleLoadZone): number {
  if (zone.capacityKw === 0) return 0;
  return Math.round((zone.loadKw / zone.capacityKw) * 1000) / 10;
}
