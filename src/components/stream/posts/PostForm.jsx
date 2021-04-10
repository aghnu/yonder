import React, { Component } from "react";
import ReactMde from "react-mde";
import { Form, Card, Container } from "react-bulma-components";
import Markdown from "react-markdown";
import ReactTags from "react-tag-autocomplete";
import "./react-tags.css";

import ConfirmButton from "./buttons/ConfirmButton";
import CheckBox from "./CheckBox";

import { TextIcon, ImageIcon, MarkdownIcon, ToolTipIcon } from "./buttons/postSVG";
import { ImageUploadIcon } from "../../../styling/svgIcons";
import PostTab from "./PostTab";
import { checkBoxLabelStyle, checkBoxStyle, checkMarkStyle, createPostHeaderStype, cardStyle, panelStyle,
tabStyle, submittPanelStyle, formContainerStyle, labelStyle, dividorStyle, formTitleStyle, buttonLayoutStyle, postIconStyle } from "../../../styling/StyleComponents";
import { color } from "./styling";


var menuDropDownStyle = {
  borderRadius: "5pt",
  textAlign: "left",
  borderWidth: "1pt",
  padding: "1em",
  border: "1pt solid" + color.baseLightGrey,
  backgroundColor: "white",
  color: color.baseLightGrey,
}

class PostForm extends Component {
  constructor(props) {
    super(props);

    this.addPost = this.addPost.bind(this);
    this.onAddition = this.onAddition.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      title: "",
      content: "",
      contentType: "",
      description: "",
      unlisted: false,
      visibility: "PUBLIC",
      categories: [],
      selectedTab: "text",
      markdownTab: "write",
      imageObj: "",
      image: "",

      // following state are kept local, used for seperate different content
      imageContent: "",
      markDownContent: "",
      textContent: "",
    };

