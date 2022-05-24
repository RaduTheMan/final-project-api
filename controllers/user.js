const express = require("express");
const userModel = require("../models/user");

/**
 * @swagger
 * components:
 *      schemas:
 *        User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              country:
 *                  type: string
 *              city:
 *                  type: string
 *              birthdate:
 *                  type: string
 *              email:
 *                  type: string
 *              imageUrl:
 *                  type: string
 *          example:
 *                name: Radu Damian
 *                country: Romania
 *                city: Iasi
 *                birthdate: 17/10/1999
 *                email: email@email.com
 *                imageUrl: url.com
 */

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    description: Use to get user by id
 *    parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *    responses:
 *        200:
 *           description: User data
 *           content:
 *                application/json:
 *                      $ref: '#/components/schemas/User'
 *        404:
 *           description: User not found
 *           content:
 *                application/json:
 *                    errorMessage:
 *                      type: string
 */
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  userModel.findUserById(userId).then((user) => {
    if (!user) {
      res.status(404).json({ errorMessage: "User not found" });
    } else {
      res.status(200).json(user);
    }
  });
};


const defaultProfilePicture = 'https://picsum.photos/id/237/200/200';

/**
 * @swagger
 * /api/users/{id}:
 *  post:
 *    description: Create user
 *    parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *    requestBody:
 *        required: true
 *        content: 
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User' 
 *    responses:
 *        201:
 *           description: success message
 *           content:
 *                application/json:
 *                    successMessage:
 *                      type: string
 */
exports.createUser = (req, res, next) => {
  const data = req.body;
  const userId = req.params.userId;
  userModel.postUser({ ...data, imageUrl: defaultProfilePicture }, userId).then(response => {
    if (!response) {
      res.status(500).json({ errorMessage: "User not created" });
    } else {
      res.status(201).json({ successMessage: "User created" });
    }
  });
};
