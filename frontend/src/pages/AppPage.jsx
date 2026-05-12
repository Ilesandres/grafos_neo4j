import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import GraphView from '../components/Views/GraphView'
import TableView from '../components/Views/TableView'
import DashboardView from '../components/Views/DashboardView'

export default function AppPage() {
  return (
    <Layout>
      <Routes>
        <Route index element={<DashboardView />} />
        <Route path="graph" element={<GraphView />} />
        <Route path="table" element={<TableView />} />
      </Routes>
    </Layout>
  )
}
