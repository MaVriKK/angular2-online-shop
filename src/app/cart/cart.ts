import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CartService } from './cart.service';

@Component({
    templateUrl: './cart.html',
    providers: [CartService]
})

export class CartComponent {
    cartList: Object[];
    total: number;
    loadingInterval: any;
    loadingColor: Array<any> = [];

    constructor(private cartService: CartService) {
        // console.debug("constructor", cartService.getCart());
        this.cartList = cartService.getCart();
        this.calculateTotal();

        //loading stuff
        this.loadingColor = [{}, {}, {}, {}];
        this.assignColors();
        this.loadingInterval = undefined;

        //this.showLoading();
    }

    calculateTotal() {
        this.total = this.cartService.calculateTotal();
    }

    adjustQuantity(item: any, increment: boolean) {
        if (increment && item.dimension.quantity <=3) {
            item.dimension.quantity++;
        } 
        else if (!increment) {
            if (item.dimension.quantity > 1)
                item.dimension.quantity--;
        }
        this.cartService.saveCart(this.cartList);
        this.calculateTotal();
    }

    removeItem(item: any) {
        this.cartList = this.cartService.removeProduct(item);
        this.calculateTotal();
    }

    removeAll() {
        this.cartList = this.cartService.clearCart();
        this.calculateTotal();
    }

    checkout() {
        this.showLoading();
        this.cartService.checkout().then((data: any) => { window.location.href = data.link });
    }

    showLoading() {
        this.loadingInterval = undefined; //incase its running
        this.loadingInterval = Observable.interval(1000);
        this.loadingInterval.subscribe((x: any) => {
            this.assignColors();
        });
    }

    assignColors() {
        //gens random rgb
        let randomColor = function () {
            var r = (Math.floor(Math.random() * 100) % 255);
            var g = (Math.floor(Math.random() * 100) % 255);
            var b = (Math.floor(Math.random() * 100) % 255);

            return "rgb(" + r + "," + g + "," + b + ")";
        }

        //generates 4 random colored squares
        this.loadingColor = this.loadingColor.map(x => {
            x = {
                'width': '50px',
                'height': '50px',
                'margin': '3px 3px 3px 3px',
                'background-color': randomColor()
            }

            return x;
        }, 0);
    }
}