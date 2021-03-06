
import React from 'react';
import {Button, Panel} from 'react-bootstrap';
import EpicComponent from 'epic-component';

export default function (bundle, deps) {

  bundle.use(
    'getTranslateState', 'getStepperDisplay', 'getStepperOptions',
    'translateClearDiagnostics', 'stepperExit',
    'BufferEditor', 'StackView', 'DirectivesPane', 'IOPane'
  );

  bundle.defineSelector('MainViewSelector', function (state, props) {
    const translate = deps.getTranslateState(state);
    const diagnostics = translate && translate.get('diagnosticsHtml');
    const stepperDisplay = deps.getStepperDisplay(state);
    const haveStepper = !!stepperDisplay;
    const error = haveStepper && stepperDisplay.error;
    const readOnly = haveStepper || props.preventInput;
    const options = deps.getStepperOptions(state);
    return {diagnostics, haveStepper, readOnly, error, options};
  });

  bundle.defineView('MainView', 'MainViewSelector', EpicComponent(self => {

    const onClearDiagnostics = function () {
      self.props.dispatch({type: deps.translateClearDiagnostics});
    };

    const onStepperExit = function () {
      self.props.dispatch({type: deps.stepperExit});
    };

    const renderSourcePanelHeader = function () {
      return (
        <span>
          {'Source'}
          {self.props.haveStepper && <span>{' '}<i className="fa fa-lock"/></span>}
        </span>
      );
    };

    const diagnosticsPanelHeader = (
      <div>
        <div className="pull-right">
          <Button className="close" onClick={onClearDiagnostics}>×</Button>
        </div>
        <span>Messages</span>
      </div>
    );

    const stepperErrorPanelHeader = (
      <div>
        <div className="pull-right">
          <Button className="close" onClick={onStepperExit}>×</Button>
        </div>
        <span>Erreur</span>
      </div>
    );

    self.render = function () {
      const {diagnostics, readOnly, preventInput, error, options} = self.props;
      const showStack = options.get('showStack');
      const showViews = options.get('showViews');
      const showIO = options.get('showIO');
      const editorRowHeight = '300px';
      return (
        <div>
          <div className="row">
            {showStack && <div className="col-sm-3">
              <Panel header={<span>Variables</span>}>
                {<deps.StackView height={editorRowHeight}/>}
              </Panel>
            </div>}
            <div className={showStack ? "col-sm-9" : "col-sm-12"}>
              <Panel header={renderSourcePanelHeader()}>
                <deps.BufferEditor buffer='source' readOnly={readOnly} shield={preventInput} mode='c_cpp' width='100%' height={editorRowHeight} />
              </Panel>
            </div>
          </div>
          <div className="row">
            {diagnostics && <div className="col-sm-12">
              <Panel header={diagnosticsPanelHeader} bsStyle="danger">
                <div dangerouslySetInnerHTML={diagnostics}/>
              </Panel>
            </div>}
            {error && <div className="col-sm-12">
              <Panel header={stepperErrorPanelHeader} bsStyle="danger">
                {error}
              </Panel>
            </div>}
            <div className="col-sm-12">
              {showViews && <deps.DirectivesPane/>}
              {showIO && <deps.IOPane preventInput={preventInput}/>}
            </div>
          </div>
        </div>
      );
    };

  }));

};
