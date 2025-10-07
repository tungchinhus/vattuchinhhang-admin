import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-don-hang',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './don-hang.component.html',
  styleUrl: './don-hang.component.css'
})
export class DonHangComponent {
  title = 'Quản lý đơn hàng';
  icon = 'shopping_cart';
}
