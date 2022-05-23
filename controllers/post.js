const { v4: uuidv4 } = require("uuid");
const express = require("express");
const postModel = require("../models/post");
const base64ToBuffer = require("../util/functions").base64ToBuffer;
const uploadToBucket = require("../util/upload-to-bucket");

exports.createPost = (req, res, next) => {
  const userId = req.params.userId;
  if ("image" in req.body) {
    const { buffer, extension } = base64ToBuffer(req.body.image);
    const uid = uuidv4();
    uploadToBucket("bucket_image_files", buffer, uid, extension)
      .then((response) => {
        const imgURL = `https://storage.googleapis.com/bucket_image_files/${uid}.${extension}`;
        const data = {
          title: req.body.title,
          content: req.body.content,
          imgUrl: imgURL,
          date: Date.now(),
          userId: userId,
          name: req.body.name,
          userImgUrl: req.body.imgUrl,
        };
        postModel.createPost(userId, data).then((response) => {
          if (!response) {
            res.status(500).json({ errorMessage: "Post not uploaded" });
          } else {
            res.status(201).json({ successMessage: "Post uploaded" });
          }
        });
      })
      .catch((_) => {
        res
          .status(500)
          .json({ errorMessage: "Image of post could not be uploaded " });
      });
  } else {
    const data = {
      title: req.body.title,
      content: req.body.content,
      date: Date.now(),
      userId: userId,
      name: req.body.name,
      userImgUrl: req.body.imgUrl,
    };
    postModel.createPost(userId, data).then((response) => {
      if (!response) {
        res.status(500).json({ errorMessage: "Post not uploaded" });
      } else {
        res.status(201).json({ successMessage: "Post uploaded" });
      }
    });
  }
};

exports.getPosts = (req, res, next) => {
  const userId = req.params.userId;
  postModel.findPostsByUserId(userId, null).then((response) => {
    // console.log(response);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ errorMessage: "Error getting posts " });
    }
  });
};

exports.getAllPosts = (req, res, next) => {
  postModel.findAllPosts().then( response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ errorMessage: "Error getting posts " });
    }
  });
}
