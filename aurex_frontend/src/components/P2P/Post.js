// import package
import React, { useRef } from 'react'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import PostHistory from './PostHistory';
import PostAds from './PostAds';

const Post = () => {
    const histRef = useRef()

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={5} lg={3}>
                <PostHistory
                    ref={histRef}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={7} lg={9}>
                <GridContainer>
                    <PostAds histRef={histRef} />
                </GridContainer>
            </GridItem>
        </GridContainer>
    )
}

export default Post;