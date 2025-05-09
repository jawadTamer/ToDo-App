export interface todo {
  id?: number; // Optional, assigned by server
  email?: string; // Optional, added by server based on JWT
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  status: string;
  date: string;
}