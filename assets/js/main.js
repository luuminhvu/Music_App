const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'user';
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playlist = $('.playlist')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {

    },
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [{
            name: "There’s No One At All",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/There_s No One At All - Son Tung M-TP.mp3",
            image: "./assets/img/M-TP.jpg",
        },
        {
            name: "Chúng Ta Của Hiện Tại",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/Chung_ta_cua_hien_tai.mp3",
            image: "./assets/img/chung_ta_cua_hien_tai.jpg",
        },

        {
            name: "Hai Mươi Hai",
            singer: "Amee",
            path: "./assets/music/Hai_muoi_hai.mp3",
            image: "./assets/img/hai_muoi_hai.jpg",
        },
        {
            name: "Có Duyên Không Nợ - Lofi Ver",
            singer: "NB3 Hoài Bảo",
            path: "./assets/music/Co_duyen_khong_no.mp3",
            image: "./assets/img/co_duyen_khong_no.jpg",
        }
    ],
    render: function() {
        const html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>

                </div>`;
        });
        $('.playlist').innerHTML = html.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }

        });
    },
    handleEvent: function() {

        const _this = this;
        const cdWitdh = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // phong to thu nho CD
        document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWitdh = cdWitdh - scrollTop;

                cd.style.width = newCdWitdh > 0 ? newCdWitdh + 'px' : 0;
                cd.style.opacity = newCdWitdh / cdWitdh;
            }
            //xu li khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying === true) {
                audio.pause();
            } else {

                audio.play();
            }

        }
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent

                }
            }
            // tua song len
        progress.onchange = function(e) {
                const seekTime = e.target.value * audio.duration / 100;
                audio.currentTime = seekTime;
            }
            // xu li khi click next
        nextBtn.onclick = function() {
                if (_this.isRandom === true) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // xu li khi click prev
        prevBtn.onclick = function() {
                if (_this.isRandom === true) {
                    _this.randomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            //xu li click random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);

        }

        //xu li nextSong khi audio ended
        audio.onended = function() {
                if (_this.isRepeat === true) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }
            // xu li phat lai bai repeat
        repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
            // xu li khi click vao 1 bai nhac
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'

            })
        }, 300)
    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function() {

        this.isRepeat = this.config.isRepeat;
        this.isRandom = this.config.isRandom;

    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);

    },
};
app.start();