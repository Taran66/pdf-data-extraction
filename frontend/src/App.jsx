import './App.css'
import MessageBar from './assets/components/MessageBar'
import Navbar from './assets/components/Navbar'

function App() {


  return (
    <div className='flex flex-col h-screen justify-between py-5'>
      <Navbar />
      <MessageBar />
    </div>
  )
}

export default App
