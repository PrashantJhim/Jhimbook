import '../styles/globals.css'
import {Provider} from 'react-redux'
import Store from './Store/Store'
function MyApp({ Component, pageProps }) {
  return <div> 
  <Provider store = {Store}>
  <Component {...pageProps} />
  </Provider>
  </div>
}

export default MyApp
