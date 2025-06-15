interface RechargeData {
  phoneNumber: string;
  operator: string;
  amount: number;
  timestamp: number;
}

export class RechargeManager {
  private static RECENT_RECHARGES_KEY = 'recentRecharges';
  private static REPEAT_DELAY = 3 * 60 * 1000; // 3 minutes in milliseconds

  static canRepeatRecharge(phoneNumber: string): boolean {
    const recentRecharges = this.getRecentRecharges();
    const lastRecharge = recentRecharges.find(r => r.phoneNumber === phoneNumber);
    
    if (!lastRecharge) return true;
    
    const timeDiff = Date.now() - lastRecharge.timestamp;
    return timeDiff >= this.REPEAT_DELAY;
  }

  static getTimeUntilNextRecharge(phoneNumber: string): number {
    const recentRecharges = this.getRecentRecharges();
    const lastRecharge = recentRecharges.find(r => r.phoneNumber === phoneNumber);
    
    if (!lastRecharge) return 0;
    
    const timeDiff = Date.now() - lastRecharge.timestamp;
    return Math.max(0, this.REPEAT_DELAY - timeDiff);
  }

  static recordRecharge(phoneNumber: string, operator: string, amount: number): void {
    const recentRecharges = this.getRecentRecharges();
    const existingIndex = recentRecharges.findIndex(r => r.phoneNumber === phoneNumber);
    
    const rechargeData: RechargeData = {
      phoneNumber,
      operator,
      amount,
      timestamp: Date.now()
    };

    if (existingIndex >= 0) {
      recentRecharges[existingIndex] = rechargeData;
    } else {
      recentRecharges.unshift(rechargeData);
    }

    // Keep only last 10 recharges
    if (recentRecharges.length > 10) {
      recentRecharges.splice(10);
    }

    localStorage.setItem(this.RECENT_RECHARGES_KEY, JSON.stringify(recentRecharges));
  }

  private static getRecentRecharges(): RechargeData[] {
    const data = localStorage.getItem(this.RECENT_RECHARGES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getLastRecharge(): RechargeData | null {
    const recentRecharges = this.getRecentRecharges();
    return recentRecharges.length > 0 ? recentRecharges[0] : null;
  }
}
