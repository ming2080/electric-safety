import {
  AlarmDeviceTypeStat,
  AlarmTypeStat,
  DisposalAlarm,
  DisposalAlarmLevel,
  RegionalAlarmBar
} from '../types';

/** 告警处置明细表，按发生时间降序排列 */
export const DISPOSAL_ALARMS: DisposalAlarm[] = [
  { id: 1, code: 'JL00001', name: 'CDZ000001', type: '发电设备', region: '区域一', owner: '用户名称A', level: '紧急', alarmType: '温度过高', value: '56/24°C', duration: '30min', status: '未处置', time: '2026-10-16 15:10' },
  { id: 2, code: 'NBQ00001', name: 'CDZ000002', type: '发电设备', region: '区域二', owner: '用户名称B', level: '严重', alarmType: '设备功率比低', value: '20/90%', duration: '30min', status: '未处置', time: '2026-10-16 14:45' },
  { id: 3, code: 'XL00001', name: 'CDZ000003', type: '储能设备', region: '区域一', owner: '用户名称C', level: '一般', alarmType: '设备欠压', value: '0V', duration: '30min', status: '未处置', time: '2026-10-16 14:20' },
  { id: 4, code: 'TK00001', name: 'CDZ000004', type: '充电设备', region: '区域三', owner: '用户名称D', level: '紧急', alarmType: '设备欠压', value: '0V', duration: '60min', status: '已处置', time: '2026-10-16 13:05' },
  { id: 5, code: 'CDZ00001', name: 'CDZ000005', type: '空调', region: '区域四', owner: '用户名称E', level: '严重', alarmType: '数据未采集', value: '2323.23/15000kWh', duration: '30min', status: '已处置', time: '2026-10-16 12:15' },
  { id: 6, code: 'NBQ00002', name: 'CDZ000002', type: '计量设备', region: '区域五', owner: '用户名称F', level: '严重', alarmType: '温度过高', value: '0/0/0V', duration: '15min', status: '已处置', time: '2026-10-16 11:30' },
  { id: 7, code: 'XL00003', name: 'CDZ000003', type: '调控设备', region: '区域六', owner: '用户名称G', level: '一般', alarmType: '设备负载', value: '2323.23/15000kWh', duration: '30min', status: '已处置', time: '2026-10-16 10:20' },
  { id: 8, code: 'TK00004', name: 'CDZ000004', type: '充电设备', region: '区域七', owner: '用户名称H', level: '一般', alarmType: '温度过高', value: '36/24°C', duration: '45min', status: '已处置', time: '2026-10-16 09:50' },
  { id: 9, code: 'CDZ00005', name: 'CDZ000005', type: '空调', region: '区域三', owner: '用户名称I', level: '一般', alarmType: '数据未采集', value: '-', duration: '1d', status: '已处置', time: '2026-10-15 18:00' },
  { id: 10, code: 'NBQ00002', name: 'CDZ000002', type: '发电设备', region: '区域二', owner: '用户名称J', level: '一般', alarmType: '数据未采集', value: '-', duration: '2d', status: '已处置', time: '2026-10-15 14:10' },
  { id: 11, code: 'XL00003', name: 'CDZ000003', type: '储能设备', region: '区域一', owner: '用户名称K', level: '一般', alarmType: '数据未采集', value: '-', duration: '1.5h', status: '已处置', time: '2026-10-15 10:00' },
];

/** 告警类型概况：全量告警的类型分布（演示口径，非明细表子集） */
export const ALARM_TYPE_STATS: AlarmTypeStat[] = [
  { label: '温度过高', percent: '21%', count: 3, colorClass: 'text-rose-400' },
  { label: '数据未采集', percent: '21%', count: 3, colorClass: 'text-amber-400' },
  { label: '设备欠压', percent: '17%', count: 3, colorClass: 'text-indigo-400' },
  { label: '设备负载', percent: '14%', count: 2, colorClass: 'text-cyan-400' },
  { label: '功率比低', percent: '8%', count: 4, colorClass: 'text-slate-400' },
];

/** 告警类型概况卡片上的告警总数（与 ALARM_TYPE_STATS 的全量口径一致） */
export const ALARM_TYPE_TOTAL = 15;

/** 告警设备类型分布 */
export const ALARM_DEVICE_TYPE_STATS: AlarmDeviceTypeStat[] = [
  { label: '线路', count: 5, colorClass: 'text-cyan-300' },
  { label: '发电', count: 8, colorClass: 'text-amber-300' },
  { label: '储能', count: 6, colorClass: 'text-emerald-300' },
  { label: '充电', count: 12, colorClass: 'text-indigo-300' },
  { label: '空调', count: 22, colorClass: 'text-rose-300' },
  { label: '计量', count: 14, colorClass: 'text-purple-300' },
];

/** 区域告警概况柱状图（#1~#7） */
export const REGIONAL_ALARM_BARS: RegionalAlarmBar[] = [
  { label: '#1', heightClass: 'h-12', colorClass: 'bg-rose-500' },
  { label: '#2', heightClass: 'h-8', colorClass: 'bg-amber-500' },
  { label: '#3', heightClass: 'h-14', colorClass: 'bg-rose-500' },
  { label: '#4', heightClass: 'h-16', colorClass: 'bg-amber-500' },
  { label: '#5', heightClass: 'h-6', colorClass: 'bg-cyan-500' },
  { label: '#6', heightClass: 'h-10', colorClass: 'bg-cyan-500' },
  { label: '#7', heightClass: 'h-7', colorClass: 'bg-cyan-500' },
];

export interface AlarmDisposalSummary {
  total: number;
  pending: number;
  disposed: number;
  /** 已处置完成率（百分比数值，保留一位小数，如 72.7） */
  completionRate: number;
  /** 未处置告警按等级分布 */
  pendingByLevel: Record<DisposalAlarmLevel, number>;
}

/** 由告警明细汇总处置概况，页眉与处置卡片数字随处置状态实时变化 */
export function summarizeAlarmDisposal(alarms: DisposalAlarm[]): AlarmDisposalSummary {
  const pendingByLevel: Record<DisposalAlarmLevel, number> = { '紧急': 0, '严重': 0, '一般': 0 };
  let pending = 0;
  for (const a of alarms) {
    if (a.status === '未处置') {
      pending += 1;
      pendingByLevel[a.level] += 1;
    }
  }
  const disposed = alarms.length - pending;
  return {
    total: alarms.length,
    pending,
    disposed,
    completionRate: alarms.length === 0 ? 100 : Math.round((disposed / alarms.length) * 1000) / 10,
    pendingByLevel
  };
}
