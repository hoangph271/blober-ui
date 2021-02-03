import { Redirect } from "react-router-dom";
import { LoginForm } from "../components";
import { useAuth } from "../hooks";

export const Login = () => {
  const { isAuthed } = useAuth()

  return isAuthed ? (
    <Redirect to="albums" />
  ) : (
    <LoginForm />
  )
};
