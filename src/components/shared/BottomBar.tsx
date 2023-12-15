//constants
import { sidebarLinks } from "@/constants"
//custom types
import { INavLink } from "@/types"
//react-router
import { Link,useLocation } from "react-router-dom"


const BottomBar = () => {
  const {pathname} = useLocation()
  return (
    <section className='bottom-bar'>

          {
            sidebarLinks.map((link:INavLink) => {
              const isActive = pathname === link.route
              return (
                <li key={link.label} >
                  <Link  to={link.route} className={` flex flex-center flex-col p-2 gap-1 rounded-[10px] transition  ${isActive && 'bg-primary-500 '}  `} >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`group-hover:invert-white ${isActive&& 'invert-white'}`}
                      width={16}
                      height={16}
                      />
                    <p className="tiny-medium text-light-2">{link.label}</p>
                  </Link>
              </li>
            )}
            )
          }

    </section>
  )
}

export default BottomBar
