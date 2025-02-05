(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
          display: inline-block;
          position: relative;
          width: 100px;
          height: 100px;
      }

      #progress-spinner {
          border-radius: 50%;
          height: 100px;
          width: 100px;
      }

      #middle-circle {
          position: absolute;
          border-radius: 50%;
          height: 80px;
          width: 80px;
          background-color: rgb(248, 248, 248);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: large;
          font-weight: bold;
      }
    </style>
    <div
      style="
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div id="middle-circle">0%</div>
      <div id="progress-spinner"></div>
    </div>
  `;

  class Widget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {
        percentage: 0, // Default Percentage
        barColor: "#03ff4f",
        emptyBarColor: "#ededed"
      };
    }

    connectedCallback() {
      this.initMain();
      this.updateFromDataBinding(); // New Method to Fetch Data
    }

    async initMain() {
      const progressBar = this.shadowRoot.querySelector("#progress-spinner");
      const progressText = this.shadowRoot.querySelector("#middle-circle");

      const { barColor, emptyBarColor, percentage } = this._props;

      let i = 0;
      let interval = setInterval(() => {
        progressBar.style.background = `conic-gradient(${barColor} ${i}%, ${emptyBarColor} ${i}%)`;
        progressText.innerText = `${i}%`;

        if (i >= percentage) {
          clearInterval(interval);
        }
        i++;
      }, 20);
    }

    // Fetch percentage from SAC model dynamically
    updateFromDataBinding() {
      if (this.dataBinding) {
        this.dataBinding.onDataChanged((data) => {
          if (data && data.length > 0) {
            let newValue = data[0].value; // Get First Data Point
            this._props.percentage = newValue;
            this.initMain(); // Re-render with New Value
          }
        });
      }
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }
  }

  customElements.define("com-rohitchouhan-sap-circleprogressbarwidget", Widget);
})();
