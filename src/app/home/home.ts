import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../shared/product';
import { ProductService } from '../product/product.service';
import { CartService } from '../cart/cart.service';

@Component({
    templateUrl: './home.html',
    providers: [ProductService, CartService]
})
export class HomeComponent implements OnInit {
    productList : Product[];

    constructor(private router : Router, private service : ProductService, private cartService : CartService){
        this.productList = [];
    }

    ngOnInit(){
       this.service.getProductList().then(productList => this.productList = productList);
       this.cartService.updateNavCount();
    }

    viewProduct(product: Product) {
        this.router.navigate(['/product', product.id]);
    }

    goToSubscribe(){
        this.router.navigate(['/subscribe']);
    }
}