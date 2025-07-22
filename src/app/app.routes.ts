import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'commande',
        loadChildren: () => import('./features/commandes/commandes.routes').then(m => m.COMMANDES_ROUTES)
      },
      {
        path: 'gestion-stock',
        loadChildren: () => import('./features/gestion-stock/gestion-stock.routes').then(m => m.GESTION_STOCK_ROUTES)
      },
      {
        path: 'livraison',
        loadChildren: () => import('./features/livraison/livraison.routes').then(m => m.LIVRAISON_ROUTES)
      },
      {
        path: 'compte',
        loadChildren: () => import('./features/comptes/comptes.routes').then(m => m.COMPTES_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }

//   {
//     path: '**',
//     redirectTo: '/dashboard'
//   }
];