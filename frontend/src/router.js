import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout.js";
import {FreelancesList} from "./components/freelances/freelances-list.js";
import {FileUtils} from "./utils/file-utils.js";
import {FreelancesView} from "./components/freelances/freelances-view.js";
import {FreelancesCreate} from "./components/freelances/freelances-create.js";
import {FreelancesEdit} from "./components/freelances/freelances-edit.js";
import {FreelancesDelete} from "./components/freelances/freelances-delete.js";
import {OrdersList} from "./components/orders/orders-list.js";
import {OrdersView} from "./components/orders/orders-view.js";
import {OrdersCreate} from "./components/orders/orders-create.js";
import {OrdersEdit} from "./components/orders/orders-edit.js";
import {OrdersDelete} from "./components/orders/orders-delete.js";
import {AuthUtils} from "./utils/auth-utils.js";

export class Router {
    constructor() {

        this.titleElement = document.getElementById('title');
        this.contentElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');
        this.userName = null;


        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'fullcalendar.js',
                    'fullcalendar-local-ru.js'
                ],
                styles: [
                    'fullcalendar.css'
                ],
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    //Чтобы форма логина у нас была по центру, мы добавили этот класс, который взяли из верстки библиотеки(инспектор)
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                },
                styles: ['icheck-bootstrap.min.css'],
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    //Чтобы форма логина у нас была по центру, мы добавили этот класс, который взяли из верстки библиотеки(инспектор)
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers',
                title: 'Фрилансеры',
                filePathTemplate: '/templates/pages/freelances/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
            },
            {
                route: '/freelancers/view',
                title: 'Фрилансер',
                filePathTemplate: '/templates/pages/freelances/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers/create',
                title: 'Создание фрилансера',
                filePathTemplate: '/templates/pages/freelances/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesCreate(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js']
            },
            {
                route: '/freelancers/edit',
                title: 'Редактирование фрилансера',
                filePathTemplate: '/templates/pages/freelances/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesEdit(this.openNewRoute.bind(this));
                },
                scripts: ['bs-custom-file-input.min.js']
            },
            {
                route: '/freelancers/delete',
                load: () => {
                    new FreelancesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders',
                title: 'Заказы',
                filePathTemplate: '/templates/pages/orders/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersList(this.openNewRoute.bind(this));
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
            },
            {
                route: '/orders/view',
                title: 'Заказ',
                filePathTemplate: '/templates/pages/orders/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/orders/create',
                title: 'Создание заказа',
                filePathTemplate: '/templates/pages/orders/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersCreate(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js'
                ],
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
            },
            {
                route: '/orders/edit',
                title: 'Редактирование заказа',
                filePathTemplate: '/templates/pages/orders/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersEdit(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js'
                ],
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
            },
            {
                route: '/orders/delete',
                load: () => {
                    new OrdersDelete(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    initEvents() {
        //Когда пользователь первый раз загрузил приложение, весь контент на нашей странице загрузился, то вызываем функцию
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        //popstate - это специальное событие, когда URL меняется, когда мы перешли на какую-то другую страницу
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));
    }


    //Функционал async openNewRoute(url) переход на новую страницу!!! ВАЖНО!!! Без перезагрузки всего приложения!!!
    async openNewRoute(url) {
        //const currentRoute - старый url-роут
        const currentRoute = window.location.pathname;
        //history.pushState - новый url-роут
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }


    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }


    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => {
                return item.route === oldRoute;
            });
            //Удаляем стили в старом роуте при переходе новый роут
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    //Удаляем нужную строку стилей перед  <link rel="stylesheet" href="/css/adminlte.min.css" id="adminlte_style">
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }

            //Удаляем скрипты в старом роуте при переходе новый роут
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    //Удаляем нужную строку стилей перед  <link rel="stylesheet" href="/css/adminlte.min.css" id="adminlte_style">
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }


            if (currentRoute.unload && typeof currentRoute.unload === "function") {
                currentRoute.unload();
            }
        }


        //window.location.pathname этим методом находим что у нас находиться в URL после основного доменного имени/......, для того чтобы дальше понимать какой
        //router у нас открыт "/", "/login","/sign-up"  и тд
        const urlRoute = window.location.pathname;
        //Проходимся по всем роутам и ищем нужный роут исходя из того, какой сейчас у нас URL
        const newRoute = this.routes.find(item => {
            //в pathname у нас будет то, что находится в URL строке после основного доменного имени http://127.0.0.1:8080/pathname, pathname в нашем случае будет "/", "/login","/sign-up" и тд
            return item.route === urlRoute;
        });


        if (newRoute) {
            //Подключение стилей
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.adminLteStyleElement);
                });
            }


            //Подключение скриптов
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    //Чтобы скрипты загружались СТРОГО ПОСЛЕДОВАТЕЛЬНО и СИНХРОННО по очередности!!!! на страницу см. file-utils.js
                    //тк как библиотеки взаимосвязаны между собой, то они должны подгружаться СТРОГО ПОСЛЕДОВАТЕЛЬНО, иначе проект не будет работать!!!
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }


            if (newRoute.title) {
                //Заголовок страницы будет подгружаться нужный нам в зависимости от страницы
                this.titleElement.innerText = newRoute.title + ' | Freelance Studio';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentElement;
                if (newRoute.useLayout) {
                    this.contentElement.innerHTML =
                        await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');


                    //Подгружаем имя и фамилию админа в сайдбар
                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo && userInfo.name) {
                                this.userName = userInfo.name;
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName;


                    //Активация пунктов меню
                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML =
                    await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }
        } else {
            //Если открылась не найденная страница, то отправим польз на 404 страницу
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }


    //Активация пунктов меню
    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');

            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }
}