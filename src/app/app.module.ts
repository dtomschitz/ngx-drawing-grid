import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DrawingGridModule } from 'ngx-drawing-grid';
import { ColorPickerComponent, ColorPickerService } from './color-picker';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, ColorPickerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DrawingGridModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [ColorPickerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
