import { Routes, Route, Navigate } from 'react-router-dom'
import { SelectBasketPage, BuildBasketPage, DeliveryPage, ReviewPage, SuccessPage } from '../pages'
import routePaths from './routePaths'

function AppRoutes() {
  return (
    <Routes>
      <Route path={routePaths.selectBasket} element={<SelectBasketPage />} />
      <Route path={routePaths.buildBasket} element={<BuildBasketPage />} />
      <Route path={routePaths.delivery} element={<DeliveryPage />} />
      <Route path={routePaths.review} element={<ReviewPage />} />
      <Route path={routePaths.success} element={<SuccessPage />} />
      <Route path="*" element={<Navigate to={routePaths.selectBasket} replace />} />
    </Routes>
  )
}

export default AppRoutes