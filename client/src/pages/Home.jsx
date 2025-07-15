import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArticles } from "../features/article/articleSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAIHelp } from "../services/openAiService";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles } = useSelector((state) => state.article);
  const { user } = useAuth();

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (user && articles.length === 0) {
      dispatch(fetchAllArticles());
    }
  }, [dispatch, user, articles.length]);

  const handleAskAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const reply = await getAIHelp(`Help me shape this idea: ${aiInput}`);
      setAiResponse(reply);
    } catch (err) {
      setAiResponse("❌ AI failed to respond. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-100 min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow"
        >
          Welcome to <span className="text-purple-600">ThinkShare</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
        >
          A platform where ideas meet intelligence — shared by professionals across the globe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <button
            onClick={() => navigate("/article/create")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-3xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            ✍️ Share Your Thoughts
          </button>

          <button
            onClick={() => setShowAIModal(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-3xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            🤖 Get AI Support
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 px-6 rounded-3xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            💫 Explore Yourself
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Link
            to="/articles"
            className="inline-block bg-white/60 backdrop-blur-md text-blue-800 font-medium px-6 py-3 rounded-full border border-blue-300 shadow hover:shadow-xl hover:bg-white/80 transition"
          >
            📚 Browse All Articles
          </Link>
        </motion.div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl w-[90%] max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-gray-300"
            >
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/90 z-10 pb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  💡 AI Thought Assistant
                </h2>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="text-2xl font-bold text-gray-600 hover:text-red-500"
                >
                  &times;
                </button>
              </div>

              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Start typing your idea..."
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={handleAskAI}
                disabled={aiLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-purple-700 transition disabled:opacity-60"
              >
                {aiLoading ? "Thinking..." : "Ask AI"}
              </button>

              <div className="bg-gray-100 rounded-lg p-4 text-gray-700 min-h-[100px] text-left whitespace-pre-line">
                {aiResponse ? (
                  <p>{aiResponse}</p>
                ) : (
                  <p className="italic text-gray-400">
                    {aiLoading ? "Fetching ideas..." : "🤖 AI will respond here..."}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
