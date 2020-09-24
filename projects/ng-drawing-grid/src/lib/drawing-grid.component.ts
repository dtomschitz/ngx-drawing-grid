import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DrawingGridService } from './drawing-grid.service';
import { Pixel } from './models';

@Component({
  selector: 'drawing-grid',
  templateUrl: './drawing-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingGridComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() width: number;
  @Input() height: number;
  @Input() xNodes: number;
  @Input() yNodes: number;
  @Input() pixelSize: number;
  @Input() disabled = false;

  @Output() mouseDown: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() mouseMove: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() mouseUp: EventEmitter<Pixel> = new EventEmitter<Pixel>();
  @Output() contextMenu: EventEmitter<Pixel> = new EventEmitter<Pixel>();

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

  renderingContext: CanvasRenderingContext2D;

  private paddingX: number;
  private paddingY: number;
  private paddingLeft: number;
  private paddingTop: number;
  private paddingRight: number;
  private paddingBottom: number;

  private isMouseLocked: boolean;
  private cachedPixel: Pixel;

  constructor(private gridService: DrawingGridService) {}

  ngOnInit() {
    this.gridService.isMouseLocked$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMouseLocked) => (this.isMouseLocked = isMouseLocked));

    this.gridService.pixels$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((pixels) => {
      if (pixels && this.renderingContext) {
        this.render(pixels);
      }
    });

    this.calculateGridSizes();
    this.gridService.pixels = this.generatePixels();
  }

  ngAfterViewInit() {
    this.renderingContext = this.canvasRef.nativeElement.getContext('2d');

    this.clearCanvas();
    this.renderGrid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.disabled) {
      this.mouseDown.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.disabled && this.isMouseLocked) {
      const pixel = this.getPixelAt(event.offsetX, event.offsetY);

      if (this.cachedPixel && this.cachedPixel.x === pixel.x && this.cachedPixel.y === pixel.y) {
        return;
      }

      this.cachedPixel = pixel;
      this.mouseMove.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onMouseUp(event: MouseEvent) {
    if (!this.disabled && this.isMouseLocked) {
      this.mouseUp.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (!this.disabled) {
      this.contextMenu.emit(this.getPixelAt(event.offsetX, event.offsetY));
    }
  }

  lockMouse(event: MouseEvent) {
    if (!this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.gridService.lockMouse();
    }
  }

  releaseMouse(event: MouseEvent) {
    if (!this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.gridService.releaseMouse();
    }
  }

  render(pixels: Pixel[]) {
    this.clearCanvas();

    ([] as Pixel[]).concat(...pixels).forEach((pixel) => {
      const { x, y } = pixel;
      if (pixel.fillStyle) {
        this.renderingContext.fillStyle = pixel.fillStyle;
        this.renderingContext.fillRect(
          x * this.pixelSize + this.paddingLeft,
          y * this.pixelSize + this.paddingTop,
          this.pixelSize,
          this.pixelSize
        );
      }

      if (pixel.icon) {
        const { fillStyle, scale, svg } = pixel.icon;
        const translatedX = x * this.pixelSize + this.paddingLeft;
        const translatedY = y * this.pixelSize + this.paddingTop;

        this.renderingContext.save();
        this.renderingContext.translate(translatedX + 4, translatedY + 4);
        this.renderingContext.fillStyle = fillStyle;
        this.renderingContext.scale(scale, scale);
        this.renderingContext.fill(new Path2D(svg));
        this.renderingContext.restore();
      }
    });

    this.renderGrid();
  }

  renderGrid() {
    this.renderingContext.strokeStyle = '#424242';
    this.renderingContext.beginPath();

    for (let x = this.paddingLeft; x <= this.width - this.paddingRight; x += this.pixelSize) {
      this.renderingContext.moveTo(x, this.paddingTop);
      this.renderingContext.lineTo(x, this.height - this.paddingBottom);
    }

    for (let y = this.paddingTop; y <= this.height - this.paddingBottom; y += this.pixelSize) {
      this.renderingContext.moveTo(this.paddingLeft, y);
      this.renderingContext.lineTo(this.width - this.paddingRight, y);
    }

    this.renderingContext.stroke();
  }

  clearCanvas() {
    this.renderingContext.clearRect(0, 0, this.width, this.height);
  }

  private calculateGridSizes() {
    this.paddingX = this.width - this.xNodes * this.pixelSize;
    this.paddingY = this.height - this.yNodes * this.pixelSize;
    this.paddingLeft = Math.ceil(this.paddingX / 3) - 0.5;
    this.paddingTop = Math.ceil(this.paddingY / 3) - 0.5;
    this.paddingRight = this.width - this.xNodes * this.pixelSize - this.paddingLeft;
    this.paddingBottom = this.height - this.yNodes * this.pixelSize - this.paddingTop;
  }

  private generatePixels() {
    const pixels: Pixel[] = [];
    let index = 0;
    for (let y = 0; y < this.yNodes; y++) {
      for (let x = 0; x < this.xNodes; x++) {
        pixels[index] = {
          id: `${y}-${x}`,
          x,
          y,
        };

        index++;
      }
    }

    return pixels;
  }

  private getPixelAt(x: number, y: number) {
    return this.gridService.getPixel(Math.floor(x / this.pixelSize), Math.floor(y / this.pixelSize));
  }
}
