import * as React from 'react';
import Scene from './components/Scene';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Scene
          width={300}
          height={600}
          images={[
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=15206001' + 
            '45728&di=a9bbde742ed8ea3e130835af6b814568&imgtype=0&src=http%3A%2F%2Fimgsrc.' + 
            'baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D81c6a' + 
            '49be350352aa56c2d4b3b2a9187%2Fc75c10385343fbf209240d0fba7eca8065388f96.jpg'
          ,
          'https://oss.ruishan666.com/image/xcx/180314/992394665856/11750340,2880,1800.jpg',
          ]}
        />
      </div>
    );
  }
}

export default App;
