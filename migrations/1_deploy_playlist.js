const PlaylistLikes = artifacts.require("PlaylistLikes");

module.exports = function (deployer) {
  deployer.deploy(PlaylistLikes);
};
