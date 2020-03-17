import React from 'react'
import styled from 'styled-components'
import {
    Col,
    Spin
} from 'antd'

import Row from '../layouts/Row'

const LoadingRow = styled(Row)`
    max-width: 700px;
    padding: 1.5rem 0;
    ${props => props.shadow === false && `
        box-shadow: none;
        max-width: 270px;
    `}
`

const Center = styled(Col)`
    text-align: center;
    padding: 1rem 0;
`

const Title = styled.p`
    text-align: center;
    font-size: 1.5rem;
    margin: 0;

    @media (max-width: 767px) {
        font-size: 1.2rem;
    }
`

const CustomizedSpin = styled(Spin)`
    .ant-spin-dot {
        font-size: 65px;

        .ant-spin-dot-item {
            width: 30px;
            height: 30px;
        }
    }
`

function Loading(props) {
    return (
        <LoadingRow shadow={props.shadow}>
            <Center xs={24}>
                <CustomizedSpin size="large" />
            </Center>
            <Center xs={24}>
                <Title>{props.title || 'กำลังค้นหา...'}</Title>
            </Center>
        </LoadingRow>
    )
}

export default Loading