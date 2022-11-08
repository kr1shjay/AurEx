const isLogin = () => {
    if (localStorage.getItem('admin_token')) {
        return true;
    }
    return false;
}

export default isLogin;