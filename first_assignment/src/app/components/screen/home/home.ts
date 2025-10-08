import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { CardService } from '../card-detail/card.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private cardService = inject(CardService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cards: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.cardService.getCards().subscribe({
      next: data => {
        this.cards = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading cards', err);
        this.error = 'Failed to load cards';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToDetails(cardNumber: string) {
    this.router.navigate(['/card-detail', cardNumber]);
  }

}
