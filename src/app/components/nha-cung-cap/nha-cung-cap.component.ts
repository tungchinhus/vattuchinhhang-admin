import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nha-cung-cap',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './nha-cung-cap.component.html',
  styleUrl: './nha-cung-cap.component.css'
})
export class NhaCungCapComponent {
  title = 'Quản lý nhà cung cấp';
  icon = 'business';
}
