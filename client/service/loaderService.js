class loaderService {
  static instance = null;
  constructor() {
    if (AudioService.instance) {
      return AudioService.instance;
    } else {
      this.isPlaying = false;
      loaderService.instance = this;
    }
  }
}
export default loaderService;
