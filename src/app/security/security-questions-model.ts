/**
 * Author: Evelyn Zepeda
 * Date: 7/10/24
 * Title: security-questions-model.ts
 * Description: Security Questions Interface
 */

//Interfaces are created for type checking
//When someone tries to log in for example they have to log in and use a username and password
export interface selectedSecurityQuestionsModel {
  question: string;
  answer: string;
}