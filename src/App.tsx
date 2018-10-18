import * as React from 'react';
import './App.css';
import TodoInput from "./components/TodoInput"
import TodoItem from './components/TodoItem'
import 'normalize.css'
import './reset.css'
import * as Interface from './components/ALLInterface'
import UserDialog from './components/UserDialog'
import { getCurrentUser, signOut } from './components/leancloud'
import deepClone from './components/deepClone'


// export interface IProps {
// 	// name: string;
// 	// enthusiasmLevel?: number;
// }

import AV from './components/leancloud'
// 声明类型
const TodoFolder = AV.Object.extend('TodoFolder');
// 新建对象
const todoFolder = new TodoFolder();
// 设置名称
todoFolder.set('name', '工作');
// 设置优先级
todoFolder.set('priority', 1);
todoFolder.save().then((todo: any) => {
	console.log('objectId is ' + todo.id);
}, (error: any) => {
	console.error(error);
});



interface IState {
	newTodo: string;
	todoList: Interface.IlistItem[];
	user: {
		username: string,
		id: string
	}
}

class App extends React.Component<{}, IState> {
	constructor(props: any, state: object) {
		super(props, state)
		this.state = {
			newTodo: 'pleace input something',
			todoList: [],
			user: getCurrentUser() || {},
		}
	}

	// 监听回车键，添加待办事项到list
	public addTodo = (event: any): void => {
		this.state.todoList.push({
			id: idMaker(),
			title: event.target.value,
			status: null,
			deleted: false
		})
		this.setState({
			newTodo: '',
			todoList: this.state.todoList
		})
	}

	// 监听输入框改变
	public changeTitle = (event: any): void => {
		this.setState({
			newTodo: event.target.value,
			todoList: this.state.todoList
		})
	}

	// 标记是否完成
	public toggle = (e: any, todo: any): void => {
		todo.status = todo.status === 'completed' ? '' : 'completed'
		this.setState(this.state)
	}

	// 标记是否删除
	public delete = (event: any, todo: any): void => {
		todo.deleted = true
		this.setState(this.state)
	}

	// 登出
	public signOut = () => {
		signOut()
		const stateCopy = deepClone(this.state)
		stateCopy.user = {}
		this.setState(stateCopy)
	}

	// 注册or登录
	public onSignUpOrSignIn = (user: object) => {
		const stateCopy = deepClone(this.state)  // 用 JSON 深拷贝
		stateCopy.user = user
		this.setState(stateCopy)
	}

	public render() {
		const todos =
			this.state.todoList
				.filter((item: Interface.IlistItem, index) => !item.deleted)
				.map((item, index) => {
					return (
						<li key={item.id}>
							<TodoItem todo={item}
								onToggle={this.toggle}
								onDelete={this.delete}
							/>
						</li>
					)
				})
		return (
			<div className="App">
				<h1>{this.state.user.username || '我'}
					的待办
				{this.state.user.id ? <button onClick={this.signOut}>登出</button> : null}
				</h1>
				<div className="inputWrapper">
					<TodoInput content={this.state.newTodo}
						onChange={this.changeTitle}
						onSubmit={this.addTodo}
					/>
				</div>
				<ol className="todoList">
					{todos}
				</ol>
				{this.state.user.id ?
					null :
					<UserDialog
						onSignIn={this.onSignUpOrSignIn}
						onSignUp={this.onSignUpOrSignIn} />}
			</div>

		);
	}
}

export default App;


// id制造器
let id = 0
function idMaker() {
	id += 1
	return id
}
