import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import {
    Col,
    Input,
    Button
} from 'antd'

import Container from '../components/layouts/Container'
import Row from '../components/layouts/Row'

const HomeRow = styled(Row)`
    width: 480px;
    padding: 2rem;
`

const Block = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.padding === false ? 0 : '0.75rem'};
`

const Title = styled.p`
    text-align: center;
    font-size: 1.5rem;
    margin: 10px;
    white-space: nowrap;
`

const Description = styled.p`
    text-align: center;
    font-size: 1rem;
    margin: 0;
    color: rgb(150, 150, 150);
`

const Error = styled.div`
    color: red;
`

const Label = styled.p`
    text-align: right;
    margin: 0;
    padding-right: 1rem;
    white-space: nowrap;
`

const Center = styled(Col)`
    text-align: center;
`

const StyledButton = styled(Button)`
    width: 130px;
`

function mapStateToProps(state) {
    return state
}

function Home(props) {
    const [username, setUsername] = useState(setInitialState('username'))
    const [password, setPassword] = useState(setInitialState('password'))
    const [loginButtonState, setLoginButtonState] = useState(setInitialState('loginButtonState'))

    const [isLoggedIn, setLoggedIn] = useState(setInitialState('isLoggedIn'))
    const [errorType, setErrorType] = useState(setInitialState('errorType'))
    const [urlToken, setUrlToken] = useState('')

    useEffect(() => {
        props.dispatch({
            type: 'SET_APP_CLASS',
            data: 'login'
        })

        setInitialState()
    }, [])

    useEffect(() => {
        if(username !== '' && password !== '') {
            setLoginButtonState('enable') // enable
        } else {
            setLoginButtonState(setInitialState('loginButtonState')) // disable
        }
    }, [username, password])

    useEffect(() => {
        if(isLoggedIn === true) {
            props.dispatch({
                type: 'SET_TOKEN',
                data: urlToken
            })
        }
    }, [isLoggedIn])

    function setInitialState(stateName) {
        switch (stateName) {
            case 'loginButtonState':
                return 'disable'

            case 'username':
                return props.username

            case 'password':
                return ''

            case 'isLoggedIn':
                return false

            case 'errorType':
                return 0

            default:
                break
        }
    }

    function usernameTrigger(event) {
        const value = event.target.value

        setUsername(value)
    }

    function passwordTrigger(event) {
        const value = event.target.value

        setPassword(value)
    }

    function handleKeyPress(event) {
        if(username !== '' && password !== '') {
            if (event.key === 'Enter') {
                if(loginButtonState === 'enable') {
                    authorizedVerification()
                }
            }
        }
    }

    function authorizedVerification() {
        setErrorType(setInitialState('errorType')) // Remove any error notification
        setLoginButtonState('loading') // disable + loading
        axios.post(`${props.url}/authenticate`, {
            username: username,
            password: password
        })
        .then(res => {
            const response = res.data

            switch (response.code) {
                case '00200':
                    // console.log('Authenticated')
                    // console.log(response)
                    // check token is expired
                    axios.get(`${props.url}/token/verify/${username}/${password}`, {
                        headers: {
                            'authorization': response.token
                        }
                    })
                    .then(res => {
                        // console.log('Token has been verified')
                        // console.log(res.data)
                        if(res.data.code === '00200') {
                            setUrlToken(response.token)
                            setLoggedIn(true)
                        }
                        else {
                            // save token //
                            axios.post(`${props.url}/token/save`, {
                                username: username,
                                password: password,
                                openedCounter: response.openingCouter
                            })
                            .then(res => {
                                setUrlToken(res.data.token) // set new token
                                setLoggedIn(true)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    break

                case '00201':
                    setErrorType(4) // Role is 0
                    setLoginButtonState('enable') // enable
                    break

                case '00401':
                    setErrorType(3) // Access denied to DB or out of service
                    setLoginButtonState('enable') // enable
                    break

                case '00404':
                    setErrorType(1) // Username or password was incorrect
                    setLoginButtonState('disable') // disable
                    break
            
                default:
                    break
            }
        })
        .catch((err) => {
            console.log(err)
            setErrorType(2) // Can't connect to gateway
            setLoginButtonState('enable') // enable
        })
    }

    function displayError() {
        switch (errorType) {
            case 1:
                return <Error>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!</Error>

            case 2:
                return <Error>ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ปลายทางได้!</Error>
        
            case 3:
                return <Error>ไม่สามารถเชื่อมต่อฐานข้อมูลได้!</Error>

            case 4:
                return <Error>ชื่อผู้ใช้ "{username}" ไม่มีสิทธิ์เข้าใช้งานระบบ</Error>

            default:
                return <Error></Error>
        }
    }

    if(props.token !== '') {
        return <Redirect to={`/${props.username}`} />
    }

    return (
        isLoggedIn 
        ?
        <Redirect to={`/${username}`} />
        :
        <Container className="animated fadeIn">
            <HomeRow>
                <Block>
                    <Center xs={24}>
                        <Title>กรุณาเข้าสู่ระบบ</Title>
                        <Description>เพื่อดูข้อมูลประวัติกำลังพลใน กพ.ทบ.</Description>
                    </Center>
                </Block>
                <Block>
                    <Col xs={8}>
                        <Label>ชื่อผู้ใช้:</Label>
                    </Col>
                    <Col xs={16}>
                        <Input
                            type="text"
                            placeholder="Username"
                            name="username"
                            size="large"
                            value={username}
                            onChange={usernameTrigger}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>
                </Block>
                <Block>
                    <Col xs={8}>
                        <Label>รหัสผ่าน:</Label>
                    </Col>
                    <Col xs={16}>
                        <Input.Password
                            type="text"
                            placeholder="Password"
                            name="password"
                            size="large"
                            value={password}
                            onChange={passwordTrigger}
                            onKeyPress={handleKeyPress}
                        />
                    </Col>
                </Block>
                <Block>
                    <Center xs={24}>
                        <StyledButton
                            type="primary"
                            size="large"
                            disabled={loginButtonState === 'enable' ? false : true}
                            onClick={authorizedVerification}
                            icon={loginButtonState === 'loading' ? 'loading' : 'login'}
                        >
                            Login
                        </StyledButton>
                    </Center>
                </Block>
                <Block padding={errorType > 0 ? true : false}>
                    <Center xs={24}>
                        { displayError() }
                    </Center>
                </Block>
            </HomeRow>
        </Container>
    )
}

export default connect(mapStateToProps)(Home)