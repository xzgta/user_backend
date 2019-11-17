const express = require('express')
const router = express()
const modules = require("../modules.js");
const fetch = require('node-fetch');

router.post('/', (req, res, next) => {

    const functionGetLink = (url) => {
        fetch(`https://www.instadownloader.org/data.php?url=` + `${url}`)
            .then(res => res.text())
            .then(body => {
                let igeh = body.split('true|')[1].split('|picture|')[0]
                res.send(igeh)
            })
    }
    const grabLink = functionGetLink(req.body.link);
    console.log(grabLink)
    res.send(grabLink);
})

module.exports = router;