import { SET_PROJECT_PROPS } from "../constants/actionTypes";

export default ({ studyUID, ...props }) => dispatch => {
  dispatch({ type: SET_PROJECT_PROPS, studyUID, ...props });

  dispatch({
    type: "server/setProjectProps",
    studyUID,
    ...props
  });
};
