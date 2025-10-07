import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-san-pham',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './san-pham.component.html',
  styleUrl: './san-pham.component.css'
})
export class SanPhamComponent {
  title = 'Quản lý sản phẩm';
  icon = 'inventory';
}
