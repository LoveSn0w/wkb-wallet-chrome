const env = process.env.NODE_ENV;

var helper = {};

if (env === 'development') {
    helper.appDetail = {
        version:'0.01',
        id:'123456'
    }
}

if (env === 'production') {
    helper.appDetail = chrome.app.getDetails();
}

export default helper;