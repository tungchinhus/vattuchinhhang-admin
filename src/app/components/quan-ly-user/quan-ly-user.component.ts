import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quan-ly-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './quan-ly-user.component.html',
  styleUrl: './quan-ly-user.component.css'
})
export class QuanLyUserComponent {
  title = 'Quản lý người dùng';
  icon = 'admin_panel_settings';
}
