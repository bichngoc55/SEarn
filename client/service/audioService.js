import { Audio } from "expo-av";
import { useSelector } from "react-redux";

class AudioService {
  static instance = null;

  constructor() {
    if (AudioService.instance == null) {
      this.audioMap = new Map();
      this.currentAudioIndex = 0;
      this.currentTime = 0;
      this.currentSound = null;
      this.isPlay = true;
      this.currentTotalTime = 0;
      this.isRepeat = false;
      this.isShuffle = false;
      this.currentPlaylist = [];
      this.currentSong = null;
      this.currentAudio = null;
      this.userId = null;
      this.isGetCoin = true;
      AudioService.instance = this;
    } else return AudioService.instance;
  }

  async loadSong() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: false,
      });
      if (
        this.currentSong.preview_url != undefined ||
        this.currentSong.preview_url != null
      ) {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: this.currentSong.preview_url },
          { shouldPlay: true },
          this.onPlaybackStatusUpdated.bind(this)
        );
        this.currentSound = { sound, status };
      } else this.playNextAudio;
    } catch (error) {}
  }

  async onPlaybackStatusUpdated(status) {
    this.currentTime = status.positionMillis;
    this.currentTotalTime = status.durationMillis;
    if (this.playbackStatusCallback) {
      this.playbackStatusCallback({
        progress: status.positionMillis,
        total: status.durationMillis,
      });
    }
    //const { user } = useSelector((state) => state.user);
    if (status.didJustFinish) {
      console.log("Next song");
      status.positionMillis = 0;
      await this.currentSound.sound.stopAsync();
      if (this.isRepeat) {
        console.log("Repeat");
        await this.playCurrentAudio();
      } else if (this.isShuffle) {
        console.log("Random");
        await this.playRandomSong();
      } else {
        console.log("Next song");
        await this.playNextAudio();
      }
      // if (this.isGetCoin) {
      //   try {
      //     const response = await fetch(
      //       `http://localhost:3005/auth/${user?._id}/increaseCoin`,
      //       {
      //         method: "PUT",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );
      //     const data = await response.json();
      //     if (response.ok) {
      //       console.log("Data being sent:", JSON.stringify(data, null, 2));
      //       //lam j nua thi k bt
      //     } else {
      //       console.error("Error liking/unliking playlist:", data.message);
      //     }
      //   } catch (e) {}
      // }
      this.isGetCoin = true;
    }
    this.onPlaybackStatusChange(status);
  }

  onPlaybackStatusChange(status) {
    // Nếu component đã đăng ký callback này, hãy gọi nó
    if (this.playbackStatusCallback) {
      this.playbackStatusCallback(status);
    }
  }

  // Cho phép component đăng ký callback này
  registerPlaybackStatusCallback(callback) {
    this.playbackStatusCallback = callback;
  }

  // unregisterPlaybackStatusCallback(callback) {
  //   this.playbackStatusCallbacks = this.playbackStatusCallbacks.filter(
  //     (cb) => cb !== callback
  //   );
  // }

  async playCurrentAudio() {
    if (this.currentSound.sound != null) {
      try {
        await this.currentSound.sound.stopAsync();
      } catch (error) {
        console.error("Lỗi khi dừng âm thanh:", error);
      }
    }

    await this.loadSong();
    // if (this.currentSound != null) {
    //   await this.currentSound.sound.setStatusAsync({
    //     shouldPlay: true,
    //     positionMillis: this.currentTime,
    //   });

    //   // Phát audio từ vị trí hiện tại
    //   if (this.currentTime) {
    //     await this.currentSound.sound.playAsync();
    //   }
    //   // Cập nhật trạng thái phát
    //   this.isPlay = true;
    // } else {
    //   await this.currentSound.sound.stopAsync();
    // }
  }

  async playNextAudio() {
    if (this.currentSound && this.currentSound.sound) {
      try {
        await this.currentSound.sound.stopAsync();
      } catch (error) {
        console.error("Lỗi khi dừng âm thanh:", error);
      }
    }
    this.currentAudioIndex++;
    if (this.currentAudioIndex >= this.currentPlaylist.size) {
      this.currentAudioIndex = 0;
    }
    this.currentSong = this.currentPlaylist[this.currentAudioIndex];
    await this.playCurrentAudio();
  }

  async playPreviousAudio() {
    if (this.currentSound && this.currentSound.sound) {
      try {
        await this.currentSound.sound.stopAsync();
      } catch (error) {
        console.error("Lỗi khi dừng âm thanh:", error);
      }
    }

    this.currentAudioIndex--;
    if (this.currentAudioIndex < 0) {
      this.currentAudioIndex = this.audioMap.size - 1;
    }
    this.currentAudio = this.audioMap.get(this.currentAudioIndex);
    this.currentSong = this.currentPlaylist[this.currentAudioIndex];

    await this.playCurrentAudio();
  }

  async playRandomSong() {
    if (this.currentSound && this.currentSound.sound) {
      try {
        await this.currentSound.sound.stopAsync();
      } catch (error) {
        console.error("Lỗi khi dừng âm thanh:", error);
      }
    }

    // Get a random index within the range of the audioMap size
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.audioMap.size);
    } while (randomIndex === this.currentAudioIndex);

    this.currentAudioIndex = randomIndex;
    this.currentAudio = this.audioMap.get(this.currentAudioIndex);
    this.currentSong = this.currentPlaylist[this.currentAudioIndex];

    await this.playCurrentAudio();
  }

  async stopSound() {
    if (!this.currentSound) {
      throw new Error("Chưa có âm thanh được tải");
    }

    try {
      await this.currentSound.stopAsync();
      // this.currentAudio = null; // Reset the currentAudio after stopping
      // this.isPlay = false; // Reset the isPlay state
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  }
}

export default AudioService;
