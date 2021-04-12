import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Button, Content, Section, Card,Container,Columns, List } from "react-bulma-components";
import Dividor from "./Dividor";
import EditButton from "./buttons/EditButton";
import ShareButton from "./buttons/ShareButton";
import LikeButton from "./buttons/LikeButton";
import LikedButton from "./buttons/LikedButton";
import { dividorStyle, pageStyle,buttonLayerContainerStyle,newPostButtonStyle, streamLayerContainerStyle, postContainerStyle, postStyle, signatureStyle, postTitleStyle, DescriptionStyle, contentStyle, postContentStyle, categoriesStyle, footerButtonLayoutStyle} from "../../../styling/StyleComponents";
import { color } from "../../../styling/ColorFontConfig";

import EditPostForm from "./EditPostForm";
import SharingPostPrompt from "./SharingPostPrompt";
import { updatePost, deletePost, likePost, sharePost } from '../StreamActions';

import { retrievePost, createComment, retrieveCommentList,updateRetrivedPost, sendCommentQuery } from "./PostActions";
import { Redirect } from "react-router-dom";

import { DetailedPostIcon,PostCommentsIcon } from "../../../styling/svgIcons";
import { retrievePostLikes } from "./PostActions";
import { toast } from "react-toastify";

import ReactMde from "react-mde";
import PaginationTag from "./Pagination";

import dateFormat from 'dateformat';
import CommentModal from "./modals/CommentModal";

// local styling
var localCardStyle = {
  ...postStyle,
  minWidth: "400pt",
  borderRadius: "12pt",
}

var wrapperStyle = {
  marginLeft: "0.6em",
  marginRight: "0.6em",
  marginBottom: "0.2em",
  boxShadow: "0pt 0pt 6pt rgb(0,0,0,0.1)",
  borderRadius: "10pt",
  backgroundColor: "white",
}

var shadowDividorStyle = {
  border:"none",
  width: "105%",
  height: "50px",
  boxShadow:"0 10pt 10pt -15pt rgb(0,0,0,0.3)",
  margin: "-40pt auto -15pt",
  marginLeft: "-1em",
  backgroundColor: color.backgroundCreamLighter,
}

function getDateString(ms) {
  let date = new Date(ms);
  return date.toLocaleDateString();
}

