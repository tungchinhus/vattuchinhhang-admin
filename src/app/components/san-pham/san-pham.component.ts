import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-san-pham',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="san-pham-container">
      <h1>Quản lý Sản phẩm</h1>
      <p>Chức năng quản lý sản phẩm đã được chuyển sang Forms Demo.</p>
      <a routerLink="/forms-demo" class="btn btn-primary">
        Truy cập Forms Demo
      </a>
    </div>
  `,
  styles: [`
    .san-pham-container {
      padding: 20px;
      text-align: center;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class SanPhamComponent implements OnInit {
  ngOnInit() {
    // Component đã được đơn giản hóa
  }
}