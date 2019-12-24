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

class Map extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      lat: 41.890251,
      lng: 12.492373,
      zoom: 17,
      heading: 0
    };
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

    map.getViewModel().setLookAtData({ tilt: 45, heading: this.state.heading });

    //setTimeout(() => {
      setInterval(() => {
        this.setState({
          heading: this.state.heading + 10
        });
        map.getViewModel().setLookAtData({
          tilt: 45,
          heading: this.state.heading
        });
        console.log(this.state)
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
