import { City } from "country-state-city";

export const locations = [
  ...new Set(
    City.getCitiesOfCountry("IN").map((city) => city.name)
  ),
];