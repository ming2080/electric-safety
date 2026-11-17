import { WorkOrder, WorkOrderLevel } from '../types';

/** 处置工单初始数据，按生成时间降序排列 */
export const INITIAL_WORK_ORDERS: WorkOrder[] = [
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
  { id: 11, code: '202610150011', name: 'CDZ000003', region: '区域一', owner: '这是用户名称', level: '一般', alarmType: '数据未采集', duration: '1.5h', disposalStatus: '已处置', status: '已归档', genTime: '2026-10-15 11:30', handleTime: '2026-10-15 11:30' },
];

export interface WorkOrderSummary {
  total: number;
  pending: number;
  archived: number;
  byLevel: Record<WorkOrderLevel, number>;
}

/** 由工单数据汇总统计，页眉数字随工单状态实时变化 */
export function summarizeWorkOrders(orders: WorkOrder[]): WorkOrderSummary {
  const byLevel: Record<WorkOrderLevel, number> = { '紧急': 0, '严重': 0, '一般': 0 };
  let pending = 0;
  let archived = 0;
  for (const o of orders) {
    byLevel[o.level] += 1;
    if (o.status === '待处理') pending += 1;
    if (o.status === '已归档') archived += 1;
  }
  return { total: orders.length, pending, archived, byLevel };
}

export interface WorkOrderFilter {
  level: string;
  region: string;
  status: string;
  query: string;
}

/** 按等级 / 区域 / 状态 / 关键字筛选工单，'全部' 与空关键字不过滤 */
export function filterWorkOrders(orders: WorkOrder[], filter: WorkOrderFilter): WorkOrder[] {
  const q = filter.query.trim().toLowerCase();
  return orders.filter(o => {
    if (filter.level !== '全部' && o.level !== filter.level) return false;
    if (filter.region !== '全部' && o.region !== filter.region) return false;
    if (filter.status !== '全部' && o.status !== filter.status) return false;
    if (q && !o.code.toLowerCase().includes(q) && !o.name.toLowerCase().includes(q)) return false;
    return true;
  });
}
