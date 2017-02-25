import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ThankYouService } from './thankyou.service';
import { CartService } from '../cart/cart.service';

@Component({
    selector: "thankyou-form",
    templateUrl: './thankyou.html',
    providers: [ThankYouService, CartService]
})

export class ThankYouComponent implements OnInit, OnDestroy {
    total : number;
    order : any;
    private sub : any;
    public errorFlag : boolean;


    constructor(private route: ActivatedRoute, private router: Router, private thankyouService : ThankYouService, private cartService : CartService){
        this.order = {};
        this.errorFlag = false;
    }

    keys(object : any) : Array<String> {
        return Object.keys(object);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let paymentId = params['paymentId']; // (+) converts string 'id' to a number
            console.log("init.paymentId", paymentId);

            if(paymentId != "error"){
                this.thankyouService.getProductList(paymentId).then(result => {
                    if(result.error && result.error == true){
                        //let them know hey bitch this fucking data is not found
                        console.log("error", true);
                    } else {
                        //then we are good present them the data muthefucker
                        //filter
                        //for every order item get some more detail
                        if(result.emptyCart){
                            this.cartService.clearCart();
                        }

                        let product_list_mapped = {};
                        //format product list...
                        result.product_list.forEach( (product, index) => {
                            Object.keys(product).forEach( (productKey, pIndex) => {
                                product[productKey].dimensionID = Object.keys(product[productKey].dimensions)[0];
                                product_list_mapped[productKey] = product[productKey];
                            })
                        })
                        console.log("thankyouService.getProductList.product_list_mapped", product_list_mapped);
                        
                        result.product_list_mapped = product_list_mapped;

                        this.order = result;
                        console.log("thankyouService.getProductList.result", result);
                    }
                })
                this.errorFlag = false;
            } else {
                this.errorFlag = true;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onItemLoad(item : any){
        console.log("onItemLoad", item);
    }
}