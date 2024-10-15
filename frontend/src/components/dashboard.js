import {HttpUtils} from "../utils/http-utils.js";
import config from "../config/config.js";
import {OrdersService} from "../services/orders-service.js";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOrders().then();

    }

    async getOrders() {
        const response = await OrdersService.getOrders();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.loadOrdersInfo(response.orders);
        this.loadCalendarInfo(response.orders);
    }


    //Загружаем в дашборд-ячейки наше кол-во заказов и их статусы
    loadOrdersInfo(orders){
        document.getElementById('count-orders').innerText = orders.length;
        document.getElementById('done-orders').innerText = orders.filter(order => order.status === config.ordersStatuses.success).length;
        document.getElementById('in-progress-orders').innerText = orders.filter(order => [config.ordersStatuses.new,config.ordersStatuses.confirmed].includes(order.status)).length;
        document.getElementById('canceled-orders').innerText = orders.filter(order => order.status === config.ordersStatuses.canceled).length;
    }



    //Загружаем в ячейки календаря наши заказы и их статусы
    loadCalendarInfo(orders){

        const preparedEvents = [];

        //Подгружаем заказ который в статусе "Выполнения"
        for (let i = 0; i < orders.length; i++) {

            let color = null;
              if (orders[i].status === config.ordersStatuses.success) {
                  color = 'gray';
              }

            if (orders[i].scheduledDate) {
                const scheduledDate = new Date(orders[i].scheduledDate);
                preparedEvents.push({
                    title: orders[i].freelancer.name + ' ' + orders[i].freelancer.lastName + ' выполняет заказ ' + orders[i].number,
                    start: scheduledDate,
                    backgroundColor: color ? color : '#00c0ef', //Info (aqua)
                    borderColor: color ? color : '#00c0ef', //Info (aqua)
                    allDay: true
                });
        }

            if (orders[i].deadlineDate) {
                const deadlineDate = new Date(orders[i].deadlineDate);
                preparedEvents.push({
                    title: 'Дедлайн заказа ' + orders[i].number,
                    start: deadlineDate,
                    backgroundColor: color ? color : '#f39c12', //yellow
                    borderColor: color ? color : '#f39c12', //yellow
                    allDay: true
                });
            }

            if (orders[i].completeDate) {
                const completeDate = new Date(orders[i].completeDate);
                preparedEvents.push({
                    title: 'Заказ ' + orders[i].number + ' выполнен фрилансером ' + orders[i].freelancer.name,
                    start: completeDate,
                    backgroundColor: color ? color : '#00a65a', //Success (green)
                    borderColor: color ? color : '#00a65a', //Success (green)
                    allDay: true
                });
            }



        const calendarElement = document.getElementById('calendar');

        const calendar = new FullCalendar.Calendar(calendarElement, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },

            firstDay: 1,
            locale: 'ru',
            themeSystem: 'bootstrap',
            //Random default events
            events: preparedEvents,
        });

        calendar.render();
    }
    }
}