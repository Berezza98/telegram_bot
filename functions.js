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

function getFootballData(done){
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
            let data= $('.score ended a').eq(1).text();
            done(null, data);
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