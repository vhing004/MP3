const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const app = {
  currentIndex: 0,
  isPlay: false,
  songs: [
    {
      name: "Em Bên Ai Rồi",
      singer: "Thành Đạt",
      path: "./assets/audio/embenairoi.mp3",
      image: "./assets/image/img_1.jpg",
    },
    {
      name: "Từng Yêu",
      singer: "Phan Duy Anh",
      path: "./assets/audio/tungyeu.mp3",
      image: "./assets/image/img_2.jpg",
    },
    {
      name: "Anh Thôi Nhân Nhượng",
      singer: "Kiều Chi",
      path: "./assets/audio/anhthoinhannhuong.mp3",
      image: "./assets/image/img_3.jpg",
    },
    {
      name: "Cẩm Tú Cầu",
      singer: "RayO",
      path: "./assets/audio/camtucau.mp3",
      image: "./assets/image/img_4.jpg",
    },
    {
      name: "Nên Chờ Hay Nên Quên",
      singer: "Chu Thúy Quỳnh",
      path: "assets/audio/nenchohayquen.mp3",
      image: "./assets/image/img_5.jpg",
    },
  ],

  //render playlist
  render: function () {
    var htmls = this.songs.map((song) => {
      return `
        <div class="song">
            <div class="thumb"
                style="background-image: url('${song.image}');">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h "></i>
            </div>
        </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  // định nghĩa obj
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  // load ra bài đầu tiên
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
    console.log(audio.src);
  },

  // handle events
  handleEvent: function () {
    const _this = this;
    const cdWidth = $(".cd").offsetWidth;

    // animate rotate
    const cdThumbRotate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbRotate.pause();

    // xử lý phóng to thu nhỏ mà mờ dần khi cuộn
    document.addEventListener("scroll", () => {
      const scrollPage = window.scrollY || document.documentElement.scrollTop;
      const widthCd = cdWidth - scrollPage;
      $(".cd").style.width = widthCd > 0 ? widthCd + "px" : 0;
      $(".cd").style.opacity = widthCd / cdWidth;
    });

    // xử lý click play
    btnPlay.onclick = function () {
      if (_this.isPlay) {
        audio.pause();
        cdThumbRotate.pause();
      } else {
        audio.play();
        cdThumbRotate.play();
      }
    };

    // khi song đc PLAY:
    audio.onplay = function () {
      player.classList.add("playing");
      _this.isPlay = true;
    };

    // khi song đc PAUSE:
    audio.onpause = function () {
      player.classList.remove("playing");
      _this.isPlay = false;
    };

    // update time when audio play
    audio.ontimeupdate = function () {
      if (this.duration) {
        const progressPercent = Math.floor(
          (this.currentTime / this.duration) * 100
        );
        //duration là lấy thời gian audio
        progress.value = progressPercent;
      }
    };

    // Tua audio
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
      //currentTime can get time of audio & Set time cho audio
    };

    // next
    nextBtn.onclick = function () {
      _this.next();
      audio.play()
    };

    // prev
    prevBtn.onclick = function () {
      _this.prev();
      audio.play()
    };
  },
  next: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prev: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  start: function () {
    // định nghĩa các thuộc tính của obj
    this.defineProperties();

    // xử lý sự kiện
    this.handleEvent();

    this.loadCurrentSong();

    // render playlist
    this.render();
  },
};

app.start();