function DetailedPostList(props) {

  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [sharingPromptIsOpen, setSharingPromptIsOpen] = useState(false)
  const [writtenComment, setWrittenComment] = useState("")


  // helper functions
  const IsImage = () => {
    if (props.post.contentType === "text/plain") {
      return false;
    }
    else if (props.post.contentType === "text/markdown") {
      return false;
    }
    else {
      return true;
    }
  }
  const getCategories = (cat) => {
    let categories =  cat.map((c) => <p>#{c}</p>)
    return (
      <Container style={categoriesStyle}>
        {categories}
      </Container>
    )
  }
  const displayFooterButtons = () => {
    let editButton = () => {
      // edit button
      if (props.loggedInAuthor.id == props.post.author.id) {
        return  (
          <EditButton action={() => setEditModalIsOpen(true)}/>
        );
      }
    }

    return (
      <div>
        <Container style={{...footerButtonLayoutStyle, height: "2.8em"}}>
          {/* buttons */}
          <LikedButton count={props.likeCount} action={() => props.likedToggle()}/>
          {editButton()}
          <ShareButton action={() => setSharingPromptIsOpen(true)}/>
          
          {/* modal */}
          <Modal className="animate__animated animate__fadeIn animate__faster" show={editModalIsOpen} onClose={() => setEditModalIsOpen(false)} closeOnBlur closeOnEsc>
            <EditPostForm
              setEditModalIsOpen={setEditModalIsOpen}
              post={props.post}
              updatePost={props.updatePost}
              deletePost={props.deletePost}
            />
          </Modal>
          <Modal className="animate__animated animate__fadeIn animate__faster" show={sharingPromptIsOpen} onClose={() => setSharingPromptIsOpen(false)} closeOnBlur closeOnEsc>
            <SharingPostPrompt
              setModalIsOpen={setSharingPromptIsOpen}   
              post={props.post}
              sharePost={props.sharePost}
            />
          </Modal>
      
      </Container>
      </div>
    );
  }

  // const CommentCard = () => {
  //   return (
  //     <Card style={postStyle}>
  //       <Card.Content style={postContainerStyle}>
  //         {/* author and timestamp */}
  //         <Container style={signatureStyle}>
  //         <p>·</p>
  //         </Container>
  //         <Container style={postTitleStyle}>
  //         <p style={{color: color.baseBlack}}>Comment</p>
  //         </Container>
  //         {/* comment section */}
  //         <Container style={DescriptionStyle}>
  //           {
  //             <div >
  //               <CommentList commentData={props.commentList} postAuthorName={props.loggedInAuthor} />
  //             </div>
  //           }
  //         </Container>
  //       </Card.Content>
  //     </Card>
  //   )
  // }

  const CommentEditorCard = () => {
    return (
      <Card style={postStyle}>
        <Card.Content style={postContainerStyle}>
          <ReactMde
            value={writtenComment}
            onChange={m => setWrittenComment(m)}
          />
          <Button
            style={{ float: "right", marginRight: `-2px` }}
            onClick={e => {
              props.createComment(writtenComment);
              setWrittenComment("");
              window.location.reload();
            }}
          >
          Comment
        </Button>
        </Card.Content>
      </Card>
    )
  }


  const PostCard = () => {
    return (
      <Card style={localCardStyle}>
        <Container style={{fill: color.baseLightGrey,textAlign: "center", width: "100%", padding: "1.2em"}}>
          <DetailedPostIcon svgScale={"80"}/>
        </Container>
        <Container style={wrapperStyle}>
          <Card.Content style={postContainerStyle}>

              {/* Title */}
              <Container style={signatureStyle}>
                <p style={{ fontWeight: "250" }}>@{props.post.author.displayName}</p>
                <p>·</p>
                <p>{getDateString(Date.parse(props.post.published))}</p>
              </Container>
              <Container style={postTitleStyle}>
                <p style={{textDecoration: "none", color: color.baseBlack}}>{props.post.title}</p>
              </Container>
              
              {/* Description */}
              <Container style = {DescriptionStyle}>  
                <p>{props.post.description }</p>
              </Container>

              <hr style={{...shadowDividorStyle, backgroundColor: "transparent", marginBottom: "0.5em", marginTop: "-32pt"}}></hr>
            
            {/* Content */}
            <Container style = {postContentStyle}>
            {IsImage() ? (
              <Content style={{textAlign: "center"}}>
                <img style={{borderRadius: "6pt", maxHeight: "500pt"}}src={props.post.content} /> 
              </Content>
            ) : <Content>{props.post.content}</Content> }
            </Container>
            
            {/* categories */}
            <Container style={postContentStyle}>
              {getCategories(props.post.categories)}
            </Container>
          </Card.Content> 
        </Container>
        {displayFooterButtons()}
        {CommentEditorCard()}
      </Card>
    )
  }
  
  return PostCard();

}


class CommentCard extends React.Component {
  constructor(props) {
    super(props);

    this.pageSize = 5;

    this.state = {
      comments: [],
      commentsCount: 0,
      commentPageNum: 1,
    };
  }

  requestComments = (page) => {


    if (this.props.post.author) {
      if ((this.props.auth !== undefined)&&(this.props.auth.isAuthenticated)) {

        this.props.sendCommentQuery(this.props.post, page, this.pageSize, (data)=>{
          console.log(data)
          if (data) {
            this.setState({
              comments: data.items,
              commentPageNum: page,
              commentsCount: data.count,
            })
          }
        })

      }      
    }


  }


  componentDidMount() {
    this.requestComments(this.state.commentPageNum);
  }

  CommentsCard = () => {

    const CommentContainer = (props) => {
      // display one comment
      return (
        <Container style={{...wrapperStyle, marginBottom: "0.6em"}}>
          <Container style={postContainerStyle}>

            {/* Date */}
            <p style={{float: "right", color: color.baseLightGrey, fontSize: "0.9em", marginRight: "0.5em"}}>{dateFormat(props.published, "dddd, mmmm dS, yyyy, h:MM TT")}</p>
            
            {/* Title */}
            <p style={{color: color.baseLightGrey, fontSize: "0.9em", marginLeft: "0.4em"}}>@{props.authorName}</p>
            <hr style={{...shadowDividorStyle, backgroundColor: "transparent", marginBottom: "0.5em", marginTop: "-32pt"}}></hr>

            {/* Content */}
            <p style={postContentStyle}>{props.content}</p>
            
          </Container>
        </Container>
      )
    }

    const CommentsList = (props) => {
      // this part will rerender when commentState changes
  
      const commentsComponentList = props.commentState.map(
        (acomment) => 
          <CommentContainer
            authorName={acomment.author.displayName}
            published={acomment.published}
            content={acomment.comment}
          />
      );
  
      return (
        <List>
          {commentsComponentList}
        </List>
      )
    }

    return (
      <Card style={localCardStyle}>
          <Container style={{position: "fixed", right: "10%", marginTop: "2.2em", display: "flex", gap: "0.5em", zIndex: "1"}}>
            <p style={{color: color.baseLightGrey, fontSize: "1.2em", fontWeight: "450", marginTop: "0.5em"}}>Write comment</p>
            <CommentModal/>
          </Container>
          <Container style={{fill: color.baseLightGrey,textAlign: "left", width: "100%", padding: "1.2em", paddingLeft: "10%"}}>
            <PostCommentsIcon svgScale={"90"}/>
          </Container>
          
          {/* <p style={{textAlign: "center"}}>{this.state.commentPageNum}</p> */}
          <hr style={{...shadowDividorStyle, backgroundColor: "transparent", marginBottom: "10pt", marginTop: "-32pt"}}></hr>
          <PaginationTag
            count={this.state.commentsCount}
            pageSize={this.pageSize}
          />
          {/* <hr style={{...shadowDividorStyle, backgroundColor: "transparent",transform: "rotate(180deg)", marginBottom: "-12pt", marginTop: "-12pt"}}></hr> */}
          <Container style={{marginBottom: "1.5em", marginTop: "-0.5em", width: "100%"}}>
          <CommentsList commentState={this.state.comments}/>
          </Container>
      </Card>
    )
  }


  render() {
    return this.CommentsCard();
  }
}


class SelectedPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      likeCount: 0,
      likePolling: null,
    }
  }

  // polling handler
  likePollingCall = (post, setter) => {
    // this function is safe measure (wrapper) for preventing situation where auth is not set, but the webpage is still open
    // polling will only be done if auth is set
    if (this.props.retrievedPost.author) {
      if ((this.props.auth !== undefined)&&(this.props.auth.isAuthenticated)) {
        this.props.retrievePostLikes(post, setter);
      }      
    }
  }

  likePostCall = (post, setter=null) => {
    // same as likePollingCall
    // call this function to like a post
    if ((this.props.auth !== undefined)&&(this.props.auth.isAuthenticated)) {
      this.props.likePost(post, setter);
    }
  }
  setLikeCount = (s) => {
    this.setState({likeCount: s});
  }
  postLikeSetter = (likeList) => {
    this.setLikeCount(likeList.items.length);
  }
  likedToggle = () => {
    // like a post, and trigger a event to retrive likes after backend responded.
    this.likePostCall(this.props.retrievedPost, () => this.likePollingCall(this.props.retrievedPost, this.postLikeSetter));
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this.props.retrievePost(params.author_id,params.id, ()=>this.likePollingCall(this.props.retrievedPost, this.postLikeSetter));
    this.props.retrieveCommentList(params.athor_id,params.id);
    
    this.state["likePolling"] = setInterval(()=>this.likePollingCall(this.props.retrievedPost, this.postLikeSetter), 15 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.state["likePolling"]);
  }

  render() {
    if (this.props.loading || !this.props.retrievedPost.author) {
        return (
            <div className="pageloader is-active">
                <span className="title">Loading</span>
            </div>
        );
    }

    const updatePostWrapper = (editedPost) => {
      this.props.updatePost(editedPost, this.props.updateRetrivedPost);
    }

    const sharePostWrapper = (post) => {
      this.props.sharePost(post, ()=>toast.success("This post is now added to your stream"));
    }

    const deletePostWrapper = (post) => {
      this.props.deletePost(post, ()=>window.location.pathname="/");
    }

    if (!this.props.auth.isAuthenticated)
      // redirect user to login page if not logged in
      return <Redirect to="/" />;
    else
      return (
        <Section style={pageStyle}>
          <div style={buttonLayerContainerStyle}>
            <Container style={newPostButtonStyle}>
              {/* add floating buttons here, if needed */}
            </Container>
          </div>
          <div style={streamLayerContainerStyle}>
            <Container fluid>
              <Columns centered>

              <div className="post-list animate__animated animate__fadeInUp">
                <List hoverable>
                  <DetailedPostList 
                    post={this.props.retrievedPost} 
                    loggedInAuthor={this.props.loggedInAuthor} 
                    comments={this.props.comments} 
                    createComment={this.props.createComment} 
                    commentList={this.props.retrievedCommentList} 
                    likePost={this.props.likePost} 
                    likeCount={this.state.likeCount}
                    likedToggle={this.likedToggle}
                    updatePost={updatePostWrapper} 
                    sharePost={sharePostWrapper}
                    deletePost={deletePostWrapper}
                    
                  />
                  <CommentCard 
                    auth={this.props.auth}
                    post={this.props.retrievedPost} 
                    sendCommentQuery={this.props.sendCommentQuery}
                  />              
                </List>
              </div>
              </Columns>
            </Container>
          </div>
        </Section>
      );
  }
}

SelectedPost.propTypes = {
  loggedInAuthor: PropTypes.object.isRequired,
  retrievePost: PropTypes.func.isRequired,
  retrievedPost: PropTypes.object.isRequired,
  updateRetrivedPost: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  retrieveCommentList: PropTypes.func.isRequired,
  retrievedCommentList: PropTypes.array.isRequired,
  retrievePostLikes: PropTypes.func.isRequired,
};

DetailedPostList.propTypes = {
  createComment: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  loading: state.post.loading,
  retrievedPost: state.post.retrievedPost,
  loggedInAuthor: state.auth.author,
  retrievedCommentList: state.post.retrievedCommentList,
});

export default connect(mapStateToProps, {
  sendCommentQuery, 
  retrievePostLikes, 
  updateRetrivedPost, 
  retrievePost, 
  updatePost, 
  deletePost, 
  likePost, 
  sharePost, 
  createComment, 
  retrieveCommentList
})(withRouter(SelectedPost));
