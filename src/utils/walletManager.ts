export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export class WalletManager {
  private static WALLET_BALANCE_KEY = 'walletBalance';
  private static WALLET_TRANSACTIONS_KEY = 'walletTransactions';

  static getBalance(): number {
    const balance = localStorage.getItem(this.WALLET_BALANCE_KEY);
    return balance ? parseFloat(balance) : 0;
  }

  static setBalance(amount: number): void {
    localStorage.setItem(this.WALLET_BALANCE_KEY, amount.toString());
  }

  static addMoney(amount: number, description: string = 'Money Added'): WalletTransaction {
    const currentBalance = this.getBalance();
    const newBalance = currentBalance + amount;
    this.setBalance(newBalance);

    const transaction: WalletTransaction = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    this.addTransaction(transaction);
    return transaction;
  }

  static deductMoney(amount: number, description: string = 'Payment'): { success: boolean; transaction?: WalletTransaction; error?: string } {
    const currentBalance = this.getBalance();
    
    if (currentBalance < amount) {
      return { 
        success: false, 
        error: 'Insufficient balance' 
      };
    }

    const newBalance = currentBalance - amount;
    this.setBalance(newBalance);

    const transaction: WalletTransaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    this.addTransaction(transaction);
    return { success: true, transaction };
  }

  private static addTransaction(transaction: WalletTransaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }
    localStorage.setItem(this.WALLET_TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  static getTransactions(): WalletTransaction[] {
    const transactions = localStorage.getItem(this.WALLET_TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  }
}
