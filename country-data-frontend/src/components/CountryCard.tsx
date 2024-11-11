import { Country } from "../model/country";

const CountryCard: React.FC<{ country: Country }> = ({ country }) => {
    return (
      <div key={country.alpha3Code} className="bg-white rounded-lg shadow-md p-4 m-4">
        {country.flag ? (
          <img
            className="w-16 h-16 object-cover mx-auto"
            src={country.flag}
            alt={`Flag of ${country.name}`}
          />
        ) : (
          <p className="text-center">No Flag Available</p>
        )}
        <div className="mt-2 text-center">
          <h2 className="font-semibold">{country.name}</h2>
          <p>{country.region}</p>
        </div>
      </div>
    );
  };
  
  export default CountryCard;
  