import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    Col,
    Input,
    Select,
    Button,
    Icon,
    Table,
    ConfigProvider,
    Spin,
    Drawer,
    Pagination,
    Modal,
    Collapse,
    notification
} from 'antd'
import swalCustomize from '@sweetalert/with-react'
import Container from '../components/layouts/Container'
import Row from '../components/layouts/Row'
import MainTitle from '../components/layouts/MainTitle'
import NotFound from '../components/functions/NotFound'
import Loading from '../components/functions/Loading'
import ConnectionFailed from '../components/functions/ConnectionFailed'
import Empty from '../components/icons/Empty'
import displayDateFotmat from '../functions/displayDateFotmat'

const { Option } = Select

const ThisContainer = styled(Container)`
    &.hidden {
        opacity: 0;
    }
`

const ScoreRow = styled(Row)`
    padding: 1rem 2rem;
    opacity: 0;

    @media (max-width: 991px) {
        padding: 1rem;
    }
`

const ErrorBlock = styled.div`
    opacity: 0;
    display: flex;

    @media (max-width: 991px) {
        max-width: 360px;
    }

    @media (max-width: 360px) {
        max-width: 280px;
    }
`

const LoadingBlock = styled.div`
    display: flex;
    flex-direction: column;
    padding: 3rem;

    span {
        font-size: 1.25rem;
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

const HorizontalLine = styled.div`
    border-bottom: 1px solid #e8e8e8;
    margin: 10px 0;
    padding: 0;
`

function mapStateToProps(state) {
    return state
}

function Score(props) {
    const [containerClass, setContainerClass] = useState('hidden')
    const [getData, setGetData] = useState(setInitialState('getData'))
    const [afterGettingdata, setAfterGettingData] = useState(setInitialState('afterGettingdata'))
    const [displayElements, setDisplayElements] = useState(setInitialState('displayElements'))

    const customizeRenderEmpty = () => (
        <div 
            style={{
                textAlign: 'center',
                padding: '1rem 0'
            }}
        >
            <Empty />
            <p
                style={{
                    marginBottom: 0
                }}
            >
                ไม่พบข้อมูล
            </p>
        </div>
    )

    useEffect(() => {
        window.scrollTo(0, 0)
        setTimeout(() => {
            setContainerClass('animated fadeIn')
        }, 0)

        props.dispatch({
            type: 'SET_APP_CLASS',
            data: 'center'
        })

        getUserData()
    }, [])

    useEffect(() => {
        switch (afterGettingdata) {
            case 1:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'found_data'
                })
                props.dispatch({
                    type: 'SET_USER_DATA',
                    data: getData
                })
                break

            case 2:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'notfound'
                })
                props.dispatch({
                    type: 'TOKEN_EXPIRED'
                })
                return setDisplayElements(<NotFound type="timeout" />)
        
            case 3:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'notfound'
                })
                return setDisplayElements(<NotFound type="wrong-url" />)

            case 4:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'notfound'
                })
                return setDisplayElements(<ConnectionFailed thisCallBack={() => getUserData(500, 'again')}/>)

            case 5:
                return setDisplayElements(<Loading title="กำลังเชื่อมต่อ..." />)

            case 6:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'notfound'
                })
                return setDisplayElements(<ConnectionFailed type="db" thisCallBack={() => getUserData(500, 'again')}/>)

            case 7:
                props.dispatch({
                    type: 'SET_APP_CLASS',
                    data: 'notfound'
                })
                props.dispatch({
                    type: 'TOKEN_EXPIRED'
                })
                return setDisplayElements(<NotFound type="loggedout" />)

            default:
                return setDisplayElements(<Loading />)
        }
    }, [afterGettingdata])

    function setInitialState(stateName) {
        switch (stateName) {
            case 'getData':
                return undefined

            case 'afterGettingdata':
                return 0

            default:
                break
        }
    }

    function getUserData(timer, type) {
        let currentUsername = props.match.params.username
        
        type !== 'again'
            ? setAfterGettingData(setInitialState('afterGettingdata'))
            : setAfterGettingData(5)

        setTimeout(() => {
            axios.get(`${props.url}/getdata/${currentUsername}`, {
                headers: {
                    'authorization': props.token,
                    'username': props.username
                }
            })
            .then(res => {
                const response = res.data
                if(response.code === '00404') { // ไม่พบข้อมูล
                    setAfterGettingData(3)
                }

                if(response.code === 'loggedout') { // ออกจากระบบหรือมีการเข้าสู่ระบบจากอุปกรณ์อื่น
                    setAfterGettingData(7)
                }

                if(response.code === '00401') { // token หมดอายุแล้ว
                    setAfterGettingData(2)
                }

                if(response.code === 'db is out of service') { // token หมดอายุแล้ว
                    setAfterGettingData(6)
                }

                if(response.code === '00200') { // token สามารถใช้ได้
                    setGetData(response.data)

                    setAfterGettingData(1)

                    if(type === 'again') {
                        notification['success']({
                            message: 'แจ้งเตือน',
                            description: 'เชื่อมต่อสำเร็จ',
                            duration: 4,
                        })
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                setAfterGettingData(4)
            })
        }, timer || 0)
    }

    function renderScoreContent() {
        return (
            <div>
                <MainTitle title="บันทึกคะแนนผู้เสนอขอบ้านพัก กพ.ทบ." />
            </div>
        )
    }

    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <ThisContainer className={containerClass} padding={afterGettingdata === 1 && "2rem 1rem"}>
                {getData !== undefined
                    ? <ScoreRow className="animated fadeIn">
                        {renderScoreContent()}
                    </ScoreRow>
                    : <ErrorBlock className="animated fadeIn">
                        {displayElements}
                    </ErrorBlock>
                }
            </ThisContainer>
        </ConfigProvider>
    )
}

export default connect(mapStateToProps)(Score)