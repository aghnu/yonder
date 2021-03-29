import axios from "axios";
import { toast } from "react-toastify";
import {
  NEW_POST_ERROR,
  NEW_POST_SUBMITTED,
  NEW_POST_SUCCESS,
  EDIT_POST_SUBMITTED,
  EDIT_POST_SUCCESS,
  EDIT_POST_ERROR,
  DELETE_POST_SUBMITTED,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  RETRIEVE_INBOX_SUBMITTED,
  RETRIEVE_INBOX_ERROR,
  RETRIEVE_INBOX_SUCCESS,
  RETRIEVE_POSTS_SUBMITTED,
  RETRIEVE_POSTS_SUCCESS,
  RETRIEVE_POSTS_ERROR,
} from "./StreamTypes";
import { setAxiosAuthToken } from "../../utils/Utils";


export const sharePost = (newPost) => (dispatch, getState) => {
  /*
  NOTICE: change this before part2 deadline
  for now, sharePost will treat the post as new, and do the samething as createPost.
  source and origin, will be handled by backend
  backend support should be ready before demo March 31st
  */
  const state = getState();
  setAxiosAuthToken(state.auth.token);

  newPost["author"] = state.auth.author;

  dispatch({ type: NEW_POST_SUBMITTED });
  axios
    .post("/author/" + state.auth.author.id + "/posts/", newPost)
    .then((response) => {
      dispatch({ type: NEW_POST_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: NEW_POST_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};

export const createPost = (newPost) => (dispatch, getState) => {
  const state = getState();
  setAxiosAuthToken(state.auth.token);

  newPost["author"] = state.auth.author;

  dispatch({ type: NEW_POST_SUBMITTED });
  axios
    .post("/author/" + state.auth.author.id + "/posts/", newPost)
    .then((response) => {
      dispatch({ type: NEW_POST_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: NEW_POST_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};

export const updatePost = (editedPost) => (dispatch, getState) => {
  setAxiosAuthToken(getState().auth.token);
  dispatch({ type: EDIT_POST_SUBMITTED });
  console.log(editedPost);
  axios
    .put("/author/" + editedPost.author.id + "/posts/" + editedPost.id + "/", editedPost)
    .then((response) => {
      dispatch({ type: EDIT_POST_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: EDIT_POST_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};

export const retrieveInbox = (authorId) => (dispatch, getState) => {
  const state = getState();

  setAxiosAuthToken(state.auth.token);
  dispatch({ type: RETRIEVE_INBOX_SUBMITTED });
  axios
    .get("/author/" + authorId + "/inbox/")
    .then((response) => {
      dispatch({ type: RETRIEVE_INBOX_SUCCESS, payload: response.data });
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: RETRIEVE_INBOX_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};

export const deletePost = (aPost) => (dispatch, getState) => {
  const state = getState();
  const author = state.auth.author;

  setAxiosAuthToken(getState().auth.token);
  dispatch({ type: DELETE_POST_SUBMITTED });
  console.log(aPost);
  axios
    .delete("/author/" + author.id + "/posts/" + aPost.id + "/")
    .then((response) => {
      dispatch({ type: DELETE_POST_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: DELETE_POST_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};


export const retrieveLoggedInAuthorPosts = () => (dispatch, getState) => {
  const state = getState();
  const author = state.auth.author;

  setAxiosAuthToken(state.auth.token);
  dispatch({ type: RETRIEVE_POSTS_SUBMITTED });
  axios
    .get("/author/" + author.id + "/posts/")
    .then((response) => {
      dispatch({ type: RETRIEVE_POSTS_SUCCESS, payload: response.data });
    })
    .catch((error) => {
      if (error.response) {
        toast.error(JSON.stringify(error.response.data));
        dispatch({
          type: RETRIEVE_POSTS_ERROR,
          errorData: error.response.data,
        });
      } else if (error.message) {
        toast.error(JSON.stringify(error.message));
      } else {
        toast.error(JSON.stringify(error));
      }
    });
};

