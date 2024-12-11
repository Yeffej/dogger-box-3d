class UI {
  ui;
  mainPlayBtn;
  mainControlsBtn;
  mainCreditsBtn;
  #pages;
  #playBtnSubcritions = [];
  #controlsBtnSubcritions = [];
  #creditsBtnSubcritions = [];

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
    this.#setPages();
    this.#setEventsListener();
    this.goTo("main");
  }

  #createPrimaryElements() {
    this.mainPlayBtn = document.createElement("button");
    this.mainPlayBtn.textContent = "Play";

    this.mainControlsBtn = document.createElement("button");
    this.mainControlsBtn.textContent = "Controls";

    this.mainCreditsBtn = document.createElement("button");
    this.mainCreditsBtn.textContent = "Credits";

    this.scoreDisplay = document.createElement("span");
    this.setScore(0);
  }

  #setPages() {
    this.#pages.main = this.#mainPage();
    this.#pages.play = this.#playPage();
  }

  #mainPage() {
    const main = document.createElement("div");
    main.className = "ui-wrapper";
    main.innerHTML = `
      <div class="ui-titles">
          <h1 class="ui-titles-main">Dogger Box 3D</h1>
          <h4 class="ui-titles-sub">Welcome, Let's dodge!</h4>
      </div>
      <div class="ui-actions">
          
      </div>
    `;

    main
      .querySelector(".ui-actions")
      .append(this.mainPlayBtn, this.mainControlsBtn, this.mainCreditsBtn);

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

  #setEventsListener() {
    // ON PLAY
    this.mainPlayBtn.addEventListener("click", () => {
      this.goTo("play");
      this.#playBtnSubcritions.forEach((callback) => callback());
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
        this.#transitionPage();
        this.ui.innerHTML = this.#pages.controls;
        break;

      case "credits":
        this.#transitionPage();
        this.ui.innerHTML = this.#pages.credits;
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

  insertToDom() {
    document.body.appendChild(this.ui);
  }
}

export default UI;
