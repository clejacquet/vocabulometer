
const circleRadius = 41;
let words = [];
let info = true;

function intersectRectCircle(rect, circle) {
    const dx = circle.x - Math.max(rect.left, Math.min(circle.x, rect.left + rect.width));
    const dy = circle.y - Math.max(rect.top, Math.min(circle.y, rect.top + rect.height));
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

function zip(rows) {
    return rows[0].map((_, c) => rows.map(row => row[c]));
}

function surroundWords(interWords, words, classWord) {
    const wordSpans = words.map(word => '<span class="' + classWord + '">' + word.raw + '</span>');

    return '<p>' + [].concat.apply([], zip([interWords, wordSpans.concat([''])])).join('') + '</p>';
}

function parseToHTML(textDoc) {
    return textDoc
        .map((paragraph) => {
            const words = paragraph.words;
            const interWords = paragraph.interWords;

            return this.surroundWords(interWords, words, 'word');
        })
        .join('\r\n');
}

function getIntersectedWords(point) {
    const circle = {
        x: point.x,
        y: point.y,
        radius: circleRadius
    };

    return words.filter(w => intersectRectCircle(w.getBoundingClientRect(), circle));
}

function setRead(word) {
    if (info) {
        $(word).addClass('read');
    } else {
        $(word).addClass('read-off');
    }

}

function toggleInfoMode() {
    info = !info;

    words.forEach(word => {
        if ($(word).hasClass('read')) {
            $(word).addClass('read-off');
            $(word).removeClass('read');
        } else if ($(word).hasClass('read-off')) {
            $(word).addClass('read');
            $(word).removeClass('read-off');
        }
    });
    $('#circle').toggleClass('circle-off');
}


$(() => {
    const text = $('#text');

    $.ajax({
        url: 'assets/text.json',
        success: (result) => {
            text.html(parseToHTML(result));

            words = Array.from(document.getElementsByClassName('word'));
        },
        error: (err) => {
            console.error(err);
        }
    });

    $('#toggle-active').on('click', () => {
        toggleInfoMode();
    });

    $('#font-size').on('change', () => {
        $('#text').css('font-size', $('#font-size').val() + 'px');
    });

    $('#line-height').on('change', () => {
        $('#text').css('line-height', $('#line-height').val() + '%');
    });

    toggleInfoMode();
});