/**
 * # grievanceFormValidation.js
 *
 * This class determines only if the form is valid
 * so that the form button can be enabled.
 * if all the fields on the form are without error,
 * the form is considered valid
 */
'use strict';

/**
 * ## formValidation
 * @param {Object} state - the Redux state object
 */
export default function formValidation (state) {
  if (state.grievanceCreate.form.fields.tag != '') {
    return state.setIn(['grievanceCreate', 'form','isValid'],true);
  } else {
    return state.setIn(['grievanceCreate', 'form','isValid'],false);
  }
}
