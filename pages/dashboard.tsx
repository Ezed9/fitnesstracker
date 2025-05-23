import { Dashboard as DashboardComponent } from '@/components/dashboard'
import AuthWrapper from '@/components/AuthWrapper'

export default function Dashboard() {
  return (
    <AuthWrapper>
      <DashboardComponent />
    </AuthWrapper>
  )
}
