import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseReview from './pages/CourseReview'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/:courseId/reviews" element={<CourseReview/>}/>


      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;