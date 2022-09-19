import React from 'react';
//components provided by react router
//rename to router to keep consistent
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  //constructor that initializes connection to graphql api server
  //specialized case of built in react tool
  ApolloClient,
  //allows apollo client to cache api response data
  //improves request efficiency
  InMemoryCache,
  //special react component used to provide data to other components
  ApolloProvider,
  //middleware for outbound network requests
  //controls how apollo client makes a request
  createHttpLink,
} from '@apollo/client';
//creates middleware to get token and combine it with http link
import { setContext } from '@apollo/client/link/context';

//import page components
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

//link graphql server
const httpLink = createHttpLink({
  //endpoint
  uri: '/graphql',
});

//retrieve token from localStorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  //set headers to include token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//instantiate apollo client
const client = new ApolloClient({
  //connect to api endpoint
  link: authLink.concat(httpLink),
  //instantiate new cache
  cache: new InMemoryCache(),
});

function App() {
  //enables entire app to interact with apollo client
  //wrap everything in apollo provider
  //passes client variable as a prop to rest of front end
  //wraps single route components in Router component
  //passes router to child components
  //wrap component path in Route component
  //set element to {<Component />}
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={<Home />} 
              />
              <Route 
                path="/login" 
                element={<Login />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
              <Route 
                path="/profile" 
                element={<Profile />} 
              />
              <Route 
                path="/thought/:id" 
                element={<SingleThought />} 
              />
              <Route 
                path="*" 
                element={<NoMatch />} 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
