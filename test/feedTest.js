const feed = require('../components/feed');
feed('https://youthlin.com/feed')
    .then(site => {
        console.log('-----------------')
        //console.log(site);
    })
    .catch(error => {
        console.log(error);
    });
