import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  )
}

export default NotFound

