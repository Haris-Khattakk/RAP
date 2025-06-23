const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const post = require("../models/postModel");
const { createNotification } = require("./notificationsController");
const notiMsgs = require("../Texts/notications");
const sendEmail = require("./sendEmail");

const userController = {
  createUser: async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      // Check for existing username or email in one query
      const existingUser = await User.findOne({
        $or: [{ user_name: name }, { email }],
      });

      if (existingUser) {
        const conflictField =
          existingUser.email === email ? "email" : "username";
        return res.status(400).send(`${conflictField} is already taken`);
      }

      // Hash password
      const saltRounds = 15;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await User.create({
        user_name: name,
        email,
        password: hashedPassword,
        role: role || "User",
        image: req.file
          ? { data: req.file.buffer, contentType: req.file.mimetype }
          : null,
      });

      // JWT token generation
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          user_name: newUser.user_name,
          role: newUser.role,
        },
        process.env.SECRET_KEY,
        { algorithm: "HS256", expiresIn: process.env.JWT_EXP }
      );

      // Send email
      const sentMail = await sendEmail(email, "Thank you!", "Thank you");
      if (!sentMail.accepted?.length) {
        return res.status(500).send("Failed to send email");
      }

      // Send cookie
      res
        .cookie("authToken", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        })
        .send("Successfully logged in - cookie sent");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const userDetails = await User.findOne({ email });
      if (!userDetails) {
        return res.status(404).send("User not found - create account first");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userDetails.password
      );
      if (!passwordMatch) {
        return res.status(401).send("Invalid credentials");
      }

      const payload = {
        id: userDetails._id,
        email: userDetails.email,
        user_name: userDetails.user_name,
        role: userDetails.role,
      };

      const tokenFromCookie = req.cookies.authToken;
      jwt.verify(tokenFromCookie, process.env.SECRET_KEY, async (err) => {
        if (err) {
          // Generate new token
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "7d",
          });

          const sentMail = await sendEmail(email, "New Login", "New Login");
          if (!sentMail.accepted?.length) {
            return res.status(500).send("Failed to send email");
          }

          res
            .cookie("authToken", token, {
              httpOnly: true,
              sameSite: "strict",
              secure: false,
              maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .send("Successfully logged in - new cookie set");
        } else {
          res.send("Successfully logged in - cookie already valid");
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Login failed due to server error");
    }
  },

  logoutUser: (req, res) => {
    res
      .clearCookie("authToken", {
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      })
      .send("successfully logged out--Redirecting to index page");
  },
  userWho: (req, res) => {
    const user_jwt = req.cookies.authToken;
    const secret_key = process.env.SECRET_KEY;
    res.send(
      jwt.verify(user_jwt, secret_key, (err, decoded) => {
        if (err) {
          return err;
        } else {
          return decoded;
        }
      })
    );
  },
  getUser: async (req, res) => {
    const user_id = req.query.user;

    try {
      const usr = await User.findOne({ _id: user_id });
      // console.log(usr)
      const finalUser = {
        ...usr._doc,
        image: `data:image/png;base64,${usr.image.data.toString("base64")}`,
      };
      res.send(finalUser);
    } catch (error) {
      res.send(error);
    }
  },
  followUser: async (req, res) => {
    const follower_id = req.query.follower_id;
    const follow_id = req.query.follow_id;

    try {
      const followerDB = await user.findById(follower_id);
      const followDB = await user.findById(follow_id);

      if (followerDB && followDB) {
        // Check if already following
        const isAlreadyFollowing = followerDB.following.includes(follow_id);
        const isAlreadyFollowed = followDB.followers.includes(follower_id);

        if (!isAlreadyFollowing) {
          followerDB.following.push(follow_id);
        }

        if (!isAlreadyFollowed) {
          followDB.followers.push(follower_id);
        }

        await followerDB.save();
        await followDB.save();
        // console.log(followDB)
        // console.log(followerDB)
        // send notification to owner
        const payload = {
          highlighter: notiMsgs.followNoti.highlight,
          for_user: [followDB?._id],
          for_post: followerDB._id,
          type: "follow",
          message: `${followerDB?.user_name} ${notiMsgs.followNoti.content}`,
        };
        // console.log(payload)
        // call notifcation controller
        createNotification(payload);

        res.send("Successfully followed the user");
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  unfollowUser: async (req, res) => {
    const follower_id = req.query.follower_id;
    const follow_id = req.query.follow_id;

    // console.log(follower_id, follow_id)

    try {
      const followerDB = await user.findById(follower_id);
      const followDB = await user.findById(follow_id);

      if (followerDB && followDB) {
        // Filter out follow_id from following array
        followerDB.following = followerDB.following.filter(
          (id) => id.toString() !== follow_id
        );

        // Filter out follower_id from followers array
        followDB.followers = followDB.followers.filter(
          (id) => id.toString() !== follower_id
        );

        await followerDB.save();
        await followDB.save();

        res.send("Successfully unfollowed the user");
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getFriends: async (req, res) => {
    try {
      const { userId } = req.params;
      const friends = await user
        .findById(userId)
        .select("followers following")
        .populate({
          path: "followers",
          select: "user_name image",
        })
        .populate({
          path: "following",
          select: "user_name image",
        });
      // console.log(friends)
      const followers = friends?.followers;
      const followings = friends?.following;

      const finalFollowing = followings?.map((friend) => {
        // console.log(friend)
        return {
          ...friend._doc,
          image: `data:image/png;base64,${friend?.image.data.toString(
            "base64"
          )}`,
        };
      });
      const finalFollowers = followers?.map((friend) => {
        // console.log(friend)
        return {
          ...friend._doc,
          image: `data:image/png;base64,${friend?.image.data.toString(
            "base64"
          )}`,
        };
      });

      // console.log(finalFollowing, finalFollowers)
      const finalFriends = {
        finalFollowers,
        finalFollowing,
      };
      res.send(finalFriends);
    } catch (error) {
      return error;
    }
  },

  search: async (req, res) => {
    // search for the 'data' in all database/only user name and post's location

    try {
      const { data } = req.params;
      const foundUser = await user.find({
        user_name: { $regex: data, $options: "i" },
      });

      const finalUsers = foundUser.map((user) => ({
        ...user._doc,
        image: user.image?.data
          ? `data:image/png;base64,${user.image.data.toString("base64")}`
          : null,
      }));

      // console.log(foundUser)
      // const foundPost = await post.find({ location: { $regex: data, $options: 'i' }})
      const posts = await post
        .find({ location: { $regex: data, $options: "i" } })
        .sort({ createdAt: -1 })
        // .skip(skip)
        // .limit(limit)
        .populate("owner")
        .populate("likes")
        .populate("disLikes")
        .populate({
          path: "media",
          populate: [{ path: "likes" }, { path: "disLikes" }],
        });

      // console.log(posts)
      // const total = await post.countDocuments();
      // console.log(`total: ${total} || fetched: ${posts.length}`)
      // const hasMore = (skip + posts.length) < total;
      // console.log(hasMore)

      const updatedPosts = posts.map((post) => {
        const mediaUrls = post.media
          .map((file) => {
            // console.log(file)
            const fileData = file.toObject();
            const fileExt = fileData.identifier.filename
              .split(".")
              .pop()
              ?.toLowerCase();
            const mediaType = ["mp4", "webm", "mov"].includes(fileExt)
              ? "video"
              : "image";
            const ownerId =
              post.owner?._id?.toString() || post.owner?.toString();

            if (!ownerId) {
              console.error("Missing owner ID for post:", post._id);
              return null;
            }

            return {
              url: `${req.protocol}://${req.get("host")}/uploads/${ownerId}/${
                fileData.identifier.filename
              }`,
              type: mediaType,
              filename: fileData.identifier.filename,
              likes: file.likes,
              disLikes: file.disLikes,
              of_post: file.of_post,
              owner: file.owner,
              _id: file._id,
            };
          })
          .filter(Boolean);

        return {
          ...post.toObject(),
          media: mediaUrls,
          owner: {
            ...post.owner.toObject(),
            image: post.owner.image?.data
              ? `data:image/png;base64,${post.owner.image.data.toString(
                  "base64"
                )}`
              : null,
          },
        };
      });

      const final = {
        users: finalUsers,
        posts: updatedPosts,
      };
      res.send(final);
    } catch (error) {
      res.send(error);
    }
  },
};

module.exports = userController;
