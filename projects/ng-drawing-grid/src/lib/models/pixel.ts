import { PixelIcon } from './pixel-icon';

export interface Pixel {
  id: string;
  x: number;
  y: number;
  fillStyle?: string;
  icon?: PixelIcon;
}
