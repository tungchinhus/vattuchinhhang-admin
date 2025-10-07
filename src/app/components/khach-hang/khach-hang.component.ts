import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-khach-hang',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './khach-hang.component.html',
  styleUrl: './khach-hang.component.css'
})
export class KhachHangComponent {
  title = 'Quản lý khách hàng';
  icon = 'people';
}
