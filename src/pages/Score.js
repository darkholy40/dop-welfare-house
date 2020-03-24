import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import {
    InputNumber,
    Button,
    Icon,
    ConfigProvider,
    Spin,
    message,
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

    div.passed {
        position: absolute;
        left: 30px;
        top: -30px;
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

const TotalScoreEachPerson = styled.span`
    display: inline-block;
    padding-left: 5px;
    color: ${props => props.totalscore < 40 ?
            props.totalscore < 1 ? 
                `rgb(200, 200, 200)` :
                `rgb(100, 200, 100)` :
        `rgb(200, 100, 100)`
    };
`

function mapStateToProps(state) {
    return state
}

function Score(props) {
    const [containerClass, setContainerClass] = useState('hidden')
    const [getData, setGetData] = useState(setInitialState('getData'))
    const [afterGettingdata, setAfterGettingData] = useState(setInitialState('afterGettingdata'))
    const [displayElements, setDisplayElements] = useState(setInitialState('displayElements'))
    const [currentCandidateType, setCurrentCandidateType] = useState(setInitialState('currentCandidateType'))
    const [candidatesData, setCandidatesData] = useState(setInitialState('candidatesData'))
    const [dataToSend, setDataToSend] = useState(setInitialState('dataToSend'))
    const [saveScoreButtons, setSaveScoreButtons] = useState(setInitialState('saveScoreButtons'))
    const [successRibbons, setSuccessRibbons] = useState(setInitialState('successRibbons'))

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
                props.dispatch({
                    type: 'TOKEN_EXPIRED'
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
    
    useEffect(() => {
        if(props.userData !== '') {
            getSuccessRibbon()
        }
    }, [props.userData])

    function setInitialState(stateName) {
        switch (stateName) {
            case 'getData':
                return undefined

            case 'displayElements':
                return ''

            case 'currentCandidateType':
                return 0

            case 'afterGettingdata':
                return 0

            case 'candidatesData':
                return []

            case 'dataToSend':
            case 'saveScoreButtons':
            case 'successRibbons': 
                return {}

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
            .catch(() => {
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
                    'authorization': props.token,
                    'agent_id': props.userData.id
                }
            })
            .then(res => {
                const response = res.data
    
                setCandidatesData(response.data)
                formatDataToSend(response.data)
                swalCustomize.close()
                setCurrentCandidateType(type)
            })
            .catch(() => {
                swalCustomize.close()
                notification['warning']({
                    message: 'แจ้งเตือน',
                    description: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ปลายทางได้',
                    duration: 4,
                })
            })
        }, 250)
    }

    function formatDataToSend(getArrObj) {
        const candidatesListData = getArrObj
        let objDataForSending = {}
        let objSaveScoreButton = {}

        for(let i=0; i<candidatesListData.length; i++) {
            objDataForSending[`group_${i}`] = {}
            objSaveScoreButton = {
                ...objSaveScoreButton,
                [`button_${i}`]: {
                    status: candidatesListData[i][0].is_approved === 1 ? 'complete' : 'normal'
                }
            }

            for(let j=0; j<candidatesListData[i].length; j++) {
                objDataForSending[`group_${i}`][`person_${j}`] = {
                    agent_id: props.userData.id,
                    candidate_id: candidatesListData[i][j].id,
                    score_first: candidatesListData[i][j].score_first,
                    score_second: candidatesListData[i][j].score_second,
                    score_third: candidatesListData[i][j].score_third,
                    score_fourth: candidatesListData[i][j].score_fourth,
                    score_fifth: candidatesListData[i][j].score_fifth,
                    is_approved: candidatesListData[i][j].is_approved,
                    rank: candidatesListData[i][j].rank,
                    fname: candidatesListData[i][j].fname,
                    lname: candidatesListData[i][j].lname,
                    salary_group: candidatesListData[i][j].salary_group
                }
            }
        }

        setDataToSend(objDataForSending)
        setSaveScoreButtons(objSaveScoreButton)
        return 0
    }

    function saveScore(value, typeText, groupNumber, personNumber) {
        const group = `group_${groupNumber}`
        const person = `person_${personNumber}`
        const type = typeText

        setDataToSend({...dataToSend,  [group]: {
            ...dataToSend[group],
            [person]: {
                ...dataToSend[group][person],
                [type]: value
            }
        }})
    }

    function markApprove(groupKeyName) {
        let newData = {}

        Object.keys(dataToSend[groupKeyName]).map((personKeyName) => {
            newData = {
                ...newData,
                [personKeyName]: {
                    ...dataToSend[groupKeyName][personKeyName],
                    is_approved: 1
                }
            }

            return 0
        })

        setDataToSend({...dataToSend, 
            [groupKeyName]: newData
        })
    }

    function sendScoreDate(groupIndex) {
        const selectedGroup = `group_${groupIndex}`
        const dataForSending = dataToSend[selectedGroup]

        setSaveScoreButtons({...saveScoreButtons, [`button_${groupIndex}`]: {
            status: "loading"
        }})

        setTimeout(() => {
            axios.post(`${props.url}/candidates/score/save`, {
                groupData: dataForSending,
            })
            .then(res => {
                if(res.data.code === '00200') {
                    // console.log("บันทึกข้อมูล เรียบร้อย")
                    getSuccessRibbon() // เนื่องจากต้องการค่าไปตรวจสอบเงื่อนไข สำหรับแสดงข้อความเมื่อทำการบันทึกครบทุก record ของกลุ่มนั้นๆ (น. หรือ ป.)
                    markApprove(selectedGroup)
                    setSaveScoreButtons({...saveScoreButtons, [`button_${groupIndex}`]: {
                        status: "complete"
                    }})
                    message.success('บันทึกข้อมูลสำเร็จ!')
                } else {
                    // console.log("ไม่มีข้อมูลที่ถูกบันทึก")
                }
            })
            .catch(() => {
                setSaveScoreButtons({...saveScoreButtons, [`button_${groupIndex}`]: {
                    status: "normal"
                }})
                message.warning('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง!')
            })
        }, 1000)
    }

    function getSuccessRibbon(type) {
        axios.get(`${props.url}/verify/approvement`, {
            headers: {
                'authorization': props.token,
                'agent_id': props.userData.id
            }
        })
        .then(res => {
            const response = res.data
            setSuccessRibbons(response.data)

            if(type === 'again') {
                notification['success']({
                    message: 'แจ้งเตือน',
                    description: 'เชื่อมต่อสำเร็จ',
                    duration: 4,
                })
            }
        })
        .catch(() => {
            // การเชื่อมต่อไม่เสถียร
            if(type !== 'again') {
                notification['warning']({
                    message: 'แจ้งเตือน',
                    description: 'การเชื่อมต่อไม่เสถียร',
                    duration: 4,
                })
            }

            setTimeout(() => {
                getSuccessRibbon("again")
            }, 3000)
        })
    }

    function handlePressGoBack() {
        setCandidatesData(setInitialState('candidatesData'))
        setDataToSend(setInitialState('dataToSend'))
        setSaveScoreButtons(setInitialState('saveScoreButtons'))
        setCurrentCandidateType(setInitialState('currentCandidateType'))
        getSuccessRibbon()
    }

    function renderOptionList() {
        return (
            <>
                <p
                    className="animated fadeIn"
                    style={{
                        textAlign: "left",
                        fontSize: 16,
                        width: "100%",
                        marginBottom: 16
                    }}
                >
                    กรุณาเลือกกลุ่มที่ต้องการให้คะแนน
                </p>
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
                    {successRibbons.row_0 === 1 &&
                    <div className="passed">
                        <Icon
                            type="check-square"
                            theme="filled"
                            style={{
                                fontSize: "12rem",
                                color: "rgba(100, 200, 100, 0.2)"
                            }}
                        />
                    </div>}
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
                    {successRibbons.row_1 === 1 &&
                    <div className="passed">
                        <Icon
                            type="check-square"
                            theme="filled"
                            style={{
                                fontSize: "12rem",
                                color: "rgba(100, 200, 100, 0.2)"
                            }}
                        />
                    </div>}
                </Card>
            </>
        )
    }

    function renderCandidatesList() {
        function displayTotalScoreEachPerson(num1, num2, num3, num4, num5) {
            const first = parseInt(num1) > 0 ? num1 : 0
            const second = parseInt(num2) > 0 ? num2 : 0
            const third = parseInt(num3) > 0 ? num3 : 0
            const fourth = parseInt(num4) > 0 ? num4 : 0
            const fifth = parseInt(num5) > 0 ? num5 : 0
            const result = first + second + third + fourth + fifth > 40 ? 40 : first + second + third + fourth + fifth

            return result
        }

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
                    onClick={() => handlePressGoBack()}
                >
                    <Icon type="caret-left" /> กลับ
                </Button>
                {candidatesData.map((objGroup, indexA) => {
                    let checkApproved = 1
                    let buttonStatus = saveScoreButtons[`button_${indexA}`] !== undefined ? saveScoreButtons[`button_${indexA}`].status : "normal"

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
                                {objGroup[0].salary_group}
                            </p>
                            <HorizontalLine />
                            {objGroup.map((objPerson, indexB) => {
                                const item = dataToSend[`group_${indexA}`] !== undefined ? dataToSend[`group_${indexA}`][`person_${indexB}`] : objPerson
                                if(item.is_approved === 0) {
                                    checkApproved = 0
                                }

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
                                            max={99} 
                                            placeholder="0"
                                            disabled={item.is_approved > 0 || buttonStatus === "loading" ? true : false}
                                            value={item !== null ? item.score_first : ""}
                                            onChange={(value) => saveScore(value, 'score_first', indexA, indexB)}
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={99} 
                                            placeholder="0"
                                            disabled={item.is_approved > 0 || buttonStatus === "loading" ? true : false}
                                            value={item !== null ? item.score_second : ""}
                                            onChange={(value) => saveScore(value, 'score_second', indexA, indexB)}
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={99} 
                                            placeholder="0"
                                            disabled={item.is_approved > 0 || buttonStatus === "loading" ? true : false}
                                            value={item !== null ? item.score_third : ""}
                                            onChange={(value) => saveScore(value, 'score_third', indexA, indexB)}
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={99} 
                                            placeholder="0"
                                            disabled={item.is_approved > 0 || buttonStatus === "loading" ? true : false}
                                            value={item !== null ? item.score_fourth : ""}
                                            onChange={(value) => saveScore(value, 'score_fourth', indexA, indexB)}
                                        />
                                        <StyledInputNumber
                                            type="number"
                                            size="small"
                                            min={0}
                                            max={99} 
                                            placeholder="0"
                                            disabled={item.is_approved > 0 || buttonStatus === "loading" ? true : false}
                                            value={item !== null ? item.score_fifth : ""}
                                            onChange={(value) => saveScore(value, 'score_fifth', indexA, indexB)}
                                        />
                                        <TotalScoreEachPerson
                                            totalscore={displayTotalScoreEachPerson(item.score_first, item.score_second, item.score_third, item.score_fourth, item.score_fifth)}
                                            className={displayTotalScoreEachPerson(item.score_first, item.score_second, item.score_third, item.score_fourth, item.score_fifth) === 40 ? "animated heartBeat" : ""}
                                        >
                                            {displayTotalScoreEachPerson(item.score_first, item.score_second, item.score_third, item.score_fourth, item.score_fifth)}
                                        </TotalScoreEachPerson>
                                    </div>
                                )
                            })}
                            {checkApproved ?
                            <div
                                className="animated bounceIn"
                                style={{
                                    display: "inline-block",
                                    marginTop: 10,
                                    lineHeight: 1.5,
                                    height: 32,
                                    padding: "0 15px",
                                    color: "rgb(100, 200, 100)"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "100%"
                                    }}
                                >
                                    <p
                                        style={{
                                            marginBottom: 0
                                        }}
                                    >
                                        <Icon type="check" /> บันทึกแล้ว
                                    </p>
                                </div>
                            </div> :
                            <Button
                                style={{
                                    marginTop: 10
                                }}
                                type="primary"
                                onClick={() => sendScoreDate(indexA)}
                                disabled={buttonStatus === "loading" && true}
                            >
                                {buttonStatus === "loading" ? 
                                    <Icon type="loading" /> :
                                    <Icon type="save" theme="filled" />
                                } บันทีก
                            </Button>}
                        </div>
                    )
                })}
                {(currentCandidateType === 1 && successRibbons.row_0 === 1) || (currentCandidateType === 2 && successRibbons.row_1 === 1) ?
                <div
                    className="animated bounceIn"
                    style={{
                        textAlign: "center"
                    }}
                >
                    <Icon
                        type="check-circle"
                        theme="filled"
                        style={{
                            fontSize: "4rem",
                            color: "rgba(0, 200, 0, 0.8)"
                        }}
                    /> 
                    <p
                        style={{
                            margin: "15px 0"
                        }}
                    >
                        ท่านได้ทำการส่งคะแนนของกลุ่มนี้เรียบร้อยแล้ว
                    </p>
                    <Button
                        type="primary"
                        style={{
                            marginBottom: "2rem"
                        }}
                        onClick={() => handlePressGoBack()}
                    >
                        <Icon type="caret-left" /> กลับ
                    </Button>
                </div> : ""}
            </div>
        )
    }

    function renderScoreContent() {
        return (
            <div>
                <MainTitle title="กรรมการให้คะแนน" />
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