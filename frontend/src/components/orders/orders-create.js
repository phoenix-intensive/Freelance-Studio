import {HttpUtils} from "../../utils/http-utils.js";
import {FileUtils} from "../../utils/file-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";
import {OrdersService} from "../../services/orders-service.js";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));


        // The Calender
        this.scheduledDate = null;
        this.deadlineDate = null;
        this.completeDate = null;

        const calendarOptions = {
            inline: true,
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false
        };


        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
        });


        const calendarComplete = $('#calendar-complete');
        calendarOptions.buttons = {
            showClear: true,
        },
            calendarComplete.datetimepicker(calendarOptions);

        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
        });


        const calendarDeadline = $('#calendar-deadline');
        calendarOptions.buttons = {
            showClear: false,
        },
            calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });


        this.findElements();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}},
        ];

        this.getFreelancers().then();
    }


    findElements() {
        this.freelancersSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    };


    async getFreelancers() {
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
            this.freelancersSelectElement.appendChild(option);
        }

        //Initialize Select2 Elements
        $(this.freelancersSelectElement).select2({
            theme: 'bootstrap4'
        });
    }


    async saveOrder(e) {
        e.preventDefault();

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.scheduledCardElement) {
                this.validations[i].options.checkProperty = this.scheduledDate;
            } else if (this.validations[i].element === this.deadlineCardElement) {
                this.validations[i].options.checkProperty = this.deadlineDate;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {

            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancersSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value)
            };

            console.log(createData)
            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }


            //request
            const response = await OrdersService.createOrder(createData);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/orders/view?id=' + response.id);

        }
    }
}