    this.reactTags = React.createRef();
  }

  handleOnHoverHelp = () => {
    console.log("Mouse is hovering");
  }

  handleOffHoverHelp = () => {
    console.log("Mouse has left");
  }

  handleFileSelected = event => {
    let file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
    this.setState({
      imageObj: file,
      image: URL.createObjectURL(event.target.files[0]),
    })
  }

  handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result;
    this.setState({
      imageContent: btoa(binaryString),
    })
  }

  handleVisibility = () => {
    if (this.state.visibility === "PUBLIC") {
      this.setState({
        visibility: "FRIENDS",
      });
      console.log(this.state.visibility);
    }
    else if (this.state.visibility === "FRIENDS") {
      this.setState({
        visibility: "PUBLIC",
      });
      console.log(this.state.visibility);
    }
  }

  handleUnlisted = () => {
    this.setState({
      unlisted: !this.state.unlisted,
    });
    console.log(this.state.unlisted);
  };

  onChange = (evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    this.setState({
      [evt.target.name]: value,
    });
  };

  addPost() {
    console.log(this.state.imageObj);
    const contentType = () => {
      switch (this.state.selectedTab) {
        case "text":
          return "text/plain";
        case "markdown":
          return "text/markdown";
        case "image":
          switch (this.state.imageObj.type) {
            case "image/png":
              return "image/png;base64";
            case "image/jpeg":
              return "image/jpeg;base64";
            default:
              break;
          }
        default:
          break;
      }
    };

    const getContent = () => {
      switch (this.state.selectedTab) {
        case "text":
          return this.state.textContent;
        case "markdown":
          return this.state.markDownContent;
        case "image":
          return this.state.imageContent;
        default:
          break;
      }
    };

    const categories = this.state.categories.map((cat) => cat.name);
    const newPost = {
      title: this.state.title,
      description: this.state.description,
      content: getContent(),
      contentType: contentType(),
      unlisted: this.state.unlisted,
      visibility: this.state.visibility,
      categories: categories,
      friends: this.state.friends,
    };
    this.props.createPost(newPost);
    this.props.setModalIsOpen(false);
    console.log(this.state);
    
  }

  selectTab(tab) {
    this.setState({ selectedTab: tab });
  }

  onDelete(i) {
    const categories = this.state.categories.slice(0);
    categories.splice(i, 1);
    this.setState({ categories });
  }

  onAddition(cat) {
    const categories = [].concat(this.state.categories, cat);
    this.setState({ categories });
  }

  render() {
    const converter = (markdown) => {
      return <Markdown>{markdown}</Markdown>;
    };

    const textEditor = () => {
      return (
        <Form.Textarea
        name="textContent"
          value={this.state.textContent}
          onChange={this.onChange}
          style={{
            height: `246.3px`,
          }}
        />
      );
    };

    const markdownEditor = () => {
      return (
        <ReactMde
          value={this.state.markDownContent}
          onChange={(m) => this.setState({ markDownContent: m })}
          selectedTab={this.state.markdownTab}
          onTabChange={(t) => this.setState({ markdownTab: t })}
          generateMarkdownPreview={(markdown) => Promise.resolve(converter(markdown))}
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
        />
      );
    };
    const FileUploadForm = () => {
      return (
        <div class="file is-centered is-boxed">
          <label class="file-label"style={{width: "100%", height: "38pt"}}>
            <input class="file-input" type="file" name="resume" onChange={this.handleFileSelected}/>
            <span class="file-cta" style={{backgroundColor: "transparent", border: "none"}}>
              <div style={{margin: "auto", marginTop: "-8pt"}}>
              <ImageUploadIcon svgScale={"35"} fill={color.baseBlack}/>
              </div>
            </span>
          </label>
        </div>
      );
    }

    const imagePreview = () => {
      if (this.state.imageContent !== "") {
        return (
          <img 
            src={ "image/png" ? `data:image/png;base64,${this.state.imageContent}` : `data:image/jpeg;base64,${this.state.content}` } 
            style={{borderRadius: "6pt", margin: "auto", objectFit: "cover"}} 
          />
        )
      }
    }

    const imageUploader = () => {
      return (
        <Form.Control>
          
          <Container style={{backgroundColor: "#F9F9F9", display: "flex", flexDirection: "column", border: "1px solid #d1d1d1", borderRadius: "6pt", height: "246.3px", padding: "0.5em"}}>
          <FileUploadForm/>
          <Container style={{backgroundColor: "white", display: "flex", width: "100%", border: "1px solid #d1d1d1", borderRadius: "6pt", overflowY: "scroll"}} className="hideScroll">
          {imagePreview()}
          </Container>
          
          </Container>
          
        </Form.Control>
      )
    }

    const SelectionPanel = () => {
      // custom selection tab
      // text, markdown, image
      return (
        <Container style={panelStyle}>
          <PostTab style={tabStyle}text="Text" active={this.state.selectedTab === "text"} action={() => this.selectTab("text")}/>
          <PostTab style={tabStyle} text="Markdown" active={this.state.selectedTab === "markdown"} action={() => this.selectTab("markdown")}/>
          <PostTab style={tabStyle} text="Image"active={this.state.selectedTab === "image"} action={() => this.selectTab("image")}/>
        </Container>
      )
    }

    const UnlistCheckBox = () => {
      return (
        <Container style={checkBoxStyle}>
          <p style={checkBoxLabelStyle}>Unlisted</p>
          <CheckBox style={checkMarkStyle} active={this.state.unlisted} action={this.handleUnlisted}/>
        </Container>
      )
    }

    const visibilityCheckBoxTranslator = (visibility) => {
      if (visibility === "FRIENDS"){
        return true;
      } else {
        return false;
      }
    }

    const VisibilityCheckBox = () => {
      return (
        <Container style={checkBoxStyle}>
          <p style={checkBoxLabelStyle}>Friends Only</p>
          <CheckBox style={checkMarkStyle} active={visibilityCheckBoxTranslator(this.state.visibility)} action={this.handleVisibility}/>
        </Container>
      )
    }

    const PostFormButtonPanel = () => {
      // Confirm and back button used to submit form
      return (
        <Container style={buttonLayoutStyle}>
          {/* <CancelButton action={cancelButtonHandler}/> */}
          <ConfirmButton action={this.addPost}/>
        </Container>
      )
    }

    const ToolTip = () => {
      return (
        <Container style={checkBoxStyle}>
        <div class="dropdown is-hoverable is-up" >
          <div class="dropdown-trigger" >
            <span
              style={{backgroundColor: "transparent", border: "none", fill: color.baseRed, padding: "0"}}
            >
            <ToolTipIcon svgScale={"25"} />
            </span>
          </div>
          <div class="dropdown-menu animate__animated animate__fadeIn animate__faster" style={{minWidth: "250pt", marginBottom: "6pt", marginLeft: "-10pt"}}>
            <div class="dropdown-content"style={menuDropDownStyle}>
              <p>
                {"<Friends> Only allows only friends to view this post."} <br></br>
                {"<Unlisted> make this post only visible to you."}
              </p>
            </div>
          </div>
        </div>    
        </Container>  
      )
    }

    const PostSubmitPanel = () => {
      return (
        <Container style={submittPanelStyle}>
          <ToolTip />
          <VisibilityCheckBox />
          <UnlistCheckBox/>
          <PostFormButtonPanel/>
        </Container>
      )
    }

    return (
      <Card id="postFormCard" style={cardStyle} className="animate__animated animate__slideInUp">
        {/* <Container style={createPostHeaderStype}>
          <Container style={postIconStyle.style}>{postIcons()}</Container>
        </Container> */}
        <Container style={formContainerStyle}>
          <Form.Field>
            <Form.Label style={labelStyle}>Title</Form.Label>
            <Form.Control>
              <Form.Textarea
                  onKeyPress={(e) => {if (e.key === "Enter") e.preventDefault();}}
                  maxLength="30"
                  cols={1}
                  name="title"
                  value={this.state.title}
                  style={formTitleStyle}
                  onChange={this.onChange}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label style={labelStyle}>Description</Form.Label>
            <Form.Control>
              <Form.Textarea
                onKeyPress={(e) => {if (e.key === "Enter") e.preventDefault();}}
                maxLength="50"
                cols={1}
                name="description"
                value={this.state.description}
                style={formTitleStyle}
                onChange={this.onChange}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label style={labelStyle}>Categories</Form.Label>
            <Form.Control>
              <ReactTags
                label=""
                allowNew={true}
                ref={this.reactTags}
                tags={this.state.categories}
                onDelete={this.onDelete}
                onAddition={this.onAddition}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label style={labelStyle}>Content</Form.Label>
            <Form.Control>
              {this.state.selectedTab === "text" ? textEditor() : null}
              {this.state.selectedTab === "markdown" ? markdownEditor() : null}
              {this.state.selectedTab === "image" ? imageUploader() : null}
            </Form.Control>
          </Form.Field>
          <SelectionPanel/>
        </Container>
        <PostSubmitPanel/>
      </Card>
    );
  }
}

export default PostForm;
