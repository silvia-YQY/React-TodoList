import * as React from 'react';
import './UserDialog.css'
import { signUp } from './leancloud'

// export interface IProps {
// 	name: string;
// 	enthusiasmLevel?: number;
// }


export interface IState {
	selected: string;
	formData: {
		username: string,
		password: string,
	}
}


export default class UserDialog extends React.Component<{}, IState>{
	constructor(props: any) {
		super(props)
		this.state = {
			selected: 'signUp',
			formData: {
				username: '',
				password: '',
			}
		}
	}
	public switch = (e: any): void => {
		this.setState({
			selected: e.target.value
		})
	}
	public signUp = (e: any): void => {
		e.preventDefault()
		const { username, password } = this.state.formData
		const successFn = (user: string): void => {
			console.log(user)
		}
		const errorFn = (error: any) => {
			console.log(error)
		}
		signUp(username, password, successFn, errorFn)   // leancloud 注册
	}
	public signIn = (e: any): void => {
		console.log(1);
	}
	public changeFormData = (key: string, e: any): void => {
		// e.persist();
		const stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
		stateCopy.formData[key] = e.target.value
		this.setState(stateCopy)
	}
	public render() {
		const signUpForm = (
			<form className="signUp" onSubmit={this.signUp}> {/* 注册*/}
				<div className="row">
					<label>用户名</label>
					<input type="text" value={this.state.formData.username}
						onChange={this.changeFormData.bind(this, 'username')} />
				</div>
				<div className="row">
					<label>密码</label>
					<input type="password" value={this.state.formData.password}
						onChange={this.changeFormData.bind(this, 'password')} />
				</div>
				<div className="row actions">
					<button type="submit">注册</button>
				</div>
			</form>
		)
		const signInForm = (
			<form className="signIn" onSubmit={this.signIn}> {/* 登录*/}
				<div className="row">
					<label>用户名</label>
					<input type="text" value={this.state.formData.username}
						onChange={this.changeFormData.bind(this, 'username')} />
				</div>
				<div className="row">
					<label>密码</label>
					<input type="password" value={this.state.formData.password}
						onChange={this.changeFormData.bind(this, 'password')} />
				</div>
				<div className="row actions">
					<button type="submit">登录</button>
				</div>
			</form>
		)
		return (

			<div className="UserDialog-Wrapper">
				<div className="UserDialog">
					<nav>
						<label><input type="radio" value="signUp" onChange={this.switch} checked={this.state.selected === 'signUp'} /> 注册</label>
						<label><input type="radio" value="signIn" onChange={this.switch} checked={this.state.selected === 'signIn'} /> 登录</label>
					</nav>
					<div className="panes">
						{this.state.selected === 'signUp' ? signUpForm : signInForm}
						{/* {this.state.selected === 'signIn' ? signInForm : null} */}
					</div>
				</div>
			</div>
		)
	}
}