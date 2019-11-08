import {createStore,applyMiddleware} from 'redux';
import rootReducer from '../reducer/rootReducer';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga/rootSaga'

const sagaMiddleware= createSagaMiddleware();

const middleware=[];
middleware.push(sagaMiddleware);

// if(process.env.NODE_ENV==='development'){
//   //comment this if you do not need to debug redux
//   middleware.push(logger);
// }



  const store = createStore(rootReducer,applyMiddleware(...middleware));

  sagaMiddleware.run(rootSaga);

  export default store;