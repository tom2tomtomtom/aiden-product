import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Unit Economics Tracker - Real-time profitability analysis by cohort
class UnitEconomicsTracker {
  constructor(supabaseClient) {
    this.db = supabaseClient;
    this.updateInterval = 24 * 60 * 60 * 1000; // Daily updates
  }

  // Calculate acquisition cost per customer
  async calculateCAC(cohortMonth, channel) {
    const { data: spending } = await this.db
      .from('marketing_spend')
      .select('amount')
      .eq('cohort_month', cohortMonth)
      .eq('channel', channel);

    const { data: customers } = await this.db
      .from('customers')
      .select('id')
      .eq('cohort_month', cohortMonth)
      .eq('acquisition_channel', channel);

    const totalSpend = spending.reduce((sum, row) => sum + row.amount, 0);
    const customerCount = customers.length;

    return customerCount > 0 ? totalSpend / customerCount : 0;
  }

  // Calculate lifetime value per customer
  async calculateLTV(customerId, cohortMonth) {
    const { data: transactions } = await this.db
      .from('transactions')
      .select('amount, created_at')
      .eq('customer_id', customerId);

    const { data: customer } = await this.db
      .from('customers')
      .select('churn_date, created_at')
      .eq('id', customerId)
      .single();

    const totalRevenue = transactions.reduce((sum, row) => sum + row.amount, 0);
    const monthsActive = this.calculateMonthsActive(customer.created_at, customer.churn_date);
    const monthlyARR = monthsActive > 0 ? totalRevenue / monthsActive : totalRevenue;

    // Assume 36-month average customer lifetime
    const estimatedLTV = monthlyARR * 36;
    return estimatedLTV;
  }

  // Calculate gross margin
  async calculateGrossMargin(cohortMonth) {
    const { data: revenue } = await this.db
      .from('transactions')
      .select('amount')
      .eq('cohort_month', cohortMonth);

    const { data: costs } = await this.db
      .from('operating_costs')
      .select('amount')
      .eq('cohort_month', cohortMonth)
      .eq('type', 'cogs');

    const totalRevenue = revenue.reduce((sum, row) => sum + row.amount, 0);
    const totalCOGS = costs.reduce((sum, row) => sum + row.amount, 0);

    return totalRevenue > 0 ? ((totalRevenue - totalCOGS) / totalRevenue) * 100 : 0;
  }

