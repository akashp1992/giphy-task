import React from 'react'
import Styled from 'styled-components';

const Loader = () => {
    return (
        <LoaderStyle>
            <i className="fas fa-spinner fa-4x fa-spin" />
        </LoaderStyle>
    )
}

const LoaderStyle = Styled.div`
  color:blue;
  `;

export default Loader