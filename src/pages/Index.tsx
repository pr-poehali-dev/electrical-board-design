import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Device {
  id: string;
  name: string;
  type: 'breaker' | 'rcd' | 'relay' | 'contactor' | 'meter';
  modules: number;
  current?: number;
  voltage?: number;
  icon: string;
}

interface PlacedDevice extends Device {
  position: number;
}

const DEVICE_LIBRARY: Device[] = [
  { id: 'br-16', name: 'Автомат C16', type: 'breaker', modules: 1, current: 16, voltage: 230, icon: 'Zap' },
  { id: 'br-25', name: 'Автомат C25', type: 'breaker', modules: 1, current: 25, voltage: 230, icon: 'Zap' },
  { id: 'br-32', name: 'Автомат C32', type: 'breaker', modules: 2, current: 32, voltage: 230, icon: 'Zap' },
  { id: 'br-40', name: 'Автомат C40', type: 'breaker', modules: 2, current: 40, voltage: 230, icon: 'Zap' },
  { id: 'rcd-25', name: 'УЗО 25А 30мА', type: 'rcd', modules: 2, current: 25, voltage: 230, icon: 'Shield' },
  { id: 'rcd-40', name: 'УЗО 40А 30мА', type: 'rcd', modules: 2, current: 40, voltage: 230, icon: 'Shield' },
  { id: 'relay-16', name: 'Реле напряжения', type: 'relay', modules: 2, voltage: 230, icon: 'Activity' },
  { id: 'cont-25', name: 'Контактор 25А', type: 'contactor', modules: 2, current: 25, icon: 'Power' },
  { id: 'meter-1', name: 'Электросчётчик', type: 'meter', modules: 6, voltage: 230, icon: 'Gauge' },
];

