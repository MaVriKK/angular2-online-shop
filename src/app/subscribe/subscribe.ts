import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscribeService } from './subscribeService';

@Component({
    selector: "subscribe-form",
    templateUrl: "./subscribe.html",
    providers: [SubscribeService]
})

export class SubscribeComponent implements OnInit, OnDestroy {
    public user: any;
    public resp: any;

    constructor(private subscribeService: SubscribeService) {
        this.user = {
            email: "",
            name: ""
        }
        this.resp = {
            msg: "",
            success: false
        }
    }

    subscribe() {
        let resp = this.resp;

        if (this.user.email && this.user.name) {
            //check if email valid
            if (this.validateEmail(this.user.email)) {
                //subscribe this bitch ass
                this.subscribeService.subscribe(this.user).then(function (data) {
                    if (data.result.inserted == 1) {
                        resp.success = true;
                        resp.msg = "Thanks for subscribing! :)"
                    } else if (data.result.errors == 1) {
                        if (data.result.first_error.indexOf("Duplicate") > -1) {
                            resp.msg = "You have already subscribed! Thanks!";
                            resp.success = true;
                        }
                    } else {
                        resp.msg = "Something is wrong, try again later! :("
                    }
                })

            } else {
                resp.msg = "email is not valid";
            }
        } else {
            resp.msg = "email & name are required";
        }

    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    validateEmail(email: any) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}