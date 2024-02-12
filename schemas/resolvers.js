// import User module
const { User } = require('../models');
// import auth checker to add token of signed in user
const { signToken, AuthenticationError } = require('../utils/auth');
// object with Query and Mutations we will add to our routes

const resolvers = {
  Query: {
    // query to find one user by id or username

    user: async (parent, { username, id }) => {
      return User.findOne({ $or: [{ _id: id }, { username: username }] });
    },
    user1: async (parent, { username }) => {
      return User.findOne({ username });
    },
  },

  Mutation: {
    // mutation to create new user and add jwt token for authorization

    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        return alert(`Cannot create user`)
      }
      const token = signToken(user);

      return { token, user };
    },
    // mutation to check user who wants to log in and add token if he is valid

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    // mutation to saveBook to user data
    saveBook: async (parent, { _id, description, bookId, image, link, title, authors }, context) => {
      try {
        let user = User.findOneAndUpdate(
          { _id: _id },
          { $addToSet: { savedBooks: { description, bookId, image, link, title, authors } } },
          { new: true, runValidators: true }
        )
        return user
      } catch (error) {
        console.error(error)
      }

      // }
      throw AuthenticationError;

    },
    // mutation to deleteBook from user data
    deleteBook: async (parent, { _id, bookId }, context) => {
      // if (context.user) {
      return User.findOneAndUpdate(
        { _id: _id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      // }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;
