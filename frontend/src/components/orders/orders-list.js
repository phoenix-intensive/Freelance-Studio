import {HttpUtils} from "../../utils/http-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FreelancersService} from "../../services/freelancers-service";
import {OrdersService} from "../../services/orders-service.js";

export class OrdersList {
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

        this.showRecords(response.orders);

    }

    showRecords(orders) {
        const recordsElement = document.getElementById('records');

        for (let i = 0; i < orders.length; i++) {
            const statusInfo = CommonUtils.getStatusInfo(orders[i].status);

            const trElement = document.createElement('tr');
            //Вставляем ячейки-столбцы в строку
            //(Первый столбец-ячейка) - Нумерация заказов
            trElement.insertCell().innerText = orders[i].number;
            //(Второй столбец-ячейка) - Автор(админ)
            trElement.insertCell().innerText = orders[i].owner.name + ' ' + orders[i].owner.lastName;
            //(Третий столбец-ячейка) - Исполнитель
            trElement.insertCell().innerHTML = '<a href = "/freelancers/view?id=' + orders[i].freelancer.id + '">' + orders[i].freelancer.name + ' ' + orders[i].freelancer.lastName + '</a>';
            //(Четвертый столбец-ячейка) - Запланировано до
            trElement.insertCell().innerText = (new Date(orders[i].scheduledDate)).toLocaleString('ru-RU');
            //(Пятый столбец-ячейка) - Дедлайн
            trElement.insertCell().innerText = (new Date(orders[i].deadlineDate)).toLocaleString('ru-RU');
            //(Шестой столбец-ячейка) - Статус заказа
            trElement.insertCell().innerHTML = '<span class="badge badge-' + statusInfo.color +'">'+ statusInfo.name +'</span>';
            //(Седьмой столбец-ячейка) - Дата выполнения
            trElement.insertCell().innerText = orders[i].completeDate ? (new Date(orders[i].completeDate)).toLocaleString('ru-RU') : '';
            //(Восьмой столбец-ячейка) - Ссылки (Просмотр, редактирование, удаление заказа)
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('orders', orders[i].id);
            recordsElement.appendChild(trElement);
        }

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next": "Вперед",
                    "previous": "Назад"
                },
            }
        });
    }
}