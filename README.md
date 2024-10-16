## Freelance Studio

Этот проект представляет собой приложение Single Page Application (SPA), разработанное для внутренних операций фриланс-студии, позволяющее управлять задачами и заказами для команд.
Приложение позволяет пользователям создавать, обновлять и удалять задачи, заказы и сотрудников, при этом все действия аккуратно отображаются в календарном виде для лучшей организации.

Основные характеристики:
* Управление задачами : создание и управление задачами для сотрудников.
* Управление заказами : добавление, обновление и удаление заказов.
* Управление сотрудниками : добавление или удаление сотрудников из системы.
* Интеграция с календарем : визуальное представление всех задач и заказов в календаре для удобства отслеживания.
  
Используемые технологии:
* JavaScript (JS) : основная функциональность SPA.
* Webpack : сборщик модулей для оптимизации ресурсов и управления загрузкой модулей.
* HTML5/CSS3 : структура и стили интерфейса.
* Пользовательские компоненты : Архитектура повторно используемых компонентов.
* Маршрутизация : приложение реализует маршрутизацию, router.js обеспечивая плавные переходы между различными представлениями без перезагрузки страницы.
* AJAX : используется для связи с внутренними службами для асинхронного выполнения операций CRUD.
* API/библиотека календаря : интегрировано для визуального отображения задач и заказов в виде календаря.


## Установка и запуск проекта

Этот проект состоит из двух частей: backend и frontend. Следуйте инструкциям ниже, чтобы клонировать и развернуть проект в своей IDE.

### 1. Клонирование проекта

1. Скопируйте ссылку на репозиторий:  
   ```bash
   https://github.com/phoenix-intensive/freelance-studio-js.git
   ```

2. Откройте вашу IDE (например, WebStorm или VS Code) и выполните следующие шаги:
   - Создайте новый проект.
   - Выберите пункт "Project from Version Control" (или аналогичный в вашей IDE).
   - Вставьте скопированную ссылку в поле URL.
   - Клонируйте репозиторий на ваш локальный компьютер.

### 2. Установка и запуск backend

1. Откройте терминал в вашей IDE.
2. Перейдите в папку backend:
   ```bash
   cd backend
   ```
3. Установите все необходимые пакеты:
   ```bash
   npm install
   ```
4. Запустите сервер:
   ```bash
   npm start
   ```

### 3. Установка и запуск frontend

1. Откройте новый терминал в IDE.
2. Перейдите в папку frontend:
   ```bash
   cd frontend
   ```
3. Установите все необходимые пакеты:
   ```bash
   npm install
   ```
4. Запустите проект:
   ```bash
   npm run dev
   ```

Теперь ваш проект развернут и доступен для просмотра

### Примечания

- **Node.js**: убедитесь, что на вашем компьютере установлена актуальная версия Node.js и npm.
- **Frontend** будет доступен по адресу, указанному в терминале после выполнения команды `npm run dev`.
- **Backend** работает по адресу, указанному в терминале после выполнения команды `npm start`.
