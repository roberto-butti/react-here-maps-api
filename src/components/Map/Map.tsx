import React, { Component } from "react";

import "./Map.css";
declare global {
  interface Window {
    H: any;
  }
}
//window.H = window.H || {};

interface IProps {
  debug?: boolean;
}

interface IState {
  lat: number;
  lng: number;
  zoom: number;
  heading: number;
}

interface IPlace {
  lat: number;
  lng: number;
  name: string;
}

let places: IPlace[] =  [
  {
    lat: 41.890251,
    lng: 12.492373,
    name: "Colosseum"
  },
  {
    lat: 41.894599,
    lng: 12.483092,
    name: "Altare della Patria"
  },


]

class Map extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      lat: places[0].lat,
      lng: places[0].lng,
      zoom: 17,
      heading: 0
    };
  }


  calculateRoute(platform: any) {
    var router = platform.getRoutingService(),
      parameters = {
        waypoint0: String(places[0].lat) + "," +  String(places[0].lng),
        waypoint1: String(places[1].lat) + "," +  String(places[1].lng),
        mode: 'fastest;pedestrian',
        /* departure: 'now' */
      };
      console.log(parameters);
      router.calculateRoute(parameters,
        function (result: any) {
          console.log(result);
        }, function (error: any) {
          console.error(error);
        });
  }
  componentDidMount() {
    let H = (window as any).H;
    var platform = new H.service.Platform({
      apikey: process.env.REACT_APP_HERE_APIKEY
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Europe
    var map = new H.Map(
      document.getElementById("map"),
      defaultLayers.vector.normal.map,
      {
        center: { lat: this.state.lat, lng: this.state.lng },
        zoom: this.state.zoom,
        pixelRatio: window.devicePixelRatio || 1
      }
    );

    //map.getViewModel().setLookAtData({ /*tilt: 45,*/ heading: this.state.heading });

    //setTimeout(() => {
      setInterval(() => {
        /* HEADING
        this.setState({
          heading: this.state.heading + 10
        });
        map.getViewModel().setLookAtData({
          tilt: 45,
          heading: this.state.heading
        });
        */
        //console.log(this.state)
      }, 1000);
    //}, 300);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => map.getViewPort().resize());

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    console.log(behavior, ui);
    this.calculateRoute(platform);
  }
  render() {
    return (
      <div className="mapWrapper">
        <div className="map" id="map"></div>
        <div className="mapSidebar"></div>
      </div>
    );
  }
}
export default Map;
