import React from 'react';
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Activity,
  CheckCircle,
  Plus,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockDashboardStats, mockSuppliers } from '@/data/mockData';

const StatCard = ({ title, value, change, changeType, icon, color }: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, icon, color, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group" onClick={onClick}>
    <CardContent className="p-6">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity }: { activity: any }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'delivery': return <Package className="w-4 h-4" />;
      case 'registration': return <Plus className="w-4 h-4" />;
      case 'contract': return <CheckCircle className="w-4 h-4" />;
      case 'quality_check': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (activity.type) {
      case 'delivery': return 'bg-green-500';
      case 'registration': return 'bg-blue-500';
      case 'contract': return 'bg-purple-500';
      case 'quality_check': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className={`w-8 h-8 rounded-full ${getColor()} flex items-center justify-center text-white flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-500">{activity.entityName}</p>
          <span className="text-gray-300">•</span>
          <p className="text-xs text-gray-500">
            {new Date(activity.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  const statCards = [
    {
      title: 'Total Suppliers',
      value: stats.totalSuppliers.toLocaleString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Total Farmers',
      value: stats.totalFarmers.toLocaleString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Active Suppliers',
      value: stats.activeSuppliers.toLocaleString(),
      change: '+5%',
      changeType: 'increase' as const,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-100'
    },
    {
      title: 'Total Volume (tons)',
      value: (stats.totalVolume / 1000).toFixed(1) + 'K',
      change: '+15%',
      changeType: 'increase' as const,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Average Quality',
      value: stats.averageQuality + '%',
      change: '+2%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Pending Registrations',
      value: stats.pendingRegistrations.toString(),
      change: '-3%',
      changeType: 'decrease' as const,
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Supplier',
      description: 'Register a new supplier or farmer',
      icon: <Plus className="w-6 h-6 text-primary-600" />,
      color: 'bg-primary-100',
      onClick: () => console.log('Add supplier')
    },
    {
      title: 'Track Delivery',
      description: 'Record new feedstock delivery',
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
      onClick: () => console.log('Track delivery')
    },
    {
      title: 'Quality Check',
      description: 'Perform quality inspection',
      icon: <Eye className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
      onClick: () => console.log('Quality check')
    },
    {
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: <Download className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100',
      onClick: () => console.log('Generate report')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Supplier & Farmer Management Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from supplier and farmer operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Suppliers</CardTitle>
          <CardDescription>Latest registered suppliers and farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Volume</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Quality</th>
                </tr>
              </thead>
              <tbody>
                {mockSuppliers.slice(0, 5).map((supplier) => (
                  <tr key={supplier.id} className="border-b">
                    <td className="py-2 px-4 font-medium">{supplier.name}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.type === 'supplier'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {supplier.type}
                      </span>
                    </td>
                    <td className="py-2 px-4">{supplier.location.region}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{(supplier.totalVolume / 1000).toFixed(1)}K</td>
                    <td className="py-2 px-4">{supplier.averageQuality}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};