import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import {
    Col,
    Input,
    Button,
    Icon,
    Spin
} from 'antd'

import Container from '../components/layouts/Container'
import Row from '../components/layouts/Row'
import Loading from '../components/functions/Loading'
import useInterval from '../functions/useInterval'
import swalCustomize from '@sweetalert/with-react'

const HomeContainer = styled(Container)`
    padding: 2rem 1rem;

    &.hidden {
        opacity: 0;
    }
`

const HomeRow = styled(Row)`
    width: 960px;
    padding: 1rem;
`

const Block = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.padding === false ? 0 : '0.75rem 0'};
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

const Center = styled(Col)`
    text-align: center;
`

const HorizontalLine = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
`

const AgentCard = styled.div`
    position: relative;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 5px;
    text-overflow: ellipsis;
    padding: 25px 15px;
    border-radius: 10px;
    transition: all 0.3s ease 0s;
    overflow: hidden;
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    ${props => props.loggedin === true ? `
        opacity: 0.3;
    ` : `
        cursor: pointer;
    `}

    p.position-detail {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
        color: rgb(75, 75, 75);
    }

    p.fullname-detail {
        margin-bottom: 0;
        font-size: 1rem;
        color: rgb(150, 150, 150);
    }

    div.arrow-icon {
        position: absolute;
        right: 20px;
        top: 45px;
        margin: 0;
    }
`

const CustomizedSpin = styled(Spin)`
    margin-bottom: 15px;

    .ant-spin-dot {
        font-size: 65px;

        .ant-spin-dot-item {
            width: 30px;
            height: 30px;
        }
    }
`

function mapStateToProps(state) {
    return state
}

function Home(props) {
    const [homeContainerClass, setHomeContainerClass] = useState(setInitialState('homeContainerClass'))
    const [username, setUsername] = useState(setInitialState('username'))
    const [password, setPassword] = useState(setInitialState('password'))
    const [loginButtonState, setLoginButtonState] = useState(setInitialState('loginButtonState'))

    const [allAgents, setAllAgents] = useState(setInitialState('allAgents'))

    const [isLoggedIn, setLoggedIn] = useState(setInitialState('isLoggedIn'))
    const [errorType, setErrorType] = useState(setInitialState('errorType'))
    const [urlToken, setUrlToken] = useState('')

    useEffect(() => {
        props.dispatch({
            type: 'SET_APP_CLASS',
            data: 'login'
        })

        setInitialState()

        setTimeout(() => {
            setHomeContainerClass('animated fadeIn')
        }, 25)
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
                data: {
                    token: urlToken,
                    username: username
                }
            })
        }
    }, [isLoggedIn])

    useInterval(() => {
        getAllAgents()
    }, 500)

    function setInitialState(stateName) {
        switch (stateName) {
            case 'homeContainerClass':
                return 'hidden'

            case 'loginButtonState':
                return 'disable'

            case 'allAgents':
                return []

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

    function getAllAgents() {
        axios.get(`${props.url}/getallagents`)
        .then(res => {
            // console.log('Token has been verified')
            // console.log(res.data)
            const response = res.data
            
            if(response.code === "00200") {
                setAllAgents(response.data)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function authorizedVerification(getUsername) {
        swalCustomize({
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
            content: (
                <div style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    padding: '0.5rem 1rem',
                    border: 0,
                }}>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}>
                        กำลังเข้าสู่ระบบ
                    </div>
                    <CustomizedSpin size="large" />
                </div>
            )
        })
        setErrorType(setInitialState('errorType')) // Remove any error notification
        setLoginButtonState('loading') // disable + loading
        setUsername(getUsername)

        setTimeout(() => {
            axios.post(`${props.url}/authenticate`, {
                username: getUsername,
            })
            .then(res => {
                const response = res.data
    
                switch (response.code) {
                    case '00200':
                        // console.log('Authenticated')
                        // console.log(response)
                        // check token is expired
                        axios.get(`${props.url}/token/verify/${getUsername}`, {
                            headers: {
                                'authorization': response.token
                            }
                        })
                        .then(res => {
                            // console.log('Token has been verified')
                            // console.log(res.data)
                            if(res.data.code === '00200') {
                                setUrlToken(response.token)

                                goNextPage()
                            }
                            else {
                                // save token //
                                axios.post(`${props.url}/token/save`, {
                                    username: getUsername,
                                })
                                .then(res => {
                                    // console.log(res.data)
                                    setUrlToken(res.data.token) // set new token
                                    
                                    goNextPage()
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
        }, 500)
    }

    function goNextPage() {
        getAllAgents()

        setTimeout(() => {
            swalCustomize.close()
            setLoggedIn(true)
        }, 500)
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
        <HomeContainer className={homeContainerClass}>
            <HomeRow>
                <Block>
                    <Center xs={24}>
                        <Title>กรุณาเลือกตำแหน่งของท่าน</Title>
                        <Description>เพื่อเข้าสู่การกรอกให้คะแนนผู้เสนอขอบ้านพัก</Description>
                    </Center>
                </Block>
                <HorizontalLine />
                {allAgents.length > 0 ? 
                    allAgents.map((item, index) => {
                    return (
                        <Block key={index}>
                            <Center xs={24}>
                                {item.inActive ?
                                <AgentCard loggedin={item.inActive}>
                                    <p className="position-detail">{item.position}</p>
                                    <p className="fullname-detail">{item.fullname}</p>
                                    <div className="arrow-icon">
                                        <Icon
                                            type="caret-right"
                                            style={{
                                                fontSize: "1.5rem"
                                            }}
                                        />
                                    </div>
                                </AgentCard> :
                                <AgentCard loggedin={item.inActive} onClick={() => authorizedVerification(item.username)}>
                                    <p className="position-detail">{item.position}</p>
                                    <p className="fullname-detail">{item.fullname}</p>
                                    <div className="arrow-icon">
                                        <Icon
                                            type="caret-right"
                                            style={{
                                                fontSize: "1.5rem"
                                            }}
                                        />
                                    </div>
                                </AgentCard>}
                            </Center>
                        </Block>
                    )}) :
                    <Block>
                        <Loading title="กำลังอ่านข้อมูล..." shadow={false} />
                    </Block>
                }
            </HomeRow>
        </HomeContainer>
    )
}

export default connect(mapStateToProps)(Home)