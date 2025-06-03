import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { ExportAssets } from '../assets/ExportAssets';

function Home() {
  return (
    <div  className=' flex flex-col items-center justify-center min-h-screen  bg-center bg-cover' style={{backgroundImage: `url(${ExportAssets.bg_img})`}} >
      <NavBar />
      <Header />
    </div>
  )
}

export default Home;