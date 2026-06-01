import { useState } from 'react';
import NaNvbar from './components/Navbar';
import Herosection from './components/Herosection';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NaNvbar />
      <Herosection />
    </>
  );
}

export default App;