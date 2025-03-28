import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CardDetail } from '../../../../models/CardDetail';

@Component({
  selector: 'app-number-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './number-card.component.html',
  styleUrl: './number-card.component.scss',
})
export class NumberCardComponent {
  @Input() details: CardDetail = { title: '', total: 0 };
}
