import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';

import { ManageService } from './manage.service';
import { ProductService } from '../product/product.service';
import { Product } from '../shared/product';
import { ProductOption } from '../shared/product-option';
import { Dimension } from '../shared/product-dimension';

@Component({
    selector: "manage-form",
    templateUrl: "./manage.html",
    providers: [ManageService, ProductService]
})

export class ManageComponent implements OnInit, OnDestroy {
    public auth : any;
    public productList : Product[];
    public productResult : any; //stores result by product id
    public email : any;

    constructor(private manageService : ManageService, private productService : ProductService, private route : ActivatedRoute){
        this.auth = {
            username: "",
            password: "",
            authenticated: false
        }

        this.email = {
            to: "",
            subject: "",
            body: "",
            result: ""
        }

        this.productResult = {};
    }

    logIn(){
        this.manageService.logIn(this.auth).then( p => {
            if(p.success && p.success == "true"){
                this.auth.authenticated = true; 
                this.productService.getProductList().then( (productList : Product[]) => {
                    console.log(productList);
                    this.productList = productList;
                });
            }
        });
    }

    sendEmail(){
        this.manageService.sendEmail(this.email).then(result => {
            console.log("manageService.sendEmail.result", result);
            this.email.result = result;
        })
    }

    ngOnInit() {
        this.manageService.checkAuth().then(p => {
            if(p.auth == true) {
                this.auth.authenticated = true;
                this.productService.getProductList().then( (productList : Product[]) => {
                    this.productList = productList;
                });
            }
            else 
                this.auth.authenticated = false;
        })
    }

    ngOnDestroy() {

    }
}