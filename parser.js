const _ = require('lodash');
const P = require('bluebird');
const request = P.promisifyAll(require('request'));
const cheerio = require('cheerio');
const store = require('./storage');


module.exports.parse = (url, concurrency = 1) =>{
    console.log('Start parsing');
    return request.getAsync(url)
        .then(res=>{
            if(res.statusCode !== 200) {
                console.error('Wrong status code:', res.statusCode);
                return [];
            }

            let $ = cheerio.load(res.body);
            const pagesCount = $('.pager_pages a').length + 1;

            return P.map(getGen(pagesCount), i =>{
                return request.getAsync(url + '&p=' + i)
                    .then(res =>{
                        console.log(`Page ${i} parsed`);
                        if(res.statusCode !== 200) {
                            return Promise.reject(new Error('Wrong status code:', res.statusCode));
                        }

                        return parsePage(res.body);
                    })
            }, {concurrency: concurrency})
                .then(r =>{
                    return r.concat(parsePage(res.body))
                })
        })
        .then(res =>{
            const data = {};
            res.forEach(res =>{
                _.extend(data, res)
            });


            const db = store.getAll();
            const newData = _.omit(data, Object.keys(db));
            store.saveAll(JSON.stringify(data));
            return prepare(newData);
        })
};

function* getGen(pagesCount){
    for(let i = 2; i <= pagesCount; i++) {
        yield i;
    }
}


function prepare(data){
    if(_.isEmpty(data)) {
        return;
    }
    let sorted = _.values(data);

    sorted = _.orderBy(sorted, ['price', 'area', 'commission'], ['desc', 'asc', 'desc']);
    return sorted;
}

function parsePage(body){
    if(!body) {
        return
    }
    let $ = cheerio.load(body);
    const res = {};

    $('.serp-list .serp-item').each((i, el) =>{
        const metro = $(el).find('div.serp-item__metro').text().trim();
        const floor = $(el).find('div.serp-item__floor-col .serp-item__solid').text().trim();
        const forLive = $(el).find('div.serp-item__floor-col .serp-item__prop').text().trim();
        const price = $(el).find('div.serp-item__price-col .serp-item__solid').text().trim().replace(' руб./мес.', '').replace(/ /g, '');
        const link = $(el).find('a.serp-item__card-link.link').attr('href');
        const area = $(el).find('.serp-item__area-col .serp-item__solid').text().replace(' м2', '');
        let img = $(el).find('.serp-item__fotorama').attr('style');
        if(img) {
            img = img.replace('background-image: url(', '').replace(/'/g, '').replace(');', '');
        }
        res[link + price] = {
            metro: metro, price: parseInt(price, 10), link: link, area: parseInt(area, 10), img: img,
            commission: $(el).find('div.serp-item__price-col .serp-item__prop').eq(0).text().replace('комиссия ', '').replace(/\t/g, '').replace(/\n/g, '').trim(),
            pledge: $(el).find('div.serp-item__price-col .serp-item__prop').eq(1).text().replace('залог ', '').replace(/\t/g, '').replace(/\n/g, '').trim(),
            desc: $(el).find('.serp-item__description__text').text().replace(/\t/g, '').replace(/\n/g, '').trim(),
            floor: floor, forLive: forLive
        };
    });

    return res;
}
