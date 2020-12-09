import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'


import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import { API } from '../../utils/api'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    inputChangeHandler({ target: { name, value}}) {
        this.setState({[name]: value})
    }

    async login() {
        const { username, password } = this.state

        const { status, body, description} = await API.post('/user/login', { username, password });

        if (status === 200) {

        } else Toast.fail(description)
    }

    submitHandler(e) {
        e.preventDefault();
        // const { username, password } = this.state

        this.login()
    }

    render() {
        const { username, password } = this.state

        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl" />

                {/* 登录表单 */}
                <WingBlank>
                    <form onSubmit={this.submitHandler.bind(this)}>
                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="username"
                                placeholder="请输入账号"
                                value={username}
                                onChange={this.inputChangeHandler.bind(this)}
                            />
                        </div>
                        {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                        {/* <div className={styles.error}>账号为必填项</div> */}
                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                                value={ password}
                                onChange={this.inputChangeHandler.bind(this)}
                            />
                        </div>
                        {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                        {/* <div className={styles.error}>账号为必填项</div> */}
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">登 录</button>
                        </div>
                    </form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/register">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

export default Login