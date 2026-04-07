import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components'
import {
  BuildBasketPage,
  DeliveryPage,
  ReviewPage,
  SelectBasketPage,
  SuccessPage,
} from '../pages'
import routePaths from './routePaths'

const appRouteConfig = [
  { path: routePaths.selectBasket, element: <SelectBasketPage /> },
  { path: routePaths.buildBasket, element: <BuildBasketPage /> },
  { path: routePaths.delivery, element: <DeliveryPage /> },
  { path: routePaths.review, element: <ReviewPage /> },
  { path: routePaths.success, element: <SuccessPage /> },
]

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {appRouteConfig.map((routeItem) => (
          <Route
            key={routeItem.path}
            path={routeItem.path}
            element={routeItem.element}
          />
        ))}
        <Route path="*" element={<Navigate to={routePaths.selectBasket} replace />} />
      </Routes>
    </Layout>
  )
}

export default AppRoutes
