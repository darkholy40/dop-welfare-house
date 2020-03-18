import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
    Col,
    Button,
    Icon
} from 'antd'

import Row from '../layouts/Row'

const NotFoundRow = styled(Row)`
    max-width: 700px;
    padding: 1.5rem 1rem;
`

const Center = styled(Col)`
    text-align: center;
`

const Title = styled.p`
    text-align: center;
    font-size: 1.5rem;
    margin: 0;
    padding: 1.5rem 0;

    @media (max-width: 767px) {
        font-size: 1.2rem;
    }
`

const TitleIcon = styled(Icon)`
    color: ${props => props.color || '#000000'};
    font-size: 4.5rem;
`

const ThisButton = styled(Button)`
    width: 90px;
`

function NotFound(props) {
    const type = props.type
    let title = ''

    switch (type) {
        case 'timeout':
            title = 'เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง'
            break

        case 'wrong-url':
            title = 'พบข้อผิดพลาด กรุณากดปุ่ม "ตกลง" เพื่อกลับไปยังหน้าแรก'
            break

        case 'loggedout':
            title = 'ออกจากระบบหรือมีการเข้าสู่ระบบจากอุปกรณ์อื่น'
            break
    
        default:
            title = 'ไม่พบหน้านี้ กรุณากดปุ่ม "ตกลง" เพื่อกลับไปยังหน้าแรก'
            break
    }

    return (
        <NotFoundRow>
            <Center xs={24}>
                <TitleIcon type="question-circle" theme="filled" color="#dddddd" />
            </Center>
            <Center xs={24}>
                <Title>{title}</Title>
            </Center>
            <Center xs={24}>
                <Link to="/">
                    <ThisButton
                        type="primary"
                        size="large"
                    >
                        ตกลง
                    </ThisButton>
                </Link>
            </Center>
        </NotFoundRow>
    )
}

export default NotFound