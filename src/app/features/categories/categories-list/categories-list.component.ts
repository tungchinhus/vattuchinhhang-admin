import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

type CategoryNode = {
  id: string;
  name: string;
  description?: string;
  imageURL?: string;
  parentCategoryId?: string | null;
  children?: CategoryNode[];
};

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent {
  constructor(private categoryService: CategoryService) {}

  keyword = '';
  tree: CategoryNode[] = [];

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const items = await this.categoryService.listCategories();
    const filtered = this.keyword
      ? items.filter(x => (x.name || '').toLowerCase().includes(this.keyword.toLowerCase()))
      : items;
    const byParent: Record<string, CategoryNode[]> = {};
    const nodes: Record<string, CategoryNode> = {};
    for (const c of filtered) {
      const node: CategoryNode = { id: c.id!, name: (c as any).name, description: (c as any).description, imageURL: (c as any).imageURL, parentCategoryId: (c as any).parentCategoryId };
      nodes[node.id] = node;
      const parent = node.parentCategoryId || 'root';
      byParent[parent] = byParent[parent] || [];
      byParent[parent].push(node);
    }
    for (const id in nodes) {
      nodes[id].children = byParent[id] || [];
    }
    this.tree = byParent['root'] || [];
  }

  openCreate(): void {
    // Placeholder: navigate to create form route when available
    window.alert('Tạo danh mục: sẽ mở form ở bước sau');
  }

  edit(node: CategoryNode): void {
    window.alert('Sửa danh mục ' + node.name + ': sẽ mở form ở bước sau');
  }

  async remove(node: CategoryNode): Promise<void> {
    if (!confirm('Xóa danh mục ' + node.name + '?')) return;
    await this.categoryService.deleteCategory(node.id);
    await this.refresh();
  }
}


