import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav {}
