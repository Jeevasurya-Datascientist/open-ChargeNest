
import { OTPService } from "./otpService";

export class AuthManager {
  private static ADMIN_PHONES = ["9789456787", "9787579950"];
  private static ADMIN_PASSWORDS = {
    "9789456787": "admin@2007",
    "9787579950": "admin@1994"
  };
  private static ADMIN_SESSION_KEY = "adminSession";
  private static USER_SESSION_KEY = "userSession";

  // Simple encryption for demo purposes
  private static encryptPassword(password: string): string {
    return btoa(password + "greencharge_salt");
  }

  private static decryptPassword(encrypted: string): string {
    try {
      return atob(encrypted).replace("greencharge_salt", "");
    } catch {
      return "";
    }
  }

  static isAdminPhone(phone: string): boolean {
    return this.ADMIN_PHONES.includes(phone);
  }

  static validateAdmin(phone: string, password: string): boolean {
    const adminPassword = this.ADMIN_PASSWORDS[phone as keyof typeof this.ADMIN_PASSWORDS];
    return adminPassword !== undefined && password === adminPassword;
  }

  static addAdmin(phone: string, password: string): void {
    // This method should only be called after verifying the current user is an admin
    if (!this.ADMIN_PHONES.includes(phone)) {
      this.ADMIN_PHONES.push(phone);
    }
    // Overwrite password if phone already exists
    this.ADMIN_PASSWORDS = { ...this.ADMIN_PASSWORDS, [phone]: password };
  }

  static setAdminSession(phone: string): void {
    const encryptedData = this.encryptPassword(JSON.stringify({ phone, role: 'admin', timestamp: Date.now() }));
    localStorage.setItem(this.ADMIN_SESSION_KEY, encryptedData);
  }

  static setUserSession(phone: string): void {
    const userData = { phone, role: 'user', timestamp: Date.now() };
    localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(userData));
  }

  static isAdminLoggedIn(): boolean {
    const session = localStorage.getItem(this.ADMIN_SESSION_KEY);
    if (!session) return false;
    
    try {
      const decryptedData = this.decryptPassword(session);
      const data = JSON.parse(decryptedData);
      return data.role === 'admin' && this.ADMIN_PHONES.includes(data.phone);
    } catch {
      return false;
    }
  }

  static isUserLoggedIn(): boolean {
    const session = localStorage.getItem(this.USER_SESSION_KEY);
    if (!session) return false;
    
    try {
      const data = JSON.parse(session);
      return data.role === 'user';
    } catch {
      return false;
    }
  }

  static getCurrentUser(): { phone: string; role: string } | null {
    const adminSession = localStorage.getItem(this.ADMIN_SESSION_KEY);
    const userSession = localStorage.getItem(this.USER_SESSION_KEY);
    
    if (adminSession) {
      try {
        const decryptedData = this.decryptPassword(adminSession);
        const data = JSON.parse(decryptedData);
        return { phone: data.phone, role: 'admin' };
      } catch {
        return null;
      }
    }
    
    if (userSession) {
      try {
        const data = JSON.parse(userSession);
        return { phone: data.phone, role: 'user' };
      } catch {
        return null;
      }
    }
    
    return null;
  }

  static clearAdminSession(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  static clearUserSession(): void {
    localStorage.removeItem(this.USER_SESSION_KEY);
  }

  static clearAllSessions(): void {
    this.clearAdminSession();
    this.clearUserSession();
  }

  // Real OTP generation and validation using Twilio
  static async generateOTP(phone: string): Promise<{ success: boolean; error?: string }> {
    if (this.isAdminPhone(phone)) {
      return { success: true }; // Skip OTP for admins
    }
    return await OTPService.sendOTP(phone);
  }

  static async validateOTP(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
    return await OTPService.verifyOTP(phone, otp);
  }
}
