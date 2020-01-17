import React, { Component } from "react";
import 'bulma/css/bulma.css';
import { Link } from "react-router-dom";
import NavBarIn from "../NavBarIn/NavBarIn";
import API from "../../utils/API";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions"
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import coord from './coord.js';
import NavBar from './navbar';
import Address from './addresses'
import "./map.css";


class Map extends Component {
  
  constructor() {
    super();    
    const initial = coord.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />);
    this.state = {
        api: [],
        done: false,
        viewport: {
            width: '100vw',
            height: '100vh',
            latitude: 36.1627,
            longitude: 86.7816,
            zoom: 8
        },
        setViewPort: null,
        navData: initial,
        latt: null,
        lngg: null,
        loc_name: null,
        user: [],
    toMap: [],
    toSave: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
}

  componentDidMount() {
  // this.setState({user: })
  // .then(() => 
  
  
  this.loadMapData(this.props.auth)
  
  

  
 }

 handleClick = (id) => {

  //  console.log(id);
  //  console.log(this.state.navData);
   this.state.navData.map(res => {

       if(res.props.places.id === id){
           this.setState({

               latt: res.props.places.coordinates[0].lat,
               lngg: res.props.places.coordinates[0].lng,
               loc_name: res.props.places.name

           });

       }
       return this.state;
   });


}
handleOnChange = (e) => {
   let txt = e.target.value.toLowerCase();
   const searched = this.state.api.filter(data => data.address.toLowerCase().includes(txt) ? data : null);

   const filtered = searched.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />)
   this.setState({
       navData: filtered
   });
}

handleKeyboardEvent = e => {
   if(e.key === 'Escape'){
       this.setState({

           latt: null,
           lngg: null,
           loc_name: null

       })
   }
   return window.removeEventListener("keydown", this);
}


 loadMapData = (temp) => {
   API.getSearchData(temp.user.id)
     .then(res =>
       this.setUserState(res.data),
     ).then(()=>
       this.loadMap()
     )
     .catch(err => console.log(err));
 }

 setUserState = (data) => {
  this.setState({toMap: data});
}

loadMap = () => {
  //for putting in the map on page
  this.setState(
    {api : this.state.toMap.mapBreweries,
     user: this.props.auth,
     navData: this.state.toMap.mapBreweries.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />),
     done: true,
        viewport: {
            width: '100vw',
            height: '100vh',
            marginLeft: '20vw',
            latitude: parseFloat(this.state.toMap.mapBreweries[0].latitude),
            longitude: parseFloat(this.state.toMap.mapBreweries[0].longitude),
            zoom: 8
        },
        setViewPort: null
    },
  ) 
  console.log(this.state.api);
}





    render() {
      const handleKey = window.addEventListener("keydown", this.handleKeyboardEvent);
      return (
        <div>
          <NavBarIn />
          <div className="container">
            <br />
            <div className="row center">
  
              <h1>
                {" "}
                <span>Map Results</span>
              </h1>
              <div>
            <ReactMapGL {...this.state.viewport}
                        mapboxApiAccessToken={"pk.eyJ1IjoiaXNpb21hIiwiYSI6ImNqemhpcTYwMDBkaWIzZm16dG5ucHdweW0ifQ.fAQlsUYEzVN2st5qft2IKw"}
                        mapStyle="mapbox://styles/isioma/cjzi11o2t2yjv1cqlraiqesb0"
                        onViewportChange={(viewport) => this.setState({viewport})}>
                {this.state.navData.map(data => (
                    <Marker key={data.props.places.id} latitude={parseFloat(data.props.places.latitude)} longitude={parseFloat(data.props.places.longitude)}>
                        <div className="mapMarkerStyle">{data.props.places.name[0]}<i className="fa fa-map-marker"></i></div>
                    </Marker>
                ))}
                {/* {this.state.latt && this.state.lngg ?
                    (<Popup
                        latitude={this.state.latt}
                        longitude={this.state.lngg}
                        onClose={() => {
                            this.setState({

                                latt: null,
                                lngg: null,
                                loc_name: null

                            });
                }}>
                        <div>
                            <h2>{this.state.loc_name}</h2>
                        </div>
                    </Popup>) : null
                } */}

            </ReactMapGL>
        </div>
            </div>
            <br />
            <div className="container" >
            {this.state.toMap.length ? (
              this.state.toMap.map(brew => (
                console.log("holder")
                //card with list?
               ))
              ) : (
                <h3>No Results to Display</h3>
              )}
            </div>
            <div className={`right`}>
              <Link to="/beer">
                <button className="button is-primary has-text-weight-bold">New Search</button>
              </Link>
              <Link to="/map">
                <button className="button is-black has-text-weight-bold">Save Breweries</button>
              </Link>
            </div>
          </div>
        </div>

      );
    }
  };

  Map.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Map);
  
  // const stuff = this.state.toMap;

  // export {stuff}