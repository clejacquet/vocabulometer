const { parse } = require('subtitle');

module.exports = (srt) => {
    try {
        return parse(srt)
            .map(srt => srt.text)
            .join('. ')
            .replace(/\r?\n/g, '')
            .replace(/\([^)]*\)/g, '')
            .replace(/\*[^*]*\*/g, '')
            .replace(/([!?.])\./g, "$1 ")
            .replace(/ + /g, ' ')
            .replace(/ +\./g, '.');
    } catch (e) {
        console.error(e);
        return ''
    }
};
