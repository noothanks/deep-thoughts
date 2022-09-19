import React from 'react';
import { useParams } from 'react-router-dom';

//get reaction list from component
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';

import Auth from '../utils/auth';
//import query to use by name
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';

const SingleThought = (props) => {
  //gets id from url
  const { id: thoughtId } = useParams();

  //destructure loading and data from useQuery
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    //will become $id param in graphQL query
    variables: { id: thoughtId },
  });

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  //display single thought info
  //display reactionlist component
  //only if length is > 0
  //conditionally render ReactionForm based on whether or not the user is logged in
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}

      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
  );
};

export default SingleThought;
