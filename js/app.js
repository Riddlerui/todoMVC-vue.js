;(function (Vue, window, Todo) {
	const app = new Vue({
		el: '#app',
		data:{
			currentEdit: null,
			// 数据
			todos: Todo.getAll(),
			routerPath: '',
			filterTodos: []
		},
		methods:{
			// 添加数据
			addTodo (e) {
				const title = e.target.value.trim(),
				todos = this.todos,
				lastItem = todos[todos.length - 1];
				if(title.length === 0) return;
				todos.push({
					id: lastItem ? lastItem.id + 1 : 1,
					title,
					done: false
				});
				e.target.value = '';
			},
			// 切换所有
			toggleAll (e) {
				const checked = e.target.checked;
				this.todos.forEach( t => t.done = checked );
			},
			deleteTodo (id) {
				// 根据id找到todo在todos中的索引
				// 然后根据索引在数据中删除一个数据
				// console.log(this);
				const todos = this.todos;
				const removeIndex = todos.findIndex(t => t.id === id);
				removeIndex !== -1 && todos.splice(removeIndex, 1);
			},
			// 获取当前编辑的内容
			getEditing (todo) {
				this.currentEdit = todo;
			},
			// 编辑
			editTodo (todo, e) {
				todo.title = e.target.value;
				this.cancelEdit();
			},
			// 取消编辑
			cancelEdit () {
				this.currentEdit = null;
			},
			// 清除已完成数据
			clearAllDone () {
				const todos = this.todos;
				let len = todos.length;
				for(let i = 0; i < len; i++){
					todos[i].done && (todos.splice(i, 1), i--, len--);
				}
			}
		},
		// 自定义指令
		directives: {
			// 添加获取焦点
			addFocus: {
				inserted (el, binding) {
					el.focus();
				}
			},
			editFocus: {
				update (el, binding) {
					if(binding.value){
						el.focus();
					}
				}
			}
		},
		// 监视 data 和 computed 成员
		watch: {
			todos:{
				handler () {
					Todo.save(this.todos);
					// 监视 hash 的变化
					getFilterTodosByHash();
				},
				deep: true
			}
		},
		computed: {
			// 没有完成的数量
			remainingCount () {
				return this.todos.filter(t => !t.done).length;
			},
			// 已完成数
			hasDone () {
				return this.todos.some(t => t.done);
			}
		}
	})

	// 1. 监视 hashchange 事件
	// 2. hash 改变, 拿到当前的 hash
	// 3. 根据不同的 hash 过滤显示不同的数据源

	function getFilterTodosByHash () {
		const hash = window.location.hash.substr(1);
		app.routerPath = hash;
		switch (hash) {
			case '/active':
				app.filterTodos = app.todos.filter(t => !t.done);
				break;
			case '/completed':
				app.filterTodos = app.todos.filter(t => t.done);
				break;
			default:
				app.routerPath = '/';
				app.filterTodos = app.todos;
				break;
		}
	}
	window.onhashchange = getFilterTodosByHash;
	getFilterTodosByHash();
})(Vue, window, Todo);
