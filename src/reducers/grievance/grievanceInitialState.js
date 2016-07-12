const {Record} = require('immutable');
import grievanceCreateInitialState from './grievanceCreateInitialState';
import grievanceUpdateInitialState from './grievanceUpdateInitialState';
import grievanceListInitialState from './grievanceListInitialState';

const grievance = Record({
  grievanceCreate: new grievanceCreateInitialState,
  grievanceUpdate: new grievanceUpdateInitialState,
  grievanceList: new grievanceListInitialState
});

export default grievance;
