import {Router} from 'express'
import { createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    toggleLikeArticle,
    addComment ,
getArticlesByUserId} from '../controllers/article_ctrl.js'
import {verifyToken} from "../middlewares/verifyToken.js"
import {upload} from "../middlewares/multer_middlewares.js"

const router = Router();

// ✅ Create a new article with image
router.post("/create", verifyToken, upload.single("image"), createArticle);

// ✅ Get all articles
router.get("/all", getAllArticles);

// ✅ Get all articles by a user
router.get("/user/:id", getArticlesByUserId); 

// ✅ Get single article by ID
router.get("/:id", getArticleById);

// ✅ Update article (only by author)
router.put("/:id", verifyToken, upload.single("image"), updateArticle);

// ✅ Delete article (only by author)
router.delete("/:id", verifyToken, deleteArticle);

// ✅ Like/unlike article
router.post("/:id/like", verifyToken, toggleLikeArticle);

// ✅ Add comment
router.post("/:id/comment", verifyToken, addComment);

export default router;