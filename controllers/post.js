const { v4: uuidv4 } = require("uuid");
const express = require("express");
const postModel = require("../models/post");
const base64ToBuffer = require("../util/functions").base64ToBuffer;
const translateText = require("../util/functions").translateText;
const detectLanguage = require("../util/functions").detectLanguage;
const getAudioFromText = require("../util/functions").getAudioFromText;
const uploadToBucket = require("../util/upload-to-bucket");

/**
 * @swagger
 * components:
 *      schemas:
 *        Post:
 *          type: object
 *          properties:
 *              content:
 *                  type: string
 *              date:
 *                  type: number
 *              imgUrl:
 *                  type: string
 *              name:
 *                  type: string
 *              title:
 *                  type: string
 *              userId:
 *                  type: string
 *              userImgUrl:
 *                  type: string
 *          example:
 *                content: string
 *                date: number
 *                imgUrl: string
 *                name: string
 *                title: string
 *                userId: string
 *                userImgUrl: string
 */

/**
 * @swagger
 * /api/users/{userId}/posts:
 *  post:
 *    description: Create post
 *    parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *                type: string
 *            required: true
 *    requestBody:
 *        required: true
 *        content: 
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Post' 
 *    responses:
 *        201:
 *           description: Post uploaded
 *           content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        successMessage:
 *                          type: string
 *        500:
 *          description: Post not uploaded
 *          content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        errorMessage:
 *                          type: string
 */
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

/**
 * @swagger
 * /api/users/{userId}/posts:
 *  get:
 *    description: Get a user's posts
 *    parameters:
 *          - in: path
 *            name: userId
 *            schema:
 *                type: string
 *            required: true
 *    responses:
 *        200:
 *           description: success message
 *           content:
 *                application/json:
 *                    schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Post'
 *        500:
 *           description: Error getting posts
 *           content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        errorMessage:
 *                          type: string
 */
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

/**
 * @swagger
 * /api/posts:
 *  get:
 *    description: Get a newest posts as feed
 *    responses:
 *        200:
 *           description: success message
 *           content:
 *                application/json:
 *                    schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Post'
 *        500:
 *           description: Error getting posts
 *           content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        errorMessage: 
 *                          type: string
 */
exports.getAllPosts = (req, res, next) => {
  postModel.findAllPosts().then( response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ errorMessage: "Error getting posts " });
    }
  });
};

/**
 * @swagger
 * /api/post-translate:
 *  get:
 *    description: Get translation of a text
 *    parameters:
 *          - in: query
 *            name: originalTitle
 *            schema:
 *                type: string
 *            required: true
 *          - in: query
 *            name: originalText
 *            schema:
 *                type: string
 *            required: true
 *          - in: query
 *            name: target
 *            schema:
 *                type: string
 *            required: true
 *    responses:
 *        200:
 *           description: success message
 *           content:
 *                application/json:
 *                    schema:
 *                      type: array
 *                      items:
 *                        type: string
 *        500:
 *           description: Error translating test
 *           content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        errorMessage: 
 *                          type: string
 */
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

/**
 * @swagger
 * /api/post-audio:
 *  get:
 *    description: Get audio from text
 *    parameters:
 *          - in: query
 *            name: title
 *            schema:
 *                type: string
 *            required: true
 *          - in: query
 *            name: content
 *            schema:
 *                type: string
 *            required: true
 *    responses:
 *        200:
 *           description: success message
 *           content:
 *                application/json:
 *                    schema:
 *                      type: string
 *        500:
 *           description: Error translating test
 *           content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        errorMessage: 
 *                          type: string
 */
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
