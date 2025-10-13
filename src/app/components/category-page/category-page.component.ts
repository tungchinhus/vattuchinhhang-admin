import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/product.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  template: `
  <div class="p-4">
    <h2>{{ category?.name || 'Danh mục' }}</h2>
    <div style="margin:8px 0;">{{ category?.description }}</div>
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
      <div class="card" *ngFor="let p of products" style="border:1px solid #eee; border-radius:8px; padding:12px;">
        <div style="font-weight:600;">{{ p.name }}</div>
        <div style="color:#d32f2f;">{{ p.price | number }} đ</div>
        <div style="font-size:12px; color:#666;">{{ p.shortDescription }}</div>
      </div>
    </div>
  </div>
  `,
})
export class CategoryPageComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];

  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.category = await this.categoryService.getCategoryBySlug(slug);
    if (this.category) {
      // naive approach: need product index; for demo we skip
      // In real app, maintain top-level collection/CF index; here we leave empty.
      this.products = [];
    }
  }
}


