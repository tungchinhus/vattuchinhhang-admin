import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CombosService, ComboItemRef } from '../../../services/combos.service';

@Component({
  selector: 'app-combo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './combo-form.component.html',
  styleUrls: ['./combo-form.component.css']
})
export class ComboFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private combosService: CombosService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      imageURL: [''],
      products: this.fb.array<FormArray>([])
    });
  }

  get products() {
    return this.form.get('products') as unknown as FormArray;
  }

  addProduct(): void {
    const group = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    (this.products as any).push(group);
  }

  removeProduct(index: number): void {
    (this.products as any).removeAt(index);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as any;
    const items: ComboItemRef[] = (value.products || []).map((p: any) => ({ productId: p.productId, quantity: Number(p.quantity) }));
    await this.combosService.createCombo({
      name: value.name,
      description: value.description,
      products: items,
      price: Number(value.price),
      discountPrice: value.discountPrice != null ? Number(value.discountPrice) : null,
      imageURL: value.imageURL || ''
    });
    this.form.reset();
    while ((this.products as any).length > 0) (this.products as any).removeAt(0);
  }
}


