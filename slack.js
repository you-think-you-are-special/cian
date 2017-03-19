const P = require('bluebird');
const request = P.promisifyAll(require('request'));
const hook = 'https://hooks.slack.com/services/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';

module.exports.notify = function(params){
    console.log('Send data to slack');

    const {price, link, img, area, metro, commission, pledge, text} = params;

    const message = {
        "channel": "#cian",
        "icon_emoji": ":kissing_closed_eyes:",
        "attachments": [
            {
                "pretext": text,
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

