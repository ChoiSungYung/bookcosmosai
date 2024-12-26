export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
} 