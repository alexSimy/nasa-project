const API_URL = 'http://localhost:5000/v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  const rsp = await response.json();
  return rsp;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const rsp = await response.json();
  return rsp.sort((a,b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
  async function httpSubmitLaunch(launch) {
    try {
    const response = await fetch(`${API_URL}/launches`,{
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(launch),
    });
    return response;
  }catch(err){
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const response = await fetch(`${API_URL}/launches/${id}`,{
      method: 'DELETE'
    });
    return response;
  }catch(err) {
    return {
      ok: false
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};