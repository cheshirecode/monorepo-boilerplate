import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/Spinner';

const App: BaseFC = () => (
  <ErrorBoundary>
    <Spinner></Spinner>
  </ErrorBoundary>
);

export default App;
