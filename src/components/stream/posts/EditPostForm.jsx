import React, { Component } from "react";
import ReactMde from "react-mde";
import { Form, Button, Card, Container } from "react-bulma-components";
import Markdown from "react-markdown";
import ReactTags from "react-tag-autocomplete";
import "./react-tags.css";

import CancelButton from "./buttons/CancelButton";
import ConfirmButton from "./buttons/ConfirmButton";
import DeleteButton from "./buttons/DeleteButton";
import CheckBox from "./CheckBox";

import { TextIcon, ImageIcon, MarkdownIcon, ToolTipIcon,  } from "./buttons/postSVG";
import { ImageUploadIcon } from "../../../styling/svgIcons";
import { color } from "./styling";
import PostTab from "./PostTab";
import Dividor from "./Dividor"


import { checkBoxLabelStyle, checkBoxStyle, checkMarkStyle, createPostHeaderStype, cardStyle, panelStyle, 
  tabStyle, submittPanelStyle, formContainerStyle, labelStyle, dividorStyle, formTitleStyle, postIconStyle } from "../../../styling/StyleComponents";


export const buttonLayoutStyle = {
  display: "flex",
  width: "0em",
  float: "right",
  marginRight: "10em",       // the width of two button.
}

var menuDropDownStyle = {
  borderRadius: "6pt",
  border: "1px solid #cfcccc",
  textAlign: "center",
  backgroundColor: "backgroundTooltip",
}

class EditPostForm extends Component {
  constructor(props) {
    super(props);

    this.editPost = this.editPost.bind(this);
    this.onAddition = this.onAddition.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.removePost = this.removePost.bind(this);

    let categoryTags = this.props.post.categories.map(function(t, i) { 
      return {id: i, name: t}
    })

    let selectedTab = () => {
      if ((this.props.post.contentType) === "text/plain") return "text";
      if ((this.props.post.contentType) === "text/markdown") return "markdown";
      return "image";
    }


    this.state = {
      title: this.props.post.title,
      content: "",
      contentType: this.props.post.contentType,
      description: this.props.post.description,
      unlisted: this.props.post.unlisted,
      visibility: this.props.post.visibility,
      categories: categoryTags,
      selectedTab: selectedTab(),
      markdownTab: "write",
      imageObj: "",
      image: "",

      // following state are kept local, used for seperate different content
      imageContent: selectedTab() === "image" ? this.props.post.content : "",
      markDownContent: selectedTab() === "markdown"? this.props.post.content : "",
      textContent: selectedTab() === "text"? this.props.post.content : "",
    };

    this.reactTags = React.createRef();
  }

  handleFileSelected = event => {
    let file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
    this.setState({
      imageObj: file,
      image: URL.createObjectURL(event.target.files[0]),
    })
  }

  handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result;
    this.setState({
      imageContent: (binaryString),
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
  };

  onChange = (evt) => {
    const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    this.setState({
      [evt.target.name]: value,
    });
  };
  

  editPost() {
    console.log(this.state.unlisted);
    const author = JSON.parse(localStorage.getItem("author"));
    console.log(author);
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
    const editedPost = {
      ...this.props.post,
      title: this.state.title,
      description: this.state.description,
      content: getContent(),
      contentType: contentType(),
      unlisted: this.state.unlisted,
      visibility: this.state.visibility,
      categories: categories,
    };

    this.props.updatePost(editedPost);
    this.props.setEditModalIsOpen(false);
  }

  removePost() {
    this.props.deletePost(this.props.post)
    this.props.setEditModalIsOpen(false);
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
            height: `245px`,
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
            <span class="file-cta">
              <div style={{margin: "auto", marginTop: "-6pt"}}>
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
            src={this.state.imageContent}
            style={{borderRadius: "6pt", margin: "auto", maxHeight: "15em", minHeight: "15em", objectFit: "cover"}} 
          />
        )
      }
    }

    const imageUploader = () => {
      return (
        <Form.Control>
          <Container style={{display: "flex", flexDirection: "column", border: "1px solid #d1d1d1", borderRadius: "4px", minHeight: "17em", maxHeight: "22em"}}>
          <FileUploadForm/>
          <Container style={{display: "flex", padding: "1em", width: "100%"}}>
          {imagePreview()}
          </Container>
          </Container>
          
        </Form.Control>
      )
    }

    const postIcons = () => {
      switch (this.state.selectedTab) {
        case "text":
          return (<TextIcon svgScale={postIconStyle.scale} />)
        case "image":
          return (<ImageIcon svgScale={postIconStyle.scale} />)
        case "markdown":
          return (<MarkdownIcon svgScale={postIconStyle.scale} />)
      }
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
          
          {/* <CancelButton action={() => this.props.setEditModalIsOpen(false)}/> */}
          <DeleteButton action={this.removePost}/>
          <ConfirmButton action={this.editPost}/>
        </Container>
      )
    }

    const DropDown = () => {
      return (
        <div class="dropdown is-hoverable" style={{ float:"left", marginTop: "1.8em" }}>
          <div class="dropdown-trigger" >
            <span
              style={{backgroundColor: "transparent", border: "none", fill: color.baseRed, width: "4em", padding: "0"}}
            >
            <ToolTipIcon svgScale={"25"} />
            </span>
          </div>
          <div class="dropdown-menu animate__animated animate__fadeIn animate__faster" style={{minWidth: "250pt", marginRight: "-5pt"}}>
            <div class="dropdown-content"style={menuDropDownStyle}>
            <strong>Friends Only</strong> will only allow friends to view this post. <br></br><strong>Unlisted</strong> will allow this post to only show up on the stream of this post author.
            </div>
          </div>
        </div>      
      )
    }
  

    const PostSubmitPanel = () => {
      return (
        <Container style={submittPanelStyle}>
          <DropDown />
          <VisibilityCheckBox />
          <UnlistCheckBox/>
          <PostFormButtonPanel/>
        </Container>
      )
    }

    return (
      <Card style={cardStyle} className="animate__animated animate__slideInUp">
        <Container style={createPostHeaderStype}>
          <Container style={postIconStyle.style}>{postIcons()}</Container>
        </Container>
        <Container style={formContainerStyle}>
          <Form.Field>
            <Form.Label style={labelStyle}>Title</Form.Label>
            <Form.Control>
              <Form.Textarea
                  onKeyPress={(e) => {if (e.key === "Enter") e.preventDefault();}}
                  maxLength="80"
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
                maxLength="120"
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
          <Dividor style={dividorStyle}/>
          <SelectionPanel/>
          <Dividor style={dividorStyle}/>
        </Container>
        <PostSubmitPanel/>
      </Card>
    );
  }
}

export default EditPostForm;
