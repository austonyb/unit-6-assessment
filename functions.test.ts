const {shuffleArray} = require('./utils')

let testArr = [1,2,3,4,5,6,7,8,9,0]

describe('shuffleArray should', () => {
    //tests whether shuffleArray sends back an array that is the same length as the array sent in.
    it('is the same size even if it is in a different order', () => {
        expect(shuffleArray(testArr).length).toBe(testArr.length)
    })

    //test to make sure that the array sent back from shuffleArray is not in the same order as the one sent in.
    it('is a different order than it was before', () => {
        expect(shuffleArray(testArr)).not.toBe(testArr)
    })
    


})