import Link from 'next/link'
 
function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">About</Link>
      </li>
      <li>
        <Link href="/contacts">Contacts</Link>
      </li>
      <li>
        <Link href="/articles">Articles</Link>
      </li>
    </ul>
  )
}
 
export default Home