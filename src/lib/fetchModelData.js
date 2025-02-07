/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! Status: ${response.status}`);
    }
    const models = await response.json();
    return models;
  } catch (error) {
    return error;
  }
}

export default fetchModel;
