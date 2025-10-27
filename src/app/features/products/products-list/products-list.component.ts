import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAdvancedService } from '../../../services/product-advanced.service';
import { ProductDoc } from '../../../models/product-advanced.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: ProductDoc[] = [];
  loading = false;

  constructor(private productsService: ProductAdvancedService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      this.products = await this.productsService.listProducts(50);
    } finally {
      this.loading = false;
    }
  }
}


