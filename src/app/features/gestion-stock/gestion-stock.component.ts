import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'En stock' | 'Stock faible' | 'Rupture';
}

@Component({
  selector: 'app-gestion-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-stock.component.html',
  styleUrls: ['./gestion-stock.component.css']
})
export class GestionStockComponent implements OnInit {
  
  // Data properties
  products: Product[] = [
    {
      id: 1,
      name: 'Doliprane 1000mg',
      category: 'Antalgique',
      stock: 32,
      price: 2951,
      status: 'En stock'
    },
    {
      id: 2,
      name: 'Efferalgan 500mg',
      category: 'Antalgique',
      stock: 8,
      price: 2558,
      status: 'Stock faible'
    },
    {
      id: 3,
      name: 'Advil 200mg',
      category: 'Anti-inflammatoire',
      stock: 0,
      price: 3870,
      status: 'Rupture'
    },
    {
      id: 4,
      name: 'Smecta',
      category: 'Gastro-entérologie',
      stock: 15,
      price: 3148,
      status: 'En stock'
    },
    {
      id: 5,
      name: 'Imodium',
      category: 'Gastro-entérologie',
      stock: 22,
      price: 4066,
      status: 'En stock'
    },
    {
      id: 6,
      name: 'Vitamine C',
      category: 'Complément alimentaire',
      stock: 18,
      price: 5575,
      status: 'En stock'
    }
  ];

  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  
  // Search and filter properties
  searchTerm: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
    this.updatePagination();
  }

  // Search and filter methods
  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    
    this.paginatedProducts = this.filteredProducts.slice(startIdx, endIdx);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // Product management methods
  addProduct(): void {
    console.log('Ajouter un nouveau produit');
    // Logique pour ouvrir un modal ou naviguer vers une page d'ajout
  }

  editProduct(product: Product): void {
    console.log('Modifier le produit:', product);
    // Logique pour ouvrir un modal d'édition ou naviguer vers une page d'édition
  }

  deleteProduct(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.products = this.products.filter(p => p.id !== productId);
      this.filterProducts(); // Refresh the filtered list
      console.log('Produit supprimé:', productId);
    }
  }

  // Utility methods
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // Method to update stock status based on stock quantity
  updateStockStatus(product: Product): void {
    if (product.stock === 0) {
      product.status = 'Rupture';
    } else if (product.stock <= 10) {
      product.status = 'Stock faible';
    } else {
      product.status = 'En stock';
    }
  }

  // Method to get status color class
  getStatusColorClass(status: string): string {
    switch (status) {
      case 'En stock':
        return 'bg-green-100 text-green-800';
      case 'Stock faible':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rupture':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}