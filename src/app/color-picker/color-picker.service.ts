import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ColorPickerService {
  private readonly _color = new BehaviorSubject<string>('#000000');

  readonly color$ = this._color.asObservable();

  set color(color: string) {
    this._color.next(color);
  }

  get color() {
    return this._color.getValue();
  }
}
