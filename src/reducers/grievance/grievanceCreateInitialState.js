/**
 * # profileInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';

const  {Record} = require('immutable');

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 *
 * The originalProfile is what Parse.com provided and has the objectId
 * The fields are what display on the UI
 */

const CreateForm = Record({
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: new (Record({
    address: '',
    location: [],
    reportedUser: '',
    description: '',
    dateOfReporting: '',
    dateOfResolving: '',
    resolvedUser: '',
    status: '',
    tag: '',
    tagHasError: false
  }))
});


var InitialState = Record({
  form: new CreateForm
});

export default InitialState;
