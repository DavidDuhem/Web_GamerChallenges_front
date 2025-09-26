import { Route, Routes } from "react-router"
import Layout from "./components/Layout"
import CGU from "./pages/CGU"
import NotFoundPage from "./pages/notFoundPage"
import { LandingPage } from "./pages/landingPage"
import { ChallengesPage } from "./pages/challengesPage"
import { useFetchCurrentUser } from "./hooks/useFetchCurrentUser"

function App() {
  useFetchCurrentUser()
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/CGU" element={<CGU />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:challengeId" element={<p>Challenge</p>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
