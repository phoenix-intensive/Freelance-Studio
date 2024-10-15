import {HttpUtils} from "../../utils/http-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Достаем id пользователя из url адреса
        const id = UrlUtils.Order('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteOrder(id).then();
    }


    async deleteOrder(id) {
        //request
        const response = await OrdersService.deleteOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return this.openNewRoute('/orders');
    }
}