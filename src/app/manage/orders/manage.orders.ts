import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ManageService } from '../manage.service';

@Component({
    selector: "manage-orders",
    templateUrl: "./manage.orders.html",
    providers: [ManageService]
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
    public auth : any;
    public orderList : any[];

    constructor(private manageService : ManageService) {
        this.auth = {
            authenticated: false
        }
        
    }

    onOrderStatus(order: any){
        console.log("onOrderStatus", order);
        order.newEmailBody = "<p>Your order status has been updated to " + order.status + ".</p></br></br> <p>Email sal@idea23.co or busgamer7394@idea23.co if you have any questions. TY! :D</p>";
    }

    sendEmail(order : any){
        this.manageService.sendEmail({to: order.payer.payer_info.email, subject: order.newEmailSubject, html: order.newEmailBody, orderID: order.id}).then(function(result){
            console.log("sendEmail.result", result);
            order.newEmailResult = result;
        });
    }

    updateOrderStatus(order : any) {
        this.manageService.updateOrderStatus(order.id, order.status).then(function(result){
            order.statusUpdateResult = result;
        })
    }

    keys(object : any) : Array<String> {
        return Object.keys(object);
    }

    ngOnInit() {
        this.orderList = [];
        this.manageService.checkAuth().then(p => {
            if(p.auth == true) {
                this.auth.authenticated = true;
                //get orders
                this.manageService.getOrders().then( (orders : any[]) => {
                    orders.forEach(order => {
                        order.newEmailSubject = "Order Update";
                        order.newEmailBody = "";
                    })
                    this.orderList = orders;
                })
            }
            else
                this.auth.authenticated = false;
        });
    }

    ngOnDestroy() {

    }
}