import {FileUtils} from "../../utils/file-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service.js";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        //Достаем id пользователя из url адреса
        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }


        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        // The Calender
        this.scheduledDate = null;
        this.deadlinedDate = null;
        this.completedDate = null;


        this.findElements();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
        ];

        this.init(id).then();

    }


    findElements() {
        this.freelancersSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
    };


    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }


    async getOrder(id) {
        //request
        const response = await OrdersService.getOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        //freelancerOriginalData - изначальные данные фрилансера
        this.orderOriginalData = response.order;
        return response.order;
    }


    async getFreelancers(currentFreelancerId) {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }


        //Выводим всех фрилансеров в select - инпут(исполнитель)
        const freelancers = response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = freelancers[i].id;
            option.innerText = freelancers[i].name + ' ' + freelancers[i].lastName;
            if (currentFreelancerId === freelancers[i].id) {
                option.selected = true;
            }
            this.freelancersSelectElement.appendChild(option);
        }

        //Initialize Select2 Elements
        $(this.freelancersSelectElement).select2({
            theme: 'bootstrap4'
        });
    }


    showOrder(order) {
        const breadCrumbsElement = document.getElementById('breadcrumbs-order');
        breadCrumbsElement.href = '/orders/view?id=' + order.id;
        breadCrumbsElement.innerText = order.number;


        //Подгружаем инфу в ИНПУТЫ
        //Подгружаем Сумму заказа
        this.amountInputElement.value = order.amount;
        //Подгружаем описание заказа
        this.descriptionInputElement.value = order.description;
        //Подгружаем статус заказа в селект
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }

        const calendarOptions = {
            inline: true,
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        };


        // The Calender
        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });


        const calendarComplete = $('#calendar-complete');
        calendarComplete.datetimepicker(Object.assign({}, calendarOptions, {
            date: order.completeDate, buttons: {
                showClear: true
            }
        }));
        calendarComplete.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });


        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

    }


    async updateOrder(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            //Отредактированные данные заказа
            const changedData = {};

            //Поле суммы заказа
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }
            //Поле описания заказа
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }
            //Поле статуса заказа
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            //Поле исполнителя заказа
            if (this.freelancersSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancersSelectElement.value;
            }
            //Поле дат календарей
            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }


            if (this.completeDate || this.completeDate === false) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }


            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }

            //Object.keys(changedData) - проверит по ключам есть ли в объекте поля name, lastName ид, то есть проверка
            //что у нас объект не пустой!!! и только тогда отправляем запрос с изменениями на бэкенд!!!

            if (Object.keys(changedData).length > 0) {
                //request
                const response = await OrdersService.updateOrder(this.orderOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }

        }
    }
}