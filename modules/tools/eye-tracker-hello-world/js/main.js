startNetwork({
    onGazePoint: (point) => {
        // Change circle position every time a gaze point is received
        $('#circle')
            .css('left', (point.x - circleRadius + window.pageXOffset) + 'px')
            .css('top', (point.y - circleRadius + window.pageYOffset) + 'px')
    },

    onFixation: (point) => {

        
        // When a fixation is received, words close to it are set as read
        const wordElements = getIntersectedWords(point);
        wordElements.forEach(wordElement => setRead(wordElement));
    }
});