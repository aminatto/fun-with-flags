'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { countriesApi } from "@/app/services";

type Params = {
    id: string;
}

type DetaildCountry = {
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
    languages: Record<string, string>;
    currencies: Record<string, {name: string, symbol: string}>;
    tld: string[];
    borders: string[];
}

export default function Country() {
    const name = "Brazil";
    const params = useParams<Params>();
    const [id, setId] = useState<string | null>(null);
    const [country, setCountry] = useState<DetaildCountry>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params?.id && params.id !== id) {
            setId(params.id);
        };
    }, [params, id]);

    useEffect(() => {
        const fetchCountry = async () => {
            const [response, error] = await countriesApi.getCountry(id);
            setLoading(false);

            if (error) {
                setError(error);
                return;
            }

            setCountry(response);
        };
        if (id) {
            fetchCountry();
        }
    }, [id]);


    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    console.log(country)
    return (
        <>
            <div className="mb-8">
                <Link href="/">
                    <button className="bg-gray-200 hover:bg-gray-300 font-semibold py-2 px-4">Back</button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
                <div className="w-full md:max-w-[400px]">
                    <Image
                        src={"/flag_placeholder.svg"}
                        alt={`Flag of ${name}`}
                        className="w-full h-full"
                        width={500}
                        height={300}
                    />
                </div>
                <div className="flex flex-col justify-center p-6 text-sm text-gray-600">
                    <h2 className="text-xl font-semibold mb-4">Brazil ({id})</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Capital:</span>
                            <span>Brasilia</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Region:</span>
                            <span>South America</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Population:</span>
                            <span>345345345</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Languages:</span>
                            <span>Portuguese</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Currencies:</span>
                            <span>BRL</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Top Leven Domain:</span>
                            <span>.br</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Borders:</span>
                            <span>Argentina, Bolivia, Uruguai, Peru</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}