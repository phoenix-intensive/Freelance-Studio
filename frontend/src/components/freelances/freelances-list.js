import {HttpUtils} from "../../utils/http-utils.js";
import {AuthUtils} from "../../utils/auth-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancesList {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        this.getFreelancers().then();
    }

    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.freelancers);
    }

    showRecords(freelancers) {
        const recordsElement = document.getElementById('records');

        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            //Вставляем ячейки-столбцы в строку
            trElement.insertCell().innerText = i + 1;//(Первый столбец-ячейка) - Нумерация
            trElement.insertCell().innerHTML = freelancers[i].avatar ? '<img class="freelancer-avatar" src = "' + config.host + freelancers[i].avatar + '" alt="User Image">' : '';//(Второй столбец-ячейка) - Фото
            trElement.insertCell().innerText = freelancers[i].name + ' ' + freelancers[i].lastName;//(Третий столбец-ячейка) - ФИО
            trElement.insertCell().innerText = freelancers[i].email;//(Четвертый столбец-ячейка) - Емайл

            //(Пятый столбец-ячейка) - Уровень
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[i].level);

            trElement.insertCell().innerText = freelancers[i].education;//(Шестой столбец-ячейка) - Образование
            trElement.insertCell().innerText = freelancers[i].location;//(Седьмой столбец-ячейка) - Локация
            trElement.insertCell().innerText = freelancers[i].skills;//(Восьмой столбец-ячейка) - Навыки

            //(Девятый столбец-ячейка) - Ссылки (Просмотр, редактирование, удаление)
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('freelancers', freelancers[i].id);
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