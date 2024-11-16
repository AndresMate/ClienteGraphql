const { request, gql } = window.graphqlRequest;

const endpoint = 'http://localhost:4000/graphql';

// Consulta para obtener todos los vuelos
const queryFlights = gql`
    {
        flights {
            flightNumber
            airline {
                name
            }
            departureAirport {
                name
            }
            arrivalAirport {
                name
            }
            departureTime
            arrivalTime
            status
        }
    }
`;

// Mutación para crear un nuevo vuelo
const createFlightMutation = gql`
    mutation($input: FlightInput!) {
        createFlight(input: $input) {
            flightNumber
            status
        }
    }
`;

// Obtener elementos del DOM
const queryFlightsButton = document.getElementById('queryFlightsButton');
const flightsList = document.getElementById('flightsList');
const createFlightButton = document.getElementById('createFlightButton');
const createFlightResult = document.getElementById('createFlightResult');

// Manejar la consulta de vuelos
queryFlightsButton.addEventListener('click', () => {
    request(endpoint, queryFlights).then((data) => {
        flightsList.innerHTML = '';
        data.flights.forEach(flight => {
            const listItem = document.createElement('li');
            listItem.textContent = `${flight.flightNumber} - ${flight.airline.name} - ${flight.departureAirport.name} to ${flight.arrivalAirport.name} - ${flight.status}`;
            flightsList.appendChild(listItem);
        });
    });
});

// Manejar la creación de un nuevo vuelo
createFlightButton.addEventListener('click', () => {
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

    request(endpoint, createFlightMutation, { input }).then((data) => {
        createFlightResult.textContent = `Flight ${data.createFlight.flightNumber} created with status ${data.createFlight.status}`;
    });
});