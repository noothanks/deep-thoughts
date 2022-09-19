const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

//serves as responses for our queries
const resolvers = {
  Query: {
    //context must be defined before you can use it
    me: async (parent, args, context) => {
      //make sure the user is authenticated
      //if context isnt present
      //user isnt authenticated
      //throw err
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    //get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
    },
    //get user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    //find all thoughts for a user
    //sort descending
    //pass parent as placeholder to access username from second param
    //pass params to the find method
    //will pass username if it exists but wont break the query without it
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    //single thought
    //pass parent as placeholder
    //pass destructured thought id into find method
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    }
  },

  //serves as mutation response
  Mutation: {
    addUser: async (parent, args) => {
      //pass in destructured args to create a new user
      const user = await User.create(args);
      const token = signToken(user);

      //assign a new token on success
      return { token, user };
    },
    //destructure args
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      ///validate email and password
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      //assign a new token if successful
      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      //check for token
      if (context.user) {
        const thought = await Thought.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      //check for token
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          //requires thought id
          { _id: thoughtId },
          //push reaction to arr in parent Thought model
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addFriend: async (parent, { friendId }, context) => {
      //check for token
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          //get user id
          { _id: context.user._id },
          //use add to set to add to friends arr
          //prevents duplicate friends
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;
