import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ProductService } from '../product/product.service';
import { Product } from '../shared/product';
import { ProductOption } from '../shared/product-option';
import { Dimension } from '../shared/product-dimension';

import { CartService } from '../cart/cart.service';

declare var $: any;

@Component({
    selector: "product-form",
    templateUrl: "./product.html",
    providers: [ProductService, CartService]
})

export class ProductComponent implements OnInit, OnDestroy, AfterViewInit {
    product: Product;
    productOptionsList : ProductOption[];
    selDimension: any;
    productImgList = [];
    selImage : any;
    cartCount: number;
    private sub: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ProductService,
        private cartService: CartService
    ) {
        //this.selDimension = new Dimension("", "", "", "", 0);
    }

    private genImgageList(p: Product) {
        this.productImgList = [];
        this.productImgList.push({index: 0, url: p.imgUrl, name: ''});

        Object.keys(p.options).forEach( (key, index) => {
             this.productImgList.push({index: index + 1, url: p.options[key].imgUrl, name: p.options[key].name});
        })
   
        this.selImage = this.productImgList[0];
    }

    private genProductOptionList(p : Product) {
        let productOptionList = [];

        Object.keys(p.options).forEach( (optionKey, index) => {
            let dimensions = [];

            p.options[optionKey]['key'] = optionKey;

            Object.keys(p.options[optionKey].dimensions).forEach( (dimKey, dimIndex) => {
                dimensions.push(p.options[optionKey].dimensions[dimKey])
            });

            p.options[optionKey]['dimensionsList'] = dimensions;

            productOptionList.push(p.options[optionKey]);
        });

        this.productOptionsList = productOptionList;

        console.log("genProductOptionList", this.productOptionsList);
    }

    cycleImg(previous: boolean){
        let nextIndex = 0;
        if(!previous) {
            nextIndex = this.selImage.index == this.productImgList.length -1 ? 0 : this.selImage.index + 1;
        } else {
            nextIndex = this.selImage.index <= 0 ? this.productImgList.length - 1 : this.selImage.index - 1;
        }
        this.selImage = this.productImgList[nextIndex];
    }

    keys(object : any) : Array<String> {
        return Object.keys(object);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = params['id']; // (+) converts string 'id' to a number
            this.service.getProductById(id)
                .then((p: Product) => {
                    this.product = p;
                    this.genImgageList(p);
                    this.genProductOptionList(p);
                    this.selDimension = this.productOptionsList[0]['dimensionsList'][0]; console.log(this.selDimension);
                });
        });
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onDimChange() {
        
    }

    processSelection() {
        console.log("processSelection", this.selDimension);
        this.cartService.addProduct(this.product, this.selDimension);
    }
}