import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Container from '../components/layouts/Container'
import NotFound from '../components/functions/NotFound'

function mapStateToProps(state) {
    return state
}

function WrongUrl(props) {
    useEffect(() => {
        props.dispatch({
            type: 'SET_APP_CLASS',
            data: 'notfound'
        })
    }, [])

    return (
        <Container className="animated fadeIn">
            <NotFound />
        </Container>
    )
}

export default connect(mapStateToProps)(WrongUrl)