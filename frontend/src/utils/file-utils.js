export class FileUtils {

    //Подключения скриптов
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            //script.onload - это функция вызовется тогда, когда наш скрипт успешно и полностью загрузиться на странице
            //script.onerror - это функция вызовется тогда, когда наш скрипт неуспешно загрузиться на странице
            script.onload = () => resolve('Script loaded: ' + src); //Промис скрипт завершился-загрузился на стр УСПЕШНО!
            script.onerror = () => reject(new Error('Script load error for: ' + src)); //Если Промис скрипт не завершился-не загрузился на стр НЕУСПЕШНО!
            //Добавляем нужную строку скриптов в конец body пример: <script src="../../plugins/datatables/jquery.dataTables.min.js"></script>
            document.body.appendChild(script);
        });
    }


    //Так же сделаем для подключения стилей
    static loadPageStyle(src, insertBeforeElement) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        //Добавляем нужную строку стилей в head перед  <link rel="stylesheet" href="/css/adminlte.min.css" id="adminlte_style">
        document.head.insertBefore(link, insertBeforeElement);
    }


    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); //Промис скрипт завершился-загрузился на стр УСПЕШНО!
            reader.onerror = () => reject(new Error('Error convert file')); //Если Промис скрипт не завершился-не загрузился на стр НЕУСПЕШНО!
        });
    }
}