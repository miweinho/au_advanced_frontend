import { Routes } from '@angular/router';
import { Home } from './components/screen/home/home';
import { CardDetail } from './components/screen/card-detail/card-detail';
import { AddCard } from './components/screen/add-card/add-card';
import { routeGuard } from './components/security/route-guard';
import { Login } from './components/forms/login/login';
import { TransacationList } from './components/screen/transacation-list/transacation-list';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: '', component: Home, canActivate: [routeGuard] },
  { path: 'transactions', component: TransacationList, canActivate: [routeGuard] },
  { path: 'card-detail', component: CardDetail, canActivate: [routeGuard] },
  { path: 'add-card', component: AddCard, canActivate: [routeGuard] },
];
