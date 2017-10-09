const http= require('http');
const cheerio = require('cheerio');

function getEuro(done){
    const options = {
        protocol: 'http:',
        hostname: 'api.minfin.com.ua',
        path: '/mb/c97ab617e87f24bf5a6bbcc6f2af43115d4c8516',
        method: 'GET',
        headers: {}
    };
    const req= http.request(options, (res)=>{
        res.setEncoding('utf8');
        let result= '';
        res.on('data', (chunk) => {
            result+= chunk;
        });
        res.on('end', () => {
            done(null, JSON.parse(result));
        });
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        done(new Error('Проблеми з отриманням даних!'));
    });
    req.end();
}

function getFootballData(club, done){
    const options = {
        protocol: 'http:',
        hostname: 'football.ua',
        path: '',
        method: 'GET',
        headers: {}
    };
    const req= http.request(options, (res)=>{
        res.setEncoding('utf8');
        let result= '';
        res.on('data', (chunk) => {
            result+= chunk;
        });
        res.on('end', () => {
            let $= cheerio.load(result);
            if(club){
                let data= $(`.slide.first .feed-table td.right-team a:contains('${club}'), .slide.first .feed-table td.left-team a:contains('${club}')`);
            }
            if(club === 'сьогодні'){
                let data= $(`.slide.first .feed-table td.right-team a`);
            }
            let arrayOfData= [];
            for(let i=0; i< data.length; i++){
                let tr= data.eq(i).closest('tr');
                let footballObj= {
                    time: tr.find('.time').text().trim(),
                    leftTeam: tr.find('.left-team a').text().trim(),
                    rightTeam: tr.find('.right-team a').text().trim(),
                    score: tr.find('.score a').text().trim()
                }
                arrayOfData.push(footballObj);
            }
            done(null, arrayOfData);
        });
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        done(new Error('Проблеми з отриманням даних!'));
    });
    req.end();
}

module.exports= {
    getEuro,
    getFootballData
};