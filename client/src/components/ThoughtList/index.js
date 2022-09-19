import React from 'react';
import { Link } from 'react-router-dom';

//destructure thoughts arr and title prop
const ThoughtList = ({ thoughts, title }) => {
  //conditionally render based on whether or not the thought arr is populated
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  //map over thoughts arr to create a section for each thought
  //saves key to thought id
  //keeps track of what gets changed and rerenders accordungly
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
