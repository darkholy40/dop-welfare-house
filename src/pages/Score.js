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

const Title = styled.p`
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 24px;

    span {
        padding-left: 20px;
    }

    @media (max-width: 991px) {
        font-size: 1.25rem;
    }
`

const Error = styled.span`
    color: #f00;
`

const DesktopCol = styled(Col)`
    @media (max-width: 991px) {
        display: none;
    }
`

const MobileCol = styled(Col)`
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    text-align: center;

    @media (min-width: 992px) {
        display: none;
    }
`

const GetDataCol = styled(Col)`
    text-align: ${props => props.setalignment === "center" ? "center" : "left"};
    padding-left: 20px;
    
    @media (max-width: 991px) {
        padding-left: 0;
    }
`

const MyRow = styled.div`
    width: 100%;
    position: relative;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 5px;
    text-overflow: ellipsis;
    padding: 30px 25px;
    border-radius: 3px;
    transition: 0.3s;
`

const MyCard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 5px;
    padding-bottom: 5px;

    span.label {
        width: 100%;
        text-align: left;
        margin-bottom: 5px;
    }
`

const MyTotalRow = styled(MyRow)`
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    padding: 10px 25px;
    margin-bottom: 15px;

    span.total {
        font-weight: bold;
    }

    span.description {
        color: rgb(175, 175, 175);
    }

    @media (max-width: 991px) {
        padding: 5px 20px;
    }
`

const PersonelCard = styled(MyRow)`
    box-shadow: none;
    border-radius: 0;
    padding: 10px 20px;
    border-bottom: 1px solid rgb(200,200,200);

    &:hover {
        background-color: rgba(24, 144, 255, 0.05);
    }

    div {
        p {
            margin: 0;
            padding: 5px 0;
        }
    }

    @media (min-width: 992px) {
        display: none;
    }
`

const MySelect = styled(Select)`
    width: 100%;
`

const MyInput = styled(Input)`
    width: 100%;
`

const DopDataTableBlock = styled.div`
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
    padding: 15px 15px 0px;

    @media (max-width: 991px) {
        display: none;
    }
`

const PersonDetailIcon = styled(Icon)`
    color: rgb(150, 150, 150);
    font-size: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 100%;
    padding: 5px;
    transition: 0.1s;

    &:hover {
        color: #ffffff;
        border: 1px solid #1890ff;
        background-color: #1890ff
    }
`

const PersonDetailModal = styled(Modal)`
    max-width: 1024px;
    top: 20px;

    .ant-modal-body {
        padding: 0
    }

    div.header {
        display: flex;
        flex-direction: row;
        align-item: center;
        justify-content: space-between;
        padding: 16px 24px;
        margin-bottom: 24px;
        color: rgba(0, 0, 0, 0.65);
        background: #fff;
        border-bottom: 1px solid #e8e8e8;
        border-radius: 4px 4px 0 0;

        span.title {
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            word-wrap: break-word;
        }

        span.close-icon {
            font-size: 1rem;
            color: rgba(0, 0, 0, 0.5);
            transition: 0.1s;

            i {
                &:hover {
                    color: rgba(0, 0, 0, 0.25);
                }
            }
        }
    }

    div.body {
        padding: 0 24px;

        div.top {
            display: flex;
            margin-bottom: 1.5rem;
    
            div.pic {
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                height: 180px;
                width: 150px;
                border: 1px solid rgb(200, 200, 200);
                border-radius: 5px;
    
                @media (max-width: 991px) {
                    margin-bottom: 0.25rem;
                }
            }
    
            div.name {
                font-size: 1.5rem;
                font-weight: 600;
                padding-left: 1.5rem;
    
                span.rightCol {
                    padding-left: 1rem;
                }
    
                @media (max-width: 991px) {
                    font-size: 1.25rem;
                    padding-left: 0;
                }
            }
    
            @media (max-width: 991px) {
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }
    }
    
    div.footer {
        padding: 0 24px 24px 24px;
        display: flex;
        flex-direction: row;
        align-item: center;
        justify-content: flex-end;
    }
`

const ProfileImage = styled.img`
    max-width: 150px;
`

const CustomPanelStyle = styled(Collapse.Panel)`
    background-color: #f7f7f7;
    border: 1px solid #d9d9d9;
    border-radius: 4px !important;
    margin-bottom: 24px;
    overflow: hidden;

    .ant-collapse-content-box {
        border: 0;
        background-color: #fff;
    }

    div {
        padding: 3px 0;

        span.right {
            padding-left: 1rem;
        }
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

const SearchDrawer = styled(Drawer)`
    .ant-drawer-header {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .ant-drawer-body {
        padding: 0.5rem 1rem;
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
        }, 250)

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
                props.dispatch({
                    type: 'TOKEN_EXPIRED'
                })
                return setDisplayElements(<NotFound type="wrongtoken" />)

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
                    'authorization': props.token
                }
            })
            .then(res => {
                const response = res.data
                if(response.code === '00404') { // ไม่พบข้อมูล
                    setAfterGettingData(3)
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

    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <ThisContainer className={containerClass} padding={afterGettingdata === 1 && "2rem 1rem"}>
                {getData !== undefined
                    ? <ScoreRow className="animated fadeIn">
                        ScoreRow
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