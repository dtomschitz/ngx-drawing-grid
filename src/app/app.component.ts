import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawingGridService, Pixel, PaintingMode } from 'drawing-grid';
import { ColorPickerService } from './color-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  width: number;
  height: number;
  nodeSize = 28;

  private paintingMode: PaintingMode;
  private color: string;

  constructor(
    private host: ElementRef,
    private gridService: DrawingGridService,
    private colorPickerService: ColorPickerService
  ) {}

  ngOnInit() {
    this.gridService.paintingMode$.pipe(takeUntil(this.destroy$)).subscribe((paintingMode) => {
      this.paintingMode = paintingMode;
    });

    this.colorPickerService.color$.pipe(takeUntil(this.destroy$)).subscribe((color) => {
      this.color = color;
    });

    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight - 64;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    this.fillPixel(pixel.x, pixel.y);
  }

  onMouseMove(pixel: Pixel) {
    this.fillPixel(pixel.x, pixel.y);
  }

  onMouseUp(pixel: Pixel) {}

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    if (this.paintingMode === PaintingMode.ERASE) {
      this.gridService.clearPixel(x, y);
      return;
    }

    this.gridService.fillPixel(x, y, this.color);
  }
}
