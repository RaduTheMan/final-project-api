const { v4: uuidv4 } = require("uuid");
const express = require("express");
const postModel = require("../models/post");
const base64ToBuffer = require("../util/functions").base64ToBuffer;
const translateText = require("../util/functions").translateText;
const detectLanguage = require("../util/functions").detectLanguage;
const getAudioFromText = require("../util/functions").getAudioFromText;
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
};

exports.getTranslatedPost = (req, res, next) => {
  const originalTitle = req.query.originalTitle;
  const originalText = req.query.originalText;
  const target = req.query.target;
  translateText(originalTitle, originalText, target).then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ errorMessage: "Error translating post " });
    }
  });
};

exports.getAudioFromPost = (req, res, next) => {
  const title = req.query.title;
  const content = req.query.content;
  const text = `${title} ... ${content}`;
  detectLanguage(text).then(language => {
    if (language) {
      getAudioFromText(text, language).then(audioContent => {
        if (audioContent) {
          const data = audioContent.toString("base64");
          res.status(200).json(data);
        } else {
          res.status(500).json({ errorMessage: "Error creating audio from post " });
        }
      });
    } else {
      res.status(500).json({ errorMessage: "Error detecting language from post " });
    } 
  });
};
