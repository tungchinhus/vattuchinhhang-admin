import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  template: `
  <div class="p-4" *ngIf="product">
    <h2>{{ product.name }}</h2>
    <div class="price" style="margin:8px 0; font-weight:600;">{{ product.price | number }} đ</div>
    <div style="display:flex; gap:24px;">
      <div class="images" style="flex:1;">
        <img *ngFor="let img of product.images" [src]="img" alt="image" style="max-width:160px; margin-right:8px;"/>
      </div>
      <div style="flex:1;">
        <div>{{ product.shortDescription }}</div>
      </div>
    </div>
    <mat-tab-group style="margin-top:16px;">
      <mat-tab label="Mô tả chi tiết">
        <div style="padding:12px; white-space:pre-wrap;">{{ product.fullDescription }}</div>
      </mat-tab>
      <mat-tab label="Thông số kỹ thuật">
        <div style="padding:12px;">
          <div *ngFor="let kv of specsEntries">
            <strong>{{ kv[0] }}:</strong> <span>{{ kv[1] }}</span>
          </div>
        </div>
      </mat-tab>
      <mat-tab label="Đánh giá">
        <div style="padding:12px;">(Danh sách đánh giá sẽ hiển thị ở đây)</div>
      </mat-tab>
    </mat-tab-group>
  </div>
  <div *ngIf="!product" class="p-4">Không tìm thấy sản phẩm</div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  specsEntries: Array<[string, any]> = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.product = await this.productService.getProductBySlug(slug);
    this.specsEntries = this.product?.specs ? Object.entries(this.product.specs) : [];
  }
}


