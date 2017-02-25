import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Product } from '../shared/product';
import { ProductOption } from '../shared/product-option';
import { Dimension } from '../shared/product-dimension';

@Injectable()
export class ProductService {

    constructor(private http : Http) {}

    getProductList() :Promise<Product[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {get:"all"};

        return this.http.post('/api/product', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getProductById(id:number) : Promise<Product> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {get:"id", id: id};

        return this.http.post('/api/product', body, options)
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