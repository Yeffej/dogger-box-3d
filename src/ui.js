class UI {
  #pages;
  #playBtnSubcritions;
  #controlsBtnSubcritions;
  #creditsBtnSubcritions;

  constructor() {
    this.ui = document.createElement("div");
    this.ui.className = "ui";
    this.#pages = {
      main: "",
      play: "",
      controls: "",
      credits: "",
    };

    this.#setPages();
    this.#setEventsListener();
    this.goTo("main");
  }

  #setPages() {
    /* SET MAIN PAGE START */
    this.#pages.main = `
    <div class="ui-wrapper">
        <div class="ui-titles">
            <h1 class="ui-titles-main">Dogger Box 3D</h1>
            <h4 class="ui-titles-sub">Welcome, Let's dodge!</h4>
        </div>
        <div class="ui-actions">
            
        </div>
    </div>
    `;
    this.mainPlayBtn = document.createElement("button");
    this.mainPlayBtn.textContent = "Play";

    this.mainControlsBtn = document.createElement("button");
    this.mainControlsBtn.textContent = "Controls";

    this.mainCreditsBtn = document.createElement("button");
    this.mainCreditsBtn.textContent = "Credits";
    /* SET MAIN PAGE END */
  }

  #setEventsListener() {
    // ON PLAY
    this.mainPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.goTo("play");
    });
  }

  goTo(page) {
    switch (page) {
      case "main":
        this.ui.innerHTML = this.#pages.main;
        this.ui
          .querySelector(".ui-actions")
          .append(this.mainPlayBtn, this.mainControlsBtn, this.mainCreditsBtn);
        break;

      case "play":
        this.ui.innerHTML = this.#pages.play;
        break;
      case "play":
        this.ui.innerHTML = this.#pages.controls;
        break;
      case "play":
        this.ui.innerHTML = this.#pages.credits;

        break;

      default:
        break;
    }
  }

  insertToDom() {
    document.body.appendChild(this.ui);
  }
}

export default UI;
