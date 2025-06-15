
export class AuthManager {
  private static ADMIN_PHONE = "9789456787";
  private static ADMIN_PASSWORD = "abc@1234";
  private static ADMIN_SESSION_KEY = "adminSession";

  static validateAdmin(phone: string, password: string): boolean {
    return phone === this.ADMIN_PHONE && password === this.ADMIN_PASSWORD;
  }

  static setAdminSession(): void {
    localStorage.setItem(this.ADMIN_SESSION_KEY, "true");
  }

  static isAdminLoggedIn(): boolean {
    return localStorage.getItem(this.ADMIN_SESSION_KEY) === "true";
  }

  static clearAdminSession(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }
}
