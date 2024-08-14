import { Box } from '@chakra-ui/react';
import { Route } from 'wouter';
import Home from './pages/home/Home';
function App() {
  return (
    <Box w={'100vw'} h={'100vh'} bg={'#2D2E32'}>
      <Route path={'/'}>
        {() => {
          return <Home />;
        }}
      </Route>
    </Box>
  );
}

export default App;
