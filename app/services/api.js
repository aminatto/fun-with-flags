const ApiClient = (baseUrl) => ({
  async get(endpoint) {
      try {
          const response = await fetch(`${baseUrl}${endpoint}`);

          if (!response.ok) {
              return [null, `HTTP Error! Status:${response.status}`];
          }

          const data = await response.json();
          return [data, null];
      } catch (error) {
          console.log("Api Request Failed", error);
          return [null, error.message];
      }
  }
})

const api = ApiClient("https://restcountries.com/v3.1"); 

const countriesApi = {
  getAll: () => api.get("/all?fields=cca3,flags,name,capital,region,population")
}

export { countriesApi };