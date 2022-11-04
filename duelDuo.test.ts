
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

//test to check that when the Draw button is clicked that the app displays the div with id #choices

test('div with id #choices shows up when Draw button is clicked', async () => {
    driver.findElement(By.id('draw')).click()
    await driver.sleep(1000)
    
    const choices = await driver.findElement(By.id('choices.container'))
    const displayed = await choices.isDisplayed()
    expect(displayed).toBe(true)

})

//Check that clicking an “Add to Duo” button displays the div with id = “player-duo”

test('clicking add to duo button displays the div with id #player-duo', async () => {
    driver.findElement(By.id('draw')).click()
    await driver.sleep(1000)

    driver.findElement(By.css("bot.btn")).click()
    await driver.sleep(2000)

    const playerDuo = await driver.findElement(By.id('player-duo'))
    const displayed = await playerDuo.isDisplayed()

    expect(displayed).toBe(true)

})

//clicking on See All Bots shows all bots
//NOTE - should currently fail, but in a perfect world where this feature works, it should pass.

test('clicking on see all bots lists all available bots.', async () => {
    driver.findElement(By.id('see-all')).click()
    await driver.sleep(1500)

    const botList = await driver.findElement(By.className('bot-card outline'))
    const displayed = await botList.isDisplayed()

    expect(displayed).toBe(true)

})