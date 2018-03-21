import * as React from 'react';
import Scene from './components/Scene';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Scene
          width={300}
          height={500}
          images={[
            'http://placeimg.com/640/480/tech',
            'http://placeimg.com/640/480/animals',
          ]}
        />
      </div>
    );
  }
}

export default App;
