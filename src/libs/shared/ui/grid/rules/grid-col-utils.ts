import { ColDef, ColGroupDef } from 'ag-grid-community';

export function getColField<T>(
  col: ColDef<T> | ColGroupDef<T>
): string | null {
  return (col as ColDef<T>).field ?? null;
}