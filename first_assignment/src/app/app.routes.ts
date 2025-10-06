import { Routes } from '@angular/router';
import { Home } from './components/screen/home/home';
import { CardDetail } from './components/screen/card-detail/card-detail';
import { AddCard } from './components/screen/add-card/add-card';
import { routeGardGuard } from './components/secururity/route-gard-guard';
import { Login } from './components/forms/login/login';
import { TransacationList } from './components/screen/transacation-list/transacation-list';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: '', component: Home, canActivate: [routeGardGuard] },
  { path: 'transactions', component: TransacationList, canActivate: [routeGardGuard] },
  { path: 'card-detail', component: CardDetail, canActivate: [routeGardGuard] },
  { path: 'add-card', component: AddCard, canActivate: [routeGardGuard] },
];
