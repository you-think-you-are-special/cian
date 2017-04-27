const P = require('bluebird');
const request = P.promisifyAll(require('request'));
const hook = 'https://hooks.slack.com/services/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';

module.exports.notify = function(params){
    console.log('Send data to slack');

    const {price, link, img, area, metro, desc, text, floor, forLive} = params;

    if(forLive === 'жилой дом') {
        return;
    }

    const message = {
        "channel": "#jane_cian",
        "icon_emoji": ":kissing_closed_eyes:",
        "attachments": [
            {
                "pretext": text,
                "image_url": img,
                "title": link,
                "title_link": link,
                "color": "#36a64f",
                "fields": [
                    {
                        "title": "Метро:",
                        "value": metro,
                        "short": true
                    },
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
                        "title": "Этаж:",
                        "value": floor,
                        "short": true
                    },
                    {
                        "title": "Описание:",
                        "value": desc,
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
};

