/**
 * # grievanceActions.js
 *
 * The actions to support the users grievance
 */
'use strict';
/**
 * ## Imports
 *
 * The actions for grievance
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

  ON_GRIEVANCE_FORM_FIELD_CHANGE,
  ON_GRIEVANCE_UPDATE_FORM_FIELD_CHANGE,

  SET_GRIEVANCE_UPDATE,

  GRIEVANCE_UPDATE_FEEDBACK_SUCCESS,
  GRIEVANCE_UPDATE_FEEDBACK_FAILURE,
  ON_GRIEVANCE_UPDATE_CURLYURL,
  ON_GRIEVANCE_CREATE_USER,
  ON_CURLY_URL_FETCHING,
  UPDATE_LOCATION_SEARCH
} = require('../../lib/constants').default;

import {Actions} from 'react-native-router-flux';
/**
 * BackendFactory - base class for server implementation
 * AppAuthToken for localStorage sessionToken access
 */
const BackendFactory = require('../../lib/BackendFactory').default;
const AppAuthToken = require('../../lib/AppAuthToken').default;

/**
 * ## retreiving grievance actions
 */
export function getGrievanceRequest() {
  return {
    type: GET_GRIEVANCE_REQUEST
  };
}
export function getGrievanceSuccess(json) {
  return {
    type: GET_GRIEVANCE_SUCCESS,
    payload: json
  };
}
export function getGrievanceFailure(json) {
  return {
    type: GET_GRIEVANCE_FAILURE,
    payload: json
  };
}


/**
 * ## State actions
 * Have to write
 */
export function getGrievances(data, sessionToken) {
  return dispatch => {
    dispatch(getGrievanceRequest());
    //store or get a sessionToken
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).getGrievances(data);
      })
      .then((json) => {
          dispatch(getGrievanceSuccess(json));
      })
      .catch((error) => {
        dispatch(getGrievanceFailure(error));
      });
  };
}

/**
 * ## Grievance create actions
 */
export function grievanceCreateRequest() {
  return {
    type: GRIEVANCE_CREATE_REQUEST
  };
}
export function grievanceCreateSuccess(json, currentUser) {
  return {
    type: GRIEVANCE_CREATE_SUCCESS,
    payload: json,
    currentUser
  };
}
export function grievanceCreateFailure(json) {
  return {
    type: GRIEVANCE_CREATE_FAILURE,
    payload: json
  };
}

export function createGrievance(address, description, location, reportedUser, tag, curlyUrl, sessionToken, toggleAction) {
  return dispatch => {
    dispatch(grievanceCreateRequest());
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).createGrievance(
          {
            address: address,
            description: description,
            location: location,
            reportedUser: reportedUser,
            tag: tag,
            curlyUrl: curlyUrl
          }
        );
      })
      .then((json) => {
          toggleAction();
          dispatch(grievanceCreateSuccess(json, sessionToken.objectId));
          // Actions.pop();
      })
      .catch((error) => {
        dispatch(grievanceCreateFailure(error));
      });
  };
}

/**
 * ## State actions
 * Have to write
 */
export function grievanceUpdateRequest() {
  return {
    type: GRIEVANCE_UPDATE_REQUEST
  };
}
export function grievanceUpdateSuccess(idx) {
  return {
    type: GRIEVANCE_UPDATE_SUCCESS,
    idx: idx
  };
}
export function grievanceUpdateFailure(json) {
  return {
    type: GRIEVANCE_UPDATE_FAILURE,
    payload: json
  };
}
export function grievanceSetUpdate(json, idx) {
  return {
    type: SET_GRIEVANCE_UPDATE,
    payload: json,
    idx: idx
  };
}
/**
 * ## updateGrievance
 * @param {string} grievanceId -  objectId
 * @param {string} description - grievance description
 * @param {Object} sessionToken - the sessionToken from Parse.com
 *
 * The sessionToken is provided when Hot Loading.
 *
 * With the sessionToken, Parse.com is called with the data to update
 * If successful, get the profile so that the screen is updated with
 * the data as now persisted on Parse.com
 *
 */
export function updateGrievance(grievanceId, description, sessionToken) {
  return dispatch => {
    dispatch(grievanceUpdateRequest());
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).updateGrievance(grievanceId,
          {
            description: description
          }
        );
      })
      .then((json) => {
          dispatch(grievanceUpdateSuccess(json));
      })
      .catch((error) => {
        dispatch(grievanceUpdateFailure(error));
      });
  };
}

export function grievanceUpdateFeedbackSuccess(idx, json) {
  return {
    type: GRIEVANCE_UPDATE_FEEDBACK_SUCCESS,
    idx: idx,
    payload: json
  };
}
export function grievanceUpdateFeedbackFailure(idx, json) {
  return {
    type: GRIEVANCE_UPDATE_FEEDBACK_FAILURE,
    idx: idx,
    payload: json
  };
}

export function grievanceUpdateFeedback(grievanceId, sessionToken, idx, feedback) {
  return dispatch => {
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).grievanceUpdateFeedback(grievanceId, {isUpVoted: feedback, user: sessionToken.objectId});
      })
      .then((json) => {
          dispatch(grievanceUpdateFeedbackSuccess(idx, json));
      })
      .catch((error) => {
        dispatch(grievanceUpdateFeedbackFailure(idx, error));
      });
  };
}
/**
 * ## Grievance delete actions
 */
export function grievanceDeleteRequest() {
  return {
    type: GRIEVANCE_DELETE_REQUEST
  };
}
export function grievanceDeleteSuccess(json) {
  return {
    type: GRIEVANCE_DELETE_SUCCESS
  };
}
export function grievanceCreateFailure(json) {
  return {
    type: GRIEVANCE_CREATE_FAILURE,
    payload: json
  };
}

export function deleteGrievance(grievanceId, sessionToken) {
  return dispatch => {
    dispatch(grievanceDeleteRequest());
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return BackendFactory(token).deleteGrievance(grievanceId);
      })
      .then(() => {
          dispatch(grievanceDeleteSuccess());
          Actions.pop();
      })
      .catch((error) => {
        dispatch(grievanceDeleteFailure(error));
      });
  };
}

export function onGrievanceFormFieldChange(field){
  return {
    type: ON_GRIEVANCE_FORM_FIELD_CHANGE,
    payload: {field: field}
  }
}

export function onGrievanceUpdateFormFieldChange(field){
  return {
    type: ON_GRIEVANCE_UPDATE_FORM_FIELD_CHANGE,
    payload: {field: field}
  }
}

export function onCurlyUrlUpdate(source) {
  return {
    type: ON_GRIEVANCE_UPDATE_CURLYURL,
    payload: source
  }
}

export function onGrievanceUserUpdate(user) {
  return {
    type: ON_GRIEVANCE_CREATE_USER,
    payload: user
  }
}

export function onCurlyUrlFetching() {
  return {
    type: ON_CURLY_URL_FETCHING
  }
}

export function updateListSearch(coords, address, radius) {
  return {
    type: UPDATE_LOCATION_SEARCH,
    payload: {
      coords,
      address,
      radius
    }
  }
}

export function retrieveLocation(coords) {
  return BackendFactory().retrieveLocation(coords);
}
