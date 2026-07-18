// services/dashboard.service.js
// ???????

import { apiClient } from './api-client.js';

// ?????????
export async function getDashboardStats() {
    try {
        const data = await apiClient.get('/rest/v1/dashboard_stats?select=*');
        if (data && data.length > 0) {
            return data[0];
        }
        // ????
        return {
            todayRevenue: 12580,
            todayOrders: 86,
            activeCustomers: 342,
            conversionRate: 23.5,
            totalRevenue: 1258000,
            totalOrders: 3240
        };
    } catch (error) {
        console.warn('??????:', error);
        return {
            todayRevenue: 12580,
            todayOrders: 86,
            activeCustomers: 342,
            conversionRate: 23.5,
            totalRevenue: 1258000,
            totalOrders: 3240
        };
    }
}

// ??????
export async function getRecentOrders(limit = 5) {
    try {
        const data = await apiClient.get('/rest/v1/orders?select=*&order=created_at.desc&limit=' + limit);
        if (data && data.length > 0) {
            return data;
        }
        return [
            { id: 'ORD-001', customer: '??', amount: 1580, status: 'completed', time: '2026-07-18 14:30' },
            { id: 'ORD-002', customer: '??', amount: 2300, status: 'pending', time: '2026-07-18 13:20' },
            { id: 'ORD-003', customer: '??', amount: 680, status: 'processing', time: '2026-07-18 12:10' },
            { id: 'ORD-004', customer: '??', amount: 4200, status: 'completed', time: '2026-07-18 11:00' },
            { id: 'ORD-005', customer: '??', amount: 950, status: 'cancelled', time: '2026-07-18 09:30' }
        ];
    } catch (error) {
        console.warn('????????:', error);
        return [
            { id: 'ORD-001', customer: '??', amount: 1580, status: 'completed', time: '2026-07-18 14:30' },
            { id: 'ORD-002', customer: '??', amount: 2300, status: 'pending', time: '2026-07-18 13:20' },
            { id: 'ORD-003', customer: '??', amount: 680, status: 'processing', time: '2026-07-18 12:10' },
            { id: 'ORD-004', customer: '??', amount: 4200, status: 'completed', time: '2026-07-18 11:00' },
            { id: 'ORD-005', customer: '??', amount: 950, status: 'cancelled', time: '2026-07-18 09:30' }
        ];
    }
}

// ??????
export async function getChartData() {
    return {
        labels: ['??', '??', '??', '??', '??', '??', '??'],
        values: [12000, 15000, 9800, 18000, 22000, 16000, 13000]
    };
}
