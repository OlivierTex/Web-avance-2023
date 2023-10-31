import Layout from '../components/layout'


export default function About() {
    return (
      <Layout>
      <h1 className="text-3xl text-center mt-8">About</h1>
      {
        <div className="text-lg text-center text-gray-700 mt-4">Cette application est écrite dans le cadre du cours de Tech Web de l'ECE Paris par Greg, Olivier et Marc</div>
      }
    </Layout>
    )
  }