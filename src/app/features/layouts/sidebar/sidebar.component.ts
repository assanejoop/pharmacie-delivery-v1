import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() menuItemClicked = new EventEmitter<string>();
  
  activeItem: string = 'dashboard';

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', route: '/dashboard' },
    { id: 'commande', label: 'Commandes reçues', route: '/commande' },
    { id: 'gestion-stock', label: 'Gestion stock', route: '/gestion-stock' },
    { id: 'livraison', label: 'Livraisons', route: '/livraison' },
    { id: 'comptes', label: 'Mon compte', route: '/compte' }
  ];

  constructor(private router: Router) {}

  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.menuItemClicked.emit(itemId);
    
    // Navigation vers la route correspondante
    const menuItem = this.menuItems.find(item => item.id === itemId);
    if (menuItem && menuItem.route) {
      this.router.navigate([menuItem.route]);
    }
  }

  logout(): void {
    // Logique de déconnexion
    console.log('Déconnexion en cours...');
    
    // Effacer les données de session/token
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
    
    // Émettre un événement pour notifier le parent
    this.menuItemClicked.emit('logout');
  }

  // Méthode pour définir l'élément actif depuis le parent
  setActiveMenuItem(itemId: string): void {
    this.activeItem = itemId;
  }
}