import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderFormData, OrderStatus, ORDER_STATUS_DISPLAY_NAMES, OrderProduct } from '../../models/order.model';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #orderForm="ngForm" class="order-form">
      <div class="form-row">
        <div class="form-group">
          <label for="buyerId">Người mua *</label>
          <select 
            id="buyerId" 
            name="buyerId" 
            [(ngModel)]="formData.buyerId" 
            required 
            class="form-control">
            <option value="">Chọn người mua</option>
            <option *ngFor="let buyer of buyers" [value]="buyer.id">
              {{ buyer.name }} ({{ buyer.email }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="sellerId">Người bán *</label>
          <select 
            id="sellerId" 
            name="sellerId" 
            [(ngModel)]="formData.sellerId" 
            required 
            class="form-control">
            <option value="">Chọn người bán</option>
            <option *ngFor="let seller of sellers" [value]="seller.id">
              {{ seller.name }} ({{ seller.email }})
            </option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="status">Trạng thái đơn hàng *</label>
        <select 
          id="status" 
          name="status" 
          [(ngModel)]="formData.status" 
          required 
          class="form-control">
          <option *ngFor="let status of orderStatuses" [value]="status">
            {{ ORDER_STATUS_DISPLAY_NAMES[status] }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Sản phẩm trong đơn hàng</label>
        <div class="products-section">
          <div *ngFor="let product of formData.products; let i = index" class="product-item">
            <div class="product-row">
              <div class="form-group">
                <label>Sản phẩm</label>
                <select 
                  [(ngModel)]="product.productId" 
                  name="productId_{{i}}"
                  class="form-control"
                  (change)="updateProductPrice(i)">
                  <option value="">Chọn sản phẩm</option>
                  <option *ngFor="let prod of availableProducts" [value]="prod.id">
                    {{ prod.name }} - {{ prod.price | currency:'VND':'symbol':'1.0-0':'vi' }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Số lượng</label>
                <input 
                  type="number" 
                  [(ngModel)]="product.quantity" 
                  name="quantity_{{i}}"
                  min="1"
                  class="form-control"
                  (change)="updateProductPrice(i)">
              </div>

              <div class="form-group">
                <label>Giá</label>
                <input 
                  type="number" 
                  [(ngModel)]="product.price" 
                  name="price_{{i}}"
                  min="0"
                  step="1000"
                  class="form-control">
              </div>

              <button type="button" (click)="removeProduct(i)" class="remove-btn">×</button>
            </div>
          </div>
          
          <button type="button" (click)="addProduct()" class="btn btn-outline">
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="totalAmount">Tổng tiền</label>
        <input 
          type="number" 
          id="totalAmount" 
          name="totalAmount" 
          [(ngModel)]="formData.totalAmount" 
          readonly
          class="form-control total-amount">
      </div>

      <div class="form-actions">
        <button type="button" (click)="onCancel()" class="btn btn-secondary">
          Hủy
        </button>
        <button type="submit" [disabled]="!orderForm.form.valid || isLoading" class="btn btn-primary">
          {{ isLoading ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .order-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .total-amount {
      background-color: #f8f9fa;
      font-weight: bold;
      font-size: 16px;
    }

    .products-section {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      background-color: #f8f9fa;
    }

    .product-item {
      margin-bottom: 15px;
      padding: 10px;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .product-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 15px;
      align-items: end;
    }

    .remove-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background-color: #c82333;
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid #007bff;
      color: #007bff;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-outline:hover {
      background-color: #007bff;
      color: white;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class OrderFormComponent implements OnInit {
  @Input() initialData: Partial<OrderFormData> = {};
  @Input() buyers: User[] = [];
  @Input() sellers: User[] = [];
  @Input() products: Product[] = [];
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<OrderFormData>();
  @Output() formCancel = new EventEmitter<void>();

  formData: OrderFormData = {
    buyerId: '',
    sellerId: '',
    products: [],
    totalAmount: 0,
    status: OrderStatus.PENDING
  };

  orderStatuses = Object.values(OrderStatus);
  ORDER_STATUS_DISPLAY_NAMES = ORDER_STATUS_DISPLAY_NAMES;

  ngOnInit() {
    if (this.initialData) {
      this.formData = { ...this.formData, ...this.initialData };
    }
    if (this.formData.products.length === 0) {
      this.addProduct();
    }
  }

  get availableProducts(): Product[] {
    return this.products.filter(p => p.status === 'approved');
  }

  addProduct() {
    this.formData.products.push({
      productId: '',
      quantity: 1,
      price: 0
    });
  }

  removeProduct(index: number) {
    this.formData.products.splice(index, 1);
    this.calculateTotal();
  }

  updateProductPrice(index: number) {
    const product = this.formData.products[index];
    if (product.productId) {
      const selectedProduct = this.products.find(p => p.id === product.productId);
      if (selectedProduct) {
        product.price = selectedProduct.price;
        this.calculateTotal();
      }
    }
  }

  calculateTotal() {
    this.formData.totalAmount = this.formData.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }

  onSubmit() {
    if (this.formData.buyerId && this.formData.sellerId && this.formData.products.length > 0) {
      this.calculateTotal();
      this.formSubmit.emit(this.formData);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
