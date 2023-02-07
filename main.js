// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zyjs.myhm.org/Learn.asp?Learn_type=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

let timeout = 6 * 60 * 1000;

function getTargetURLs() {
  const aElements = document.querySelectorAll("a");
  const studyAElements = Array.from(aElements).filter(element => element.getAttribute("target") === "study");
  const targetElements = studyAElements.filter(element => element.previousElementSibling.color !== "green");
  const result = targetElements.map(element => element.href);
  return result;
}

function getFormData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(html => {
        const target = html.match(/var studyInfo={"lid".+}/);
        if(target) {
            eval(target[0]);
            studyInfo.isVideo = true;
            studyInfo.curp = 1;
            studyInfo.ctrl = "studying";
            console.log(studyInfo);
            return new URLSearchParams(Object.entries(studyInfo)).toString();
        }
        else {
            alert("studyInfo 404, something goes wrong");
        }
    });
}

function study(url) {
  const postURL = "http://zyjs.myhm.org/u_server.asp";
  return getFormData(url).then(formData => {
    return fetch(postURL, {
      method: "POST",
      body: formData,
      headers: {"Host": "zyjs.myhm.org", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Cookie": document.cookie},
    }).then(response => response.json());
  });
}
function worker(idx, urls) {
  const url = urls[idx];
  study(url).then(data => {
      console.log(data);
      if(data.state == 1 && idx+1 < urls.length)
          setTimeout(worker, timeout, idx+1, urls);
      if(data.state == 0)
          setTimeout(worker, timeout, idx, urls);
  });
}
function demo() {
  console.log("hi")
  setTimeout(demo, 1000);
}
(function() {
  'use strict';
  let urls = getTargetURLs();
  worker(0, urls);
})();
