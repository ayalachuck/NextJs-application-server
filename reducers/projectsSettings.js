import { PROJECTS_SET_SETTINGS } from "../constants/actionTypes";

const initialState = {
  filter: {
    status: "", // TODO Change type later
    patientName: "",
    studyName: "",
    studyDate: "", // TODO Change type later
    modality: "",
    location: "",
    client: "",
    uploadDateTime: "",
    multusID: ""
  },
  sortKey: "status",
  sortDesc: false
};

export default (
  state = initialState,
  { type, settings: { sortKey, filter = {}, ...settings } = {} }
) => {
  switch (type) {
    // TODO This is used in two places.  Should a utility function?
    case PROJECTS_SET_SETTINGS:
      return {
        ...state,
        sortKey: sortKey !== undefined ? sortKey : state.sortKey,
        sortDesc:
          sortKey !== undefined
            ? state.sortKey === sortKey
              ? !state.sortDesc
              : state.sortDesc
            : state.sortDesc,
        ...settings,
        // Merge filters if any
        filter: {
          ...state.filter,
          ...filter
        }
      };
    default:
      return state;
  }
};
