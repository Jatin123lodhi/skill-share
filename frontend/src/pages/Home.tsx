import CourseListing from "../components/CourseLisiting"

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <p>Welcome to SkillShare</p>

      <CourseListing/>
    </div>
  )
}

export default Home

