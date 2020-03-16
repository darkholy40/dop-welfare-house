import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: inline-block;
    box-sizing: border-box;
    margin-bottom: 30px;
    width: 100%;

    @media (max-width: 767px) {
        margin-bottom: 15px;
    }
`

const Shield = styled.div`
    display: flex;
    color: rgb(0, 0, 0);
    padding: 0.5rem 0px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    transition: 0.3s;
`

const Text = styled.span`
    font-size: 22px;
    line-height: 28px;

    @media (max-width: 767px) {
        font-size: 20px;
    }
`

function MainTitle(props) {
    return (
        <Container>
            <Shield>
                <Text>{props.title}</Text>
            </Shield>
        </Container>
    )
}

export default MainTitle