/**
 * Monitor the light levels inside an IOT enabled snail mailbox to detect
 * when the mailbox door has been opened and closed.
 * @class IOTMailbox
 */
class IOTMailbox {
  /**
   * Creates an instance of IOTMailbox.
   * @param {number} [signalInterval=500] Timer interval for checking mailbox status.
   * @param {function} signalCallback Function to invoke when the timer interval expires.
   * @memberof IOTMailbox
   */
  constructor(signalInterval = 500, signalCallback) {
    this.signalInterval = signalInterval;
    this.signalCallback = signalCallback;
    this.intervalID = null;
    this.lastLightLevel = 0;
  }

  /**
   * Start monitoring of the mailbox and invoke the caller specified callback
   * function when the interval expires.
   * @memberof IOTMailbox
   */
  startMonitoring = () => {
    console.log(`Starting monitoring of mailbox...`);
    this.intervalID = window.setInterval(this.signalStateChange, this.signalInterval);
  }

  /**
   * Stop monitoring the mailbox status
   * @memberof IOTMailbox
   */
  stopMonitoring = () => {
    if (this.intervalID === null) return;
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    console.log(`Mailbox monitoring stopped...`);
  }

  /**
   * Pass the current light level inside the mailbox to the users callback
   * function. The positive light levels indicate the door is open while 
   * negative levels indicate it is closed. Depending on the sampling interval 
   * the mailbox door could be in any postion from fully closed to fully open. 
   * This means the light level varies from interval-to-interval.
   * @memberof IOTMailbox
   */
  signalStateChange = () => {
    const lightLevel = this.lastLightLevel >= 0 
      ? Math.random().toFixed(2) * -1 
      : Math.random().toFixed(2);
    console.log(`Mailbox state changed - lightLevel: ${lightLevel}`);
    this.signalCallback(lightLevel);
    this.lastLightLevel = lightLevel;
  }
};

function handler (light) {
  var log = document.getElementById("log"),
    scrollLog = shouldScroll(log),
    scrollCallout = shouldScroll(document.getElementById("callout"));
  
	log.innerHTML += `<p> Light Level: ${light}</p>`
  if (light > 0 && box.lastLightLevel < 0) {
    document.getElementById("notifications").innerHTML += `<p>Mailbox Opened</p>`
    notify()
  } else if (light < 0 && box.lastLightLevel > 0) {
    document.getElementById("notifications").innerHTML += `<p>Mailbox Closed</p>`
    notify()
  }

  scrollPosition(log, scrollLog)
  scrollPosition(document.getElementById("callout"), scrollCallout);
    
}

function notify () {
  var badge = document.getElementById("badge")

  if (parseInt(badge.innerHTML)) {
    badge.innerHTML = parseInt(badge.innerHTML) + 1
  } else {
    badge.innerHTML = 1
  }
  badge.style.display = "inline"
}

function shouldScroll (element) {
  return Math.floor(element.scrollTop + element.clientHeight) + 1 >= element.scrollHeight;
}

function scrollPosition (element, scroll) {

   if (scroll) {
    element.scrollTop = element.scrollHeight;
   }
}

var box = new IOTMailbox(500, handler),
  visible = true,
  start = true;
  stop = false;

document.getElementById("notification").addEventListener("click", () => {
  if (visible) {
    document.getElementById("callout").style.display = "block";
    document.getElementById("badge").innerHTML = "";
    document.getElementById("badge").style.display = "none";
  } else {
    document.getElementById("callout").style.display = "none"
  }
  visible = !visible;
});

document.getElementById("start").addEventListener("click", () => {
  if (start) {
    box.startMonitoring();
    document.getElementById("start").style.background = "lightgrey";
    document.getElementById("stop").style.background = "#ff2e2e";
    start = false;
    stop = true;
  }
});


document.getElementById("stop").addEventListener("click", () => {
  if (stop) {
    box.stopMonitoring();
    document.getElementById("start").style.background = "#29ff29";
    document.getElementById("stop").style.background = "lightgrey";
    stop = false;
    start = true;
  };
});

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("log").innerHTML = "";
  document.getElementById("notifications").innerHTML = "";
  document.getElementById("badge").innerHTML = "";
  document.getElementById("badge").style.display = "none";
  document.getElementById("start").style.background = "#29ff29";
  document.getElementById("stop").style.background = "lightgrey";
  box.stopMonitoring();
});