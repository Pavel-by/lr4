import Emitter from 'events';

class Timer extends Emitter{
    static EventChanged = 'changed';

    _timerId;
    _current: Number;

    start(value) {
        this.cancel();
        this._current = Math.round(value);
        this._timerId = setInterval(() => {
            if (this._current === 0)
                this.cancel();

            this._current -= 1;
            this.emit(Timer.EventChanged, this._current);
        }, 1000);

        this.emit(Timer.EventChanged, this._current);
    }

    cancel() {
        if (this._timerId != null) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
    }
}

export default Timer;