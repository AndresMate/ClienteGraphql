document.addEventListener('DOMContentLoaded', () => {
    const endpoint = 'http://localhost:4000/graphql';

    // Queries
    const queryFlights = `
        query {
            flights {
                flightNumber
                airline
                departureAirport
                arrivalAirport
                departureTime
                status
            }
        }
    `;

    const queryAirlines = `
        query {
            airlines {
                id
                name
            }
        }
    `;

    const queryAirports = `
        query {
            airports {
                id
                name
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
    const flightsTable = document.getElementById('flightsTable').querySelector('tbody');
    const queryAirlinesButton = document.getElementById('queryAirlinesButton');
    const airlinesList = document.getElementById('airlinesList');
    const queryAirportsButton = document.getElementById('queryAirportsButton');
    const airportsList = document.getElementById('airportsList');
    const createFlightButton = document.getElementById('createFlightButton');
    const createFlightResult = document.getElementById('createFlightResult');
    const filterButton = document.getElementById('filterButton');
    const flightFilter = document.getElementById('flightFilter');
    const airlineFilter = document.getElementById('airlineFilter');
    const statusFilter = document.getElementById('statusFilter');

    // Handle flight query and filter
    async function fetchAndDisplayFlights() {
        try {
            const data = await sendGraphQLRequest(queryFlights);
            displayFlights(data.flights);
        } catch (error) {
            console.error('Error fetching flights:', error);
            flightsTable.innerHTML = '<tr><td colspan="5">Error fetching flights. Please try again later.</td></tr>';
        }
    }

    function displayFlights(flights) { flightsTable.innerHTML = ''; flights.forEach(flight => { 
        const departureTime = new Date(flight.departureTime).toLocaleTimeString(); 
        const row = document.createElement('tr'); 
        row.innerHTML = ` <td>${departureTime}</td> 
                          <td>${flight.arrivalAirport}</td> 
                          <td>${flight.airline}</td> 
                          <td>${flight.flightNumber}</td> 
                          <td>${flight.status}</td> `; 
        
        flightsTable.appendChild(row);
    }); 
    }

    filterButton.addEventListener('click', async () => {
        const selectedFlight = flightFilter.value;
        const selectedAirline = airlineFilter.value;
        const selectedStatus = statusFilter.value;

        try {
            const data = await sendGraphQLRequest(queryFlights);
            const filteredFlights = data.flights.filter(flight => 
                (selectedFlight ? flight.flightNumber === selectedFlight : true) &&
                (selectedAirline ? flight.airline === selectedAirline : true) &&
                (selectedStatus ? flight.status === selectedStatus : true)
            );
            displayFlights(filteredFlights);
        } catch (error) {
            console.error('Error fetching flights:', error);
            flightsTable.innerHTML = '<tr><td colspan="5">Error fetching flights. Please try again later.</td></tr>';
        }
    });

    // Function to populate filter options
    async function populateFilterOptions() {
        try {
            const flightsData = await sendGraphQLRequest(queryFlights);
            flightFilter.innerHTML = '<option value="">Select Flight</option>';
            flightsData.flights.forEach(flight => {
                const option = document.createElement('option');
                option.value = flight.flightNumber;
                option.textContent = flight.flightNumber;
                flightFilter.appendChild(option);
            });

            const airlinesData = await sendGraphQLRequest(queryAirlines);
            airlineFilter.innerHTML = '<option value="">Select Airline</option>';
            airlinesData.airlines.forEach(airline => {
                const option = document.createElement('option');
                option.value = airline.name;
                option.textContent = airline.name;
                airlineFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating filter options:', error);
        }
    }

    // Initial population of filter options
    populateFilterOptions();

    // Fetch and display initial flights data
    fetchAndDisplayFlights();
});
