import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArticles } from "../features/article/articleSlice";
import { Link, useNavigate } from "react-router-dom";
import slugify from "slugify";
import { useAuth } from "../hooks/useAuth";
import {
  deleteArticle as deleteArticleApi,
  likeArticle,
} from "../services/articleService";

const BATCH_SIZE = 5;

const Articles = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.article);

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [localLikes, setLocalLikes] = useState({});
  const observer = useRef();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (articles.length === 0) {
      dispatch(fetchAllArticles());
    }
  }, [dispatch, articles.length, user, navigate]);

  const lastArticleRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCount < articles.length) {
          setVisibleCount((prev) => prev + BATCH_SIZE);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, visibleCount, articles.length]
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticleApi(id);
        dispatch(fetchAllArticles());
        setVisibleCount(BATCH_SIZE);
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Failed to delete article");
      }
    }
  };

  const handleLike = async (id) => {
    const alreadyLiked = localLikes[id] || articles.find(a => a._id === id)?.likes.includes(user?._id);
    const updatedLikes = { ...localLikes };

    updatedLikes[id] = !alreadyLiked;
    setLocalLikes(updatedLikes);

    try {
      await likeArticle(id);
      dispatch(fetchAllArticles());
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const sortedArticles = [...articles].reverse(); // reverse order
  const currentArticles = sortedArticles.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-12 drop-shadow">
        📝 Explore Articles
      </h1>

      {loading && <p className="text-center text-lg">Loading articles...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {currentArticles.map((article, index) => {
          const isAuthor = user?._id && article.author?._id === user._id;
          const slug = slugify(article.title, { lower: true });
          const isLast = index === currentArticles.length - 1;
          const alreadyLiked =
            localLikes[article._id] !== undefined
              ? localLikes[article._id]
              : article.likes.includes(user?._id);

          const commentPreview = article.comments
            .slice(-2)
            .reverse()
            .map((c) => ({
              name: c.user?.fullName || "User",
              text: c.text,
            }));

          return (
            <div
              key={article._id}
              ref={isLast ? lastArticleRef : null}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-[1.01] overflow-hidden flex flex-col border border-gray-200"
            >
              <Link to={`/article/${slug}-${article._id}`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    ✍️{" "}
                    <span className="font-medium text-blue-600">
                      {article.author?.fullName || "Unknown"}
                    </span>
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    {commentPreview.map((c, i) => (
                      <p key={i}>
                        💬 <span className="font-medium">{c.name}:</span> {c.text}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>

              <div className="flex justify-between items-center px-5 pb-4 mt-auto gap-3">
                <button
                  onClick={() => handleLike(article._id)}
                  className={`text-sm px-3 py-1.5 rounded-full ${
                    alreadyLiked
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } transition`}
                >
                  👍{" "}
                  {article.likes.length +
                    (localLikes[article._id] !== undefined
                      ? localLikes[article._id]
                        ? 1
                        : -1
                      : 0)}
                </button>

                <Link
                  to={`/article/${slug}-${article._id}#comments`}
                  className="text-sm px-3 py-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  💬 {article.comments.length}
                </Link>

                {isAuthor && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/article/edit/${slug}-${article._id}`)
                      }
                      className="text-sm px-3 py-1.5 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-sm px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && articles.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No articles found. Be the first to share!
        </p>
      )}

      {visibleCount < articles.length && (
        <div className="text-center mt-10 text-blue-500 animate-pulse font-medium">
          Loading more articles...
        </div>
      )}
    </div>
  );
};

export default Articles;
