import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateArticle } from "../services/articleService.js";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArticle as updateArticleInStore,
  fetchAllArticles,
} from "../features/article/articleSlice";
import slugify from "slugify";

const EditArticle = () => {
  const { slug: rawSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const slugParts = rawSlug.split("-");
  const id = slugParts.pop();

  const { articles } = useSelector((state) => state.article);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    oldImage: "",
    _id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const article = articles.find((art) => art._id === id);
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        oldImage: article.image,
        image: null,
        _id: article._id,
      });
    }
  }, [id, articles]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (formData.image) data.append("image", formData.image);

      const res = await updateArticle(formData._id, data);
      if (!res?.data) throw new Error("Unexpected response from server");

      dispatch(updateArticleInStore(res.data));
      dispatch(fetchAllArticles());

      navigate(
        `/article/${slugify(res.data.title, { lower: true })}-${res.data._id}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!formData._id)
    return <p className="text-center text-lg mt-20">Loading article...</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 drop-shadow">
          ✏️ Edit Your Article
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            type="text"
            placeholder="Article Title"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 font-medium shadow-sm"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <img
            src={formData.oldImage}
            alt="Current"
            className="w-full h-52 object-cover rounded-lg border"
          />

          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            onChange={handleFileChange}
          />

          <textarea
            name="content"
            rows="10"
            placeholder="Update your article content..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 shadow-sm resize-none"
            value={formData.content}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Updating..." : "✅ Update Article"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditArticle;
