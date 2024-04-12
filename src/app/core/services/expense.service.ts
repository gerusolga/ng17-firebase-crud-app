import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {IExpense} from "../models/common.model";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expensesRef: AngularFireList<any>;
  private dbPath = '/expenses';

  constructor(private db: AngularFireDatabase) {
    this.expensesRef = db.list(this.dbPath);
  }

  getAllExpenses() {
    return this.expensesRef;
  }
getExpense(key: string) {
    return this.db.object(`${this.dbPath}/${key}`);
}
  addExpense(expense: IExpense) {
    this.expensesRef.push(expense);
  }
  updateExpense(key: string, expense: IExpense) {
    this.expensesRef.update(key, expense);
  }
  deleteExpense(key: string) {
    return this.expensesRef.remove(key);
  }
}
