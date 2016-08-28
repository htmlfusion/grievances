/**
 * # grievanceReducer.js
 *
 * The reducer user grievance actions
 */
'use strict';

const {fromJS, List, Record} = require('immutable');
/**
 * ## Imports
 *
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
/*const fieldValidation = require('../../lib/fieldValidation').default;
const formValidation = require('./grievanceFormValidation').default;*/

/**
 * ## Actions
 *
 */
const {
  GET_GRIEVANCE_REQUEST,
  GET_GRIEVANCE_SUCCESS,
  GET_GRIEVANCE_FAILURE,

  GRIEVANCE_UPDATE_REQUEST,
  GRIEVANCE_UPDATE_SUCCESS,
  GRIEVANCE_UPDATE_FAILURE,

  GRIEVANCE_CREATE_REQUEST,
  GRIEVANCE_CREATE_SUCCESS,
  GRIEVANCE_CREATE_FAILURE,

  GRIEVANCE_DELETE_REQUEST,
  GRIEVANCE_DELETE_SUCCESS,
  GRIEVANCE_DELETE_FAILURE,

  CREATE_SET_STATE,
  UPDATE_SET_STATE,
  LIST_SET_STATE,

  ON_GRIEVANCE_FORM_FIELD_CHANGE,
  ON_GRIEVANCE_UPDATE_FORM_FIELD_CHANGE,
  GRIEVANCE_UPDATE_FEEDBACK_SUCCESS,
  GRIEVANCE_UPDATE_FEEDBACK_FAILURE,
  SET_GRIEVANCE_UPDATE,
  ON_GRIEVANCE_UPDATE_CURLYURL,
  ON_GRIEVANCE_CREATE_USER,
  ON_CURLY_URL_FETCHING,
  UPDATE_LOCATION_SEARCH
} = require('../../lib/constants').default;

import InitialState from './grievanceInitialState';
/**
 * ## Initial State
 *
 */
