const endpoint = 'http://localhost:4000/graphql';

// Queries
const queryFlights = `
    query {
        flights {
            flightNumber
            airline
            departureAirport
            arrivalAirport
            status
        }
    }
`;

const queryAirlines = `
    query {
        airlines {
            id
            name
            country
            IATA
            ICAO
            callsign
        }
    }
`;

const queryAirports = `
    query {
        airports {
            id
            name
            city
            country
            IATA
            ICAO
        }
    }
`;

// Mutation
const createFlightMutation = `
    mutation($input: FlightInput!) {
        createFlight(input: $input) {
            flightNumber
            status
        }
    }
`;

// Function to send GraphQL requests
async function sendGraphQLRequest(query, variables = {}) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    const data = await response.json();
    if (data.errors) {
        throw new Error(data.errors.map(error => error.message).join(', '));
    }
    return data.data;
}

// Get DOM elements
const queryFlightsButton = document.getElementById('queryFlightsButton');
const flightsList = document.getElementById('flightsList');
const queryAirlinesButton = document.getElementById('queryAirlinesButton');
const airlinesList = document.getElementById('airlinesList');
const queryAirportsButton = document.getElementById('queryAirportsButton');
const airportsList = document.getElementById('airportsList');
const createFlightButton = document.getElementById('createFlightButton');
const createFlightResult = document.getElementById('createFlightResult');

// Handle flight query
queryFlightsButton.addEventListener('click', async () => {
    try {
        const data = await sendGraphQLRequest(queryFlights);
        flightsList.innerHTML = '';
        data.flights.forEach(flight => {
            const listItem = document.createElement('li');
            listItem.textContent = `${flight.flightNumber} - ${flight.airline} - ${flight.departureAirport} to ${flight.arrivalAirport} - ${flight.status}`;
            flightsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching flights:', error);
        flightsList.innerHTML = 'Error fetching flights. Please try again later.';
    }
});

// Handle airline query
queryAirlinesButton.addEventListener('click', async () => {
    try {
        const data = await sendGraphQLRequest(queryAirlines);
        airlinesList.innerHTML = '';
        data.airlines.forEach(airline => {
            const listItem = document.createElement('li');
            listItem.textContent = `${airline.name} (${airline.IATA}) - ${airline.country}`;
            airlinesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching airlines:', error);
        airlinesList.innerHTML = 'Error fetching airlines. Please try again later.';
    }
});

// Handle airport query
queryAirportsButton.addEventListener('click', async () => {
    try {
        const data = await sendGraphQLRequest(queryAirports);
        airportsList.innerHTML = '';
        data.airports.forEach(airport => {
            const listItem = document.createElement('li');
            listItem.textContent = `${airport.name} (${airport.IATA}) - ${airport.city}, ${airport.country}`;
            airportsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching airports:', error);
        airportsList.innerHTML = 'Error fetching airports. Please try again later.';
    }
});

// Handle flight creation
createFlightButton.addEventListener('click', async () => {
    const flightNumber = document.getElementById('flightNumber').value;
    const airlineId = document.getElementById('airlineId').value;
    const departureAirportId = document.getElementById('departureAirportId').value;
    const arrivalAirportId = document.getElementById('arrivalAirportId').value;
    const departureTime = document.getElementById('departureTime').value;
    const arrivalTime = document.getElementById('arrivalTime').value;

    const input = {
        flightNumber,
        airline: airlineId,
        departureAirport: departureAirportId,
        arrivalAirport: arrivalAirportId,
        departureTime,
        arrivalTime
    };

    try {
        const data = await sendGraphQLRequest(createFlightMutation, { input });
        createFlightResult.textContent = `Flight ${data.createFlight.flightNumber} created with status ${data.createFlight.status}`;
    } catch (error) {
        console.error('Error creating flight:', error);
        createFlightResult.textContent = 'Error creating flight. Please try again later.';
    }
});