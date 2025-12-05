import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Settings, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { RMTank, FPTank, TankStatus } from '@/types/production';

interface TankDiagramProps {
  tanks: (RMTank | FPTank)[];
  title: string;
  onTankClick?: (tank: RMTank | FPTank) => void;
  onTankView?: (tank: RMTank | FPTank) => void;
  onTankSettings?: (tank: RMTank | FPTank) => void;
  onDeleteTank?: (tank: RMTank | FPTank) => void;
  onAddTank?: () => void;
  showAddButton?: boolean;
}

const TankDiagram: React.FC<TankDiagramProps> = ({
  tanks,
  title,
  onTankClick,
  onTankView,
  onTankSettings,
  onDeleteTank,
  onAddTank,
  showAddButton = false
}) => {
  const getTankColor = (status: TankStatus): string => {
    switch (status) {
      case TankStatus.ACTIVE:
        return 'bg-blue-500';
      case TankStatus.INACTIVE:
        return 'bg-gray-400';
      case TankStatus.MAINTENANCE:
        return 'bg-orange-500';
      case TankStatus.CLEANING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getFillPercentage = (tank: RMTank | FPTank): number => {
    return tank.maxCapacity > 0 ? (tank.currentWeight / tank.maxCapacity) * 100 : 0;
  };

  const getFillHeight = (tank: RMTank | FPTank): string => {
    const percentage = getFillPercentage(tank);
    return `${Math.max(5, Math.min(95, percentage))}%`; // Clamp between 5% and 95%
  };

  const getFillColor = (percentage: number): string => {
    if (percentage < 20) return 'bg-red-500';
    if (percentage < 40) return 'bg-orange-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: TankStatus): string => {
    switch (status) {
      case TankStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case TankStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case TankStatus.MAINTENANCE:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case TankStatus.CLEANING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatNumberWithPeriods = (num: number | string): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatWeight = (weight: number): string => {
    // Convert to metric tons (MT)
    const metricTons = weight / 1000;
    return `${formatNumberWithPeriods(metricTons.toFixed(3))} MT`;
  };

  const TankVisual: React.FC<{ tank: RMTank | FPTank }> = ({ tank }) => {
    const fillPercentage = getFillPercentage(tank);
    const fillHeight = getFillHeight(tank);
    const fillColor = getFillColor(fillPercentage);

    return (
      <div
        className="relative cursor-pointer group flex flex-col items-center p-4 m-2 bg-gray-50/30 rounded-xl hover:bg-gray-50/50 transition-colors"
        onClick={() => onTankClick?.(tank)}
      >
        {/* Tank Container */}
        <div className="relative w-28 h-44 bg-gray-200 rounded-t-2xl rounded-b-lg border-4 border-gray-300 shadow-lg overflow-hidden mb-3 sm:w-32 sm:h-48">
          {/* Tank Fill */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${fillColor} transition-all duration-300 ease-in-out`}
            style={{ height: fillHeight }}
          >
            {/* Fill Animation Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Tank Indicator Lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 right-0 border-t border-gray-400/30"></div>
            <div className="absolute top-1/2 left-0 right-0 border-t border-gray-400/30"></div>
            <div className="absolute top-3/4 left-0 right-0 border-t border-gray-400/30"></div>
          </div>

          {/* Tank Label */}
          <div className="absolute top-2 left-0 right-0 text-center">
            <div className="text-xs font-bold text-gray-800 bg-white/90 px-1 py-0.5 rounded">
              {tank.tankCode}
            </div>
          </div>

          {/* Capacity Label */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <div className="text-xs font-medium text-gray-800 bg-white/90 px-1 py-0.5 rounded">
              {formatWeight(tank.currentWeight)} / {formatWeight(tank.maxCapacity)}
            </div>
          </div>

          {/* Warning Indicator */}
          {fillPercentage < 20 && (
            <div className="absolute top-8 right-2">
              <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
            </div>
          )}
        </div>

        {/* Tank Info Card */}
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md group-hover:shadow-lg transition-shadow w-56 sm:w-60 md:w-64 lg:w-68 max-w-full">
          {/* Header with Status and Percentage */}
          <div className="flex items-center justify-between mb-3">
            <Badge className={getStatusColor(tank.status)} variant="secondary">
              {tank.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {fillPercentage.toFixed(1)}%
            </div>
          </div>

          {/* Tank Code and Name */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Tank</div>
            <h4 className="text-base font-bold text-gray-900 truncate">
              {tank.tankCode}
            </h4>
            <p className="text-sm text-gray-600 font-medium truncate">
              {tank.name}
            </p>
          </div>

          {/* Capacity Info */}
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Capacity</div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900 truncate">
                {formatWeight(tank.currentWeight)}
              </span>
              <span className="text-gray-600">/ {formatWeight(tank.maxCapacity)}</span>
            </div>
          </div>

          {/* Product Type */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Product</div>
            <div className="text-sm font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded truncate">
              {tank.productType}
            </div>
          </div>

          {/* Supplier Composition for RM Tanks */}
          {tank.activeSuppliers && tank.activeSuppliers.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2">Suppliers</div>
              <div className="space-y-1">
                {tank.activeSuppliers.slice(0, 2).map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                      {supplier.supplierName}
                    </span>
                    <Badge variant="outline" className="text-xs px-2 py-0 whitespace-nowrap">
                      {supplier.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
                {tank.activeSuppliers.length > 2 && (
                  <div className="text-xs text-gray-500 italic">
                    +{tank.activeSuppliers.length - 2} more suppliers
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quality Metrics */}
          {tank.qualityMetrics && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Quality Metrics</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-orange-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">FFA</div>
                  <div className="text-sm font-bold text-orange-700">
                    {tank.qualityMetrics.ffa.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">Moisture</div>
                  <div className="text-sm font-bold text-blue-700">
                    {tank.qualityMetrics.moisture.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
<div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
  <Button
    size="sm"
    variant="outline"
    className="h-8 text-xs" // Removed flex-1
    onClick={(e) => {
      e.stopPropagation();
      onTankView?.(tank);
    }}
  >
    <Eye className="w-3 h-3 mr-1" />
    View
  </Button>
  <Button
    size="sm"
    variant="outline"
    className="h-8 text-xs" // Removed flex-1
    onClick={(e) => {
      e.stopPropagation();
      onTankSettings?.(tank);
    }}
  >
    <Settings className="w-3 h-3 mr-1" />
    Details
  </Button>
  {onDeleteTank && (
    <Button
      size="sm"
      variant="outline"
      className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" // Removed flex-1 and added red text color
      onClick={(e) => {
        e.stopPropagation();
        onDeleteTank(tank);
      }}
    >
      <Trash2 className="w-3 h-3 mr-1" />
      Delete
    </Button>
  )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {showAddButton && (
              <Button onClick={onAddTank} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Tank
              </Button>
            )}
            <Badge variant="outline">
              {tanks.length} {tanks.length === 1 ? 'Tank' : 'Tanks'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16 justify-items-center">
          {tanks.map((tank) => (
            <TankVisual key={tank.id} tank={tank} />
          ))}
        </div>

        {tanks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No tanks available</div>
            <div className="text-sm">
              {title === 'Raw Material Tanks'
                ? 'Add RM tanks to start tracking raw material inventory'
                : 'Add FP tanks to start tracking finished products'
              }
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Tank Fill Levels:</div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Low (0-20%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Medium (20-40%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Good (40-70%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Optimal (70-100%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TankDiagram;