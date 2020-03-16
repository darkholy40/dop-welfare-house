import React from 'react'
import styled from 'styled-components'
import {
    Col,
    Button,
    Icon
} from 'antd'

import Row from '../layouts/Row'

const ConnectionFailedRow = styled(Row)`
    max-width: 700px;
    padding: 1.5rem 1rem 0.75rem 1rem;
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

function ConnectionFailed(props) {
    return (
        <ConnectionFailedRow>
            <Center xs={24}>
                <TitleIcon type="question-circle" theme="filled" color="#dddddd" />
            </Center>
            <Center xs={24}>
                <Title>
                    {props.type !== 'db' ? 'ไม่สามารถเชื่อมต่อไปยัง server ปลายทาง' : 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'}
                    <br />
                    เชื่อมต่อใหม่อีกครั้ง
                </Title>
            </Center>
            <Center xs={24} style={{paddingBottom: '1rem'}}>
                <ThisButton
                    type="primary"
                    size="large"
                    onClick={props.thisCallBack}
                >
                    ตกลง
                </ThisButton>
            </Center>
        </ConnectionFailedRow>
    )
}

export default ConnectionFailed