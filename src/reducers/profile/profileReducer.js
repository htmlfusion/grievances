/**
 * # profileReducer.js
 *
 * The reducer user profile actions
 */
'use strict';

/**
 * ## Imports
 *
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const fieldValidation = require('../../lib/fieldValidation').default;
const formValidation = require('./profileFormValidation').default;

/**
 * ## Actions
 *
 */
const {
  ON_PROFILE_FORM_FIELD_CHANGE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  LOGOUT_SUCCESS,

  PROFILE_SYNC_SOCIAL_REQUEST,
  PROFILE_SYNC_SOCIAL_SUCCESS,
  PROFILE_SYNC_SOCIAL_FAILURE,

  SET_STATE
} = require('../../lib/constants').default;

/**
 * ## Initial State
 *
 */
const InitialState = require('./profileInitialState').default;
const initialState = new InitialState;

/**
 * ## profileReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function profileReducer(state = initialState, action) {
  let nextProfileState = null;

  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
    /**
     * ### Request starts
     * set the form to fetching and clear any errors
     */
  case GET_PROFILE_REQUEST:
  case PROFILE_UPDATE_REQUEST:
  case PROFILE_SYNC_SOCIAL_REQUEST:
    return state.setIn(['form', 'isFetching'], true)
      .setIn(['form','error'],null);

    /**
     * ### Request end successfully
     * set the form to fetching as done
     */
  case PROFILE_UPDATE_SUCCESS:
    return state.setIn(['form', 'isFetching'], false);

    /**
     * ### Request ends successfully
     *
     * the fetching is done, set the UI fields and the originalProfile
     *
     * Validate the data to make sure it's all good and someone didn't
     * mung it up through some other mechanism
     */
  case GET_PROFILE_SUCCESS:
    nextProfileState = state.setIn(['form', 'isFetching'], false)
      .setIn(['form','fields','fullname'], action.payload.fullname)
      .setIn(['form','fields','email'], action.payload.email)
      .setIn(['form','fields','emailVerified'],
             action.payload.emailVerified)
      .setIn(['form','originalProfile','fullname'],action.payload.fullname)
      .setIn(['form','originalProfile','email'],action.payload.email)
      .setIn(['form','originalProfile','fbId'],action.payload.fbId)
      .setIn(['form','originalProfile','gId'],action.payload.gId)
      .setIn(['form','originalProfile','emailVerified'],action.payload.emailVerified)
      .setIn(['form','originalProfile','objectId'],action.payload.objectId)
      .setIn(['form','error'],null);

    return formValidation(
      fieldValidation( nextProfileState, action)
      , action);

    /**
     * User logged out, so reset form fields and original profile.
     *
     */
  case LOGOUT_SUCCESS:
    nextProfileState = state.setIn(['form','fields','fullname'], '')
      .setIn(['form','fields','email'], '')
      .setIn(['form','fields','emailVerified'], false)
      .setIn(['form','fields','socialSyncError'], false)
      .setIn(['form','originalProfile','fullname'],'')
      .setIn(['form','originalProfile','email'],'')
      .setIn(['form','originalProfile','fbId'], 0)
      .setIn(['form','originalProfile','gId'], 0)
      .setIn(['form','originalProfile','emailVerified'],false)
      .setIn(['form','originalProfile','objectId'],null)
      .setIn(['form','error'],null);
    return formValidation( nextProfileState, action);

    /**
     * ### Request fails
     * we're done fetching and the error needs to be displayed to the user
     */
  case GET_PROFILE_FAILURE:
  case PROFILE_UPDATE_FAILURE:
    return state.setIn(['form', 'isFetching'], false)
      .setIn(['form','error'], action.payload);

  case PROFILE_SYNC_SOCIAL_FAILURE:
    return state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'fields', 'socialSyncError'], true)
      .setIn(['form','error'], action.payload);

  case PROFILE_SYNC_SOCIAL_SUCCESS:
    return state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'fields', 'socialSyncError'], false)
      .setIn(['form', 'originalProfile', action.payload.type], action.payload.value);

  case PROFILE_SYNC_SOCIAL_REQUEST:
    return state.setIn(['form', 'isFetching'], true);
    /**
     * ### form fields have changed
     *
     * Set the state with the fields, clear the form error
     * and perform field and form validation
     */
  case ON_PROFILE_FORM_FIELD_CHANGE:
    let nextFormState =
      state.setIn(['form', 'fields', 'fullname'],
                  action.payload.field.fullname)
      .setIn(['form', 'fields', 'email'], action.payload.field.email)
      .setIn(['form','error'],null);

    return formValidation(
      fieldValidation( nextFormState, action)
      , action);

    /**
     * ### set the state
     *
     * This is in support of Hot Loading - take the payload
     * and set the values into the state
     *
     */
  /*case SET_STATE:
    debugger;
    var profile  = JSON.parse(action.payload).profile.form;
    var next = state.setIn(['form','disabled'],profile.disabled)
          .setIn(['form','error'],profile.error)
          .setIn(['form','isValid'],profile.isValid)
          .setIn(['form','isFetching'],profile.isFetching)
          .setIn(['form','originalProfile',
                  'fullname'],profile.originalProfile.fullname)
          .setIn(['form','originalProfile',
                  'email'],profile.originalProfile.email)
          .setIn(['form','originalProfile',
                  'objectId'],profile.originalProfile.objectId)
          .setIn(['form','originalProfile',
                  'emailVerified'],profile.originalProfile.emailVerified)
          .setIn(['form','fields',
                  'fullname'],profile.fields.fullname)
          .setIn(['form','fields',
                  'email'],profile.fields.email)
          .setIn(['form','fields',
                  'emailHasError'],profile.fields.emailHasError)
          .setIn(['form','fields',
                  'emailVerified'],profile.fields.emailVerified);
    return next;*/

  }//switch
  /**
   * # Default
   */
  return state;
}
