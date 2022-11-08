export const getAuthToken = () => {
    if (localStorage.getItem('user_token')) {
        return localStorage.getItem('user_token')
    }
    return '';
}

export const removeAuthToken = () => {
    localStorage.removeItem('user_token');
}

export const setAuthToken = (token) => {
    localStorage.setItem('user_token', token);
    return true
}

export const setTheme = async (theme) => {
    if (theme == 'dark') {
        document.body.classList.add('light_theme');
    } else {
        document.body.classList.remove('light_theme');
    }
    localStorage.setItem('theme', theme);
    return theme
}

export const getTheme = () => {
    let theme = localStorage.getItem('theme');
    if (theme) {
        return theme
    }
    return 'dark'
}

export const changeTheme = (theme) => {
    if (theme == 'dark') {
        document.body.classList.add('light_theme');
    } else if (theme == 'light') {
        document.body.classList.remove('light_theme');
    }
    return true;
}

export const setTradeTheme = async (theme) => {
    localStorage.setItem('tradeTheme', theme);
    if (theme == 'dark') {
        document.body.classList.add('light_theme');
    } else if (theme == 'light') {
        document.body.classList.remove('light_theme');
    }
    return true;
}

export const changeTradeTheme = (theme) => {
    if (theme == 'dark') {
        document.body.classList.add('light_theme');
    } else if (theme == 'light') {
        document.body.classList.remove('light_theme');
    }
    return true;
}

export const getTradeTheme = () => {
    let theme = localStorage.getItem('tradeTheme');
    if (theme) {
        return theme
    }
    return 'dark'
}

export const setLang = async (value) => {
    localStorage.setItem('lang', value);
    return true
}

export const getLang = () => {
    if (localStorage.getItem('lang')) {
        return localStorage.getItem('lang')
    }
    return '';
}