import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CombosService, Combo } from '../../../services/combos.service';

@Component({
  selector: 'app-combos-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './combos-list.component.html',
  styleUrls: ['./combos-list.component.css']
})
export class CombosListComponent implements OnInit {
  combos: Combo[] = [];
  loading = false;

  constructor(private combosService: CombosService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      this.combos = await this.combosService.listCombos();
    } finally {
      this.loading = false;
    }
  }
}


