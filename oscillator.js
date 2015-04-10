$(function () {

    /**
     * Frequencies.
     */
    var frequencies = {
        "-": 0,
        c: 261.6,
        cis: 277.2,
        d: 293.7,
        dis: 311.1,
        e: 329.6,
        f: 349.2,
        fis: 370.0,
        g: 392.0,
        gis: 415.3,
        a: 440.0,
        ais: 466.2,
        b: 493.9
        //523.3
    };

    /**
     * Note.
     */
    var Note = function (note) {
        var parts = note.match(/^(\d{1,2})(#?)([a-g\-])(\d)?$/);
        var length = parseInt(parts[1], 10);
        var accidental = parts[2] !== "";
        var note = parts[3] + (accidental ? "is": "");
        var octave = parseInt(parts[4], 10);

        var frequency = frequencies[note] * Math.pow(2, octave - 1);
        var length = Math.floor(1800 / length);

        function getFrequency() {
            return frequency;
        }

        function getLength() {
            return length;
        }

        return {
            getFrequency: getFrequency,
            getLength: getLength
        };
    };

    /**
     * Tune.
     */
    var Tune = function () {
        var notes = [],
            index;

        function load(code) {
            notes = [];
            $.each(code.split(" "), function (i, note) {
                notes.push(new Note(note));
            });
            reset();
        }

        function reset() {
            index = 0;
        }

        function getNote() {
            return notes[index++];
        }

        return {
            load: load,
            reset: reset,
            getNote: getNote
        };
    };

    /**
     * Player.
     */
    var Player = function () {
        var tune,
            context = new AudioContext(),
			oscillator = null;

        function play(t) {
            tune = t;
            tune.reset();
            playNote();
        }

        function playNote() {
            var note = tune.getNote();
				oscillator && oscillator.stop();
				oscillator = context.createOscillator();
				oscillator.type = 0;
				oscillator.connect(context.destination);
				oscillator.start();
            if (!note) {
                oscillator.frequency.value = 0;
            } else {
                oscillator.frequency.value = note.getFrequency() || 0;
                setTimeout(playNote, note.getLength());
            }
        }

        return {
            play: play
        };
    };

    var player = new Player;

    $("#play").click(function () {
        var code = $("textarea").val();
        var tune = new Tune();
        tune.load(code);
        player.play(tune);
    });

});
