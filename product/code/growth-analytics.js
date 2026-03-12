import { createClient } from '@supabase/supabase-js';
import { format, subDays, startOfDay } from 'date-fns';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

class GrowthAnalyticsDashboard {
  constructor() {
    this.alertThresholds = {
      cacCreep: 1.2, // 20% increase triggers alert
      ltvMinimum: 3, // LTV should be 3x CAC minimum
      paybackPeriodMax: 12 // months
    };
  }

  async getDailyMetrics(days = 30) {
    const startDate = subDays(new Date(), days);
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    return this.calculateMetrics(transactions, days);
  }

  calculateMetrics(transactions, days) {
    const metrics = {};
    const channels = {};
    const cohorts = {};

    // Group by date and channel
    transactions.forEach(tx => {
      const date = format(new Date(tx.created_at), 'yyyy-MM-dd');
      const channel = tx.acquisition_channel || 'direct';
      const cohortMonth = format(new Date(tx.created_at), 'yyyy-MM');

      if (!metrics[date]) metrics[date] = {};
      if (!channels[channel]) channels[channel] = { spend: 0, conversions: 0, revenue: 0, users: new Set() };
      if (!cohorts[cohortMonth]) cohorts[cohortMonth] = { users: new Set(), revenue: 0, months: 0 };

      channels[channel].spend += tx.marketing_spend || 0;
      channels[channel].conversions += tx.is_conversion ? 1 : 0;
      channels[channel].revenue += tx.revenue || 0;
      channels[channel].users.add(tx.user_id);

      cohorts[cohortMonth].users.add(tx.user_id);
      cohorts[cohortMonth].revenue += tx.revenue || 0;
    });

    // Calculate CAC by channel
    const cacByChannel = {};
    Object.entries(channels).forEach(([channel, data]) => {
      cacByChannel[channel] = data.conversions > 0 ? data.spend / data.conversions : 0;
    });

    // Calculate 30-day rolling average CAC
    const rollingCACAverage = this.calculateRollingAverage(cacByChannel, 30);

    // Calculate LTV by cohort
    const ltvByCohort = {};
    Object.entries(cohorts).forEach(([cohort, data]) => {
      const monthsActive = Math.max(1, Math.floor((Date.now() - new Date(cohort).getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const avgRevenuePerUser = data.users.size > 0 ? data.revenue / data.users.size : 0;
      ltvByCohort[cohort] = avgRevenuePerUser * 12; // Annualized
    });

    // Calculate payback period by channel
    const paybackPeriodByChannel = {};
    Object.entries(channels).forEach(([channel, data]) => {
      const monthlyRevenue = data.revenue / Math.max(1, data.users.size);
      const cac = cacByChannel[channel];
      paybackPeriodByChannel[channel] = monthlyRevenue > 0 ? cac / monthlyRevenue : Infinity;
    });

    // Calculate channel profitability
    const channelProfitability = {};
    Object.entries(channels).forEach(([channel, data]) => {
      const ltv = ltvByCohort[Object.keys(ltvByCohort)[0]] || 0; // Use latest cohort LTV
      const cac = cacByChannel[channel];
      const profitMargin = ltv > 0 ? ((ltv - cac) / ltv) * 100 : 0;
      channelProfitability[channel] = {
        ltv,
        cac,
        profitMargin,
        roi: cac > 0 ? ((ltv - cac) / cac) * 100 : 0
      };
    });

    // Check for alerts
    const alerts = this.generateAlerts(cacByChannel, rollingCACAverage, ltvByCohort, paybackPeriodByChannel);

    return {
      timestamp: new Date().toISOString(),
      cacByChannel,
      rollingCACAverage,
      ltvByCohort,
      paybackPeriodByChannel,
      channelProfitability,
      alerts,
      summary: {
        totalRevenue: Object.values(channels).reduce((sum, ch) => sum + ch.revenue, 0),
        totalSpend: Object.values(channels).reduce((sum, ch) => sum + ch.spend, 0),
        totalConversions: Object.values(channels).reduce((sum, ch) => sum + ch.conversions, 0),
        totalUsers: new Set(Object.values(channels).flatMap(ch => Array.from(ch.users))).size
      }
    };
  }

  calculateRollingAverage(data, windowDays) {
    // Simplified rolling average - in production, calculate from daily data
    const values = Object.values(data).filter(v => v > 0);
    return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
  }

  generateAlerts(cacByChannel, rollingAvg, ltvByCohort, paybackPeriod) {
    const alerts = [];

    // CAC creep detection
    Object.entries(cacByChannel).forEach(([channel, cac]) => {
      if (cac > rollingAvg * this.alertThresholds.cacCreep) {
        alerts.push({
          severity: 'warning',
          type: 'cac_creep',
          channel,
          message: `CAC for ${channel} increased ${((cac / rollingAvg - 1) * 100).toFixed(1)}% above 30-day average`,
          currentCAC: cac,
          averageCAC: rollingAvg
        });
      }
    });

    // LTV/CAC ratio check
    const latestLTV = Object.values(ltvByCohort)[Object.values(ltvByCohort).length - 1] || 0;
    Object.entries(cacByChannel).forEach(([channel, cac]) => {
      const ratio = latestLTV / Math.max(cac, 1);
      if (ratio < this.alertThresholds.ltvMinimum) {
        alerts.push({
          severity: 'critical',
          type: 'ltv_cac_ratio',
          channel,
          message: `LTV/CAC ratio for ${channel} is ${ratio.toFixed(2)}x (target: ${this.alertThresholds.ltvMinimum}x)`,
          ratio
        });
      }
    });

    // Payback period check
    Object.entries(paybackPeriod).forEach(([channel, months]) => {
      if (months > this.alertThresholds.paybackPeriodMax && months !== Infinity) {
        alerts.push({
          severity: 'warning',
          type: 'payback_period',
          channel,
          message: `${channel} payback period is ${months.toFixed(1)} months (target: ${this.alertThresholds.paybackPeriodMax} months)`,
          paybackMonths: months
        });
      }
    });

    return alerts;
  }

  async streamRealtimeUpdates(callback) {
    // Subscribe to real-time transaction updates
    const subscription = supabase
      .from('transactions')
      .on('*', payload => {
        this.getDailyMetrics(30).then(metrics => {
          callback(metrics);
        });
      })
      .subscribe();

    return subscription;
  }
}

export default GrowthAnalyticsDashboard;"
    }
  },
  {
    "skill": "local_write_file",
    "params": {
      "path": "product/components/GrowthDashboard.jsx",
      "content": "import React, { useState, useEffect } from 'react';
import GrowthAnalyticsDashboard from '../code/growth-analytics';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GrowthDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const dashboard = new GrowthAnalyticsDashboard();
    
    // Initial load
    dashboard.getDailyMetrics(30).then(data => {
      setMetrics(data);
      setAlerts(data.alerts);
      setLoading(false);
    });

    // Real-time updates
    const subscription = dashboard.streamRealtimeUpdates((updatedMetrics) => {
      setMetrics(updatedMetrics);
      setAlerts(updatedMetrics.alerts);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
  if (!metrics) return <div className="p-8 text-center">No data available</div>;

  const { cacByChannel, ltvByCohort, paybackPeriodByChannel, channelProfitability, summary } = metrics;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Growth Analytics Dashboard</h1>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                }`}
              >
                <p className="font-semibold">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold">${(summary.totalRevenue / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Spend</p>
            <p className="text-3xl font-bold">${(summary.totalSpend / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Conversions</p>
            <p className="text-3xl font-bold">{summary.totalConversions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold">{summary.totalUsers}</p>
          </div>
        </div>

        {/* CAC by Channel */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">CAC by Channel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(cacByChannel).map(([channel, cac]) => ({ channel, cac }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cac" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Profitability */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Channel Profitability</h2>
            <div className="space-y-4">
              {Object.entries(channelProfitability).map(([channel, data]) => (
                <div key={channel} className="border-b pb-4">
                  <p className="font-semibold text-lg">{channel}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-gray-600">LTV</p>
                      <p className="text-lg font-bold">${data.ltv.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">CAC</p>
                      <p className="text-lg font-bold">${data.cac.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Profit Margin</p>
                      <p className="text-lg font-bold">{data.profitMargin.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ROI</p>
                      <p className="text-lg font-bold">{data.roi.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payback Period */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Payback Period by Channel</h2>\