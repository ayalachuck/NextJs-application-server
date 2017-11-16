import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardBlock,
  CardTitle,
  CardSubtitle,
  CardText,
  CardLink,
  Button,
  Table,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input
} from "reactstrap";
import Sidebar from "../components/Sidebar";
import withRedux from "next-redux-wrapper";
import { bindActionCreators } from "redux";
import { initStore } from "..//store";
import * as actions from "../actions";
import Wrapper from "../hoc/wrapper";
import UploadButton from "../components/UploadButton";
import ButtonConfirm from "../components/ButtonConfirm";

// TODO Move these to different Area?
// Remove this and hardcode in render method for now
import getStatusName from "../helpers/getStatusName";

const ProjectDetails = class extends Component {
  static async getInitialProps({
    store,
    isServer,
    query: {
      projectDetail = {},
      projectDetailSettings = {},
      defaultList = [],
      studyUID = ""
    }
  }) {
    const {
      payloadProjectDetail,
      setDefaultList,
      setProjectDetailSettings,
      fetchAction
    } = actions;

    if (isServer) {
      // TODO Should we wrap these in single action?
      store.dispatch(payloadProjectDetail(projectDetail));
      store.dispatch(setDefaultList(defaultList));
      store.dispatch(setProjectDetailSettings(projectDetailSettings));
      return;
    }

    store.dispatch(fetchAction(true));
    store.dispatch({
      type: "server/pageProjectDetail",
      studyUID
    });
  }

  render() {
    const {
      props: {
        // Actions
        setProjectProps,
        videoRender,
        toggleSidebar,
        resetProject,
        handleProjectImport,
        destroyProject,
        // State
        sidebarIsOpen,
        studyUID,
        studyName,
        patientName,
        studyDate,
        modality,
        location,
        status = 0,
        client = "",
        uploadedFiles = [],
        defaultList = [],
        defaultName = ""
      }
    } = this;

    // TODO Used for render video will be removed in the future
    const windowName = "renderWindow";
    const width = 1920 / 2; // TODO Add a few different presets
    const height = 1080 / 2;
    const windowSettings = `width=${width},height=${height},resizable=false,toolbar=false,status=false`;

    return (
      <div
        className="root"
        ref={input => {
          this.container = input;
        }}
      >
        <style jsx>
          {`
            .root {
              display: flex;
              flex-direction: row;
              height: 100%;
              width: 100%;
            }

            .projectDetailLeft {
              width: 100%;
              margin-bottom: 50px;
            }

            .projectDetailRight {
              width: 100%;
              height: 100%;
              background: lightGray;
            }

            .Sidebar-header {
              margin-bottom: 30px;
            }

            .RenderVideo {
              margin-bottom: 10px;
            }

            .dataFunctionGroup {
              display: flex;
              justify-content: space-around;
            }

            .dataFunction {
              margin-right: 10px;
            }

            .dataFunction:last-child {
              margin-right: 0;
            }

            .dataDefaults {
              display: flex;
              width: 100%;
              white-space: nowrap;
              align-items: center;
            }

            .dataDefaultsLabel {
              padding-right: 5px;
            }
          `}
        </style>
        <Sidebar
          toggleSidebar={toggleSidebar}
          isOpen={sidebarIsOpen}
          width={400}
        >
          <div className="projectDetailLeft">
            <div>
              <div className="Sidebar-header">
                <CardTitle>Project Details</CardTitle>
                <CardSubtitle>{patientName}</CardSubtitle>
              </div>
              <div className="RenderVideo">
                <Button
                  onClick={() =>
                    window.open(
                      `/static/render/?p=${studyUID}`,
                      windowName,
                      windowSettings
                    )}
                >
                  Render Video
                </Button>
              </div>
              <Table>
                <tbody>
                  <tr>
                    <th scope="row">Status</th>
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle caret>
                          {getStatusName(status)}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              setProjectProps({
                                studyUID,
                                status: 1
                              })}
                          >
                            {getStatusName(1)}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              setProjectProps({
                                studyUID,
                                status: 2
                              })}
                          >
                            {getStatusName(2)}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              setProjectProps({
                                studyUID,
                                status: 3
                              })}
                          >
                            {getStatusName(3)}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              setProjectProps({
                                studyUID,
                                status: 4
                              })}
                          >
                            {getStatusName(4)}
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              setProjectProps({
                                studyUID,
                                status: 5
                              })}
                          >
                            {getStatusName(5)}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Study Name</th>
                    <td>{studyName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Study Date</th>
                    <td>{studyDate}</td>
                  </tr>
                  <tr>
                    <th scope="row">Modality</th>
                    <td>{modality}</td>
                  </tr>
                  <tr>
                    <th scope="row">Location</th>
                    <td>{location}</td>
                  </tr>
                  <tr>
                    <th scope="row">Client</th>
                    <td>{client}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div>
              <Table hover>
                <thead>
                  <tr>
                    <td>Files</td>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((name, i) => (
                    <tr key={`attached-files-${i}`}>
                      <td>
                        <a
                          href={`/uploadGet/?id=${studyUID}&name=${name}`}
                          target="_UploadPreview"
                        >
                          {name}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <hr />
            <div>
              <div>Data functions</div>
              <div className="dataFunctionGroup">
                <div className="dataFunction">
                  <UploadButton
                    studyUID={studyUID}
                    handleUpload={handleProjectImport}
                    label="Import"
                  />
                </div>
                <div className="dataFunction">
                  <a
                    className="btn btn-secondary"
                    target="_projectExport"
                    href={`/export/?studyUID=${studyUID}`}
                  >
                    Export
                  </a>
                </div>
                <div className="dataFunction">
                  <ButtonConfirm
                    color="warning"
                    message="You are about to reset a project to the selected default.  This action can't be undone. Please confirm."
                    onConfirm={() => resetProject({ studyUID })}
                  >
                    Reset
                  </ButtonConfirm>
                </div>
                <div className="dataFunction">
                  <ButtonConfirm
                    color="warning"
                    message="You are about to destroy a project and all it's snapshots.  This action can't be undone. Please confirm."
                    onConfirm={() => destroyProject({ studyUID })}
                  >
                    Destroy
                  </ButtonConfirm>
                </div>
              </div>
            </div>
            <hr />
            <div className="dataDefaults">
              <div className="dataDefaultsLabel">Set Default</div>
              <UncontrolledDropdown
                style={{ width: "100%" }}
                color="danger"
              >
                <DropdownToggle caret style={{ width: "100%" }}>
                  {defaultName}
                </DropdownToggle>
                <DropdownMenu right>
                  {defaultList.map(defaultName => (
                    <DropdownItem
                      key={`default-${defaultName}`}
                      onClick={() =>
                        setProjectProps({ studyUID, defaultName })}
                    >
                      {defaultName}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <div />
          </div>
        </Sidebar>
        <iframe
          className="projectDetailRight"
          src={`/static/interface/?p=${studyUID}`}
          title="iframe"
          width="100%"
          height="100%"
          style={{ margin: 0, border: 0, padding: 0 }}
        />
      </div>
    );
  }
};

const mapStateToProps = ({
  projectDetail,
  defaultList,
  projectDetailSettings: { sidebarIsOpen }
}) => ({ ...projectDetail, sidebarIsOpen, defaultList });

const mapDispatchToProps = dispatch =>
  bindActionCreators(actions, dispatch);

export default withRedux(
  initStore,
  mapStateToProps,
  mapDispatchToProps
)(Wrapper(ProjectDetails));
