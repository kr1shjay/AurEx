// import package
import React from 'react';

// import component
import List from './List';
import Post from './Post'
import Chat from './Chat';

const P2P = (props) => {
    const { type } = props;
    if (type == 'list') {
        return <List />
    } else if (type == 'post') {
        return <Post />
    } else if (type == 'chat') {
        return <Chat />
    }
    return <div />
}

export default P2P;