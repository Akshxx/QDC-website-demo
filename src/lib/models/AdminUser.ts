export interface AdminUser {
  _id?: string;
  username: string;
  password: string; // Hashed password
  name?: string;
  email?: string;
  role?: string;
  createdAt?: Date;
  lastLogin?: Date;
}
