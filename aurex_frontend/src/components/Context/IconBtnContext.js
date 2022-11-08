import { useState, createContext } from 'react';

const IconBtnContext = createContext({
    activeKey: -1,
    setActiveKey: null
});

export default IconBtnContext;