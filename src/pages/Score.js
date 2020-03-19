import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    InputNumber,
    Select,
    Button,
    Icon,
    ConfigProvider,
    Spin,
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

const CardShield =  styled.div`
    display: flex;
    justify-content: center;
    align-items: ${props => props.alignment === "left" ? "flex-start" : "center"};
    flex-direction: column;
`

const Card = styled.div`
    position: relative;
    width: 100%;
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.2) 1px 1px 5px;
    padding: 50px 20px;
    margin-bottom: 30px;
    border-radius: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    -webkit-user-select: none; /* Safari 3.1+ */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */

    &.the-last-one {
        margin-bottom: 20px;
    }

    &:hover {
        background-color: rgba(24, 144, 255, 0.1);
    }

    .salary-group {
        font-size: 1.25rem;
        margin-bottom: 0;
        text-align: left;
    }

    div.arrow-icon {
        position: absolute;
        right: 12px;
        top: 54px;
        margin: 0;
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
    margin-top: 5px;
    margin-bottom: 10px;
    padding: 0;
`

const StyledInputNumber = styled(InputNumber)`
    margin-right: 5px;

    &.ant-input-number {
        width: 40px;

        .ant-input-number-handler-wrap {
            display: none;
        }
    }
`

function mapStateToProps(state) {
    return state
}

function Score(props) {
    const [containerClass, setContainerClass] = useState('hidden')
    const [getData, setGetData] = useState(setInitialState('getData'))
    const [afterGettingdata, setAfterGettingData] = useState(setInitialState('afterGettingdata'))
    const [displayElements, setDisplayElements] = useState(setInitialState('displayElements'))
    const [candidatesData, setCandidatesData] = useState(setInitialState('candidatesData'))

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

            case 'displayElements':
                return ''

            case 'afterGettingdata':
                return 0

            case 'candidatesData':
                return []

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

    function getCandidatesData(type) {
        // type === 1 -> สัญญาบัตร
        // type === 2 -> ประทวน
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
                        กำลังอ่านข้อมูล
                    </div>
                    <CustomizedSpin size="large" />
                </div>
            )
        })

        setTimeout(() => {
            axios.get(`${props.url}/getcandidates/${type}`, {
                headers: {
                    'authorization': props.token
                }
            })
            .then(res => {
                const response = res.data
    
                console.log(response)
                setCandidatesData(response.data)
                swalCustomize.close()
            })
            .catch((err) => {
                console.log(err)
                swalCustomize.close()
            })
        }, 250)
    }

    function renderOptionList() {
        return (
            <>
                <Card className="animated fadeIn" onClick={() => getCandidatesData(1)}>
                    <p className="salary-group">กลุ่ม นายทหารสัญญาบัตร</p>
                    <div className="arrow-icon">
                        <Icon
                            type="caret-right"
                            style={{
                                fontSize: "1.5rem"
                            }}
                        />
                    </div>
                </Card>
                <Card className="the-last-one animated fadeIn" onClick={() => getCandidatesData(2)}>
                    <p className="salary-group">กลุ่ม นายทหารประทวน</p>
                    <div className="arrow-icon">
                        <Icon
                            type="caret-right"
                            style={{
                                fontSize: "1.5rem"
                            }}
                        />
                    </div>
                </Card>
            </>
        )
    }

    function renderCandidatesList() {
        return (
            <div
                className="animated fadeIn"
                style={{
                    textAlign: "left",
                    width: "100%"
                }}
            >
                <Button
                    style={{
                        marginBottom: 15
                    }}
                    onClick={() => setCandidatesData(setInitialState('candidatesData'))}
                >
                    <Icon type="caret-left" /> กลับ
                </Button>
                {candidatesData.map((arrayType, indexA) => {
                    return (
                        <div
                            key={indexA}
                            style={{
                                marginBottom: 30
                            }}
                        >
                            <p
                                style={{
                                    marginBottom: 0,
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}
                            >
                                {arrayType[0].salary_group}
                            </p>
                            <HorizontalLine />
                            {arrayType.map((item, indexB) => {
                                return (
                                    <div
                                        key={indexB}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    >
                                        <p style={{
                                            marginBottom: 0
                                        }}>
                                            {`${item.rank} ${item.fname} ${item.lname}`}
                                        </p>
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={999} 
                                            placeholder="0"
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={999} 
                                            placeholder="0"
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={999} 
                                            placeholder="0"
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={999} 
                                            placeholder="0"
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={999} 
                                            placeholder="0"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )

        // return (
        //     <div
        //         className="animated fadeIn"
        //         style={{
        //             textAlign: "left",
        //             width: "100%"
        //         }}
        //     >
        //         <Button
        //             style={{
        //                 marginBottom: 15
        //             }}
        //             onClick={() => setCandidatesData(setInitialState('candidatesData'))}
        //         >
        //             <Icon type="caret-left" /> กลับ
        //         </Button>
        //         <p style={{
        //             marginBottom: 0
        //         }}>น.4-5</p>
        //         <HorizontalLine />
        //         <div>
        //             <p style={{
        //                 marginBottom: 0
        //             }}>
        //                 พ.อ. พชรพล ปลื้มใจ
        //             </p>
        //             <StyledInputNumber
        //                 type="number"
        //                 size="small"
        //                 min={0}
        //                 max={100} 
        //                 placeholder="0"
        //             />
        //             <StyledInputNumber
        //                 type="number"
        //                 size="small"
        //                 min={0}
        //                 max={100} 
        //                 placeholder="0"
        //             />
        //             <StyledInputNumber
        //                 type="number"
        //                 size="small"
        //                 min={0}
        //                 max={100} 
        //                 placeholder="0"
        //             />
        //             <StyledInputNumber
        //                 type="number"
        //                 size="small"
        //                 min={0}
        //                 max={100} 
        //                 placeholder="0"
        //             />
        //             <StyledInputNumber
        //                 type="number"
        //                 size="small"
        //                 min={0}
        //                 max={100} 
        //                 placeholder="0"
        //             />
        //         </div>
        //     </div>
        // )
    }

    function renderScoreContent() {
        return (
            <div>
                <MainTitle title="กรุณาเลือกกลุ่มที่ต้องการลงคะแนน" />
                <CardShield alignment={candidatesData.length > 0 ? "left" : "center"}>
                    {candidatesData.length > 0 ?
                    renderCandidatesList() :
                    renderOptionList()}
                </CardShield>
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