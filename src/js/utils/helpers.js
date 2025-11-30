/**
 * helpers.js
 * Contains small, stateless helpers used across the Pokedex app.
 */


/**
 * Fetches Data from API endpoint.
 *
 * @param {string} url URL string
 * @returns {string} The parsed json.
 */
export const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json(); // step for parsing byte stream to json
        return data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};


/**
 * Validates an object against a type schema.
 * Each key in `schema` defines the expected typeof for that field.
 * If a field in `data` is missing or has the wrong type,
 * it will be replaced with the string "na".
 *
 * @param {Object.<string, string>} schema - Keys with expected JS data types ("string", "number", ...)
 * @param {Object} data - Raw object to validate and clean
 * @returns {Object} A new object containing only schema keys with valid values or "na"
 */
export const validateSchema = (schema, data) =>
  Object.fromEntries(
    Object.entries(schema).map(([key, rule]) => {
      const val = data[key];

      if (Array.isArray(rule)) {
        const type = rule[0];
        return [key,
          Array.isArray(val) && val.every(i => typeof i === type)
            ? val
            : "na"
        ];
      }

      return [key, typeof val === rule ? val : "na"];
    })
  );

