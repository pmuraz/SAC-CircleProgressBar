(function () {
    let template = document.createElement("template");
    template.innerHTML = `
        <form id="form">
            <label>Percentage:</label>
            <input type="number" id="percentage" min="0" max="100">
            
            <label>Bar Color:</label>
            <input type="color" id="barColor">

            <label>Empty Bar Color:</label>
            <input type="color" id="emptyBarColor">

            <button type="submit">Update Settings</button>
        </form>
    `;

    class CircleProgressBarWidgetBuilder extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot.getElementById("form").addEventListener("submit", (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: {
                        properties: {
                            percentage: this.shadowRoot.getElementById("percentage").value,
                            barColor: this.shadowRoot.getElementById("barColor").value,
                            emptyBarColor: this.shadowRoot.getElementById("emptyBarColor").value
                        }
                    }
                }));
            });
        }
    }

    customElements.define("com-pmuraz-sap-circleprogressbarwidget-builder", CircleProgressBarWidgetBuilder);
})();
