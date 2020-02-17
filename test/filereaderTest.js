const assert = require('chai').assert;
const read = require('../filereader');

describe('FileReader', function () {
    it("FileReader should return 1 as a value for property 'answer'", function () {
        let result = read(['test/inputTest.json']);
        assert.equal(result[0].answer, 1);
    })
})