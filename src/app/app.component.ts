import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { DrawingGridService, Pixel } from 'drawing-grid';
import { PaintingMode } from 'projects/ng-drawing-grid/src/lib/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject<void>();

  width: number;
  height: number;
  nodeSize = 28;

  private paintingMode: PaintingMode;

  constructor(private host: ElementRef, private gridService: DrawingGridService) {}

  ngOnInit() {
    this.gridService.paintingMode$.pipe(takeUntil(this.destroy$)).subscribe((paintingMode) => {
      this.paintingMode = paintingMode;
    });

    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight - 64;
  }

  onMouseDown({ x, y }: Pixel) {
    this.fillPixel(x, y);
  }

  onMouseMove({ x, y }: Pixel) {
    this.fillPixel(x, y);
  }

  onMouseUp({ x, y }: Pixel) {}

  onContextMenu({ x, y }: Pixel) {
    this.gridService.clearPixel(x, y);
  }

  private fillPixel(x: number, y: number) {
    if (this.paintingMode === PaintingMode.ERASE) {
      this.gridService.clearPixel(x, y);
      return;
    }

    this.gridService.fillPixel(x, y, 'black');
  }
}
