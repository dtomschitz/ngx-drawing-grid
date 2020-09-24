import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pixel, PixelIcon } from './models';

@Injectable({ providedIn: 'root' })
export class DrawingGridService {
  private readonly _isMouseLocked = new BehaviorSubject<boolean>(false);
  private readonly _pixels = new BehaviorSubject<Pixel[]>([]);

  readonly isMouseLocked$ = this._isMouseLocked.asObservable();
  readonly pixels$ = this._pixels.asObservable();

  lockMouse() {
    this.isMouseLocked = true;
  }

  releaseMouse() {
    this.isMouseLocked = false;
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
    const coordinates = id.split('-');
    return this.getPixel(+coordinates[1], +coordinates[0]);
  }

  private updatePixel(x: number, y: number, options?: { fillStyle?: string; icon?: PixelIcon }) {
    const id = `${y}-${x}`;
    const pixel = this.pixels.find((pixel) => pixel.id === id);

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
