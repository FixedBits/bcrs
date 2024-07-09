/**
 * Author: Evelyn Zepeda
 * Date: 7/8/24
 * Title: register-route.js
 * Description: The register API for BCRS
 */

//Define a registerSchema
const registerSchema = {
  type: 'object',
  properties: {
    email: {type: 'string'},
    password: {type: 'string'},
    firstName: {type: 'string'},
    lastName: { type: 'string'},
    selectedSecurityQuestions: securityQuestionsSchema
  },
  required: ['email', 'password', 'firstName', 'lastName'],
  additionalProperties: false
}