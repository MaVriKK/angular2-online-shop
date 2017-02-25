import { Injectable, EventEmitter, Input, Output} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject }    from 'rxjs/Subject';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CartService {
    public cartCount = new Subject<number>();
    public cartCountNumber: number;

    constructor(private http : Http) {
        this.cartCountNumber = this.getCartCount();
    }

    getCart = function () {
        let cart : any;
        cart = localStorage.getItem("cartList");
        if (cart === null) {
            cart = [];
            localStorage.setItem("cartList", JSON.stringify(cart));
        } else {
            cart = JSON.parse(cart);
        }

        return cart;
    }

    saveCart = function(cart : any){
        localStorage.setItem('cartList', JSON.stringify(cart));
    }

    getCartCount = function() {
        let count = 0;
        let cart = this.getCart();

        cart.forEach( (e : any) => {
            count+=e.dimension.quantity;
        })

        return count;
    }

    addProduct = function (prod: any, dimension: any) {
        let cart = this.getCart();
        let inCart : boolean = false;
        dimension.quantity = 1;

        //search to see if this product id is already in cart
        cart.forEach( (e : any) => {
            if(e.id == prod.id){
                //check if this is the same dimension
                if(e.dimension.name == dimension.name){
                    inCart = true;
                    e.dimension.quantity++;
                }
            }
        })
        
        if(inCart == false)
            cart.push({ product: prod, dimension: dimension, id: prod.id });

        localStorage.setItem("cartList", JSON.stringify(cart));
        this.updateNavCount();
    }

    removeProduct = function (item: any) {
        let cart = this.getCart();
        cart.splice(cart.indexOf(item), 1);
        localStorage.setItem("cartList", JSON.stringify(cart));
        this.updateNavCount();
        return cart;
    }

    clearCart = function () {
        localStorage.setItem("cartList", JSON.stringify([]));
        this.updateNavCount();
        return this.getCart();
    }

    //using jquery
    updateNavCount = function () {
        document.getElementById("cartCount").innerText = this.getCartCount();
    }

    // Observable string streams
    countObservable$ = this.cartCount.asObservable();

    //doesn't seem to work to parent node
    announceCount(count: number) {
        console.log("announceCount", count);
        this.cartCount.next(count);
    }

    calculateTotal(){
        let total : number = 0;
        let cart = this.getCart();

        cart.forEach( (e : any) => {
            console.info("calculateTotal", e);
            total += parseFloat(e['dimension'].price) * parseInt(e['dimension'].quantity);
        });

        return total;
    }

    //checkout
    checkout(): Promise<string> {
        //if we even have shit in the cart
        if(this.getCart().length == 0)
            return null;
        //total
        let body = {total: parseFloat(this.calculateTotal().toString()).toFixed(2)};
        //set item array
        let items : any = [];
        let cart = this.getCart();
        cart.forEach( (e : any) => {
            items.push({
                'name':  e.dimension.optionName + ":" + e.dimension.id + ":" + e.dimension.name,
                'price': e.dimension.price.toString(),
                'description': e.product.details,
                'currency':'USD',
                'sku': e.product.id.toString(),
                'quantity':e.dimension.quantity.toString()
            });
        });
        body['items'] = items;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('/api/create', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        console.log("extractData", body);
        return body || {};
    }
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

}