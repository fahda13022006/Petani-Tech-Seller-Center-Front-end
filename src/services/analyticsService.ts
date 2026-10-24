import initialAnalytics from '@/mock/analytics.json';
import { AnalyticsSummary } from '@/types';
import { simulateDelay } from '@/api/client';

class AnalyticsService {
  async getAnalytics(): Promise<AnalyticsSummary> {
    await simulateDelay(250);
    return initialAnalytics as unknown as AnalyticsSummary;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
