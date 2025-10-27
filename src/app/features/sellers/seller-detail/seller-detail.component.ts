import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seller-detail',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './seller-detail.component.html',
  styleUrls: ['./seller-detail.component.css']
})
export class SellerDetailComponent {}


