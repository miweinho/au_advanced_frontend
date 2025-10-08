import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { CardService } from '../card-detail/card.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  private cardService = inject(CardService);
  private router = inject(Router);

  cards: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.cardService.getCards().subscribe({
      next: data => {
        this.cards = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading cards', err);
        this.error = 'Failed to load cards';
        this.loading = false;
      }
    });
  }

  goToDetails(cardNumber: string) {
    this.router.navigate(['/card-detail', cardNumber]);
  }

}
