import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container,Modal} from "react-bulma-components";

import { logout } from "./login/LoginActions";
import { sendFollow } from "../components/profile/ProfileActions";
import YonderLogo from "./YonderLogo";
import MenuButton from "./MenuButton";
import SearchButton from "./SearchButton";
import LoginStateButton from "./loginStateButton";
import ProfileButton from "./ProfileButton";
import InboxButton from "./InboxButton";
import InboxModal from "./inbox/InboxModal";
import SearchModalView from "./search/SearchModalView";


import { color } from "../styling/ColorFontConfig";

// local stylings
// do not move to ./styling
var naviBarStyle = {
  position: "fixed",
  // display: "flex",
  // justifyContent: "space-between",
  width: "100%",
  height: "auto",
  backgroundColor: "transparent",
  zIndex: "5",
  paddingLeft: "2em",
  paddingRight: "2em",
  paddingTop: "1em",
  paddingBottom: "1em",
}

var menuDropDownStyle = {
  borderRadius: "10pt",
  textAlign: "center",
  backgroundColor: color.backgroundCreamLighter,
}

var menuDropDownContentStyle = {
  display: "flex",
  flexDirection: "column",
  marginTop: "0.5em",
  marginBottom: "0.5em",
  gap: "0.9em",
}

var brandStyle = {
  float: "left",
  margin: "auto"
}

var meunButtonStyle = {
  position: "fixed",
  right: "5%",
  marginRight: "-2pt",
}

function NavigationBar(props) {

  // set the list of path that you dont want navigation bar to render

  switch (window.location.pathname) {
    // case "/login":
    // case "/signup":
    //   return (<div></div>)
    default:
      break;
  }


  const loginStateButtonClickHandler=() => {
    if (props.auth.isAuthenticated) {
      props.logout();
    } else {
      window.location.href = '/'
    }
  }

  const DropDownContent =()=> {
    // add new entry and logic in this component

    // modal state
    const [inboxModalIsOpen, setInboxModalIsOpen] = useState(false);
    const [searchModalIsOpen, setSearchModalIsOpen] = useState(false);


    let entryList = [];

    if (props.auth.isAuthenticated) {
      // add entry that require authentication here
      entryList.push(<ProfileButton action={() => window.location.href = "/author/" + props.auth.author.id}/>)
      entryList.push(<InboxButton action={() => setInboxModalIsOpen(true)}/>)
    } 

    // add entry that only avalible to stranger here, if needed
    // else {}

    // add entry that will always exist here
    entryList.push(<SearchButton action={() => setSearchModalIsOpen(true)}/>)
    entryList.push(<LoginStateButton 
      islogin={props.auth.isAuthenticated} 
      action={loginStateButtonClickHandler}
    />)

    return (
      <Container style={menuDropDownContentStyle}>
        {entryList}
      
      {/* add modal here */}
      <Modal className="animate__animated animate__fadeIn animate__faster" show={inboxModalIsOpen} onClose={() => setInboxModalIsOpen(false)} closeOnBlur closeOnEsc>
        <InboxModal setModalIsOpen={setInboxModalIsOpen}/>
      </Modal>
      <Modal className="animate__animated animate__fadeIn animate__faster" show={searchModalIsOpen} onClose={() => setSearchModalIsOpen(false)} closeOnBlur closeOnEsc>
        <SearchModalView setModalIsOpen={setSearchModalIsOpen}/>
      </Modal>
      </Container>
    )
  }

  const DropDown = () => {
    return (
      <div class="dropdown is-hoverable is-right">
        <div class="dropdown-trigger" >
          <MenuButton/>
        </div>
        <div class="dropdown-menu animate__animated animate__fadeIn animate__faster" style={{minWidth: "63pt", marginRight: "-5pt"}}>
          <div class="dropdown-content"style={menuDropDownStyle}>
            <DropDownContent/>
          </div>
        </div>
      </div>      
    )
  }

  return (
    <div style={naviBarStyle}>
      <Container style={brandStyle}>
        <a href = '/'>
        <YonderLogo svgScale="70"/>
        </a>
      </Container>
      <Container style={meunButtonStyle}>
        <DropDown/>
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  allAuthors: state.stream.allAuthors,
});

export default connect(mapStateToProps, { logout, sendFollow })(withRouter(NavigationBar));
