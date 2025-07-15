import { Article } from "../models/article_models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ✅ Create Article
export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const imageLocalPath = req.file?.path;

  if (!title || !content || !imageLocalPath) {
    throw new ApiError(400, "Title, content, and image are required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image?.url) throw new ApiError(500, "Image upload failed");

  const article = await Article.create({
    title,
    content,
    image: image.url,
    author: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, article, "Article created"));
});

// ✅ Get All Articles
export const getAllArticles = asyncHandler(async (_, res) => {
  const articles = await Article.find({})
  .populate("author", "fullName")
  .populate("comments.user", "fullName"); // ✅ This is crucial
  return res.status(200).json(new ApiResponse(200, articles));
});

// ✅ Get Single Article
export const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
  .populate("author", "fullName avatar")
  .populate("comments.user", "fullName avatar");
  if (!article) throw new ApiError(404, "Article not found");
  return res.status(200).json(new ApiResponse(200, article));
});

// ✅ Update Article
// ✅ Update Article
export const updateArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, "Article not found");

  if (article.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to update this article");
  }

  article.title = title || article.title;
  article.content = content || article.content;

  // ✅ Optional image update
  if (req.file?.path) {
    const image = await uploadOnCloudinary(req.file.path);
    if (!image?.url) throw new ApiError(500, "Image upload failed");
    article.image = image.url;
  }

  await article.save();
  return res.status(200).json(new ApiResponse(200, article, "Article updated"));
});

// ✅ Delete Article
export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, "Article not found");
  if (article.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this article");
  }

  await article.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Article deleted"));
});

// ✅ Like Article
export const toggleLikeArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, "Article not found");

  const userId = req.user._id;
  const index = article.likes.indexOf(userId);

  if (index === -1) {
    article.likes.push(userId);
  } else {
    article.likes.splice(index, 1);
  }

  await article.save();
  return res.status(200).json(new ApiResponse(200, article.likes, "Like status updated"));
});

// ✅ Add Comment
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) throw new ApiError(400, "Comment text is required");

  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, "Article not found");

  article.comments.push({
    user: req.user._id,
    text,
  });

  await article.save();
  return res.status(200).json(new ApiResponse(200, article.comments, "Comment added"));
});


export const getArticlesByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const articles = await Article.find({ author: id }).populate("author", "fullName avatar");

  return res.status(200).json(new ApiResponse(200, articles, "Articles by user fetched"));
});
