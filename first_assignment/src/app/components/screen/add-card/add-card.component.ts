import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  cardForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  apiUrl = 'https://assignment1.swafe.dk/api/CreditCard';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardHolder: ['', Validators.required],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(new Date().getFullYear())]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      issuer: ['',[Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.cardForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = '';
      return;
    }

    this.http.post(this.apiUrl, this.cardForm.value).subscribe({
      next: () => {
        this.successMessage = 'Card added successfully!';
        this.errorMessage = '';
        this.cardForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to add card. Please try again.';
        this.successMessage = '';
      },
    });
  }
}

