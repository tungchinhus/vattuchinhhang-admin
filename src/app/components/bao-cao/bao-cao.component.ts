import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bao-cao',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './bao-cao.component.html',
  styleUrl: './bao-cao.component.css'
})
export class BaoCaoComponent {
  title = 'Báo cáo';
  icon = 'analytics';
}
