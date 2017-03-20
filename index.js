const parser = require('./parser');
const P = require('bluebird');
const _ = require('lodash');
const slack = require('./slack');
const url = 'https://www.cian.ru/cat.php?currency=2&deal_type=rent&engine_version=2&foot_min=10&maxprice=40000&metro%5B0%5D=4&metro%5B10%5D=50&metro%5B11%5D=54&metro%5B12%5D=56&metro%5B13%5D=58&metro%5B14%5D=61&metro%5B15%5D=64&metro%5B16%5D=66&metro%5B17%5D=68&metro%5B18%5D=71&metro%5B19%5D=77&metro%5B1%5D=5&metro%5B20%5D=78&metro%5B21%5D=80&metro%5B22%5D=84&metro%5B23%5D=85&metro%5B24%5D=86&metro%5B25%5D=95&metro%5B26%5D=96&metro%5B27%5D=98&metro%5B28%5D=103&metro%5B29%5D=105&metro%5B2%5D=8&metro%5B30%5D=107&metro%5B31%5D=108&metro%5B32%5D=114&metro%5B33%5D=115&metro%5B34%5D=119&metro%5B35%5D=121&metro%5B36%5D=123&metro%5B37%5D=124&metro%5B38%5D=125&metro%5B39%5D=129&metro%5B3%5D=12&metro%5B40%5D=130&metro%5B41%5D=131&metro%5B42%5D=132&metro%5B43%5D=145&metro%5B44%5D=148&metro%5B45%5D=149&metro%5B46%5D=150&metro%5B47%5D=151&metro%5B48%5D=159&metro%5B49%5D=236&metro%5B4%5D=15&metro%5B50%5D=237&metro%5B5%5D=18&metro%5B6%5D=20&metro%5B7%5D=38&metro%5B8%5D=46&metro%5B9%5D=47&offer_type=flat&only_foot=2&room1=1&room2=1&type=-2&wp=1';

setInterval(() =>{
    parser
        .parse(url, 1)
        .then(res =>{
            if(_.isEmpty(res)) {
                console.info('No new data');
                return
            }

            P.map(res, flat =>{
                slack.notify(flat);
            }, {concurrency: 10})
                .then(() =>{
                    console.log('finish')
                })
        })
        .catch(e =>{
            console.error(e)
        });
}, 600000); //10 minutes