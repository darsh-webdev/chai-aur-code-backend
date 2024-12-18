import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Missing video id");
  }

  const comments = await Comment.aggregatePaginate(
    [
      { $match: { video: mongoose.Types.ObjectId(videoId) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "owner",
        },
      },
      {
        $project: {
          content: 1,
          owner: {
            _id: "$owner._id",
            name: "$owner.name",
            email: "$owner.email",
          },
        },
      },
    ],
    {
      page: parseInt(page),
      limit: parseInt(limit),
    }
  );

  if (!comments) {
    throw new ApiError(400, "Error fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId, channelId } = req.params;
  const { content } = req.body;

  if (!videoId || !channelId) {
    throw new ApiError(400, "Missing video id or channel id");
  }

  if (!content) {
    throw new ApiError(400, "Content cannot be empty");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: channelId,
  });

  if (!comment) {
    throw new ApiError(400, "Error while creating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (commentId) {
    throw new ApiError(400, "Missing comment id");
  }

  if (!content) {
    throw new ApiError(400, "Content cannot be empty");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Error updating comment");
  }

  return res
    .statu(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Missing comment id");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(400, "Error while deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
