import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isOpen = signal(true);
  private _isCollapsed = signal(false);

  isOpen = this._isOpen.asReadonly();
  isCollapsed = this._isCollapsed.asReadonly();

  mode() {
    return 'side';
  }

  toggle(): void {
    this._isOpen.update(value => !value);
  }

  toggleCollapse(): void {
    this._isCollapsed.update(value => !value);
  }

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  collapse(): void {
    this._isCollapsed.set(true);
  }

  expand(): void {
    this._isCollapsed.set(false);
  }
}
