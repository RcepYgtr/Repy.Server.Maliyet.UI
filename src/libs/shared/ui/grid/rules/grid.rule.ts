import { GridState } from "../grid.state";
import { GridRuleResult } from "./grid-rule.result";


export interface GridRule<T extends { id: string | number }> {
  name: string;
  validate(state: GridState<T>, row: T): GridRuleResult[];
}