const Index = () => {
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<PlacedDevice | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const addDevice = (device: Device) => {
    const lastPosition = placedDevices.length > 0 
      ? Math.max(...placedDevices.map(d => d.position + d.modules))
      : 0;
    
    const newDevice: PlacedDevice = {
      ...device,
      id: `${device.id}-${Date.now()}`,
      position: lastPosition,
    };
    
    setPlacedDevices([...placedDevices, newDevice]);
  };

  const removeDevice = (id: string) => {
    setPlacedDevices(placedDevices.filter(d => d.id !== id));
    if (selectedDevice?.id === id) setSelectedDevice(null);
  };

  const totalModules = placedDevices.reduce((sum, d) => sum + d.modules, 0);
  const totalLoad = placedDevices.reduce((sum, d) => sum + (d.current || 0), 0);

  const getDeviceColor = (type: string) => {
    switch (type) {
      case 'breaker': return 'bg-blue-500';
      case 'rcd': return 'bg-green-500';
      case 'relay': return 'bg-yellow-500';
      case 'contactor': return 'bg-purple-500';
      case 'meter': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <Icon name="Boxes" className="text-primary" size={24} />
          <h1 className="text-xl font-semibold">ElectroPanel Designer</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Icon name="FolderOpen" size={16} className="mr-2" />
            Открыть
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
          <Button size="sm">
            <Icon name="FileDown" size={16} className="mr-2" />
            Экспорт
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon name="PackagePlus" size={18} />
              Библиотека устройств
            </h2>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <Tabs defaultValue="all">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="all" className="flex-1">Все</TabsTrigger>
                <TabsTrigger value="protection" className="flex-1">Защита</TabsTrigger>
                <TabsTrigger value="control" className="flex-1">Управление</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-2">
                {DEVICE_LIBRARY.map((device) => (
                  <Card
                    key={device.id}
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addDevice(device)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${getDeviceColor(device.type)}`}>
                          <Icon name={device.icon as any} size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{device.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {device.modules} мод.
                            </Badge>
                            {device.current && (
                              <Badge variant="outline" className="text-xs">
                                {device.current}A
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Icon name="Plus" size={16} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="protection" className="space-y-2">
                {DEVICE_LIBRARY.filter(d => d.type === 'breaker' || d.type === 'rcd').map((device) => (
                  <Card
                    key={device.id}
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addDevice(device)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${getDeviceColor(device.type)}`}>
                          <Icon name={device.icon as any} size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{device.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {device.modules} мод.
                            </Badge>
                            {device.current && (
                              <Badge variant="outline" className="text-xs">
                                {device.current}A
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Icon name="Plus" size={16} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="control" className="space-y-2">
                {DEVICE_LIBRARY.filter(d => d.type === 'relay' || d.type === 'contactor' || d.type === 'meter').map((device) => (
                  <Card
                    key={device.id}
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addDevice(device)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${getDeviceColor(device.type)}`}>
                          <Icon name={device.icon as any} size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{device.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {device.modules} мод.
                            </Badge>
                            {device.current && (
                              <Badge variant="outline" className="text-xs">
                                {device.current}A
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Icon name="Plus" size={16} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
            <div className="flex items-center gap-4">
              <Button
                variant={viewMode === '2d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('2d')}
              >
                <Icon name="LayoutGrid" size={16} className="mr-2" />
                2D схема
              </Button>
              <Button
                variant={viewMode === '3d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('3d')}
              >
                <Icon name="Box" size={16} className="mr-2" />
                3D вид
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Grid3x3" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Модулей:</span>
                <span className="font-semibold">{totalModules}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Нагрузка:</span>
                <span className="font-semibold">{totalLoad}A</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {viewMode === '2d' ? (
              <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon name="PanelTop" size={18} />
                      Конфигурация щита
                    </h3>
                    {placedDevices.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPlacedDevices([])}
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Очистить
                      </Button>
                    )}
                  </div>
                  
                  {placedDevices.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                      <Icon name="MousePointerClick" size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Выберите устройства из библиотеки</p>
                      <p className="text-sm mt-2">Кликните на устройство слева, чтобы добавить его в щит</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {placedDevices.map((device, index) => (
                        <div
                          key={device.id}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedDevice?.id === device.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedDevice(device)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                                #{index + 1}
                              </div>
                              <div className={`w-12 h-12 rounded flex items-center justify-center ${getDeviceColor(device.type)}`}>
                                <Icon name={device.icon as any} size={24} className="text-white" />
                              </div>
                              <div>
                                <p className="font-medium">{device.name}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    Позиция: {device.position + 1}-{device.position + device.modules}
                                  </Badge>
                                  {device.current && (
                                    <Badge variant="outline" className="text-xs">
                                      {device.current}A
                                    </Badge>
                                  )}
                                  {device.voltage && (
                                    <Badge variant="outline" className="text-xs">
                                      {device.voltage}V
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDevice(device.id);
                              }}
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card className="w-full max-w-3xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-muted to-background rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-border">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}></div>
                    
                    {placedDevices.length === 0 ? (
                      <div className="text-center relative z-10">
                        <Icon name="Box" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-lg text-muted-foreground">Добавьте устройства для просмотра 3D</p>
                      </div>
                    ) : (
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-border" style={{
                          transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
                        }}>
                          <div className="flex gap-1">
                            {placedDevices.map((device) => (
                              <div
                                key={device.id}
                                className={`${getDeviceColor(device.type)} rounded shadow-lg transition-all hover:scale-105`}
                                style={{
                                  width: `${device.modules * 18}px`,
                                  height: '120px',
                                  transform: 'perspective(500px) rotateY(0deg)',
                                }}
                                title={device.name}
                              >
                                <div className="h-full flex flex-col items-center justify-center text-white p-2">
                                  <Icon name={device.icon as any} size={20} />
                                  <div className="text-[10px] mt-1 text-center leading-tight opacity-90">
                                    {device.current ? `${device.current}A` : '—'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground text-center">
                            DIN-рейка • {totalModules} модулей
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>

        <aside className="w-80 border-l border-border bg-card p-4">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Icon name="Info" size={18} />
            Спецификация проекта
          </h2>
          
          <Card className="p-4 mb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Всего устройств</span>
                <span className="font-semibold">{placedDevices.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Занято модулей</span>
                <span className="font-semibold">{totalModules}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Суммарная нагрузка</span>
                <span className="font-semibold">{totalLoad}A</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Рекомендуемый щит</span>
                <span className="font-semibold text-primary">
                  {totalModules <= 12 ? '12' : totalModules <= 24 ? '24' : '36'} мод.
                </span>
              </div>
            </div>
          </Card>

          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Icon name="ClipboardList" size={16} />
            Список материалов
          </h3>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            {placedDevices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Icon name="PackageOpen" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Список пуст</p>
              </div>
            ) : (
              <div className="space-y-2">
                {placedDevices.map((device, index) => (
                  <Card key={device.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground font-mono mt-0.5">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">{device.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {device.modules} мод. • {device.current && `${device.current}A • `}
                          {device.voltage}V
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
};

export default Index;
