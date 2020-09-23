module.exports = page => {
    return page.evaluate(() => {
        const ls = JSON.stringify(localStorage);

        return JSON.parse(ls);
    });
};
