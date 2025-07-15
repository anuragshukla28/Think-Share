import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addArticle } from "../features/article/articleSlice.js";
import { createArticle } from "../services/articleService.js";

const CreateArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      data.append("image", formData.image);

      const res = await createArticle(data);
      const savedArticle = res.data?.data;

      if (!savedArticle) throw new Error("Failed to save article");

      dispatch(addArticle(savedArticle));
      navigate("/articles");
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 drop-shadow">
          ✍️ Create a New Article
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            type="text"
            placeholder="Amazing Article Title"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 font-medium shadow-sm"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            onChange={handleFileChange}
            required
          />

          <textarea
            name="content"
            rows="10"
            placeholder="Start writing your thoughts here..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-700 shadow-sm resize-none"
            value={formData.content}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "🚀 Publish Article"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
