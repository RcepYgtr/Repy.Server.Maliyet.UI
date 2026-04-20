import { CellClassParams } from 'ag-grid-community';
import { getColField } from './grid-col-utils';

export function hasError(p: CellClassParams): boolean {
  const field = getColField(p.colDef);
  if (!field) return false;

  return p.context?.gridState?.hasError(p.data.id, field) ?? false;
}

export function hasWarning(p: CellClassParams): boolean {
  const field = getColField(p.colDef);
  if (!field) return false;

  return p.context?.gridState?.hasWarning(p.data.id, field) ?? false;
}

export function hasInfo(p: CellClassParams): boolean {
  const field = getColField(p.colDef);
  if (!field) return false;

  return p.context?.gridState?.hasInfo(p.data.id, field) ?? false;
}