  // Calculate payback period (months to recover CAC)
  async calculatePaybackPeriod(cohortMonth, channel) {
    const cac = await this.calculateCAC(cohortMonth, channel);
    
    const { data: customers } = await this.db
      .from('customers')
      .select('id')
      .eq('cohort_month', cohortMonth)
      .eq('acquisition_channel', channel);

    let totalMonthlyRevenue = 0;
    for (const customer of customers) {
      const { data: transactions } = await this.db
        .from('transactions')
        .select('amount')
        .eq('customer_id', customer.id)
        .gte('created_at', new Date(cohortMonth).toISOString())
        .lte('created_at', new Date(new Date(cohortMonth).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString());
      
      totalMonthlyRevenue += transactions.reduce((sum, row) => sum + row.amount, 0);
    }

    const avgMonthlyRevenuePerCustomer = customers.length > 0 ? totalMonthlyRevenue / customers.length : 0;
    return avgMonthlyRevenuePerCustomer > 0 ? cac / avgMonthlyRevenuePerCustomer : Infinity;
  }

  // Calculate CLV:CAC ratio
  async calculateCLVtoCACRatio(cohortMonth, channel) {
    const { data: customers } = await this.db
      .from('customers')
      .select('id')
      .eq('cohort_month', cohortMonth)
      .eq('acquisition_channel', channel);

    const cac = await this.calculateCAC(cohortMonth, channel);
    let totalLTV = 0;

    for (const customer of customers) {
      const ltv = await this.calculateLTV(customer.id, cohortMonth);
      totalLTV += ltv;
    }

    const avgLTV = customers.length > 0 ? totalLTV / customers.length : 0;
    return cac > 0 ? avgLTV / cac : 0;
  }

  // Generate comprehensive dashboard data
  async generateDashboard() {
    const { data: cohorts } = await this.db
      .from('customers')
      .select('cohort_month, acquisition_channel')
      .distinct();

    const dashboardData = [];

    for (const cohort of cohorts) {
      const cac = await this.calculateCAC(cohort.cohort_month, cohort.acquisition_channel);
      const margin = await this.calculateGrossMargin(cohort.cohort_month);
      const payback = await this.calculatePaybackPeriod(cohort.cohort_month, cohort.acquisition_channel);
      const ratio = await this.calculateCLVtoCACRatio(cohort.cohort_month, cohort.acquisition_channel);

      dashboardData.push({
        cohort_month: cohort.cohort_month,
        channel: cohort.acquisition_channel,
        acquisition_cost: Math.round(cac * 100) / 100,
        gross_margin_percent: Math.round(margin * 100) / 100,
        payback_period_months: Math.round(payback * 100) / 100,
        clv_cac_ratio: Math.round(ratio * 100) / 100,
        health_status: this.getHealthStatus(ratio, payback)
      });
    }

    return dashboardData;
  }

  // Determine cohort health based on metrics
  getHealthStatus(clvCacRatio, paybackPeriod) {
    if (clvCacRatio >= 3 && paybackPeriod <= 12) return 'excellent';
    if (clvCacRatio >= 2 && paybackPeriod <= 18) return 'healthy';
    if (clvCacRatio >= 1.5 && paybackPeriod <= 24) return 'acceptable';
    return 'at-risk';
  }

  // Helper: calculate months between two dates
  calculateMonthsActive(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }

  // Schedule daily updates
  startDailyUpdates(callback) {
    setInterval(async () => {
      const dashboard = await this.generateDashboard();
      callback(dashboard);
    }, this.updateInterval);
  }
}

export default UnitEconomicsTracker;"
    }
  },
  {
    "skill": "local_write_file",
    "params": {
      "path": "product/components/UnitEconomicsDashboard.jsx",
      "content": "'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import UnitEconomicsTracker from '@/product/code/unit-economics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UnitEconomicsDashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [filterChannel, setFilterChannel] = useState('all');

  useEffect(() => {
    const tracker = new UnitEconomicsTracker(supabase);
    
    const loadDashboard = async () => {
      setLoading(true);
      const data = await tracker.generateDashboard();
      setDashboardData(data);
      setLoading(false);
    };

    loadDashboard();
    tracker.startDailyUpdates(setDashboardData);
  }, []);

  const filteredData = filterChannel === 'all' 
    ? dashboardData 
    : dashboardData.filter(row => row.channel === filterChannel);

  const channels = [...new Set(dashboardData.map(row => row.channel))];

  const getHealthColor = (status) => {
    const colors = {
      excellent: 'bg-green-50 border-green-200',
      healthy: 'bg-blue-50 border-blue-200',
      acceptable: 'bg-yellow-50 border-yellow-200',
      'at-risk': 'bg-red-50 border-red-200'
    };
    return colors[status] || 'bg-gray-50';
  };

  const getHealthBadge = (status) => {
    const badges = {
      excellent: 'bg-green-100 text-green-800',
      healthy: 'bg-blue-100 text-blue-800',
      acceptable: 'bg-yellow-100 text-yellow-800',
      'at-risk': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading unit economics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Economics Dashboard</h1>
        <p className="text-gray-600">Real-time profitability analysis by customer cohort</p>
      </div>

      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Channel</label>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Channels</option>
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No data available for the selected filters</p>
          </div>
        ) : (
          filteredData.map((cohort, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-lg p-6 cursor-pointer transition ${getHealthColor(cohort.health_status)} ${selectedCohort === idx ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedCohort(selectedCohort === idx ? null : idx)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(cohort.cohort_month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-sm text-gray-600">Channel: {cohort.channel}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthBadge(cohort.health_status)}`}>
                  {cohort.health_status.charAt(0).toUpperCase() + cohort.health_status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white bg-opacity-60 rounded p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">CAC</p>
                  <p className="text-2xl font-bold text-gray-900">${cohort.acquisition_cost.toFixed(2)}</p>
                </div>

                <div className="bg-white bg-opacity-60 rounded p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Gross Margin</p>
                  <p className="text-2xl font-bold text-gray-900">{cohort.gross_margin_percent.toFixed(1)}%</p>
                </div>

                <div className="bg-white bg-opacity-60 rounded p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Payback Period</p>
                  <p className="text-2xl font-bold text-gray-900">{cohort.payback_period_months.toFixed(1)}mo</p>
                </div>

                <div className="bg-white bg-opacity-60 rounded p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">CLV:CAC Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{cohort.clv_cac