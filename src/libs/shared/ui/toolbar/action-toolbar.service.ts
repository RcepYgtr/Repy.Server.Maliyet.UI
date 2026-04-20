import { Injectable } from "@angular/core";
import { ActionContext } from "./action-context";

@Injectable({ providedIn: 'root' })
export class ActionToolbarService {

  private addHandlers = new Map<string, (ctx: ActionContext) => void>();

  registerAdd(pageKey: string, handler: (ctx: ActionContext) => void) {
    this.addHandlers.set(pageKey, handler);
  }

  unregisterAdd(pageKey: string) {
    this.addHandlers.delete(pageKey);
  }

  handleAdd(ctx: ActionContext) {
    const handler = this.addHandlers.get(ctx.pageKey);
    if (!handler) {
      console.warn('ADD handler yok:', ctx.pageKey);
      return;
    }
    handler(ctx);
  }
}
