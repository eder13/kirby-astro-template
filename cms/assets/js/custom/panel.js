/**
 * Constants
 */
const deployBtnText = "Veröffentlichen";
const deployConfirmTextBtn = "Änderungen veröffentlichen 🚀";
const deployConfirmWarningText =
    "Sind Sie sicher, dass sie die Änderungen <strong>jetzt</strong> veröffentlichen wollen? Dies kann kurzfristig dazu führen, dass die Seite nicht erreichbar ist, bis der Prozess abgeschlossen ist.";
const deployConfirmTextRetryBtn = "Erneut versuchen";
const deploySuccessMsg =
    "Die Änderungen wurden <strong>erfolgreich</strong> veröffentlicht! 🎉";
const deployFailedNoAccessRights =
    "Keine Berechtigung. Vergewissern Sie sich, dass Sie das Passwort richtig eingegeben haben.";
const getDeployFailedMsgWithCode = (code) =>
    `Deployment fehlgeschlagen ❌<br/>Error Code: ${code}<br/>Bitte kontaktieren Sie ihren Administrator.`;
let cancelingModalIsDisabled = false;

/**
 * Overlay
 */
const overlayConfirmation = document.createElement("div");
overlayConfirmation.className = "d-none";
overlayConfirmation.id = "overlay-deployment";
overlayConfirmation.style.width = "100dvw";
overlayConfirmation.style.height = "100dvh";
overlayConfirmation.style.display = "grid";
overlayConfirmation.style.placeItems = "center";
overlayConfirmation.style.position = "absolute";
overlayConfirmation.style.top = "0";
overlayConfirmation.style.left = "0";
overlayConfirmation.style.zIndex = 800;
overlayConfirmation.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
overlayConfirmation.innerHTML = /*html*/ `
<div id="overlay-wrapper" style="background: #f4f4f4; width: ${
    window.innerWidth > 500 ? "70%" : "100%"
}; transform: translate(0, -200px); padding: 20px">
    <header style="display: flex; justify-content: flex-end">
        <button style="padding: 5px" id="close-deployment">x</button>
        <br/>
        <br/>
    </header>
    <article>
        <p>${deployConfirmWarningText}</p>
        <br/>
        <form id="form" style="display: grid; place-items: center">
          <br>
          <label for="secret">Deployment Secret: </label>  
          <br>
          <input style="
            width: 250px; 
            display: block;
            padding-bottom: 6px;
            padding-left: 12px;
            padding-right: 12px;
            padding-top: 6px;
            line-height: 24px;
            color: rgb(73, 80, 87);
            background-color: rgb(255, 255, 255);
            background-clip: padding-box;
            border: 1px solid rgb(206, 212, 218);
            border-radius: 4px"
          id="secret" name="secret" type="password" />
          <br>
          <button type="submit" class="deploy-button dark" id="confirmation-deployment">${deployConfirmTextBtn}</button>
        </form>
        <div style="display: grid; place-items: center">
            <div id="loader-deployment" class="deploy-loader d-none"></div>
            <div class="alert success d-none" style="text-align: center" id="deploy-success">${deploySuccessMsg}</div>
            <div class="alert danger d-none" style="margin-top: 1rem; text-align: center" id="deploy-failure"></div>
                <input type="checkbox" style="height: 24px; background-color: #777;color: white;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;" class="d-none" id="deploy-collapsible-button">
                <span style="transform: translateY(-16px)" class="arrow-right d-none" id="deploy-collapsible-icon-down"></span>
                <span style="transform: translateY(-16px)" class="arrow-down d-none" id="deploy-collapsible-icon-up"></span>
                <div style="padding: 18px;overflow-y: scroll;background-color: #eaeaea; max-height: 150px;" class="d-none" id="deploy-collapsible-content">
                    <p></p>
                </div>
        </div>
    </article>
</div>
`;

/**
 * Deploy Button
 */
const deployBtnWrapper = document.createElement("div");
deployBtnWrapper.style.color = "white";
deployBtnWrapper.style.width = "100dvw";
deployBtnWrapper.style.height = "40px";
deployBtnWrapper.style.position = "absolute";
deployBtnWrapper.style.top = "0";
deployBtnWrapper.style.left = "0";
deployBtnWrapper.style.display = "grid";
deployBtnWrapper.style.placeItems = "center";
deployBtnWrapper.style.cursor = "default";

const deployBtn = document.createElement("button");
deployBtn.className = "deploy-button";
deployBtn.style.position = "absolute";
deployBtn.textContent = deployBtnText;

deployBtnWrapper.appendChild(deployBtn);

/**
 * Selectors
 */
const overlayForm = overlayConfirmation.querySelector("#form");
const secretDeploymentKeyInput = overlayConfirmation.querySelector("#secret");
const overlayConfirmationBtn = overlayConfirmation.querySelector(
    "#confirmation-deployment"
);
const overlayLoader = overlayConfirmation.querySelector("#loader-deployment");
const overlayFailure = overlayConfirmation.querySelector("#deploy-failure");
const overlaySuccess = overlayConfirmation.querySelector("#deploy-success");
const overlayCollapsibleLogButton = overlayConfirmation.querySelector(
    "#deploy-collapsible-button"
);
const overlayCollapsibleLogContent = overlayConfirmation.querySelector(
    "#deploy-collapsible-content"
);
const overlayCollapsibleIconDown = overlayConfirmation.querySelector(
    "#deploy-collapsible-icon-down"
);
const overlayCollapsibleIconUp = overlayConfirmation.querySelector(
    "#deploy-collapsible-icon-up"
);

