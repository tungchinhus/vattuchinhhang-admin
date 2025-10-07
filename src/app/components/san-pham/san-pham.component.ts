import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { 
  Product, 
  ProductCategory, 
  ProductStatus, 
  ProductSpecification, 
  ProductFilter,
  ProductFormData,
  CATEGORY_DISPLAY_NAMES,
  STATUS_DISPLAY_NAMES 
} from '../../models/product.model';

@Component({
  selector: 'app-san-pham',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './san-pham.component.html',
  styleUrl: './san-pham.component.css'
})
export class SanPhamComponent implements OnInit {
  title = 'Quản lý sản phẩm';
  icon = 'inventory';

  // Data
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal(false);
  
  // Table
  displayedColumns: string[] = [
    'image', 'name', 'model', 'category', 'brand', 'price', 'stock', 'status', 'actions'
  ];
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  
  // Filter
  filterForm: FormGroup;
  searchTerm = signal('');
  
  // Dialog state
  isDialogOpen = signal(false);
  isEditMode = signal(false);
  currentProduct = signal<Product | null>(null);
  
  // Form
  productForm: FormGroup;
  
  // Enums for template
  categories = Object.values(ProductCategory);
  statuses = Object.values(ProductStatus);
  categoryDisplayNames = CATEGORY_DISPLAY_NAMES;
  statusDisplayNames = STATUS_DISPLAY_NAMES;
  
