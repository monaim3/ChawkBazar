import Widgets from './widgets'
import Copyright from './copyright'
import { footer } from './data'
const { widgets, payment } = footer
import footerBg from "@public/assets/images/banner/footer-bg.jpg";

const Footer: React.FC = () => (
  <div className="bg-gray-100" style={{ backgroundImage: `url(${footerBg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <footer className='border-b-4 border-heading    pt-2.5 lg:pt-0 2xl:pt-2 text-white'>
      <Widgets />
      <Copyright payment={payment} />
    </footer>
  </div>
)

export default Footer
