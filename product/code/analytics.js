/**
 * Lightweight Revenue Analytics Tracker
 * Tracks revenue events, calculates metrics, persists to localStorage
 */

class RevenueAnalytics {
  constructor(config = {}) {
    this.storageKey = config.storageKey || 'revenue_analytics';
    this.events = this.loadEvents();
    this.config = {
      currencySymbol: config.currencySymbol || '$',
      decimalPlaces: config.decimalPlaces || 2,
      ...config
    };
  }

  /**
   * Track a revenue event
   */
  trackEvent(event) {
    const normalizedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      amount: parseFloat(event.amount) || 0,
      currency: event.currency || 'USD',
      source: event.source || 'unknown',
      description: event.description || '',
      metadata: event.metadata || {},
      status: event.status || 'completed'
    };

    this.events.push(normalizedEvent);
    this.saveEvents();
    return normalizedEvent;
  }

  /**
   * Get total revenue
   */
  getTotalRevenue(filters = {}) {
    return this.getFilteredEvents(filters).reduce((sum, evt) => sum + evt.amount, 0);
  }

  /**
   * Get revenue by source
   */
  getRevenueBySource(filters = {}) {
    const filtered = this.getFilteredEvents(filters);
    return filtered.reduce((acc, evt) => {
      acc[evt.source] = (acc[evt.source] || 0) + evt.amount;
      return acc;
    }, {});
  }

  /**
   * Get daily revenue
   */
  getDailyRevenue(filters = {}) {
    const filtered = this.getFilteredEvents(filters);
    return filtered.reduce((acc, evt) => {
      const date = evt.timestamp.split('T')[0];
      acc[date] = (acc[date] || 0) + evt.amount;
      return acc;
    }, {});
  }

  /**
   * Get revenue metrics summary
   */
  getSummary(filters = {}) {
    const filtered = this.getFilteredEvents(filters);
    const total = filtered.reduce((sum, evt) => sum + evt.amount, 0);
    const count = filtered.length;
    const average = count > 0 ? total / count : 0;

    return {
      totalRevenue: this.formatCurrency(total),
      eventCount: count,
      averageValue: this.formatCurrency(average),
      minValue: count > 0 ? this.formatCurrency(Math.min(...filtered.map(e => e.amount))) : '0',
      maxValue: count > 0 ? this.formatCurrency(Math.max(...filtered.map(e => e.amount))) : '0',
      sources: Object.keys(this.getRevenueBySource(filters)).length,
      dateRange: count > 0 ? {
        start: filtered[0].timestamp.split('T')[0],
        end: filtered[filtered.length - 1].timestamp.split('T')[0]
      } : null
    };
  }

  /**
   * Get filtered events
   */
  getFilteredEvents(filters = {}) {
    let filtered = [...this.events];

    if (filters.source) {
      filtered = filtered.filter(e => e.source === filters.source);
    }

    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate);
    }

    if (filters.minAmount) {
      filtered = filtered.filter(e => e.amount >= filters.minAmount);
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(e => e.amount <= filters.maxAmount);
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get all events
   */
  getAllEvents(limit = null) {
    const events = [...this.events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return limit ? events.slice(0, limit) : events;
  }

  /**
   * Delete event by ID
   */
  deleteEvent(eventId) {
    this.events = this.events.filter(e => e.id !== eventId);
    this.saveEvents();
    return true;
  }

  /**
   * Clear all events
   */
  clearAllEvents() {
    this.events = [];
    this.saveEvents();
    return true;
  }

  /**
   * Export events as CSV
   */
  exportAsCSV() {
    if (this.events.length === 0) return '';

    const headers = ['ID', 'Timestamp', 'Amount', 'Currency', 'Source', 'Status', 'Description'];
    const rows = this.events.map(e => [
      e.id,
      e.timestamp,
      e.amount,
      e.currency,
      e.source,
      e.status,
      `"${e.description.replace(/"/g, '""')}"`
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Import events from JSON
   */
  importFromJSON(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        this.events = [...this.events, ...imported];
        this.saveEvents();
        return { success: true, count: imported.length };
      }
      return { success: false, error: 'Invalid JSON format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return `${this.config.currencySymbol}${amount.toFixed(this.config.decimalPlaces)}`;
  }

  /**
   * Save events to localStorage
   */
  saveEvents() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to save analytics events:', e);
    }
  }

  /**
   * Load events from localStorage
   */
  loadEvents() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load analytics events:', e);
      return [];
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RevenueAnalytics;
}
