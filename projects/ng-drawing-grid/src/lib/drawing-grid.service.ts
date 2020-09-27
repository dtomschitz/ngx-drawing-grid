import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaintingMode, Pixel, PixelIcon } from './models';

@Injectable({ providedIn: 'root' })
export class DrawingGridService {
  private readonly _isMouseLocked = new BehaviorSubject<boolean>(false);
  private readonly _paintingMode = new BehaviorSubject<PaintingMode>(PaintingMode.CREATE);
  private readonly _pixels = new BehaviorSubject<Pixel[]>([]);

  readonly isMouseLocked$ = this._isMouseLocked.asObservable();
  readonly paintingMode$ = this._paintingMode.asObservable();
  readonly pixels$ = this._pixels.asObservable();

  lockMouse() {
    this.isMouseLocked = true;
  }

  releaseMouse() {
    this.isMouseLocked = false;
  }

  setPaintingMode(mode: PaintingMode) {
    this._paintingMode.next(mode);
  }

  renderPixel(x: number, y: number, options?: { fillStyle?: string; icon?: PixelIcon }) {
    this.updatePixel(x, y, {
      ...options,
    });
  }

  fillPixel(x: number, y: number, fillStyle: string) {
    this.updatePixel(x, y, { fillStyle });
  }

  clearPixel(x: number, y: number) {
    this.updatePixel(x, y, { fillStyle: undefined, icon: undefined });
  }

  getPixel(x: number, y: number) {
    return this.pixels.find((pixel) => pixel.x === x && pixel.y === y);
  }

  getPixelById(id: string) {
    return this.pixels.find((pixel) => (pixel.id = id));
  }

  private updatePixel(x: number, y: number, options?: { fillStyle?: string; icon?: PixelIcon }) {
    const pixel = this.getPixelById(`${y}-${x}`);

    if (pixel) {
      if (pixel.fillStyle === options.fillStyle) {
        return;
      }

      const index = this.pixels.indexOf(pixel);
      this.pixels[index] = {
        ...pixel,
        ...options,
      };
      this.pixels = [...this.pixels];
    }
  }

  get isMouseLocked(): boolean {
    return this._isMouseLocked.getValue();
  }

  set isMouseLocked(isMouseLocked: boolean) {
    this._isMouseLocked.next(isMouseLocked);
  }

  get pixels(): Pixel[] {
    return this._pixels.getValue();
  }

  set pixels(pixels: Pixel[]) {
    this._pixels.next(pixels);
  }
}
