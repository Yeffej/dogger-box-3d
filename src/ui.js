import { sounds } from "./core";

class UI {
  ui;
  mainPlayBtn;
  mainControlsBtn;
  mainCreditsBtn;
  goBackBtn;
  scoreDisplay;
  soundsBtn;
  isSoundOn = false;
  #pages;
  #playBtnSubcritions = [];
  #soundsBtnSubcritions = [];
  // #controlsBtnSubcritions = [];
  // #creditsBtnSubcritions = [];

  constructor() {
    this.ui = document.createElement("div");
    this.ui.className = "ui";
    this.#pages = {
      main: "",
      play: "",
      controls: "",
      credits: "",
    };

    this.#createPrimaryElements();
    this.#setEventsListener();
    this.#setPages();
    this.goTo("main");
  }

  #createPrimaryElements() {
    this.mainPlayBtn = document.createElement("button");
    this.mainPlayBtn.textContent = "Play";

    this.mainControlsBtn = document.createElement("button");
    this.mainControlsBtn.textContent = "Controls";

    this.mainCreditsBtn = document.createElement("button");
    this.mainCreditsBtn.textContent = "Credits";

    this.goBackBtn = document.createElement("button");
    this.goBackBtn.textContent = "Go Back";

    this.soundsBtn = document.createElement("button");
    this.soundsBtn.id = "sound-wrapper";

    const iconSoundOn = document.createElement("img");
    iconSoundOn.src = "/assets/sound-on.svg";
    iconSoundOn.width = 70;
    iconSoundOn.className = "sound-icon";
    iconSoundOn.style.display = "none";
    iconSoundOn.id = "soundOn";
    
    const iconSoundOff = document.createElement("img");
    iconSoundOff.width = 70;
    iconSoundOff.src = "/assets/sound-off.svg";
    iconSoundOff.className = "sound-icon";
    iconSoundOff.id = "soundOff";

    this.soundsBtn.append(iconSoundOn, iconSoundOff);

    this.scoreDisplay = document.createElement("span");
    this.setScore(0);
  }

  #setPages() {
    this.#pages.main = this.#mainPage();
    this.#pages.play = this.#playPage();
    this.#pages.controls = this.#controlsPage();
    this.#pages.credits = this.#creditsPage();
  }

  #mainPage() {
    const main = document.createElement("div");
    main.className = "ui-wrapper";
    main.innerHTML = `
      <div class="ui-titles">
          <h1 class="ui-titles-main">Dogger Box 3D</h1>
          <h4 class="ui-subtitle-sub">Welcome, Let's dodge!</h4>
      </div>
      <div class="ui-actions">
          
      </div>
    `;

    main
      .querySelector(".ui-actions")
      .append(this.mainPlayBtn, this.mainControlsBtn, this.mainCreditsBtn, this.soundsBtn);

    return main;
  }

  #playPage() {
    const play = document.createElement("div");
    play.className = "ui-wrapper";
    play.innerHTML = `
      <div class="ui-play"></div>
    `;

    play.querySelector(".ui-play").append(this.scoreDisplay);

    return play;
  }

  #controlsPage() {
    const controls = document.createElement("div");
    controls.className = "ui-wrapper";
    controls.innerHTML = `
      <div class="ui-controls">
        <div class="controls-set">
          <figure>
            <img src="/assets/wasd.png" />
          </figure>
          <p>
            Movements keys: W → Move Forward, A → Move Left, S → Move Backward, D → Move Right.
          </p>
        </div>
        <div class="controls-set">
          <figure>
            <img src="/assets/space.png" />
          </figure>
          <p>
            -> JUMP.
          </p>
        </div>
        <div class="ui-actions"></div>
      </div>
    `;

    controls.querySelector(".ui-actions").append(this.goBackBtn);

    return controls;
  }

  #creditsPage() {
    const credits = document.createElement("div");
    credits.className = "ui-wrapper";
    credits.innerHTML = `
      <div class="ui-credits">
        <div class="credits-content">
          <p><strong>Game Developed By:</strong> Yefri Encarnación</p>
          <p><strong>Additional Contributions:</strong> Chris Courses (some part of this game was made thanks to his threejs tutorial)</p>
          <p><strong>Powered By:</strong> THREE.JS, HTML, CSS, JS</p>
          <p><strong>Contact:</strong> yefri@yefftech.com</p>
          <p><strong>Music:</strong> Syn Cole - I Can Feel (ncs.io/ICanFeel)</p>
        </div>
        <div class="ui-actions"></div>
      </div>
    `;

    const gobackclone = this.goBackBtn.cloneNode(true)
    gobackclone.onclick = this.goBackBtn.onclick;
    credits.querySelector(".ui-actions").append(gobackclone);

    return credits;
  }

  #setEventsListener() {
    // ON PLAY
    this.mainPlayBtn.addEventListener("click", () => {
      sounds.start.play();
      this.goTo("play");
      this.#playBtnSubcritions.forEach((callback) => callback());
    });

    // ON CONTROLS
    this.mainControlsBtn.addEventListener("click", ()=> {
      this.goTo("controls");
    });

    // ON CREDITS
    this.mainCreditsBtn.addEventListener("click", ()=> {
      this.goTo("credits");
    });

    this.goBackBtn.onclick = () => {
      this.goTo("main");
    }

    this.soundsBtn.addEventListener("click", () => {
      const soundOn = this.soundsBtn.querySelector("#soundOn");
      const soundOff = this.soundsBtn.querySelector("#soundOff");

      if(this.isSoundOn) {
        soundOn.style.display = "none";
        soundOff.style.display = "initial";
      } else {
        soundOff.style.display = "none";
        soundOn.style.display = "initial";
      }

      this.isSoundOn = !this.isSoundOn;

      this.#soundsBtnSubcritions.forEach((callback) => callback(this.isSoundOn));
    });
  }

  goTo(page) {
    switch (page) {
      case "main":
        this.#transitionPage().after(this.#pages.main);
        break;

      case "play":
        this.#transitionPage().after(this.#pages.play, () => {
          this.ui.style.pointerEvents = "none";
          this.mainPlayBtn.textContent = "Play"; // in case PAUSE was the value
        });
        break;

      case "controls":
        this.#transitionPage().after(this.#pages.controls);
        break;

      case "credits":
        this.#transitionPage().after(this.#pages.credits);
        break;

      default:
        break;
    }
  }

  #transitionPage() {
    if (this.ui.firstElementChild) {
      this.ui.firstElementChild.style.animationName = "FadeOut";
      this.ui.firstElementChild.style.pointerEvents = "none";
    }

    const actions = {};
    actions.after = (element, callback = null) => {
      const performNewElementDuty = () => {
        // reset and insert element/page
        this.ui.appendChild(element);
        element.style.animationName = "FadeIn";
        element.style.pointerEvents = "auto";

        if (callback) callback();
      };

      if (this.ui.firstElementChild) {
        const onAnimationEnd = () => {
          this.ui.firstElementChild.removeEventListener(
            "animationend",
            onAnimationEnd
          );
          this.ui.firstElementChild.remove();

          performNewElementDuty();
        };

        return this.ui.firstElementChild.addEventListener(
          "animationend",
          onAnimationEnd
        );
      }

      performNewElementDuty();
    };

    return actions;
  }

  setScore(score) {
    this.scoreDisplay.textContent = `Score: ${score}`;
  }

  onPlay(callback) {
    this.#playBtnSubcritions.push(callback);
  }

  onSound(callback) {
    this.#soundsBtnSubcritions.push(callback);
  }

  insertToDom() {
    document.body.appendChild(this.ui);
  }
}

export default UI;
