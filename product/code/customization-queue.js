/**
 * Customization Queue System
 * Manages user customization requests with priority, status tracking, and callbacks
 */

class CustomizationQueue {
  constructor(options = {}) {
    this.queue = [];
    this.processing = false;
    this.maxConcurrent = options.maxConcurrent || 3;
    this.activeJobs = new Map();
    this.completedJobs = new Map();
    this.failedJobs = new Map();
    this.jobTimeout = options.jobTimeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.onProgress = options.onProgress || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onError = options.onError || (() => {});
  }

  /**
   * Add a customization job to the queue
   * @param {Object} job - Job configuration
   * @param {string} job.id - Unique job identifier
   * @param {string} job.type - Type of customization (e.g., 'color', 'text', 'layout')
   * @param {Object} job.payload - Customization data
   * @param {number} job.priority - Priority level (1-10, higher = more urgent)
   * @param {Function} job.processor - Async function to process the job
   * @param {Function} job.onSuccess - Callback on successful completion
   * @param {Function} job.onFailure - Callback on failure
   * @returns {string} Job ID
   */
  enqueue(job) {
    const jobId = job.id || this._generateId();
    const queueItem = {
      id: jobId,
      type: job.type,
      payload: job.payload,
      priority: job.priority || 5,
      processor: job.processor,
      onSuccess: job.onSuccess || (() => {}),
      onFailure: job.onFailure || (() => {}),
      createdAt: Date.now(),
      attempts: 0,
      status: 'queued',
    };

    this.queue.push(queueItem);
    this._sortByPriority();
    this.onProgress({ type: 'enqueued', jobId, queueLength: this.queue.length });
    this._processQueue();

    return jobId;
  }

  /**
   * Process the queue, respecting concurrency limits
   * @private
   */
  async _processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0 && this.activeJobs.size < this.maxConcurrent) {
      const job = this.queue.shift();
      this._executeJob(job);
    }

    this.processing = false;
  }

  /**
   * Execute a single job with timeout and retry logic
   * @private
   */
  async _executeJob(job) {
    job.status = 'processing';
    this.activeJobs.set(job.id, job);
    this.onProgress({ type: 'started', jobId: job.id, type: job.type });

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Job timeout')), this.jobTimeout)
      );

      const result = await Promise.race([
        job.processor(job.payload),
        timeoutPromise,
      ]);

      job.status = 'completed';
      job.result = result;
      this.completedJobs.set(job.id, job);
      this.activeJobs.delete(job.id);

      this.onProgress({ type: 'completed', jobId: job.id, result });
      job.onSuccess(result);
      this.onComplete({ jobId: job.id, result });
    } catch (error) {
      job.attempts += 1;

      if (job.attempts < this.retryAttempts) {
        job.status = 'queued';
        this.queue.unshift(job);
        this.onProgress({
          type: 'retrying',
          jobId: job.id,
          attempt: job.attempts,
          error: error.message,
        });
      } else {
        job.status = 'failed';
        job.error = error.message;
        this.failedJobs.set(job.id, job);
        this.activeJobs.delete(job.id);

        this.onProgress({ type: 'failed', jobId: job.id, error: error.message });
        job.onFailure(error);
        this.onError({ jobId: job.id, error: error.message, attempts: job.attempts });
      }
    }

    this.activeJobs.delete(job.id);
    await this._processQueue();
  }

  /**
   * Sort queue by priority (descending)
   * @private
   */
  _sortByPriority() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate unique job ID
   * @private
   */
  _generateId() {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get job status
   * @param {string} jobId - Job identifier
   * @returns {Object} Job status and metadata
   */
  getStatus(jobId) {
    if (this.activeJobs.has(jobId)) {
      return { status: 'processing', ...this.activeJobs.get(jobId) };
    }
    if (this.completedJobs.has(jobId)) {
      return { status: 'completed', ...this.completedJobs.get(jobId) };
    }
    if (this.failedJobs.has(jobId)) {
      return { status: 'failed', ...this.failedJobs.get(jobId) };
    }
    const queuedJob = this.queue.find(j => j.id === jobId);
    if (queuedJob) {
      return { status: 'queued', ...queuedJob };
    }
    return { status: 'not_found' };
  }

  /**
   * Get queue statistics
   * @returns {Object} Queue metrics
   */
  getStats() {
    return {
      queued: this.queue.length,
      processing: this.activeJobs.size,
      completed: this.completedJobs.size,
      failed: this.failedJobs.size,
      totalProcessed: this.completedJobs.size + this.failedJobs.size,
      successRate: this.completedJobs.size / (this.completedJobs.size + this.failedJobs.size) || 0,
    };
  }

  /**
   * Clear completed and failed jobs
   */
  clearHistory() {
    this.completedJobs.clear();
    this.failedJobs.clear();
  }

  /**
   * Pause queue processing
   */
  pause() {
    this.processing = false;
  }

  /**
   * Resume queue processing
   */
  resume() {
    this._processQueue();
  }

  /**
   * Cancel a specific job
   * @param {string} jobId - Job identifier
   * @returns {boolean} Whether job was cancelled
   */
  cancel(jobId) {
    const index = this.queue.findIndex(j => j.id === jobId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = CustomizationQueue;