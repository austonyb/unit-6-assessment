const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')
require("dotenv").config()

const {ACCESS_TOKEN, PORT} = process.env

app.use(express.json())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// Send up-status and port to Rollbar.
rollbar.info(`Server up and running on port: ${PORT}`)

//endpoints

//home
try {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "/public/index.html"))
    })
} catch {
    rollbar.critical('root endpoint wont load')
}


//stylesheet
try {
    app.get('/styles', (req, res) => {
        res.sendFile(path.join(__dirname, "/public/index.css"))
    })
} catch {
    rollbar.critical('CSS stylesheet wont load')
}


//js endpoint
try {
    app.get('/js', (req, res) => {
        res.sendFile(path.join(__dirname, "/public/index.js"))
    })
} catch {
    rollbar.critical('logic to the site is missing! Javascript file wont load')
}


//---------^----END PAGE ENDPOINTS-----^--------

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        rollbar.error('Error getting bots.')
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        rollbar.info("bots shuffled!")
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        rollbar.error('Error shuffling bots.')
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.error('Error dueling. User sent Error code 400.')
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const port = PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})