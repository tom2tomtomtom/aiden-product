import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ============================================
// AFFILIATE SIGNUP & LOGIN
// ============================================

export async function affiliateSignup(email, password, name) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Create affiliate profile
    const { data, error } = await supabase
      .from('affiliates')
      .insert([
        {
          user_id: userId,
          email,
          name,
          referral_code: generateReferralCode(),
          status: 'active',
          commission_rate: 0.4,
          total_referrals: 0,
          total_conversions: 0,
          total_commission: 0,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      affiliate: data[0],
      message: 'Affiliate account created successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function affiliateLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch affiliate profile
    const { data: affiliate, error: fetchError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (fetchError) throw fetchError;

    return {
      success: true,
      user: data.user,
      affiliate,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// REFERRAL LINK GENERATION
// ============================================

function generateReferralCode() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

export async function getReferralLink(affiliateId) {
  try {
    const { data, error } = await supabase
      .from('affiliates')
      .select('referral_code')
      .eq('id', affiliateId)
      .single();

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com';
    const referralLink = `${baseUrl}?ref=${data.referral_code}`;

    return {
      success: true,
      referralLink,
      referralCode: data.referral_code,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// CONVERSION TRACKING
// ============================================

export async function trackReferral(referralCode, customerEmail) {
  try {
    // Find affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (affiliateError) throw affiliateError;

    // Log referral
    const { data, error } = await supabase
      .from('referrals')
      .insert([
        {
          affiliate_id: affiliate.id,
          customer_email: customerEmail,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Update affiliate referral count
    await supabase.rpc('increment_affiliate_referrals', {
      affiliate_id: affiliate.id,
    });

    return {
      success: true,
      referral: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function trackConversion(referralCode, amount) {
  try {
    // Find affiliate
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, commission_rate')
      .eq('referral_code', referralCode)
      .single();

    if (affiliateError) throw affiliateError;

    const commission = amount * affiliate.commission_rate;

    // Create conversion record
    const { data, error } = await supabase
      .from('conversions')
      .insert([
        {
          affiliate_id: affiliate.id,
          amount,
          commission,
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Update affiliate stats
    await supabase.rpc('update_affiliate_conversion', {
      affiliate_id: affiliate.id,
      commission_amount: commission,
    });

    return {
      success: true,
      conversion: data[0],
      commission,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// COMMISSION CALCULATION
// ============================================

export async function calculateCommissions(affiliateId, startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('conversions')
      .select('commission')
      .eq('affiliate_id', affiliateId)
      .eq('status', 'completed')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const totalCommission = data.reduce((sum, conv) => sum + conv.commission, 0);

    return {
      success: true,
      totalCommission,
      conversions: data.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// PAYOUT SCHEDULING
// ============================================

export async function schedulePayout(affiliateId, amount, payoutMethod) {
  try {
    // Verify affiliate has sufficient balance
    const { data: affiliate, error: fetchError } = await supabase
      .from('affiliates')
      .select('total_commission')
      .eq('id', affiliateId)
      .single();

    if (fetchError) throw fetchError;
    if (affiliate.total_commission < amount) {
      throw new Error('Insufficient commission balance');
    }

    // Create payout record
    const { data, error } = await supabase
      .from('payouts')
      .insert([
        {
          affiliate_id: affiliateId,
          amount,
          method: payoutMethod,
          status: 'scheduled',
          scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Deduct from commission balance
    await supabase.rpc('deduct_affiliate_commission', {
      affiliate_id: affiliateId,
      amount,
    });

    return {
      success: true,
      payout: data[0],
      message: 'Payout scheduled for processing',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function processPayout(payoutId) {
  try {
    const { data, error } = await supabase
      .from('payouts')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', payoutId)
      .select();

    if (error) throw error;

    return {
      success: true,
      payout: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// AFFILIATE DASHBOARD DATA
// ============================================

export async function getAffiliateDashboard(affiliateId) {
  try {
    // Get affiliate profile
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', affiliateId)
      .single();

    if (affiliateError) throw affiliateError;

    // Get recent referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (referralsError) throw referralsError;

    // Get conversions
    const { data: conversions, error: conversionsError } = await supabase
      .from('conversions')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (conversionsError) throw conversionsError;

    // Get payouts
    const { data: payouts, error: payoutsError } = await supabase
      .from('payouts')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (payoutsError) throw payoutsError;

    // Calculate stats
    const conversionRate = affiliate.total_referrals > 0 
      ? ((affiliate.total_conversions / affiliate.total_referrals) * 100).toFixed(2)
      : 0;

    const pendingPayouts = payouts
      .filter(p => p.status === 'scheduled')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      success: true,
      dashboard: {
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          referralCode: affiliate.referral_code,
          status: affiliate.status,
        },
        stats: {
          totalReferrals: affiliate.total_referrals,
          totalConversions: affiliate.total_conversions,
          conversionRate: `${conversionRate}%`,
          totalCommissionEarned: affiliate.total_commission,
          pendingPayouts,
          availableBalance: affiliate.total_commission - pendingPayouts,
        },
        recentReferrals: referrals,
        recentConversions: conversions,
        recentPayouts: payouts,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getAffiliateStats(affiliateId, period = '30days') {
  try {
    const startDate = new Date();
    if (period === '7days') startDate.setDate(startDate.getDate() - 7);
    if (period === '30days') startDate.setDate(startDate.getDate() - 30);
    if (period === '90days') startDate.setDate(startDate.getDate() - 90);

    const { data: conversions, error } = await supabase
      .from('conversions')
      .select('amount, commission, created_at')
      .eq('affiliate_id', affiliateId)
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const totalRevenue = conversions.reduce((sum, c) => sum + c.amount, 0);
    const totalCommission = conversions.reduce((sum, c) => sum + c.commission, 0);

    return {
      success: true,
      stats: {
        period,
        conversions: conversions.length,
        totalRevenue,
        totalCommission,
        averageOrderValue: conversions.length > 0 ? (totalRevenue / conversions.length).toFixed(2) : 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
"
    }
  },
  {
    "skill": "local_write_file",
    "params": {
      "path": "product/code/affiliate-dashboard.jsx",
      "content": "'use client';

import { useEffect, useState } from 'react';
import { getAffiliateDashboard, getReferralLink, schedulePayout } from './affiliate-system';

export default function AffiliateDashboard({ affiliateId }) {
  const [dashboard, setDashboard] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('stripe');

  useEffect(() => {
    loadDashboard();
  }, [affiliateId]);

  async function loadDashboard() {
    setLoading(true);
    const result = await getAffiliateDashboard(affiliateId);
    if (result.success) {
      setDashboard(result.dashboard);
      const linkResult = await getReferralLink(affiliateId);
      if (linkResult.success) {
        setReferralLink(linkResult.referralLink);
