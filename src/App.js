import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";

//Layouts
import RootLayout from "./layouts/RootLayout";
import TaskLayout from "./layouts/TaskLayout";
import SigninLayout from "./layouts/SigninLayout";

//pages
import NotFound from "./pages/NotFound";
import CreateTodo from "./pages/CreateTodo";
import Home from "./pages/Home";
import Registor from "./pages/signing/Registor";
import Signin from "./pages/signing/Signin";
import Self from "./pages/tasks/Self";
import Team from "./pages/tasks/Team";
import Complete from "./pages/tasks/Complete";
import TaskDetails, { taskDetailLoader } from "./pages/tasks/TaskDetails";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(<>
      <Route path="/account" element={<SigninLayout />}>
        <Route path="sign-in" element={<Signin/>}/>
        <Route path="reg" element={<Registor />} />
      </Route>
      <Route path="/" element={<RootLayout/>}>
        <Route index element={<Home/>}/>
        <Route path=":id" element={<TaskDetails/>} loader={taskDetailLoader} />
        <Route path="tasks" element={<TaskLayout/>}>
          <Route path="self" element={<Self/>}/>
          <Route path="team" element={<Team/>}/>
          <Route path="complete" element={<Complete/>}/>
          <Route path=":id" element={<TaskDetails/>} loader={taskDetailLoader} />
        </Route>
        <Route path="create" element={<CreateTodo/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
      </>
    )
  )
  return (
    < RouterProvider router={router} />
  );
}

export default App;
