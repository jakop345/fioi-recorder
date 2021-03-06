
import React from 'react';
import {Button} from 'react-bootstrap';
import EpicComponent from 'epic-component';

export default function (bundle, deps) {

  bundle.use(
    'recorderStart', 'recorderStop',
    'isTranslated',
    'StepperControls', 'ExamplePicker', 'FullscreenButton'
  );

  bundle.defineSelector('RecorderControlsSelector', function (state, props) {
    const recorder = state.get('recorder');
    const status = recorder.get('status');
    const canStart = status === 'ready';
    const canStop = status === 'recording';
    const canPause = false;
    const isRecording = status === 'recording';
    const elapsed = recorder.get('elapsed') || 0;
    const events = recorder.get('events');
    const eventCount = events && events.count();
    const isTranslated = deps.isTranslated(state);
    return {canStart, canStop, canPause, isRecording, isTranslated, elapsed, eventCount};
  });

  bundle.defineView('RecorderControls', 'RecorderControlsSelector', EpicComponent(self => {

    const onStartRecording = function () {
      self.props.dispatch({type: deps.recorderStart});
    };

    const onStopRecording = function () {
      self.props.dispatch({type: deps.recorderStop});
    };

    const onPauseRecording = function () {
      // TODO
    };

    const zeroPad2 = function (n) {
      return ('0'+n).slice(-2);
    };
    const timeFormatter = function (ms) {
      let s = Math.round(ms / 1000);
      const m = Math.floor(s / 60);
      s -= m * 60;
      return zeroPad2(m) + ':' + zeroPad2(s);
    };

    self.render = function () {
      const {canStart, canStop, canPause, isRecording, isTranslated, elapsed} = self.props;
      return (
        <div className="pane pane-controls clearfix">
          <div className="pane-controls-right">
            {isRecording || <deps.ExamplePicker/>}
            <deps.FullscreenButton/>
          </div>
          <div className="controls controls-main">
            {canStart &&
              <div>
                <Button onClick={onStartRecording} className="float-left">
                  <i className="fa fa-circle" style={{color: '#a01'}}/>
                  </Button>
                {" démarrer un enregistrement"}
              </div>}
            {canStop &&
              <Button onClick={onStopRecording}>
                <i className="fa fa-stop"/>
              </Button>}
            {canPause &&
              <Button onClick={onPauseRecording}>
                <i className="fa fa-pause"/>
              </Button>}
            {isRecording &&
              <p>
                <i className="fa fa-clock-o"/>
                {' '}
                {timeFormatter(elapsed)}
              </p>}
          </div>
          <deps.StepperControls enabled={isRecording}/>
        </div>
      );
    };

  }));

};
