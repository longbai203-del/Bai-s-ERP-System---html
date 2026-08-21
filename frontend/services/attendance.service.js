/**
 * Attendance Service - 考勤管理服务
 */

(function() {
    'use strict';

    class AttendanceService {
        constructor() {
            this.table = 'attendances';
        }

        // 获取所有考勤记录
        async getAll(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*, profiles(full_name)');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.user_id) {
                    query = query.eq('user_id', filters.user_id);
                }
                if (filters.status) {
                    query = query.eq('status', filters.status);
                }
                if (filters.date_from) {
                    query = query.gte('date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('date', filters.date_to);
                }
                
                const { data, error } = await query.order('date', { ascending: false });
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取考勤记录失败:', error);
                return [];
            }
        }

        // 获取单个考勤记录
        async getById(id) {
            try {
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*, profiles(full_name)')
                    .eq('id', id)
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取考勤记录失败:', error);
                return null;
            }
        }

        // 打卡签到
        async checkIn(userId, branchId, latitude = null, longitude = null) {
            try {
                const today = new Date().toISOString().slice(0, 10);
                const now = new Date();
                const time = now.toTimeString().slice(0, 8);
                
                // 检查是否已签到
                const existing = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('user_id', userId)
                    .eq('date', today)
                    .single();
                    
                if (existing.data) {
                    throw new Error('今日已签到');
                }
                
                // 判断是否迟到（默认9:00上班）
                const isLate = time > '09:00:00';
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .insert([{
                        user_id: userId,
                        branch_id: branchId,
                        date: today,
                        check_in: time,
                        check_in_latitude: latitude,
                        check_in_longitude: longitude,
                        status: isLate ? 'late' : 'present',
                        created_at: now.toISOString(),
                        updated_at: now.toISOString()
                    }])
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('签到失败:', error);
                throw error;
            }
        }

        // 打卡签退
        async checkOut(userId, latitude = null, longitude = null) {
            try {
                const today = new Date().toISOString().slice(0, 10);
                const now = new Date();
                const time = now.toTimeString().slice(0, 8);
                
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .update({
                        check_out: time,
                        check_out_latitude: latitude,
                        check_out_longitude: longitude,
                        updated_at: now.toISOString()
                    })
                    .eq('user_id', userId)
                    .eq('date', today)
                    .select()
                    .single();
                    
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('签退失败:', error);
                throw error;
            }
        }

        // 获取今日考勤状态
        async getTodayStatus(userId) {
            try {
                const today = new Date().toISOString().slice(0, 10);
                const { data, error } = await window.Supabase
                    .from(this.table)
                    .select('*')
                    .eq('user_id', userId)
                    .eq('date', today)
                    .single();
                    
                if (error && error.code !== 'PGRST116') throw error;
                
                if (data) {
                    return {
                        checkedIn: !!data.check_in,
                        checkedOut: !!data.check_out,
                        status: data.status,
                        checkIn: data.check_in,
                        checkOut: data.check_out
                    };
                }
                
                return {
                    checkedIn: false,
                    checkedOut: false,
                    status: 'absent',
                    checkIn: null,
                    checkOut: null
                };
            } catch (error) {
                console.error('获取今日考勤状态失败:', error);
                return { checkedIn: false, checkedOut: false, status: 'absent' };
            }
        }

        // 获取考勤统计
        async getStats(filters = {}) {
            try {
                let query = window.Supabase.from(this.table).select('*');
                
                if (filters.branch_id) {
                    query = query.eq('branch_id', filters.branch_id);
                }
                if (filters.organization_id) {
                    query = query.eq('organization_id', filters.organization_id);
                }
                if (filters.date_from) {
                    query = query.gte('date', filters.date_from);
                }
                if (filters.date_to) {
                    query = query.lte('date', filters.date_to);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                
                const present = data.filter(item => item.status === 'present').length;
                const late = data.filter(item => item.status === 'late').length;
                const absent = data.filter(item => item.status === 'absent').length;
                const leave = data.filter(item => item.status === 'leave').length;
                
                return {
                    total: data.length,
                    present,
                    late,
                    absent,
                    leave,
                    attendanceRate: data.length > 0 ? ((present + late) / data.length * 100) : 0
                };
            } catch (error) {
                console.error('获取考勤统计失败:', error);
                return { total: 0, present: 0, late: 0, absent: 0, leave: 0, attendanceRate: 0 };
            }
        }
    }

    window.AttendanceService = new AttendanceService();

})();