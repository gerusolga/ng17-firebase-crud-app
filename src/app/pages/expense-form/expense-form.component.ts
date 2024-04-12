import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime} from "rxjs";
import {ExpenseService} from "../../core/services/expense.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IExpense} from "../../core/models/common.model";

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  expenseId = '';
  priceField = new FormControl('', [Validators.required]);
  titleField = new FormControl<string>('', [Validators.required]);
  descriptionField = new FormControl<string>('', [Validators.maxLength(255)]);

  constructor(private fb: FormBuilder, private expenseService: ExpenseService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.expenseForm = this.fb.group({
      price: this.priceField,
      title: this.titleField,
      description: this.descriptionField,
    });
    this.expenseForm.controls['price'].valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      console.log(1, value);
    });
    this.price.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      console.log(2, value);
    });
    this.priceField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      console.log(3, value);
    });
  }

  get price(): FormControl {
    return this.expenseForm.controls['price'] as FormControl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this.expenseId = params['id'];
          this.getExpense(this.expenseId);
        }
      }
    })
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      if (this.expenseId !== '') {
        this.expenseService.updateExpense(
          this.expenseId,
          this.expenseForm.value
        );
      } else {
        this.expenseService.addExpense(this.expenseForm.value);
      }

      this.router.navigate(['/']);
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  getExpense(key: string) {
    this.expenseService.getExpense(key).snapshotChanges().subscribe({
      next: (data) => {
        let expense = data.payload.toJSON() as IExpense;
        this.expenseForm.setValue(expense);
      }

    })
  }
}
