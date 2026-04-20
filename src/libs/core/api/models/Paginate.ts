export interface Paginate<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}