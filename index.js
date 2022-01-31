const fs = require('fs')
const fetch = require('node-fetch')

let token;
async function auth() {
    const params = new URLSearchParams();
    params.append('username', 'opendata');
    params.append('password', 'open_pass_bcrypt_data');
    params.append('grant_type', 'password');

    const res = (await fetch('https://mainapi.hsc.gov.ua/auth-server/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`opendata_cl_id_nopd:open_secret_encrypt_nopd`, 'binary').toString('base64')
        },
        body: params
    }))
    token = (await res.json()).access_token
}

async function getAllNums() {
    await auth();

    let allNums = [];
    const regions = []
    for (let i = 24; i > 0; i--) {
        regions.push(i);
    }
    for await (let region of regions) {
        const res = (await fetch(`https://mainapi.hsc.gov.ua/licenseplate-service/whs/plates/regionid/${region}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }))
        // console.log(res)
        const data = await res.json();
        allNums = [...allNums, ...data]
    }
    return allNums;
}

async function main() {
    let nums = JSON.parse(fs.readFileSync('nums.json', 'utf8'))

    // nums = await getAllNums();

    fs.writeFileSync('nums.json', JSON.stringify(nums))

    let majoresNums = []
    // nums = nums.sort((a, b) => Number(b.price) - Number(a.price))
    // console.log(~nums[0].licenceplate.indexOf('1501'))
    nums.forEach(item => {
        const num = String(item.number)
        if (item.licenceplate.slice(0, 2) !== 'ВН' && item.licenceplate.slice(0, 2) !== 'ОО' && item.licenceplate.slice(0, 2) !== 'НН') return;
        if (~item.licenceplate.indexOf('1234')) {
            majoresNums.push(item)
            console.log('1234 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('4321')) {
            majoresNums.push(item)
            console.log('4321 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('2802')) {
            majoresNums.push(item)
            console.log('2802 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('1501')) {
            majoresNums.push(item)
            console.log('1501 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('2709')) {
            majoresNums.push(item)
            console.log('2709 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('1208')) {
            majoresNums.push(item)
            console.log('1208 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('2305')) {
            majoresNums.push(item)
            console.log('2305 - ', item.licenceplate)
        }
        if (~item.licenceplate.indexOf('2102')) {
            majoresNums.push(item)
            console.log('2102 - ', item.licenceplate)
        }
        if (num.slice(0, 2) === num.slice(2)) {
            majoresNums.push(item)
            console.log('повторямба', item.licenceplate)
        }
        if (num.slice(0, 2) === num.slice(2).split('').reverse().join('')) {
            majoresNums.push(item)
            console.log('обратный', item.licenceplate)
        }
        // if (~item.licenceplate.indexOf('РЕ')) {
        //     console.log(item.licenceplate)
        //     majoresNums.push(item.licenceplate)
        // }
    })

    fs.writeFileSync('majors-nums.json', JSON.stringify(majoresNums))
}

main();
