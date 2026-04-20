export interface ToolbarBase {
  type: 'button' | 'dropdown' | 'separator' | 'page';
  title?: string;
  visible?: boolean;
}

export interface ToolbarButton extends ToolbarBase {
  type: 'button';
  key: string;
  icon: string;
  action: () => void;
  disabled?: () => void;
  label?: string;
}

export interface ToolbarDropdown extends ToolbarBase {
  type: 'dropdown';
  icon: string;
  items: ToolbarDropdownItem[];
}

export interface ToolbarDropdownItem {
  label: string;
  danger?: boolean;
   icon: string;
  action: () => void;
}

export interface ToolbarSeparator extends ToolbarBase {
  type: 'separator';
}

export interface ToolbarPageIndicator extends ToolbarBase {
  type: 'page';
  action: () => void;
}

export type ToolbarItem =
  | ToolbarButton
  | ToolbarDropdown
  | ToolbarSeparator
  | ToolbarPageIndicator;

export interface TableToolbar {
  left: ToolbarItem[];
  right: ToolbarItem[];
}
