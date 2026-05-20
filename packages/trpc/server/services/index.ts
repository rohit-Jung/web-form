import AuthService from "@workspace/services/auth"
import FieldService from "@workspace/services/field"
import FormService from "@workspace/services/form"
import SubmissionService from "@workspace/services/submission"
import UserService from "@workspace/services/user"

export const authService = new AuthService()
export const fieldService = new FieldService()
export const formService = new FormService()
export const submissionService = new SubmissionService()
export const userService = new UserService()
