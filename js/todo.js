;(function (window) {
    const dbName = 'todos-vue';
    const Todo = {
        getAll () {
            const todos_json = window.localStorage.getItem(dbName) || '[]';
            try {
                return JSON.parse(todos_json);
            } catch (e) {
                return [];
            }
        },
        save (todos) {
            if (Object.prototype.toString.call(todos) !== '[object Array]')
                throw new Error('todos must be an Array!');
            window.localStorage.setItem(dbName, JSON.stringify(todos));
        }
    }
    window.Todo = Todo;
})(window)