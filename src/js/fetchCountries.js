export function fetchCountries(name) {
  return fetch(name).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

