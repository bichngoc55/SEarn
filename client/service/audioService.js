import { Audio } from "expo-av";

class AudioService {
  static instance = null;
  constructor() {
    if (AudioService.instance) {
      return AudioService.instance;
    }
    this.audioMap = new Map();
    this.currentAudioIndex = 0;
    this.currentTime = 0;
    this.isPlay = false;
    this.currentTotalTime = 0;
    this.isRepeat = false;
    this.isShuffle = false;
    this.currentPlaylist = [];
    this.currentSong = null;
    this.currentAudio = null;
    AudioService.instance = this;
  }

  async loadPlaylist(audioList) {
    try {
      // Tải tất cả các audio trong playlist
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: false,
      });
      for (let i = 0; i < audioList.length; i++) {
        const audioUrl = audioList[i];
        const { sound, status } = await Audio.Sound.createAsync(
          {
            uri: audioUrl.preview_url,
          },
          { shouldPlay: false },
          this.onPlaybackStatusUpdated.bind(this)
        );

        await status.isLoaded;

        if (status.isLoaded) {
          this.audioMap.set(i, { sound, status });
        } else {
          console.error(`Không thể tải âm thanh ${audioUrl.preview_url}`);
        }
      }

      // Phát âm thanh đầu tiên trong playlist
      if (this.audioMap.size > 0) {
        console.log(this.audioMap.size);
      } else console.log("map rỗng");
      this.isPlay = true;
    } catch (error) {
      console.error("Lỗi khi tải playlist:", error);
      throw error;
    }
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

    if (status.didJustFinish) {
      if (this.isRepeat) {
        await this.playCurrentAudio();
      } else if (this.isShuffle) {
        await this.playRandomSong();
      } else await this.playNextAudio();
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
    try {
      if (this.currentAudio != null) {
        await this.currentAudio.sound.stopAsync();
      }
      this.currentAudio = this.audioMap.get(this.currentAudioIndex);
      await this.currentAudio.sound.setStatusAsync({
        shouldPlay: true,
        positionMillis: this.currentTime,
      });

      // Phát audio từ vị trí hiện tại
      await this.currentAudio.sound.playAsync();

      // Cập nhật trạng thái phát
      this.isPlay = true;
    } catch (error) {
      console.error("Lỗi khi phát âm thanh:", error);
      throw error;
    }
  }

  async playNextAudio() {
    if (this.currentAudio) {
      await this.currentAudio.sound.stopAsync();
    }

    this.currentAudioIndex++;
    if (this.currentAudioIndex >= this.audioMap.size) {
      this.currentAudioIndex = 0;
    }
    this.currentAudio = this.audioMap.get(this.currentAudioIndex);
    this.currentSong = this.currentPlaylist[this.currentAudioIndex];
    await this.playCurrentAudio();
  }

  async playPreviousAudio() {
    if (this.currentAudio) {
      await this.currentAudio.sound.stopAsync();
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
    if (this.currentAudio) {
      await this.currentAudio.sound.stopAsync();
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
    if (!this.currentAudio) {
      throw new Error("Chưa có âm thanh được tải");
    }

    try {
      await this.currentAudio.stopAsync();
    } catch (error) {
      console.error("Lỗi khi dừng âm thanh:", error);
      throw error;
    }
  }
}

export default AudioService;
