import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StorageService } from '../../../services/storage.service';
import { CategoryService } from '../../../services/category.service';
import { ProductSimpleService } from '../../../services/product-simple.service';
import { ProductSimple } from '../../../models/product-simple.model';
import { Category } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  uploadedImages: { file: File; preview: string; url?: string }[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private categoryService: CategoryService,
    private productService: ProductSimpleService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      product_id: ['', Validators.required],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      base_price: [0, [Validators.required, Validators.min(0)]],
      stock_status: ['in_stock', Validators.required],
      is_published: [true],
      description: [''],
      short_description: [''],
      categories: this.fb.group({}), // Will be populated dynamically
      variants: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.categoryService.listCategories();
      
      // Initialize category form controls
      const categoryGroup = this.form.get('categories') as FormGroup;
      this.categories.forEach(cat => {
        categoryGroup.addControl(cat.id, this.fb.control(false));
      });
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showMessage('Không thể tải danh sách danh mục', 'error');
    }
  }

  // Variants management
  get variantsArray(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  addVariant(): void {
    const variantGroup = this.fb.group({
      sku: ['', Validators.required],
      size: ['', Validators.required],
      color: ['', Validators.required],
      price_adjustment: [0],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      final_price: [0, [Validators.required, Validators.min(0)]]
    });

    // Auto-calculate final_price when price_adjustment changes
    variantGroup.get('price_adjustment')?.valueChanges.subscribe(adjustment => {
      const basePrice = this.form.get('base_price')?.value || 0;
      variantGroup.get('final_price')?.setValue(basePrice + (adjustment || 0), { emitEvent: false });
    });

    this.variantsArray.push(variantGroup);
  }

  removeVariant(index: number): void {
    this.variantsArray.removeAt(index);
  }

  // Auto-update variant final prices when base price changes
  updateVariantPrices() {
    const basePrice = this.form.get('base_price')?.value || 0;
    this.variantsArray.controls.forEach(control => {
      const adjustment = control.get('price_adjustment')?.value || 0;
      control.get('final_price')?.setValue(basePrice + adjustment, { emitEvent: false });
    });
  }

  // Images management
  onImageSelected(event: any): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showMessage('Chỉ chấp nhận file hình ảnh', 'error');
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  setMainImage(index: number): void {
    // Move main image to first position
    const mainImage = this.uploadedImages.splice(index, 1)[0];
    this.uploadedImages.unshift(mainImage);
  }

  // Generate slug from name
  generateSlug(): void {
    const name = this.form.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      this.form.get('slug')?.setValue(slug);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    if (this.variantsArray.length === 0) {
      this.showMessage('Vui lòng thêm ít nhất một biến thể sản phẩm', 'error');
      return;
    }

    try {
      this.isUploading = true;

      // Upload images to Firebase Storage
      const imageUrls = await this.uploadImages();

      // Build category_refs object
      const categoryRefs: Record<string, boolean> = {};
      const categoriesControl = this.form.get('categories') as FormGroup;
      this.categories.forEach(cat => {
        if (categoriesControl.get(cat.id)?.value) {
          categoryRefs[cat.id] = true;
        }
      });

      // Build variants object
      const variantsObj: Record<string, any> = {};
      this.variantsArray.controls.forEach((control, index) => {
        const value = control.value;
        const variantId = value.sku || `variant_${index}`;
        variantsObj[variantId] = {
          sku: value.sku,
          size: value.size,
          color: value.color,
          price_adjustment: value.price_adjustment,
          stock_quantity: value.stock_quantity,
          final_price: value.final_price
        };
      });

      // Build images object
      const imagesObj: Record<string, any> = {};
      imageUrls.forEach((url, index) => {
        imagesObj[`img${index + 1}`] = {
          image_url: url,
          alt_text: `${this.form.get('name')?.value} - Hình ${index + 1}`,
          is_main: index === 0
        };
      });

      // Prepare product data
      const productData: Partial<ProductSimple> = {
        product_id: this.form.get('product_id')?.value,
        name: this.form.get('name')?.value,
        slug: this.form.get('slug')?.value,
        base_price: this.form.get('base_price')?.value,
        stock_status: this.form.get('stock_status')?.value,
        is_published: this.form.get('is_published')?.value,
        description: this.form.get('description')?.value,
        short_description: this.form.get('short_description')?.value,
        category_refs: categoryRefs,
        variants: variantsObj,
        images: imagesObj
      };

      // Save to Firestore
      console.log('Attempting to save product:', productData);
      const productId = await this.productService.createProduct(productData as any);
      console.log('Product saved with ID:', productId);
      
      this.showMessage(`Lưu sản phẩm thành công với ID: ${productId}`, 'success');
      
      // Reset form
      this.resetForm();

    } catch (error: any) {
      console.error('Error saving product:', error);
      let errorMessage = 'Có lỗi xảy ra khi lưu sản phẩm';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Không có quyền lưu sản phẩm. Vui lòng kiểm tra đăng nhập.';
      } else if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      this.showMessage(errorMessage, 'error');
    } finally {
      this.isUploading = false;
    }
  }

  private async uploadImages(): Promise<string[]> {
    if (this.uploadedImages.length === 0) return [];

    const productId = this.form.get('product_id')?.value || 'temp';
    const uploadPromises = this.uploadedImages.map(async (item, index) => {
      const fileName = `${productId}_${index + 1}_${item.file.name}`;
      return await this.storageService.uploadFile(item.file, 'products/images', fileName);
    });

    return Promise.all(uploadPromises);
  }

  private resetForm(): void {
    this.form.reset({
      base_price: 0,
      stock_status: 'in_stock',
      is_published: true
    });
    this.variantsArray.clear();
    this.uploadedImages = [];
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