  // Sample data
  sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Máy lọc nước RO Karofi KAQ-L22',
      model: 'KAQ-L22',
      category: ProductCategory.WATER_FILTER_STANDING,
      brand: 'Karofi',
      price: 8500000,
      originalPrice: 9500000,
      description: 'Máy lọc nước RO Karofi KAQ-L22 với công nghệ lọc RO tiên tiến, đảm bảo nguồn nước sạch và an toàn cho gia đình.',
      specifications: [
        { name: 'Công suất lọc', value: '10-15 lít/giờ', unit: 'L/h' },
        { name: 'Số lõi lọc', value: '6', unit: 'lõi' },
        { name: 'Áp suất làm việc', value: '0.1-0.4', unit: 'MPa' },
        { name: 'Nhiệt độ nước', value: '5-40', unit: '°C' }
      ],
      features: [
        'Công nghệ RO tiên tiến',
        'Lõi lọc chính hãng',
        'Thiết kế sang trọng',
        'Dễ dàng thay lõi',
        'Bảo hành 36 tháng'
      ],
      images: ['assets/images/products/kaq-l22.jpg'],
      status: ProductStatus.ACTIVE,
      stock: 25,
      sku: 'KRF-KAQ-L22-001',
      warranty: '36 tháng',
      origin: 'Việt Nam',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['RO', 'Tủ đứng', 'Karofi'],
      isFeatured: true,
      isNew: false,
      discount: 10
    },
    {
      id: '2',
      name: 'Máy lọc nước nóng lạnh Hydro-ion Kiềm SA9 PREMIUM',
      model: 'SA9 PREMIUM',
      category: ProductCategory.HYDRO_ALKALINE,
      brand: 'Karofi',
      price: 12500000,
      originalPrice: 14000000,
      description: 'Máy lọc nước nóng lạnh Hydro-ion Kiềm SA9 PREMIUM với pH đa dạng: Dưỡng da ~5.5, Sống Khỏe ~8.5-9.5, Rửa Rau Quả ~10.5.',
      specifications: [
        { name: 'pH Dưỡng da', value: '5.5', unit: 'pH' },
        { name: 'pH Sống Khỏe', value: '8.5-9.5', unit: 'pH' },
        { name: 'pH Rửa Rau Quả', value: '10.5', unit: 'pH' },
        { name: 'Công suất nóng', value: '95', unit: '°C' },
        { name: 'Công suất lạnh', value: '5', unit: '°C' }
      ],
      features: [
        'Hydro-ion Kiềm đa pH',
        'Nước nóng lạnh',
        'Điện cực Titan phủ Bạch Kim',
        'Thiết kế cao cấp',
        'Bảo hành 36 tháng'
      ],
      images: ['assets/images/products/sa9-premium.jpg'],
      status: ProductStatus.ACTIVE,
      stock: 15,
      sku: 'KRF-SA9-PREMIUM-001',
      warranty: '36 tháng',
      origin: 'Việt Nam',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      tags: ['Hydro-ion', 'Kiềm', 'Nóng lạnh', 'Premium'],
      isFeatured: true,
      isNew: true,
      discount: 11
    },
    {
      id: '3',
      name: 'Máy lọc nước để gầm KAE-S68 PRO',
      model: 'KAE-S68 PRO',
      category: ProductCategory.WATER_FILTER_UNDER_SINK,
      brand: 'Karofi',
      price: 6800000,
      originalPrice: 7500000,
      description: 'Máy lọc nước để gầm KAE-S68 PRO với công nghệ Hydro-ion Kiềm, pH tới 9.0, thiết kế gọn gàng phù hợp để gầm tủ bếp.',
      specifications: [
        { name: 'pH Kiềm', value: '9.0', unit: 'pH' },
        { name: 'Công suất lọc', value: '8-12', unit: 'L/h' },
        { name: 'Kích thước', value: '350x200x400', unit: 'mm' },
        { name: 'Áp suất', value: '0.1-0.4', unit: 'MPa' }
      ],
      features: [
        'Hydro-ion Kiềm pH 9.0',
        'Thiết kế để gầm',
        'Tiết kiệm không gian',
        'Lõi lọc chất lượng cao',
        'Bảo hành 36 tháng'
      ],
      images: ['assets/images/products/kae-s68-pro.jpg'],
      status: ProductStatus.ACTIVE,
      stock: 30,
      sku: 'KRF-KAE-S68-PRO-001',
      warranty: '36 tháng',
      origin: 'Việt Nam',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      tags: ['Để gầm', 'Hydro-ion', 'Kiềm', 'Compact'],
      isFeatured: false,
      isNew: false,
      discount: 9
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      status: [''],
      brand: [''],
      priceMin: [''],
      priceMax: [''],
      isFeatured: [false],
      isNew: [false]
    });

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required]],
      category: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: [''],
      description: ['', [Validators.required]],
      specifications: this.fb.array([]),
      features: this.fb.array([]),
      images: this.fb.array([]),
      status: [ProductStatus.ACTIVE, [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.required]],
      warranty: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      tags: this.fb.array([]),
      isFeatured: [false],
      isNew: [false],
      discount: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFilterSubscription();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      this.products.set([...this.sampleProducts]);
      this.applyFilters();
      this.isLoading.set(false);
    }, 1000);
  }

  setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filter = this.filterForm.value;
    const search = this.searchTerm();
    
    let filtered = [...this.products()];
    
    // Search filter
    if (search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.model.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Category filter
    if (filter.category) {
      filtered = filtered.filter(product => product.category === filter.category);
    }
    
    // Status filter
    if (filter.status) {
      filtered = filtered.filter(product => product.status === filter.status);
    }
    
    // Brand filter
    if (filter.brand) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(filter.brand.toLowerCase())
      );
    }
    
    // Price range filter
    if (filter.priceMin) {
      filtered = filtered.filter(product => product.price >= filter.priceMin);
    }
    if (filter.priceMax) {
      filtered = filtered.filter(product => product.price <= filter.priceMax);
    }
    
    // Featured filter
    if (filter.isFeatured) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    
    // New filter
    if (filter.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }
    
    this.filteredProducts.set(filtered);
    this.totalItems = filtered.length;
    this.pageIndex = 0;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.searchTerm.set('');
    this.applyFilters();
  }

  openAddDialog(): void {
    this.isEditMode.set(false);
    this.currentProduct.set(null);
    this.productForm.reset();
    this.productForm.patchValue({
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: false
    });
    this.isDialogOpen.set(true);
  }

  openEditDialog(product: Product): void {
    this.isEditMode.set(true);
    this.currentProduct.set(product);
    this.productForm.patchValue(product);
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.currentProduct.set(null);
    this.productForm.reset();
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value as ProductFormData;
      
      if (this.isEditMode()) {
        // Update existing product
        const updatedProduct: Product = {
          ...this.currentProduct()!,
          ...formData,
          updatedAt: new Date()
        };
        
        const index = this.products().findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          const updatedProducts = [...this.products()];
          updatedProducts[index] = updatedProduct;
          this.products.set(updatedProducts);
        }
        
        this.snackBar.open('Cập nhật sản phẩm thành công!', 'Đóng', {
          duration: 3000
        });
      } else {
        // Add new product
        const newProduct: Product = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.products.set([...this.products(), newProduct]);
        
        this.snackBar.open('Thêm sản phẩm thành công!', 'Đóng', {
          duration: 3000
        });
      }
      
      this.applyFilters();
      this.closeDialog();
    } else {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc!', 'Đóng', {
        duration: 3000
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      const updatedProducts = this.products().filter(p => p.id !== product.id);
      this.products.set(updatedProducts);
      this.applyFilters();
      
      this.snackBar.open('Xóa sản phẩm thành công!', 'Đóng', {
        duration: 3000
      });
    }
  }

  toggleProductStatus(product: Product): void {
    const newStatus = product.status === ProductStatus.ACTIVE 
      ? ProductStatus.INACTIVE 
      : ProductStatus.ACTIVE;
    
    const updatedProduct = { ...product, status: newStatus, updatedAt: new Date() };
    const index = this.products().findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      const updatedProducts = [...this.products()];
      updatedProducts[index] = updatedProduct;
      this.products.set(updatedProducts);
      this.applyFilters();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : 'assets/images/products/no-image.svg';
  }

  getStatusColor(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.ACTIVE:
        return 'green';
      case ProductStatus.INACTIVE:
        return 'orange';
      case ProductStatus.OUT_OF_STOCK:
        return 'red';
      case ProductStatus.DISCONTINUED:
        return 'gray';
      default:
        return 'gray';
    }
  }

  getStockColor(stock: number): string {
    if (stock === 0) return 'red';
    if (stock < 10) return 'orange';
    return 'green';
  }

  getCategoryDisplayName(category: ProductCategory): string {
    return this.categoryDisplayNames[category] || category;
  }

  getStatusDisplayName(status: ProductStatus): string {
    return this.statusDisplayNames[status] || status;
  }
}
