const COUNTRIES_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const POPULATION_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=400&date=2023";
const FALLBACK_POPULATION_URL =
  "https://countriesnow.space/api/v0.1/countries/population";

let countriesRequest;

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

const ensureSuccessfulResponse = (response, resourceName) => {
  if (!response.ok) {
    throw new Error(`${resourceName} HTTP Error! Status:${response.status}`);
  }
};

const createPopulationMap = (populationData) =>
  new Map(
    populationData
      .filter(({ value }) => value !== null)
      .map(({ countryiso3code, value }) => [countryiso3code, value])
  );

const createFallbackPopulationMap = (populationData) =>
  new Map(
    populationData
      .map(({ iso3, populationCounts }) => [
        iso3,
        populationCounts?.at(-1)?.value,
      ])
      .filter(([, value]) => value !== undefined)
  );

const enrichCountries = (countries, populations, fallbackPopulations) =>
  countries.map((country) => ({
    ...country,
    population:
      populations.get(country.cca3) ??
      fallbackPopulations.get(country.cca3) ??
      country.population ??
      0,
    flags: { svg: getFlagUrl(country.cca2) },
  }));

const fetchCountries = async () => {
  const [countriesResponse, populationResponse, fallbackResponse] =
    await Promise.all([
      fetch(COUNTRIES_URL),
      fetch(POPULATION_URL),
      fetch(FALLBACK_POPULATION_URL),
    ]);

  ensureSuccessfulResponse(countriesResponse, "Countries");
  ensureSuccessfulResponse(populationResponse, "Population");
  ensureSuccessfulResponse(fallbackResponse, "Fallback population");

  const countries = await countriesResponse.json();
  const populationPayload = await populationResponse.json();
  const fallbackPopulationPayload = await fallbackResponse.json();
  const populationData = populationPayload[1];
  const fallbackPopulationData = fallbackPopulationPayload.data;

  if (
    !Array.isArray(countries) ||
    !Array.isArray(populationData) ||
    !Array.isArray(fallbackPopulationData)
  ) {
    throw new Error("The countries API returned an invalid response.");
  }

  return enrichCountries(
    countries,
    createPopulationMap(populationData),
    createFallbackPopulationMap(fallbackPopulationData)
  );
};

const loadCountries = () => {
  if (!countriesRequest) {
    countriesRequest = fetchCountries().catch((error) => {
      countriesRequest = undefined;
      throw error;
    });
  }

  return countriesRequest;
};

const countriesApi = {
  async getAll() {
    try {
      return [await loadCountries(), null];
    } catch (error) {
      console.error("Countries request failed", error);
      return [null, error.message];
    }
  },
  async getCountry(id) {
    try {
      const countries = await loadCountries();
      const country = countries.find(
        ({ cca3 }) => cca3.toLowerCase() === id.toLowerCase()
      );

      if (!country) {
        return [null, "Country not found."];
      }

      return [country, null];
    } catch (error) {
      console.error("Country request failed", error);
      return [null, error.message];
    }
  },
};

export { countriesApi };
