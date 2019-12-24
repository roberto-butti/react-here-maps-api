import React from 'react';
import Header from './components/Header/Header';
import Map from './components/Map/Map';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <Map></Map>
    </div>
  );
}

export default App;
