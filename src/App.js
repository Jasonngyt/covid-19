import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Form from "react-bootstrap/Form";
import GoogleMapReact from 'google-map-react';
import Navbar from 'react-bootstrap/Navbar';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function App() {
  const [latest, setLatest] = useState([]);
  const [results, setResults] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");

  useEffect(() => {
    axios
    .all([
      axios.get("https://corona.lmao.ninja/V2/all"),
      axios.get("https://corona.lmao.ninja/V2/countries")
    ])
    .then(responseArr => {
      setLatest(responseArr[0].data);
      setResults(responseArr[1].data);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const date = new Date(parseInt (latest.updated));
  const lastUpdated = date.toString();


  // Function to seach for the country
  const filterCountry = results.filter(item => {
    return searchCountry !== "" ? item.country.includes(searchCountry) : item;
  })


  // Function to display the number of covid cases and country flag in Google Map 
  const countriesLocations = filterCountry.map((data, i) => {
    return (
        <div
        lat={data.countryInfo.lat}
        lng={data.countryInfo.long}
        style={{
          color: "red",
          backgroundColor: '#FFF',
          height: "30px",
          width: "40px",
          textAlign: "center",
          borderRadius: "8px",
          border: "1px solid",
        }}
      >
        <img height="12px" src={data.countryInfo.flag} />
        <br />
        {data.cases}
      </div>
    );
  });


  // Function to display the details of individual country covi cases
  const countries = filterCountry.map((data, i) => {
    return (
      <Card
        key={i}
        bg="light"
        text="dark"
        className="text-center"
        style={{margin: "10px"}}
      > 
        <Card.Img variant="top" src={data.countryInfo.flag} />
        <Card.Body>
          <Card.Title><h4>{data.country}</h4></Card.Title>
          <Card.Text>Cases {data.cases}</Card.Text>
          <Card.Text>Deaths {data.deaths}</Card.Text>
          <Card.Text>Recovered {data.recovered}</Card.Text>
          <Card.Text>Today's Cases {data.todayCases}</Card.Text>
          <Card.Text>Today's Deaths {data.todayDeaths}</Card.Text>
          <Card.Text>Active {data.active}</Card.Text>
          <Card.Text>Critcal {data.critical}</Card.Text>
        </Card.Body>
      </Card>
    )
  })

  
  //Function to total cases, deaths, recovery cases
  return (
    <div>
      <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home"><h1>Covid-19 World Tracker</h1></Navbar.Brand>
          <Col className="text-center">
            <Form inline>
              <FormControl style={{width:'150vh'}} type="text" placeholder="Search for a country" onChange={e=> setSearchCountry(e.target.value)} className="mr-sm-2" />
            </Form>
          </Col>
      </Navbar>

      <Row style ={{width : '100%'}}>
        <Col sm={3}>
          <Card
            bg="dark" 
            border="light"
            text="white" 
            className="text-center"
            >
              <Card.Header>
                <Card.Title>Confirmed Cases</Card.Title>
                <Card.Text> <h2>{latest.cases}</h2> </Card.Text>
              </Card.Header>
          </Card>

          <Card
            bg="dark" 
            border="light"
            text="white" 
            className="text-center">
              <Card.Header>
                <Card.Title>Global Deaths</Card.Title>
                <Card.Text><h2>{latest.deaths}</h2></Card.Text>
              </Card.Header>
          </Card>

          <Card
            bg="dark" 
            border="light"
            text="white" 
            className="text-center">
            <Card.Header>
              <Card.Title>Recovered Cases</Card.Title>
              <Card.Text><h2>{latest.recovered}</h2></Card.Text>
            </Card.Header>
          </Card>

          <Card
            bg="dark" 
            border="light"
            text="white" 
            className="text-center"
            style={{padding: "10px"}}>
              <small>Last updated <br/>{lastUpdated}</small>
          </Card>
          

          {/* Display all the countries/ searched country */}
          <Card bg="dark" border="light">{countries}</Card>
          
        </Col>


        {/* Display Google Map */}
      
        <Col sm={9}>
          <div style ={{height : '100vh', width : '100%'}}>
            <GoogleMapReact
              // bootstrapURLKeys={{ key:"Your API Key"}}
              defaultCenter={{lat: 59.95, lng: 30.33}}
              defaultZoom={4}
            >
            {countriesLocations}
            </GoogleMapReact>
          </div>
        </Col>
        
      </Row>      
    </div>
  );
}

export default App;
