export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  permission?: string;
  children?: MenuItem[];
  sortOrder: number;
}
