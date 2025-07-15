import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getArticlesByUser } from "../services/articleService";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const res = await getArticlesByUser(user?._id);
        setArticles(res.data.data);
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchUserArticles();
  }, [user]);

  const totalLikes = articles.reduce((sum, article) => sum + article.likes.length, 0);
  const totalComments = articles.reduce((acc, curr) => acc + curr.comments.length, 0);

  if (!user)
    return (
      <p className="text-center text-lg text-gray-600 mt-10">
        Please login to view your profile.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl mb-10 border border-gray-200">
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt={user.fullName || "User Avatar"}
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
            {user.fullName}
          </h2>
          <p className="text-gray-600 italic text-sm">
            {user.bio || "No bio provided."}
          </p>
          <p className="mt-2 text-sm text-gray-700">
            ❤️{" "}
            <span className="font-semibold text-red-500">{totalLikes}</span> total
            likes on your articles
          </p>
          <p className="text-sm text-gray-700">
    📄 <span className="font-semibold text-blue-600">{articles.length}</span> articles published
  </p>
  <p className="text-sm text-gray-700">
  💬 <span className="font-semibold text-purple-600">{totalComments}</span> total comments received
</p>
          <div className="flex gap-6 mt-3 text-blue-600 font-medium text-lg">
            {user.instagram && (
              <a
                href={user.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline hover:text-pink-500 transition"
              >
                <FaInstagram /> Instagram
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline hover:text-blue-800 transition"
              >
                <FaLinkedin /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <h3 className="text-2xl font-bold text-purple-700 mb-6 drop-shadow">
        📝 Your Articles
      </h3>

      {loading && <p className="text-center text-gray-600">Loading articles...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && articles.length === 0 && (
        <p className="text-center text-gray-500 text-lg italic">
          No articles found. Start sharing your thoughts!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const slug = slugify(article.title, { lower: true });
          return (
            <Link
              key={article._id}
              to={`/article/${slug}-${article._id}`}
              className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800 truncate">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {article.description || "Click to read more..."}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
