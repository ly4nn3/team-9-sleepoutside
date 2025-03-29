import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// get parameter
const userName = decodeURI(getParam("name"));
const responseMsg = decodeURI(getParam("msg"));

document.getElementById("user-name").innerHTML = userName;
document.getElementById("response-msg").innerHTML = responseMsg;
