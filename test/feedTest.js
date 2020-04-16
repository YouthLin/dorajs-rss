const feed = require('../components/feed');
feed('https://youthlin.com/feed')
    .then(result => {
        console.log('-----------------')
        console.log(result.meta);
        console.log('-----------------')
        console.log(result.articles[0]);
    })
    .catch(error => {
        console.log(error);
    });
