import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Product } from '../shared/product';

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
export class ManageService {
    constructor(private http : Http){}

    logIn(auth : any) : Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = auth;

        return this.http.post('/api/loginAdmin', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    sendEmail(email : any) : Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = email;

        return this.http.post('/api/emailadmin', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    checkAuth() : Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.post('/api/auth', {}, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    removeProduct(product : Product) : Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = product;

        return this.http.post('/api/productRemove', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    saveProduct(product : Product) : Promise<any>{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = product;

        return this.http.post('/api/productSave', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    updateOrderStatus(orderID: String, status : String) : Promise<any>{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = {orderID: orderID, status: status};

        return this.http.post('/api/updateOrderStatus', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getOrders() : Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers: headers});

        return this.http.post('/api/getOrders', {}, options)
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