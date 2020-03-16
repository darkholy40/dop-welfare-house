import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.padding || '0 1rem'};
    z-index: 1;
    width: 100%;
`

export default Container