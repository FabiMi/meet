import { mockData } from './mock-data';
import NProgress from 'nprogress';
import axios from 'axios';


/**
 * @description removeQuery function  removes the query string from the URL.
 * @returns {string} newurl
 * @param {string} newurl
 */
const removeQuery = () => {
  if (window.history.pushState && window.location.pathname) {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};


/**
 * @description checkToken function checks if the access token is valid.
 * @param {*} accessToken 
 * @returns {object} result
 */

const checkToken = async (accessToken) => {
  const result = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  )
    .then((res) => res.json())
    .catch((error) => error.json());

  return result;
};

const extractLocations = (events) => {
  var extractLocations = events.map((event) => event.location);
  var locations = [...new Set(extractLocations)];
  return locations;
};



/**
 *
 * @param {*} events:
 * @description This function takes an events array, then uses map to create a new array with only locations. It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.The Set will remove all duplicates from the array.
 + @returns {array} locations 
*/




const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');

  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const results = await axios.get(
        'https://cu8ic3u2b9.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url'
      );
      const { authUrl } = results.data;
      return (window.location.href = authUrl);
    }
    return code && getToken(code);
  }
  return accessToken;
}



/**
 * @description getEvents function gets the events from the API.
 * @returns {array} result.data.events
 * @param {string} url
 * @param {string} token
 */


const getEvents = async () => {
  NProgress.start();

  if (window.location.href.startsWith("http://localhost")) { //if the user is offline, the app will use the data from mock-data.js.
    NProgress.done();
    return mockData;
  }

  if (!navigator.onLine) { //if the user is offline, the app will use the data from localStorage.
    const data = localStorage.getItem("lastEvents");
    NProgress.done();
    return data ? JSON.parse(data).events : [];;
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url = `https://cu8ic3u2b9.execute-api.eu-central-1.amazonaws.com/dev/api/get-events/${token}`; //the app will use the token to get the events from the API.
    const result = await axios.get(url);
    if (result.data) {
      var locations = extractLocations(result.data.events);
      localStorage.setItem("lastEvents", JSON.stringify(result.data)); //the app will store the events in localStorage.
      localStorage.setItem("locations", JSON.stringify(locations)); //the app will store the locations in localStorage.
    }
    NProgress.done();
    return result.data.events;
  }

}

/**
 * @description getToken function gets the access token from the API.
 * @param {*} code 
 * @returns  {string} access_token
 */

const getToken = async (code) => {
  try {
    const encodeCode = encodeURIComponent(code);

    const response = await fetch(`https://cu8ic3u2b9.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeCode}`); //the app will use the code to get the access token from the API.
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const { access_token } = await response.json();
    access_token && localStorage.setItem("access_token", access_token); //the app will store the access token in localStorage.
    return access_token;
  } catch (error) {
    error.json();
  }
}

export { getEvents, getAccessToken, extractLocations, getToken, checkToken };









