import React from 'react';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';
import FriendList from '../components/FriendList';

//check logged in status
import Auth from '../utils/auth';
//allows us to make requests to graphWl server
//made available by ApolloProvider component in App.js
import { useQuery } from '@apollo/client';
//import individual queries to be used by name
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';

const Home = () => {
  //execute QUERY_THOUGHTS to get all thought data
  //loading property indicates the request isnt finished
  //response data is stored in a destructured data var
  //show loading screen in place until request is complete
  //print list to main when finished
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //destructure to rxtract data from the useQuery hook
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  
  //destructure thought data if it exists
  //othewise set empty arr
  const thoughts = data?.thoughts || [];

  const loggedIn = Auth.loggedIn();

  //thought form should appear above thought list
  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
