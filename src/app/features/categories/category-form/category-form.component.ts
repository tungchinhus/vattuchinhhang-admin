import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageURL: [''],
      parentCategoryId: ['']
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value as any;
    await this.categoryService.createCategory({
      name: v.name,
      description: v.description || '',
      imageURL: v.imageURL || '',
      parentCategoryId: v.parentCategoryId || null
    } as any);
    this.form.reset();
  }
}


