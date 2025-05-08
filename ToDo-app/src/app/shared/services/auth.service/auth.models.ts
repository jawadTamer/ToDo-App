// بيانات التسجيل (register)
export interface UserData {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  age: string;
}

// بيانات تسجيل الدخول (login)
export interface LoginPayload {
  email: string;
  password: string;
}

// الرد الراجع من السيرفر بعد register أو login
export interface AuthResponse {
  email: string;
  name: string;
  token: string;
  phone: string;
  age: string;
  address: string;
}