const initialState = new InitialState;
/**
 * ## profileReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function grievanceReducer(state = initialState, action) {
  let nextGrievanceState = null;

  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  let grievanceRec = Record({
    _id: "0",
    address: '',
    location: [],
    reportedUser: new Record({
      _id: "0",
      fullname: ''
    }),
    description: '',
    dateOfReporting: '',
    dateOfResolving: '',
    resolvedUser: "0",
    status: '',
    tag: '',
    isUpVoted: false,
    upVotedCount: 0,
    curlyUrl: null,
    curlyUrlSmall: null,
    curlyUrlLarge: null,
    error: null,
    hasError: false
  });
  let recordMap;
  let newGrievance = (grievance) => new grievanceRec({
    _id: grievance._id,
    address: grievance.address,
    location: grievance.location,
    reportedUser: grievance.reportedUser,
    description: grievance.description,
    dateOfReporting: grievance.dateOfReporting,
    dateOfResolving: grievance.dateOfResolving,
    resolvedUser: grievance.resolvedUser,
    status: grievance.status,
    tag: grievance.tag,
    curlyUrl: grievance.curlyUrl,
    curlyUrlSmall: grievance.curlyUrlSmall,
    curlyUrlLarge: grievance.curlyUrlLarge,
    isUpVoted: grievance.isUpVoted,
    upVotedCount: grievance.upVotedCount
  });

  switch (action.type) {
    /**
     * ### Request starts
     * set the form to fetching and clear any errors
     */
  case GRIEVANCE_CREATE_REQUEST:
    return state.setIn([ 'grievanceCreate', 'form', 'disabled'], true)
      .setIn([ 'grievanceCreate', 'form', 'error'], null);

  case GET_GRIEVANCE_REQUEST:
    return state.setIn([ 'grievanceList', 'isFetching'], true)
      .setIn([ 'grievanceList', 'error'], null);

  case GRIEVANCE_UPDATE_REQUEST:
  case GRIEVANCE_DELETE_REQUEST:
    return state.setIn([ 'grievanceUpdate', 'form', 'disabled'], true)
      .setIn([ 'grievanceUpdate', 'form','error'], null);

    /**
     * ### Request end successfully
     * set the form to fetching as done
     */
  case GRIEVANCE_DELETE_SUCCESS:
    return state.setIn(['grievanceUpdate', 'form', 'disabled'], false).
      deleteIn(['grievanceList','grievances', state.getIn([ 'grievanceUpdate', 'form', 'originalGrievance', 'idx'])]);

    /**
     * ### Request ends successfully
     *
     * the fetching is done, set the UI fields and the originalGrievance
     *
     * Validate the data to make sure it's all good and someone didn't
     * mung it up through some other mechanism
     */
  case SET_GRIEVANCE_UPDATE:
    nextGrievanceState = state.setIn([ 'grievanceUpdate', 'form', 'isFetching'], false)
      .setIn([ 'grievanceUpdate', 'form','fields','description'], action.payload.description)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','address'],action.payload.address)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','location'],action.payload.location)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','reportedUser'],action.payload.reportedUser)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','description'],action.payload.description)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','dateOfReporting'], action.payload.dateOfReporting)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','dateOfResolving'],action.payload.dateOfResolving)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','curlyUrl'],action.payload.curlyUrl)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','curlyUrlSmall'],action.payload.curlyUrlSmall)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','curlyUrlLarge'],action.payload.curlyUrlLarge)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','status'],action.payload.status)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','tag'],action.payload.tag)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','_id'],action.payload._id)
      .setIn([ 'grievanceUpdate', 'form','originalGrievance','idx'],action.idx)
      .setIn([ 'grievanceUpdate', 'form','error'],null);

    return nextGrievanceState;

  case GRIEVANCE_UPDATE_SUCCESS:

    return state.setIn([ 'grievanceUpdate', 'form', 'disabled'], false).updateIn(['grievanceList','grievances', state.getIn([ 'grievanceUpdate', 'form', 'originalGrievance', 'idx'])], function(grievance) {
      return grievance.set('description', state.getIn([ 'grievanceUpdate', 'form', 'fields', 'description']));
    });

  case GRIEVANCE_UPDATE_FEEDBACK_SUCCESS:
    return state.updateIn(['grievanceList','grievances', action.idx], function(grievance) {
      console.log('action.payload.isUpVoted', action.payload.isUpVoted, 'upVotedCount', action.payload.upVotedCount);
      return grievance.set('isUpVoted', action.payload.isUpVoted).set('upVotedCount', action.payload.upVotedCount);
    });

  case GRIEVANCE_UPDATE_FEEDBACK_FAILURE:
    return state.updateIn(['grievanceList','grievances', action.idx], function(grievance) {
      return grievance.set('hasError', true).set('error', action.payload);
    });

  case GET_GRIEVANCE_SUCCESS:
    recordMap = new List(action.payload.map(function(grievance) {
      return newGrievance(grievance);
    }));
    nextGrievanceState = state.setIn([ 'grievanceList', 'isFetching'], false)
      .setIn([ 'grievanceList','grievances'], recordMap)
      .setIn([ 'grievanceList','error'], null);
    return nextGrievanceState;

  case GET_GRIEVANCE_FAILURE:
    return state.setIn([ 'grievanceList', 'isFetching'], false)
      .setIn([ 'grievanceList', 'error'], action.payload);
    /**
     *
     *
     */
  case GRIEVANCE_CREATE_SUCCESS:
    recordMap = state.getIn(['grievanceList', 'grievances']).push(newGrievance(action.payload));
    nextGrievanceState = state.setIn([ 'grievanceCreate','form', 'disabled'], false)
      .setIn([ 'grievanceCreate', 'form', 'error'], null)
      /*.setIn([ 'grievanceCreate', 'form', 'fields', 'address'], '')*/
      .setIn([ 'grievanceCreate', 'form', 'fields', 'description'], '')
      .setIn([ 'grievanceCreate', 'form', 'fields', 'location'], [])
      .setIn([ 'grievanceCreate', 'form', 'fields', 'tag'], '')
      .setIn([ 'grievanceCreate', 'form', 'fields', 'curlyUrl'], null)
      .setIn([ 'grievanceCreate', 'form', 'fields', 'reportedUser'], action.currentUser)
      .setIn(['grievanceList', 'grievances'], recordMap);
    return nextGrievanceState;
      //Push value to grievance list
    /**
     * ### Request fails
     * we're done fetching and the error needs to be displayed to the user
     */
  case GRIEVANCE_DELETE_FAILURE:
  case GRIEVANCE_UPDATE_FAILURE:
    return state.setIn([ 'grievanceUpdate', 'form', 'disabled'], false)
      .setIn([ 'grievanceUpdate', 'form','error'], action.payload);

  case GRIEVANCE_CREATE_FAILURE:
    return state.setIn([ 'grievanceCreate', 'form', 'disabled'], false)
      .setIn([ 'grievanceCreate', 'form','error'], action.payload);

    /**
     * ### set the state
     *
     * This is in support of Hot Loading - take the payload
     * and set the values into the state
     *
     */
  // case CREATE_SET_STATE:
  //   debugger;
  //   var grievance  = JSON.parse(action.payload).grievanceCreate.form;
  //   var next = state.setIn([ 'grievanceCreate', 'form','disabled'],grievance.disabled)
  //         .setIn([ 'grievanceCreate','form','error'],grievance.error)
  //         .setIn([ 'grievanceCreate','form','isValid'],grievance.isValid)
  //         .setIn([ 'grievanceCreate','form','isFetching'],grievance.isFetching)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'address'],grievance.fields.address)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'location'],grievance.fields.location)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'reportedUser'],grievance.fields.reportedUser)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'description'],grievance.fields.description)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'dateOfReporting'],grievance.fields.dateOfReporting)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'dateOfResolving'],grievance.fields.dateOfResolving)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'resolvedUser'],grievance.fields.resolvedUser)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'status'],grievance.fields.status)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'tag'],grievance.fields.tag)
  //         .setIn([ 'grievanceCreate', 'form','fields',
  //                 'tagHasError'],grievance.fields.tagHasError);
  //     return next;
  //
  //   case UPDATE_SET_STATE:
  //     debugger;
  //     var grievance  = JSON.parse(action.payload).grievanceUpdate.form;
  //     var next = state.setIn([ 'grievanceUpdate', 'form','disabled'],grievance.disabled)
  //           .setIn([ 'grievanceUpdate','form','error'],grievance.error)
  //           .setIn([ 'grievanceUpdate','form','isValid'],grievance.isValid)
  //           .setIn([ 'grievanceUpdate','form','isFetching'],grievance.isFetching)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'address'],grievance.originalGrievance.address)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'location'],grievance.originalGrievance.location)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'reportedUser'],grievance.originalGrievance.reportedUser)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'description'],grievance.originalGrievance.description)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'dateOfReporting'],grievance.originalGrievance.dateOfReporting)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'dateOfResolving'],grievance.originalGrievance.dateOfResolving)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'resolvedUser'],grievance.originalGrievance.resolvedUser)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'status'],grievance.originalGrievance.status)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   'tag'],grievance.originalGrievance.tag)
  //           .setIn([ 'grievanceUpdate', 'form','originalGrievance',
  //                   '_id'],grievance.originalGrievance._id)
  //           .setIn([ 'grievanceUpdate', 'form','fields',
  //                   'description'],grievance.fields.description);
  //     return next;
  //
  //   case LIST_SET_STATE:
  //     debugger;
  //     var grievance  = JSON.parse(action.payload).grievanceList;
  //     var next = state.setIn([ 'grievanceList','disabled'],grievance.disabled)
  //           .setIn([ 'grievanceList','error'],grievance.error)
  //           .setIn([ 'grievanceList','isValid'],grievance.isValid)
  //           .setIn([ 'grievanceList','isFetching'],grievance.isFetching)
  //           .setIn([ 'grievanceList','grievances'],grievance.grievances);
  //     return next;

    case ON_GRIEVANCE_FORM_FIELD_CHANGE:
      return state.setIn([ 'grievanceCreate', 'form','fields','description'], action.payload.field.description)
        /*.setIn([ 'grievanceCreate', 'form','fields','address'],action.payload.field.address)*/
        .setIn([ 'grievanceCreate', 'form','fields','tag'],action.payload.field.tag)
        .setIn([ 'grievanceCreate', 'form','fields','location'],action.payload.field.location)
        .setIn([ 'grievanceCreate', 'form','error'],null);

    case ON_GRIEVANCE_UPDATE_FORM_FIELD_CHANGE:
      return state.setIn([ 'grievanceUpdate', 'form','fields','description'], action.payload.field.description)
        .setIn([ 'grievanceUpdate', 'form','error'],null);

    case ON_GRIEVANCE_UPDATE_CURLYURL:
      return state.setIn([ 'grievanceCreate', 'form','fields','curlyUrl'], action.payload)
        .setIn([ 'grievanceCreate', 'form','fields','curlyUrlFetching'], false)
        .setIn([ 'grievanceCreate', 'form','error'], null);

    case ON_GRIEVANCE_CREATE_USER:
      return state.setIn([ 'grievanceCreate', 'form','fields','reportedUser'], action.payload)
        .setIn([ 'grievanceCreate', 'form','error'], null);

    case ON_CURLY_URL_FETCHING:
      return state.setIn([ 'grievanceCreate', 'form','fields','curlyUrlFetching'], true)
        .setIn([ 'grievanceCreate', 'form','error'], null);

    case UPDATE_LOCATION_SEARCH:
      return state.setIn([ 'grievanceList', 'locationSearch'], action.payload.coords)
        .setIn([ 'grievanceList', 'locationSearchRadius'], action.payload.radius)
        .setIn([ 'grievanceList', 'locationSearchText'], action.payload.address);
  }//switch
  /**
   * # Default
   */
  return state;
}
