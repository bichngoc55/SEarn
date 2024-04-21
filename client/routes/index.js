import ArtistPage from "../pages/ArtistPage/artistPage";
import HomePage from "../pages/HomePage/HomePage";
import artistDetailPage from "../pages/ArtistDetailPage/artistDetailPage";
import NotFoundPage from "../pages/NotFoundPage/notFoundPage";
import albumPage from "../pages/AbumPage/albumPage";
import launchingPage from "../pages/LaunchingPage/launchingPage";
import addToPlaylistPage from "../pages/AddToPlaylistPage/addToPlaylistPage";
import exploreSearchPage from "../pages/ExploreSearchPage/exploreSearchPage";
import likedSongsPage from "../pages/LikedSongsPage/likedSongsPage";
import userProfilePage from "../pages/userProfile/userProfilePage";
import LoginPage from "../pages/LoginPage/loginPage";
import registerPage from "../pages/RegisterPage/registerPage";
import playlistPage from "../pages/PlaylistPage/playlistPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/playlist",
    page: playlistPage,
    isShowHeader: true,
  },
  {
    path: "/artist",
    page: ArtistPage,
    isShowHeader: true,
  },
  {
    path: "/artist/:id",
    page: artistDetailPage,
    isShowHeader: true,
  },
  {
    path: "/album",
    page: albumPage,
    isShowHeader: true,
  },
  {
    path: "/launching",
    page: launchingPage,
    isShowHeader: true,
  },
  {
    path: "/add-to-playlist",
    page: addToPlaylistPage,
    isShowHeader: true,
  },
  {
    path: "/explore-search",
    page: exploreSearchPage,
    isShowHeader: true,
  },
  {
    path: "/liked-songs",
    page: likedSongsPage,
    isShowHeader: false,
  },
  {
    path: "/user-profile",
    page: userProfilePage,
    isShowHeader: false,
  },
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: true,
  },
  {
    path: "/register",
    page: registerPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
