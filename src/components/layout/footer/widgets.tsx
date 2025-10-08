// import Container from '@components/ui/container'
// import WidgetLink from '@components/widgets/widget-link'
// import cn from 'classnames'

// interface WidgetsProps {
//   widgets: {
//     id: number
//     widgetTitle?: string
//     lists: any
//     isCompanyIntroduction?: boolean
//     logo?: any
//   }[]

//   variant?: 'contemporary'
// }

// const Widgets: React.FC<WidgetsProps> = ({ widgets, variant }) => {
//   return (
//     <Container>
//       <div
//         className={cn(
//           'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-9 xl:gap-5  pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24 lg:mb-0.5 2xl:mb-0 3xl:-mb-1',
//           {
//             'xl:grid-cols-4': variant !== 'contemporary',
//             'xl:grid-cols-5': variant === 'contemporary',
//           }
//         )}
//       >
//         {widgets?.map((widget) => (
//           <WidgetLink
//             key={`footer-widget--key${widget.id}`}
//             data={widget}
//             className='pb-3 md:pb-0'
//             variant='contemporary'
//           />
//         ))}
//       </div>
//     </Container>
//   )
// }

// export default Widgets

"use client";

import Loading from "@components/common/Loading";
import { useFooter } from "@framework/footer-address";

const Widgets = () => {
  const { data, isLoading } = useFooter();
  if (isLoading) return <Loading />
  return (
    <div className=" text-white container mx-auto px-4 lg:px-0  py-4">
      <div className="container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Column 1 - Social */}
        <div>
          <h3 className="font-bold mb-4">Social</h3>
          <ul className="space-y-2">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Youtube</a></li>
          </ul>
        </div>

        {/* Column 2 - Contact */}
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>yourexample@email.com</li>
            <li>example@email.com</li>
            <li>Call us: +1 254 568-5479</li>
          </ul>
        </div>

        {/* Column 3 - About */}
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li><a href="#">Support Center</a></li>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Copyright</a></li>
          </ul>
        </div>

        {/* Column 4 - From API */}
        {/* Column 4 - From API */}
        <div>
          <h3 className="font-bold mb-4">Contact Info</h3>
          <ul className="space-y-2">
            <li>{data?.name}</li>
            <li>{data?.email}</li>
            <li>{data?.phone}</li>
            <li>{data?.address}</li>
          </ul>
        </div>


      </div>
    </div>
  );
}

export default Widgets;