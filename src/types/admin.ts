export interface Admin {
  _id: string;
  username: string;
  name?: string | null;
  email?: string | null;
  role: string;
  lastLogin?: string | null;
}

export interface QuickStatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  positive: boolean | null;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  color?: string;
  delay?: number;
  href?: string;
}

export interface AdminFormData {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}
