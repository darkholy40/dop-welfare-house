import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import {
    Col,
    Icon,
    Spin,
    notification
} from 'antd'

import Container from '../components/layouts/Container'
import Row from '../components/layouts/Row'
import Loading from '../components/functions/Loading'
import useInterval from '../functions/useInterval'
import swalCustomize from '@sweetalert/with-react'
import logo from '../images/logo.png'

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

const MyImage = styled.img`
    max-width: 150px;
`

const Title = styled.p`
    text-align: center;
    font-size: 1.25rem;
    margin: 10px;
`

const Center = styled(Col)`
    text-align: center;
`

const HorizontalLine = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
`

function mapStateToProps(state) {
    return state
}

function DashBoard(props) {
    const [scoreData, setScoreData] = useState([])

    useEffect(() => {
        getSummationData()
    }, [])

    function getSummationData() {
        axios.get(`${props.url}/candidates/score`, {
            headers: {
                'authorization': props.token
            }
        })
        .then(res => {
            // console.log('Token has been verified')
            // console.log(res.data)
            if(res.data.code === '00200') {
                const response = res.data
                // console.log(response.data)

                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'dashboard'
                })
                setScoreData(response.data)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function formatDataToDisplay() {
        const getArray = scoreData
        console.log(getArray)

        // getArray.map((option, optionIndex) => {
        //     // option.agent_id => agent_id
        //     option.big_group.map((bigGroup, indexBigGroup) => {
        //         bigGroup.map((subGroup, indexSubGroup) => {
        //             subGroup.map((person, indexPerson) => {
        //                 console.log(person.fname)
        //             })
        //         })
        //     })
        // })

        return getArray[0].big_group.map((bigGroup, indexBigGroup) => {
            let solderType = ''
            if(indexBigGroup === 0) {
                solderType = 'นายทหารสัญญาบัตร'
            } else {
                solderType = 'นายทหารประทวน'
            }

            return (
                <div key={indexBigGroup}>
                    {solderType}
                    {bigGroup.map((subGroup, indexSubGroup) => {
                        return (
                            <div key={indexSubGroup}>
                                {subGroup[0].salary_group}
                                {subGroup.map((person, indexPerson) => {
                                    return (
                                        <div key={indexPerson}>
                                            <span>{`${person.rank} ${person.fname} ${person.lname}`}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )
        })
    }

    return (
        <HomeContainer className="animated fadeIn">
            {scoreData.length > 0 ?
            <HomeRow className="animated fadeIn">
                <Block>
                    <Center xs={24}>
                        <MyImage src={logo} />
                        <Title>ระบบงานจัดกำลังพลเข้าบ้านพัก กพ.ทบ.</Title>
                    </Center>
                </Block>
                <HorizontalLine />
                {scoreData.length > 0 && formatDataToDisplay()}
            </HomeRow> :
            <Loading title="กำลังเชื่อมต่อ..." />}
        </HomeContainer>
    )
}

export default connect(mapStateToProps)(DashBoard)