/**
 * Callbacks
 */
function onClose() {
    if (!cancelingModalIsDisabled) {
        overlayConfirmation.classList.add("d-none");
        overlaySuccess.classList.add("d-none");
        overlayFailure.classList.add("d-none");
        overlayForm.classList.remove("d-none");
        secretDeploymentKeyInput.value = "";

        overlayConfirmationBtn.classList.remove("d-none");
        overlayLoader.classList.add("d-none");
        overlayCollapsibleLogButton.classList.add("d-none");
        overlayCollapsibleIconDown.classList.add("d-none");
        overlayCollapsibleIconUp.classList.add("d-none");
        overlayCollapsibleLogContent.classList.add("d-none");
        overlayConfirmationBtn.textContent = deployConfirmTextBtn;
    }
}

function onDeployBtnClicked() {
    overlayConfirmationBtn.classList.remove("d-none");
    overlayForm.classList.remove("d-none");
    overlayConfirmation.classList.remove("d-none");
    overlaySuccess.classList.add("d-none");
    overlayFailure.classList.add("d-none");
    overlayCollapsibleLogButton.classList.add("d-none");
    overlayCollapsibleIconDown.classList.add("d-none");
    overlayCollapsibleIconUp.classList.add("d-none");
    overlayCollapsibleLogContent.classList.add("d-none");
    overlayLoader.classList.add("d-none");
    overlayConfirmationBtn.textContent = deployConfirmTextBtn;
}

/**
 * Listeners
 */
overlayForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.classList.add("d-none");
    overlayLoader.classList.remove("d-none");
    overlayCollapsibleLogButton.classList.add("d-none");
    overlayCollapsibleIconDown.classList.add("d-none");
    overlayCollapsibleIconUp.classList.add("d-none");
    overlayCollapsibleLogContent.classList.add("d-none");
    const secret = secretDeploymentKeyInput.value;

    cancelingModalIsDisabled = true;

    fetch("/cms/ssg/deploy", {
        method: "post",
        body: JSON.stringify({
            secret,
        }),
    })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            overlayLoader.classList.add("d-none");

            if (json.status !== 200) {
                throw new Error("Failed to Deploy.", {
                    cause: deployFailedNoAccessRights,
                });
            }

            if (json.retval === 0 || json.retval === "0") {
                overlaySuccess.classList.remove("d-none");
                overlayCollapsibleLogButton.classList.remove("d-none");
                overlayCollapsibleIconDown.classList.remove("d-none");
                overlayCollapsibleIconUp.classList.remove("d-none");
                overlayCollapsibleLogContent.classList.remove("d-none");

                overlayCollapsibleLogContent.innerHTML =
                    Array.isArray(json.message) && json.message.length > 0
                        ? json.message.reduce(
                              (prevValue, currentValue) =>
                                  prevValue + "<br/>" + currentValue
                          )
                        : json.message;

                overlayFailure.classList.add("d-none");
            } else {
                throw new Error("Failed to Deploy.", {
                    cause: {
                        code: json.retval,
                        log:
                            Array.isArray(json.message) &&
                            json.message.length > 0
                                ? json.message.reduce(
                                      (prevValue, currentValue) =>
                                          prevValue + "<br/>" + currentValue
                                  )
                                : json.message,
                    },
                });
            }
        })
        .catch((e) => {
            console.error(e);

            if (!!e.cause) {
                if (typeof e.cause === "object") {
                    overlayFailure.innerHTML = getDeployFailedMsgWithCode(
                        e.cause.code
                    );
                    overlayCollapsibleLogContent.innerHTML = e.cause.log;

                    overlayCollapsibleLogButton.classList.remove("d-none");
                    overlayCollapsibleIconDown.classList.remove("d-none");
                    overlayCollapsibleIconUp.classList.remove("d-none");
                    overlayCollapsibleLogContent.classList.remove("d-none");
                } else {
                    overlayFailure.innerHTML = e.cause;
                }
            }
            overlayFailure.classList.remove("d-none");

            overlayConfirmationBtn.classList.remove("d-none");
            overlayForm.classList.remove("d-none");
            overlayConfirmationBtn.textContent = deployConfirmTextRetryBtn;
        })
        .finally(() => {
            cancelingModalIsDisabled = false;
        });
});

const mutationObserver = new MutationObserver(() => {
    if (
        location.pathname.includes("/panel/login") ||
        location.pathname.includes("/panel/installation")
    ) {
        deployBtnWrapper.style.visibility = "hidden";
    } else {
        deployBtnWrapper.style.visibility = "visible";
    }
});
mutationObserver.observe(document.body, { subtree: true, childList: true });

overlayConfirmation
    .querySelector("#close-deployment")
    .addEventListener("click", onClose);

deployBtn.addEventListener("click", onDeployBtnClicked);

window.addEventListener("click", (e) => {
    const overlay = document.getElementById("overlay-deployment");
    const overlayIsActive = !overlay.classList.contains("d-none");

    if (overlayIsActive && !cancelingModalIsDisabled) {
        const clickedElement = e.target;
        const innerOverlayWrapper = document.getElementById("overlay-wrapper");

        if (clickedElement === overlayConfirmation) {
            onClose();
            return;
        }

        if (
            innerOverlayWrapper.contains(clickedElement) ||
            clickedElement === deployBtn
        ) {
            return;
        } else {
            onClose();
        }
    }
});

const firstChildOfBody = document.body.firstChild;
document.body.insertBefore(deployBtnWrapper, firstChildOfBody);
document.body.insertBefore(overlayConfirmation, firstChildOfBody);
