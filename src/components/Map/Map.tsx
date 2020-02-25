import React, { Component } from "react";
import { bearing } from "../../helpers/utils/map";

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
  rotate: boolean;
  path: string[];
  idxPath: number;
}

interface IPlace {
  lat: number;
  lng: number;
  name: string;
}

let places: IPlace[] = [
  {
    lat: 41.890251,
    lng: 12.492373,
    name: "Colosseum"
  },
  {
    lat: 41.90296,
    lng: 12.45336,
    name: "Basilica di San Pietro"
  },


]

let H = (window as any).H;

class Map extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      lat: places[0].lat,
      lng: places[0].lng,
      zoom: 17,
      heading: 0,
      rotate: false,
      path: [],
      idxPath: -1
    };
  }

  addManueversToMap(map: any, route: any) {
    //var svgMarkup = '',
    //dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
    var group = new H.map.Group(),
      i,
      j;
    var lineString = new H.geo.LineString();
    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
      for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        let maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        console.log(maneuver.position);
        var marker = new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude
        });
        //lineString.pushPoint({ lat: maneuver.position.latitude, lng: maneuver.position.longitude });

        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }
    this.setState({
      path: route.shape,
      idxPath: 0
      
    });
    for (i = 0; i < route.shape.length; i += 1) {
      let point = route.shape[i];
      let  parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    }

    let polyline =new H.map.Polyline(
      lineString, { style: { lineWidth: 4 ,
      strokeColor: 'rgba(0, 128, 255, 0.7)'} }
    ); 
    map.addObject(polyline);

    /*
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
    */

    this.setState({
      idxPath : 0
    });

    group.addEventListener('tap', function (evt: any) {
      map.setCenter(evt.target.getGeometry());

    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  }

  parseRoute(map: any, result: any) {
    console.log(result.response.route[0].leg[0].maneuver)
    this.addManueversToMap(map, result.response.route[0]);

  }

  calculateRoute(map: any, platform: any) {
    var router = platform.getRoutingService(),
      parameters = {
        waypoint0: String(places[0].lat) + "," + String(places[0].lng),
        waypoint1: String(places[1].lat) + "," + String(places[1].lng),
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        mode: 'fastest;pedestrian',
        /* departure: 'now' */
      };
    console.log(parameters);
    router.calculateRoute(parameters,
      (result: any) => {
        this.parseRoute(map, result);
      }, function (error: any) {
        console.error(error);
      });
  }




  componentDidMount() {

    var platform = new H.service.Platform({
      apikey: process.env.REACT_APP_HERE_APIKEY
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Europe
    var map = new H.Map(
      document.getElementById("map"),
      //defaultLayers.vector.normal.map,
      //defaultLayers.raster.terrain.map,
      defaultLayers.raster.satellite.map,
      
      {
        center: { lat: this.state.lat, lng: this.state.lng },
        zoom: this.state.zoom,
        pixelRatio: window.devicePixelRatio || 1
      }
    );

    map.getViewModel().setLookAtData({ tilt: 45, heading: this.state.heading });


    setTimeout(() => {
      setInterval(() => {
        if (this.state.idxPath >= 0 && this.state.idxPath < this.state.path.length) {
          let center = this.state.path[this.state.idxPath].split(',');
          if (this.state.idxPath < this.state.path.length -1) {
            let nextCenter = this.state.path[this.state.idxPath+1].split(',');
            this.setState(
              {
                heading : bearing( +nextCenter[0], +nextCenter[1],+center[0],+center[1])
              }
            )
          }
          

          map.setCenter(
            {
              lat: center[0],
              lng: center[1]
            }
          );

          map.setZoom(this.state.zoom);
          
          
          map.getViewModel().setLookAtData({ tilt: 60, heading: this.state.heading });
          this.setState({
            idxPath : this.state.idxPath + 1,
            lat: +center[0],
            lng: +center[1],
            zoom: 20
          });

        }
      }, 2000);
    }, 1000);
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener("resize", () => map.getViewPort().resize());

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    console.log(behavior, ui);
    this.calculateRoute(map, platform);
    //map.addEventListener("change", () => console.log("Prova"));


    //map.ChangeEvent()
  }
  render() {
    return (
      <div className="mapWrapper">
        <div className="map" id="map"></div>
        <div className="mapSidebar" id="sidebar">
          <ul>

            <li>Lat: {this.state.lat}</li>
            <li>Lng: {this.state.lng}</li>
            <li>Zoom: {this.state.zoom}</li>
          </ul>
          <button></button>


        </div>
      </div>
    );
  }
}
export default Map;
