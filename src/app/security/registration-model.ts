import { selectedSecurityQuestionsModel } from "./security-questions-model";

//Create and export the user model
//This registration Model is being exported so that it can be used in the .ts file. It MUST be an array. It is also using the selectedSecurityQuestionsModel from the security-questions-model.ts file as an interface for the selectedSecurityQuestions
export interface RegistrationModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  selectedSecurityQuestions?: selectedSecurityQuestionsModel[];
}

export interface UserViewModel {
  password: string
  selectedSecurityQuestions: selectedSecurityQuestionsModel[]
}