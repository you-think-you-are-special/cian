const P = require('bluebird');
const request = P.promisifyAll(require('request'));
const hook = 'https://hooks.slack.com/services/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';
const hookVladimir = 'https://hooks.slack.com/services/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'; //vladimir


function notify(params, hook){
    console.log('Send data to slack');

    const {price, link, img, area, metro, commission, pledge, desc} = params;
    const text = link + '\n' + desc;

    const message = {
        "channel": "#cian",
        "icon_emoji": ":kissing_closed_eyes:",
        "attachments": [
            {
                "image_url": img,
                "title": metro,
                "title_link": link,
                "color": "#36a64f",
                "fields": [
                    {
                        "title": "Цена:",
                        "value": price + ' Руб.',
                        "short": true
                    },
                    {
                        "title": "Площадь:",
                        "value": area + ' м2',
                        "short": true
                    },
                    {
                        "title": "Комиссия:",
                        "value": commission,
                        "short": true
                    },
                    {
                        "title": "Залог:",
                        "value": pledge,
                        "short": true
                    },
                    {
                        "title": "Описание:",
                        "value": text,
                        "short": false
                    }

                ]
            }
        ]
    };

    return request
        .postAsync(
            hook,
            {
                form: JSON.stringify(message)
            }
        );
}

module.exports.notify = function(params){
    return notify(params, hook)
};

module.exports.notifyVladimir = function(params){
    return notify(params, hookVladimir)
};

