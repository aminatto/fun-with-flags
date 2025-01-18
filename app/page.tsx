'use client'

import { useEffect, useState } from "react";
import { Card, Footer, Grid, Header } from "./components"

type Country = {
  cca3: string;
  flags: {
    svg: string;
  }
  name: {
    common: string;
  }
  capital: string[];
  region: string;
  population: number;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=cca3,flags,name,capital,region,population");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>


  return (
    <>
      <Header />
      <main className="flex-1">
        <Grid>
          {countries.map(
            ({ cca3, flags, name, capital, region, population }, index) => {
              const { svg: flag } = flags ?? {};
              const { common: countryName } = name ?? {};
              const [capitalName] = capital ?? {};

              return (
                <Card
                  key={cca3}
                  index={index}
                  flag={flag}
                  name={countryName}
                  capital={capitalName}
                  region={region}
                  population={population}
                />
              )
            }
          )}
        </Grid>
      </main>
      <Footer />
    </>
  );
}
