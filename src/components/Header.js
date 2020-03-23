import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components' 
import {
    Icon,
    Dropdown,
    Menu,
    message,
    notification
} from 'antd'
import logo from '../images/logo.png'

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;
    padding: 0 2rem;
    background-color: rgba(255, 255, 255);
    border-bottom: 1px solid rgba(0,0,0,0.1);
    position: relative;
    width: 100%;
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */

    &.hidden {
        opacity: 0;
    }

    @media (max-width: 991px) {
        padding: 0 1.5rem;
    }
`

const ProfileContent = styled.span`
    font-size: 1rem;
    padding: 0.75rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.1s;

    &:hover {
        background-color: #efefef;
    }

    @media (max-width: 991px) {
        font-size: 0.85rem;
        padding: 0.75rem 0.25rem;
    }
`

const DopLogoBlock = styled.div`
    max-width: 60px;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 100%;

    &:hover {
        background-color: #efefef;
    }
`

const DopLogo = styled.img`
    width: 100%;
`

function mapStateToProps(state) {
    return state
}

function Header(props) {
    const [headerContainerState, setHeaderContainerState] = useState('hidden')
    const [isLoggedOut, setLoggedOut] = useState(setInitialState('isLoggedOut'))
    const [isLoading, setIsLoading] = useState(setInitialState('isLoading'))
    const [goHome, setGoHome] = useState(setInitialState('goHome'))

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Link to="#" onClick={() => logout()} disabled={isLoading === true && true}>{isLoading === true ? <Icon type="loading" /> : <><Icon type="logout" /> ออกจากระบบ</>}</Link>
            </Menu.Item>
        </Menu>
    )

    useEffect(() => {
        setTimeout(() => {
            setHeaderContainerState('animated fadeInDown')
        }, 0)
    }, [])

    useEffect(() => {
        if(isLoggedOut === true) {
            message.destroy()
            message.success('ออกจากระบบสำเร็จ!')

            props.dispatch({
                type: 'GO_LOGOUT',
            })
        }
    }, [isLoggedOut])

    function setInitialState(stateName) {
        switch (stateName) {
            case 'isLoggedOut':
                return false

            case 'isLoading':
                return false

            case 'goHome':
                return false
        
            default:
                break
        }
    }

    function logout() {
        setIsLoading(true)
        const username = props.userData.username
        axios.post(`${props.url}/logout`, {
            username: username,
        })
        .then(res => {
            const response = res.data

            if(response.code === '00200') {
                setLoggedOut(true)
            } else {
                openNotification() // can't connect to db
                setIsLoading(setInitialState('isLoading'))
            }
        })
        .catch((err) => {
            console.log(err)
            openNotification() // can't connect to server
            setIsLoading(setInitialState('isLoading'))
        })
    }

    function renderUsername() {
        const username = `${props.userData.rank} ${props.userData.name} ${props.userData.lastname}`
        return username
    }

    function openNotification() {
        const args = {
            message: 'ออกจากระบบไม่สำเร็จ!',
            description: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ปลายทางได้ กรุณาลองใหม่อีกครั้ง',
            duration: 4,
        }
        notification.error(args);
    }

    return (
        isLoggedOut || goHome
        ? <Redirect to="/" />
        : <HeaderContainer className={headerContainerState}>
            <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                <ProfileContent>
                    <Icon type="user" />
                    <span style={{
                        marginLeft: "0.25rem"
                    }}>
                        {renderUsername()}
                    </span>
                </ProfileContent>
            </Dropdown>
            <DopLogoBlock onClick={() => setGoHome(true)}>
                <DopLogo src={logo} />
            </DopLogoBlock>
        </HeaderContainer>
    )
}

export default connect(mapStateToProps)(Header)