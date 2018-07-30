import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import Wrapper from "../../hoc/wrapper";
import TableList from "../../components/TableList";
import UploadFilePopup from "../../components/UploadFilePopup";
import CreateProjectModal from "../../components/CreateProjectModal";
//
import fieldEnhancer from "./fieldEnhancer";
import header from "./header";
import sortFunc from "./sortFunc";
import filterRender from "./filterRender";
import filterFunc from "./filterFunc";

class ProjectsListing extends Component {
  static async getInitialProps({
    store,
    isServer,
    query: { projects = [], projectsSettings = {} } = {}
  }) {
    const { payloadProjects, setProjectsSettings } = actions;

    if (isServer) {
      // TODO Should we wrap these in single action?
      store.dispatch(payloadProjects({ projects }));
      store.dispatch(setProjectsSettings(projectsSettings));
      return;
    }

    store.dispatch({
      type: "server/pageProjects"
    });
  }

  // TODO Remove handle using redux portalSettings or portal?
  constructor(props) {
    super(props);

    // TODO Move to redux?
    this.state = {
      popupTarget: null,
      popupStudyUID: "",
      modalCreateProjects: false
    };
  }

  // TODO Move to redux action?
  popupOpen = ({ target, studyUID }) => {
    this.setState({
      popupTarget: target,
      popupStudyUID: studyUID
    });
  };

  // TODO Move to redux action?
  popupToggle() {
    this.setState({
      popupTarget: null
    });
  }

  render() {
    const {
      props,
      props: {
        projects = [],
        sortKey,
        sortDesc,
        setProjectsSettings = () => {},
        uploadDel = () => {}
      } = {},
      state: {
        popupTarget,
        popupStudyUID,
        modalCreateProjects = false
      }
    } = this;

    const projectsEnhanced = fieldEnhancer({
      ...props,
      onCreate: () => {
        console.log("onCreate");
        this.setState({ modalCreateProjects: true });
      },
      popupOpen: this.popupOpen
    });

    // Query the study from tableData
    const study = projects.find(
      ({ studyUID = "" }) => studyUID === popupStudyUID
    );

    const { uploadedFiles = [] } = study || {};

    return (
      <div className="projects">
        <style jsx>
          {`
            .projects {
              display: flex;
              width: 100%;
              height: 100%;
            }
          `}
        </style>
        <TableList
          data={projectsEnhanced}
          sortFunc={sortFunc()}
          sortKey={sortKey}
          sortDesc={sortDesc}
          header={header()}
          filterFunc={filterFunc(props)}
          filterRender={filterRender(props)}
          onSort={k => setProjectsSettings({ sortKey: k })}
        />
        <CreateProjectModal
          toggle={() => {}}
          isOpen={modalCreateProjects}
        />
        <UploadFilePopup
          popupTarget={popupTarget}
          fileList={uploadedFiles}
          toggle={() => this.popupToggle()}
          studyUID={popupStudyUID}
          onDelete={props => {
            uploadDel(props);

            if (uploadedFiles.length <= 1) {
              this.setState({ popupTarget: null });
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  projectsSettings: { sortKey, sortDesc, filter },
  defaultList,
  projects: { projects }
}) => ({
  projects,
  sortKey,
  sortDesc,
  filter,
  defaultList
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper(ProjectsListing));
