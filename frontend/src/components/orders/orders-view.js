import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service";

export class OrdersView{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Достаем id пользователя из url адреса
        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        //Вставляем на кнопки Редактировать и Удалить фрилансера конкректный адрес
        document.getElementById('edit-link').href = '/orders/edit?id=' + id;
        document.getElementById('delete-link').href = '/orders/delete?id=' + id;


        this.getOrder(id).then();
    }


    async getOrder(id) {
        //request
        const response = await OrdersService.getOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOrder(response.order);
    }


    showOrder(order) {

        //В зависимости от статуса заказа подгружаем фон, иконку, имя статуса см, CommonUtils.getStatusInfo
        const statusInfo = CommonUtils.getStatusInfo(order.status);
        document.getElementById('order-status').classList.add('bg-' + statusInfo.color);
        document.getElementById('order-status-icon').classList.add('fa-' + statusInfo.icon);
        document.getElementById('order-status-value').innerText = statusInfo.name;

        //Подгружаем дату плана выполнения заказа на платформу
        if (order.scheduledDate) {
            const date = new Date(order.scheduledDate)
            document.getElementById('scheduled').innerText = date.toLocaleDateString('ru-RU');
        }

        //Подгружаем дату выполнения заказа на платформу
        document.getElementById('complete').innerText = (order.completeDate) ? (new Date ((order.completeDate)).toLocaleDateString('ru-RU')) : '(Заказ не выполнен)';

        //Подгружаем дату дедлайна заказа на платформу
        if (order.deadlineDate) {
            const date = new Date(order.deadlineDate)
            document.getElementById('deadline').innerText = date.toLocaleDateString('ru-RU');
        }

        //Подгружаем аватар фрилансера по нужному пути
        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        }

        //Подгружаем ФИО
        document.getElementById('freelancer-name').innerHTML = '<a href = "/freelancers/view?id=' + order.freelancer.id + '">' + order.freelancer.name + ' ' + order.freelancer.lastName + '</a>';

        //Подгружаем номер заказа
        document.getElementById('number').innerText = order.number;

        //Подгружаем описание заказа
        document.getElementById('description').innerText = order.description;

        //Подгружаем кто создал заказ
        document.getElementById('owner').innerText = order.owner.name + ' ' + order.owner.lastName;

        //Подгружаем cумму заказа
        document.getElementById('amount').innerText = order.amount;

        //Подгружаем дату создания заказа
        document.getElementById('created').innerText = (order.createdAt) ? (new Date ((order.createdAt)).toLocaleString('ru-RU')) : '';
    }
}