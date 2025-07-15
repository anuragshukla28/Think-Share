import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // ✅ import Provider
import store from './redux/store.js'; // ✅ correct path

// layout & pages
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ArticleDetails from './pages/ArticleDetails.jsx';
import Profile from './pages/Profile.jsx';
import CreateArticle from './pages/CreateArticle.jsx';
import EditArticle from './pages/EditArticle.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Articles from './pages/Articles.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="articles" element={<Articles />} /> {/* ✅ Add this */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="article/create" element={<CreateArticle />} />
        <Route path="article/edit/:slug" element={<EditArticle />} />
      </Route>
      <Route path="article/:slug" element={<ArticleDetails />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* ✅ Wrap with Provider */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
