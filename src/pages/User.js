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
    padding: 1rem 2rem 2rem;
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

function User(props) {
    const [containerClass, setContainerClass] = useState('hidden')
    const [getData, setGetData] = useState(setInitialState('getData'))
    const [afterGettingdata, setAfterGettingData] = useState(setInitialState('afterGettingdata'))
    const [displayElements, setDisplayElements] = useState(setInitialState('displayElements'))

    const [useRankId, setUseRankId] = useState(setInitialState('useRankId'))
    const [firstName, setFirstName] = useState(setInitialState('firstName'))
    const [lastName, setLastName] = useState(setInitialState('lastName'))
    const [bornFrom, setBornFrom] = useState(setInitialState('bornFrom'))
    const [soldierGroup, setSoldierGroup] = useState(setInitialState('soldierGroup'))
    const [unit, setUnit] = useState(setInitialState('unit'))
    const [position, setPosition] = useState(setInitialState('position'))
    
    const [isLoading, setIsLoading] = useState(false)

    const [dopData, setDopData] = useState([])
    const [personTableVisibility, setPersonTableVisibility] = useState(false)
    const [personIdCardNumber, setPersonIdCardNumber] = useState('')
    const [personDetail, setPersonDetail] = useState([])
    const [activePersonPanel, setActivePersonPanel] = useState(1)
    const [searchCount, setSearchCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filterIsCleared, setFilterIsCleared] = useState(true)
    const paginationSize = 10

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
        setContainerClass('animated fadeIn')

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

    useEffect(() => {
        if(personTableVisibility === true) {
            axios.post(`${props.url}/getpersondetail`, {
                idCard13: personIdCardNumber,
            })
            .then(res => {
                const response = res.data

                if(response.code === '00200') { // ค้นหาข้อมูลกำลังพลรายบุคคลสำเร็จ
                    console.log(response.data)
                    setPersonDetail(response.data)
                }

                if(response.code === '00400') {
                    setPersonTableVisibility(false)

                    setTimeout(() => {
                        notification['error']({
                            message: 'แจ้งเตือน',
                            description: 'ไม่พบการเชื่อมต่อบนอุปกรณ์ของท่าน กรุณาตรวจสอบและลองใหม่อีกครั้ง',
                            duration: 4,
                        })
                    }, 300)
                }
            })
            .catch(() => {
                setPersonTableVisibility(false)

                setTimeout(() => {
                    notification['error']({
                        message: 'แจ้งเตือน',
                        description: 'การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง',
                        duration: 4,
                    })
                }, 300)
            })
        } else {
            setActivePersonPanel(1)
            setTimeout(() => {
                setPersonDetail([])
            }, 200)
        }
    }, [personTableVisibility])

    useEffect(() => {
        if(useRankId !== setInitialState('useRankId') || firstName !== setInitialState('firstName') || lastName !== setInitialState('lastName') || bornFrom !== setInitialState('bornFrom') || soldierGroup !== setInitialState('soldierGroup') || unit !== setInitialState('unit') || position !== setInitialState('position')) {
            setFilterIsCleared(false)
        } else {
            setFilterIsCleared(true)
        }
    }, [useRankId, firstName, lastName, bornFrom, soldierGroup, unit, position])

    function setInitialState(stateName) {
        switch (stateName) {
            case 'getData':
                return undefined

            case 'afterGettingdata':
                return 0

            case 'useRankId':
            case 'bornFrom':
            case 'soldierGroup':
            case 'unit':
                return '0'

            case 'firstName':
            case 'lastName':
            case 'position':
                return ''

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

                    getSetting()

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

    function getSetting(timer, type) {
        setTimeout(() => {
            axios.get(`${props.url}/getsetting`)
            .then(res => {
                const response = res.data

                if(response.code === '00200') { // สามารถดึงข้อมูลจาก hasura ได้
                    props.dispatch({
                        type: 'GET_SETTING',
                        data: response.setting
                    })

                    if(type === 'again') {
                        notification['success']({
                            message: 'แจ้งเตือน',
                            description: 'เชื่อมต่อสำเร็จ',
                            duration: 4,
                        })

                        swalCustomize.close()
                    }

                    if(dopData.length > 0) {
                        goSearch()
                    }
                }

                if(response.code === '00400') {
                    getSettingAgain()
                }
            })
            .catch((err) => {
                console.log(err)
                console.log('ไม่สามารถดึงค่าการตั้งค่าได้')
            })
        }, timer || 0)
    }

    function getSettingAgain() {
        swalCustomize({
            buttons: {
                connectAgain: {
                    text: 'ลองใหม่',
                    value: 'again'
                }
            },
            closeOnClickOutside: false,
            closeOnEsc: false,
            content: (
                <div style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    padding: '0.5rem 1rem',
                    border: 0,
                }}>
                    <Icon type="question-circle" theme="filled" style={{
                        color: '#dddddd',
                        fontSize: '4rem',
                        transition: '0.3s',
                    }} />
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}>
                        แจ้งเตือน
                    </div>
                    <div>
                        ไม่พบการเชื่อมต่อบนอุปกรณ์ของท่าน กรุณาตรวจสอบและกดปุ่มลองใหม่อีกครั้ง
                    </div>
                </div>
            )
        })
        .then((value) => {
            switch(value) {
                case "again":
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
                                    กำลังเชื่อมต่อ
                                </div>
                                <CustomizedSpin size="large" />
                            </div>
                        )
                    })
                    getSetting(500, 'again')
                    break

                default:
                    break
            }
        })
    }

    function selectRankId(value) {
        setUseRankId(value)
    }

    function selectBornFrom(value) {
        setBornFrom(value)
    }

    function selectSoldierGroup(value) {
        setSoldierGroup(value)
    }

    function selectUnit(value) {
        setUnit(value)
    }

    function firstnameTrigger(event) {
        const value = event.target.value
        setFirstName(value)
    }

    function lastnameTrigger(event) {
        const value = event.target.value
        setLastName(value)
    }

    function positionTrigger(event) {
        const value = event.target.value
        setPosition(value)
    }

    function goSearch() {
        setIsLoading(true)
        setCurrentPage(1)
        props.dispatch({
            type: 'TRIGGER_SEARCH_DRAWER',
            visibility: false
        })

        setTimeout(() => {
            axios.post(`${props.url}/getpersons`, {
                ranksId: useRankId,
                nameTh: firstName,
                surnameTh: lastName,
                bornFromsId: bornFrom,
                soldierGroupsId: soldierGroup,
                positionName: position
            })
            .then(res => {
                const response = res.data

                if(response.code === '00200') { // ค้นหาข้อมูลกำลังพลสำเร็จ
                    setDopData(response.data)
                    setSearchCount(searchCount + 1)
                }

                if(response.code === '00400') {
                    getSettingAgain()
                }

                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                setAfterGettingData(4)
                setGetData(setInitialState('getData'))
                console.log(err)
            })
        }, 250)
    }

    function setAllFilterToInitialState() {
        setUseRankId(setInitialState('useRankId'))
        setFirstName(setInitialState('firstName'))
        setLastName(setInitialState('lastName'))
        setBornFrom(setInitialState('bornFrom'))
        setSoldierGroup(setInitialState('soldierGroup'))
        setUnit(setInitialState('unit'))
        setPosition(setInitialState('position'))
    }

    function desktopPaginationIsChanged(value) {
        setCurrentPage(value)
    }

    function mobilePaginationIsChanged(value) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        setCurrentPage(value)
    }

    function checkImageExist(profile) {
        try {
            require(`../images/profiles/${profile}.jpg`)

            return <ProfileImage src={require(`../images/profiles/${profile}.jpg`)} alt={profile} />
        } catch {
            return <span>ไม่มีรูป</span>
        }
    }

    function displayRank(obj) {
        const result = obj.join_ranks !== null
            ? `${obj.join_ranks.short_name}${obj.sex === 'M' ? "" : obj.join_ranks.rank_order < 19 ? "หญิง" : ""}`
            : "-"

        return result
    }

    function displayPersonsTable() {
        const columns = [
            {
                title: 'ลำดับ',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'ยศ',
                dataIndex: 'rank',
                key: 'rank',
            },
            {
                title: 'ชื่อ',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'สกุล',
                dataIndex: 'surname',
                key: 'surname',
            },
            {
                title: 'วันเกิด',
                dataIndex: 'birthday',
                key: 'birthday',
            },
            {
                title: 'กำเนิด',
                dataIndex: 'born_froms',
                key: 'born_froms',
            },
            {
                title: 'ตำแหน่ง',
                dataIndex: 'position_name',
                key: 'position_name',
                render: (text) => {
                    return (
                        <div style={{
                            maxWidth: 200,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        }}>
                            {text}
                        </div>
                    )
                }
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render: (text, row) => {
                    return (
                        <PersonDetailIcon type="search" onClick={() => {
                            setPersonIdCardNumber(row.id_card13)
                            setPersonTableVisibility(true)
                        }} />
                    )
                }
            }
        ]

        const getDopData = []
        dopData.map((item, index) => {
            getDopData.push({
                key: `${index+1}`,
                rank: displayRank(item),
                name: item.name_th,
                surname: item.surname_th,
                birthday: displayDateFotmat(item.birthdate, 'th', 'short'),
                born_froms: item.join_born_froms !== null ? item.join_born_froms.short_name : "ไม่มีข้อมูล",
                position_name: item.position_name,
                id_card13: item.id_card13
            })

            return 0
        })

        return (
            <DopDataTableBlock>
                <Table
                    columns={columns}
                    dataSource={getDopData}
                    size="middle"
                    pagination={{ 
                        size: "small",
                        total: dopData.length,
                        pageSize: paginationSize,
                        onChange: desktopPaginationIsChanged,
                        current: currentPage
                    }}
                />
                <PersonDetailModal
                    width="100%"
                    visible={personTableVisibility}
                    maskClosable={false} // will close a modal when area outside the modal was clicked
                    footer={null}
                    destroyOnClose={true}
                    closable={false}
                >
                    <div className="header">
                        <span className="title">ค้นหากำลังพล</span>
                        <span className="close-icon">
                            <Icon type="close" onClick={() => setPersonTableVisibility(false)} />
                        </span>
                    </div>
                    <div className="body">
                        {personDetail.length > 0
                            ? <>
                                <div className="top">
                                    <div className="pic">
                                        {checkImageExist(personDetail[0].id_card13)}
                                    </div>
                                    <div className="name">
                                        <span>{`${displayRank(personDetail[0])} ${personDetail[0].name_th}`}</span>
                                        <span className="rightCol">{personDetail[0].surname_th}</span>
                                    </div>
                                </div>
                                <Collapse
                                    bordered={false}
                                    activeKey={activePersonPanel}
                                    expandIconPosition="right"
                                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                    onChange={(value) => {
                                        setActivePersonPanel(value)}
                                    }
                                >
                                    <CustomPanelStyle header="ข้อมูลบุคคล" key="1">
                                        <div>
                                            <span>ยศ: {personDetail[0].join_ranks.name}</span>
                                            <span className="right">วันที่ครองยศ: value</span>
                                        </div>
                                        <div>
                                            <span>ชื่อ: {personDetail[0].name_th}</span>
                                            <span className="right">{personDetail[0].surname_th}</span>
                                        </div>
                                        <div>
                                            <span>ชื่อเล่น: <Error>-</Error></span>
                                        </div>
                                        <div>
                                            <span>เลขประจำตัวประชาชน: {personDetail[0].id_card13}</span>
                                        </div>
                                        <div>
                                            <span>วัน เดือน ปีเกิด: {personDetail[0].birthdate !== null ? displayDateFotmat(personDetail[0].birthdate, 'th', 'long') : '-'}</span>
                                            <span className="right">อายุ {new Date().getUTCFullYear() - parseInt(personDetail[0].birthdate.substring(0, 4))} ปี</span>
                                        </div>
                                        <HorizontalLine />
                                        <div>
                                            <span>กำเนิด: {personDetail[0].join_born_froms.name}</span>
                                            <span className="right">เหล่า: {personDetail[0].join_soldier_groups.name}</span>
                                        </div>
                                        <div>
                                            <span>เลขประจำตัวทหาร: {personDetail[0].soldier_number}</span>
                                        </div>
                                        <div>
                                            <span>ตท. รุ่นที่: {personDetail[0].preparatory_no || "-"}</span>
                                            <span className="right">จปร. รุ่นที่: {personDetail[0].crma_no || "-"}</span>
                                        </div>
                                        <div>
                                            <span>หลักฐานการบรรจุ: {personDetail[0].contain}</span>
                                        </div>
                                        <div>
                                            <span>วันที่บรรจุ: {personDetail[0].contain_date !== null ? displayDateFotmat(personDetail[0].contain_date, 'th', 'long') : '-'}</span>
                                            <span className="right">ลงวันที่: value</span>
                                        </div>
                                        <div>
                                            <span>วันขึ้นทะเบียน: {personDetail[0].register_date !== null ? displayDateFotmat(personDetail[0].register_date, 'th', 'long') : '-'}</span>
                                        </div>
                                        <div>
                                            <span>สังกัด: <Error>-</Error></span>
                                            <span className="right">ตำแหน่ง: {personDetail[0].position_name}</span>
                                        </div>
                                        <div>
                                            <span>วันที่เริ่มปฏิบัติงาน: <Error>-</Error></span>
                                        </div>
                                        <div>
                                            <span>เงินเดือน: ระดับ value ชั้น value</span>
                                        </div>
                                        <div>
                                            <span>หมายเลขโทรศัพท์มือถือ: {personDetail[0].telephone_number}</span>
                                        </div>
                                        <div>
                                            <span>ชื่อ บิดา: {personDetail[0].father_name}</span>
                                            <span className="right">{personDetail[0].father_surname}</span>
                                        </div>
                                        <div>
                                            <span>ชื่อ มารดา: {personDetail[0].mother_name}</span>
                                            <span className="right">{personDetail[0].mother_surname}</span>
                                        </div>
                                    </CustomPanelStyle>
                                    <CustomPanelStyle header="การศึกษาทางพลเรือน" key="2">
                                        <div>
                                            <span>สถานศึกษา: </span>
                                            <span className="right">ประเทศ: </span>
                                        </div>
                                        <div>
                                            <span>วุฒิการศึกษา: </span>
                                            <span className="right">ระดับการศึกษา: </span>
                                        </div>
                                        <div>
                                            <span>สาขาวิชาเอก: </span>
                                            <span className="right">วันที่สำเร็จ: </span>
                                        </div>
                                        <div>
                                            <span>ผลการศึกษา: </span>
                                        </div>
                                    </CustomPanelStyle>
                                </Collapse>
                            </>
                            : <div style={{textAlign: 'center'}}>
                                <CustomizedSpin size="large" />
                            </div>
                        }
                    </div>
                    <div className="footer">
                        <Button
                            style={{ width: 90 }}
                            type="default"
                            size="default"
                            onClick={() => setPersonTableVisibility(false)}
                        >
                            ปิด
                        </Button>
                    </div>
                </PersonDetailModal>
            </DopDataTableBlock>
        )
    }

    function displaySearchOption() {
        return (
            <>
                <MyCard>
                    <span className="label">ยศ</span>
                    <MySelect
                        showSearch
                        size="large"
                        placeholder="เลือกยศ"
                        optionFilterProp="children"
                        value={useRankId}
                        onChange={selectRankId}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={isLoading === true && true}
                    >
                        <Option value="0">ทั้งหมด</Option>
                        {props.setting.rank.map((aRank, index) => {
                            return (
                                <Option key={index} value={aRank.id}>{aRank.short_name}</Option>
                            )
                        })}
                    </MySelect>
                </MyCard>
                <MyCard>
                    <span className="label">ชื่อ</span>
                    <MyInput
                        size="large"
                        type="text"
                        placeholder="ชื่อ"
                        name="name"
                        value={firstName}
                        onChange={firstnameTrigger}
                        // onKeyPress={``}
                        disabled={isLoading === true && true}
                    />
                </MyCard>
                <MyCard>
                    <span className="label">สกุล</span>
                    <MyInput
                        size="large"
                        type="text"
                        placeholder="สกุล"
                        name="surname"
                        value={lastName}
                        onChange={lastnameTrigger}
                        // onKeyPress={``}
                        disabled={isLoading === true && true}
                    />
                </MyCard>
                <MyCard>
                    <span className="label">กำเนิด</span>
                    <MySelect
                        showSearch
                        size="large"
                        placeholder="เลือกกำเนิด"
                        optionFilterProp="children"
                        value={bornFrom}
                        onChange={selectBornFrom}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={isLoading === true && true}
                    >
                        <Option value="0">ทั้งหมด</Option>
                        {props.setting.born.map((born, index) => {
                            return (
                                <Option key={index} value={born.id}>{born.short_name}</Option>
                            )
                        })}
                    </MySelect>
                </MyCard>
                <MyCard>
                    <span className="label">เหล่า</span>
                    <MySelect
                        showSearch
                        size="large"
                        placeholder="เลือกเหล่า"
                        optionFilterProp="children"
                        value={soldierGroup}
                        onChange={selectSoldierGroup}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={isLoading === true && true}
                    >
                        <Option value="0">ทั้งหมด</Option>
                        {props.setting.groups.map((group, index) => {
                            return (
                                <Option key={index} value={group.id}>{group.short_name}</Option>
                            )
                        })}
                    </MySelect>
                </MyCard>
                <MyCard>
                    <span className="label">สังกัด</span>
                    <MySelect
                        showSearch
                        size="large"
                        placeholder="เลือกสังกัด"
                        optionFilterProp="children"
                        value={unit}
                        onChange={selectUnit}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={isLoading === true && true}
                    >
                        <Option value="0">ทั้งหมด</Option>
                        <Option value="1">กธก.กพ.ทบ.</Option>
                        <Option value="2">กตพ.สผพ.กพ.ทบ.</Option>
                        <Option value="3">กคง.สผพ.กพ.ทบ.</Option>
                        <Option value="4">กวค.สผพ.กพ.ทบ.</Option>
                        <Option value="5">กจก.สพบ.กพ.ทบ.</Option>
                        <Option value="6">กสท.สพบ.กพ.ทบ.</Option>
                        <Option value="7">กกศ.สพบ.กพ.ทบ.</Option>
                        <Option value="8">กปค.สปบ.กพ.ทบ.</Option>
                        <Option value="9">กบพ.สปบ.กพ.ทบ.</Option>
                        <Option value="10">กสพ.สปบ.กพ.ทบ.</Option>
                        <Option value="11">ฝกพ.ศปก.ทบ.</Option>
                        <Option value="12">สง.ผบช.กพ.ทบ.</Option>
                    </MySelect>
                </MyCard>
                <MyCard>
                    <span className="label">ตำแหน่ง</span>
                    <MyInput
                        size="large"
                        type="text"
                        placeholder="ตำแหน่ง"
                        name="position"
                        value={position}
                        onChange={positionTrigger}
                        // onKeyPress={``}
                        disabled={isLoading === true && true}
                    />
                </MyCard>
                <MyCard
                    style={{
                        marginTop: 10,
                        flexDirection: 'row'
                    }}
                >
                    <Button
                        style={{ width: 90 }}
                        type="primary"
                        size="large"
                        onClick={() => goSearch()}
                        disabled={isLoading === true && true}
                    >
                        {isLoading === true ? <Icon type="loading" /> : "ค้นหา"}
                    </Button>
                    <Button
                        style={{ width: 90 }}
                        type="link"
                        size="large"
                        onClick={() => setAllFilterToInitialState()}
                        disabled={isLoading === true || filterIsCleared === true ? true : false}
                    >
                        ล้าง
                    </Button>
                </MyCard>
            </>
        )
    }

    function displayContentByRole() {
        switch (getData.role) {
            case 1: // Commander will see (This user can only read data.)
            case 2: // Staff will see (This user can read/write data.)
                return (
                    <Col xs={24}>
                        <MainTitle title="ค้นหากำลังพล" />
                        <DesktopCol lg={6} md={24} className="animated fadeIn">
                            <MyRow>
                                {displaySearchOption()}
                            </MyRow>
                        </DesktopCol>
                        <GetDataCol lg={18} md={24} setalignment={isLoading === true ? "center" : "left"}>
                            {isLoading === true 
                            ? <LoadingBlock>
                                <CustomizedSpin size="large" />
                                <span>กำลังค้นหา...</span>
                            </LoadingBlock>
                            : searchCount > 0
                                ? <div style={{opacity: 0}} className="animated fadeIn">
                                    <MyTotalRow>
                                        <span className="total">พบ {dopData.length} รายการ</span>
                                    </MyTotalRow>
                                    {displayPersonsTable()}
                                    {dopData.length === 0 && 
                                        <MobileCol xs={24}>
                                            {customizeRenderEmpty()}
                                        </MobileCol>
                                    }
                                    {dopData.slice((paginationSize*currentPage)-paginationSize, paginationSize*currentPage).map((item, index) => {
                                        return (
                                            <PersonelCard 
                                                key={index}
                                                className="animated fadeIn"
                                                onClick={() => {
                                                    setPersonIdCardNumber(item.id_card13)
                                                    setPersonTableVisibility(true)
                                                }}
                                            >
                                                <div>
                                                    <p style={{
                                                        padding: 0,
                                                        color: 'rgb(150, 150, 150)'
                                                    }}>
                                                        {(currentPage*paginationSize)-(paginationSize-1)+index}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '1rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {displayRank(item)} {item.name_th} {item.surname_th}
                                                    </p>
                                                    <p>วันเกิด: {displayDateFotmat(item.birthdate, 'th', 'long')}</p>
                                                    <p>เหล่า: {item.join_soldier_groups !== null ? item.join_soldier_groups.short_name : "ไม่มีข้อมูล"}</p>
                                                    <p>กำเนิด: {item.join_born_froms !== null ? item.join_born_froms.short_name : "ไม่มีข้อมูล"}</p>
                                                    <p>ตำแหน่ง: {item.position_name}</p>
                                                </div>
                                            </PersonelCard>
                                        )
                                    })}
                                    {dopData.length > 0 && 
                                        <MobileCol xs={24}>
                                            <Pagination
                                                size="small"
                                                total={dopData.length}
                                                pageSize={paginationSize}
                                                onChange={mobilePaginationIsChanged}
                                                current={currentPage}
                                                style={{
                                                    marginTop: '0.75rem'
                                                }}
                                            />
                                        </MobileCol>
                                    }
                                </div>
                                : <MyTotalRow style={{
                                    textAlign: 'center',
                                    padding: '5rem 0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Icon type="database" theme="filled" style={{
                                            fontSize: '4rem',
                                            color: 'rgb(225,225,225)',
                                            marginBottom: 10
                                        }}/>
                                        <span className="description">ผลลัพธ์การค้นหาจะแสดงที่นี่</span>
                                    </div>
                                </MyTotalRow>
                            }
                        </GetDataCol>
                    </Col>
                )
        
            // case 2: // Staff will see
            //     return (
            //         <Title>This user can read/write data.</Title>
            //     )

            case 3: // Admin will see
                return (
                    <Title>This user can use the User Management menu and read/write data.</Title>
                )

            default:
                break
        }
    }

    return (
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <ThisContainer className={containerClass} padding={afterGettingdata === 1 && "2rem 1rem"}>
                {getData !== undefined
                    ? <ScoreRow className="animated fadeIn">
                        {displayContentByRole()}
                    </ScoreRow>
                    : <ErrorBlock className="animated fadeIn">
                        {displayElements}
                    </ErrorBlock>
                }
            </ThisContainer>
            <SearchDrawer
                title="ค้นหากำลังพล"
                placement="right"
                onClose={() => {
                    props.dispatch({
                        type: 'TRIGGER_SEARCH_DRAWER',
                        visibility: false
                    })
                }}
                visible={props.dopSearchDrawer}
            >
                {displaySearchOption()}
            </SearchDrawer>
        </ConfigProvider>
    )
}

export default connect(mapStateToProps)(User)