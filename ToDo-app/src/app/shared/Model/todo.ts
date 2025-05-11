export interface todo {
  id?: number;
  _id?: string;
  email?: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[] | string;
  status: string;
  date: string;
}
