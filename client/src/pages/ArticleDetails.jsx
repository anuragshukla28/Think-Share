import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, deleteArticle } from "../services/articleService";
import { useDispatch, useSelector } from "react-redux";
import { likeArticleThunk, commentArticleThunk } from "../features/article/articleSlice";

const ArticleDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");

  const articleId = slug.split("-").pop();

  useEffect(() => {
    const fetchArticle = async (retry = false) => {
      try {
        const res = await getArticleById(articleId);
        setArticle(res.data?.data);
        setError(null);
      } catch (err) {
        if (!retry) {
          setTimeout(() => fetchArticle(true), 600);
        } else {
          setError("Failed to fetch article.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleEdit = () => {
    navigate(`/article/edit/${slug}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(articleId);
        navigate("/");
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleLike = async () => {
    await dispatch(likeArticleThunk(articleId));
    const updated = await getArticleById(articleId);
    setArticle(updated.data?.data);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await dispatch(commentArticleThunk({ id: articleId, text: comment }));
    const updated = await getArticleById(articleId);
    setArticle(updated.data?.data);
    setComment("");
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!article) return <p className="p-4">Article not found.</p>;

  const isAuthor = user?._id && article?.author?._id && user._id === article.author._id;
  const hasLiked = article.likes.includes(user?._id);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-600 mb-4">By {article.author?.fullName}</p>
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${hasLiked ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {hasLiked ? 'Unlike' : 'Like'} ({article.likes.length})
        </button>
        {isAuthor && (
          <>
            <button
              onClick={handleEdit}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <form onSubmit={handleComment} className="mb-4">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {article.comments.length === 0 && <p>No comments yet.</p>}
          {article.comments.map((c, idx) => (
            <div key={idx} className="border rounded p-3">
              <p className="font-semibold">{c.user?.fullName || "User"}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
