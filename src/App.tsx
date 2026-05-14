/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Wallet, 
  Settings, 
  Box, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
    const data = [];
    let prev = 40;
    for (let i = 0; i < 20; i++) {
        prev = prev + (Math.random() - 0.5) * 20;
        if (prev < 10) prev = 10;
        if (prev > 90) prev = 90;
        data.push({
            time: `${i}s`,
            cpu: prev,
            network: (prev * 0.8) + (Math.random() * 10)
        });
    }
    return data;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(generateData());

  useEffect(() => {
      const interval = setInterval(() => {
          setData(current => {
              const newArr = [...current.slice(1)];
              const last = current[current.length - 1];
              let nextCpu = last.cpu + (Math.random() - 0.5) * 20;
              if(nextCpu < 10) nextCpu = 10;
              if(nextCpu > 90) nextCpu = 90;

              newArr.push({
                  time: `${new Date().getSeconds()}s`,
                  cpu: nextCpu,
                  network: (nextCpu * 0.8) + (Math.random() * 10)
              });
              return newArr;
          });
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans border-8 border-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-6 gap-4">
        <div className="pb-4 border-b border-slate-200 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold font-mono">
            LB
          </div>
          <span className="font-bold tracking-tight text-slate-900">LIGHTBRINGER</span>
        </div>
        
        <nav className="flex-1 space-y-4 mt-4">
          <NavItem icon={<Activity size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Box size={18} />} label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <NavItem icon={<Network size={18} />} label="Network" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
          <NavItem icon={<HardDrive size={18} />} label="Storage" active={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
          <NavItem icon={<Wallet size={18} />} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
        </nav>
        
        <div className="pt-4 border-t border-slate-200 mt-auto">
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
             <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span>Node Active</span>
             </div>
             <p className="text-[10px] text-slate-400 mt-2">Connected to global network</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            <span>Reputation: <span className="text-emerald-600 font-medium">99.8%</span></span>
            <span>Uptime: 24d 14h 32m</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 border border-slate-300">
               N
            </div>
          </div>
        </header>

        <div className="p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'overview' && (
            <>
              {/* Telemetry Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard 
                  title="CPU Usage" 
                  value={`${data[data.length - 1]?.cpu.toFixed(1)}%`} 
                  icon={<Cpu className="text-indigo-600" size={20} />} 
                  subtitle="WASM Sandbox Active"
                />
                <MetricCard 
                  title="Network I/O" 
                  value="1.2 Gbps" 
                  icon={<Network className="text-indigo-600" size={20} />} 
                  subtitle="Libp2p QUIC"
                />
                <MetricCard 
                  title="Storage Consumed" 
                  value="124 GB" 
                  icon={<HardDrive className="text-indigo-600" size={20} />} 
                  subtitle="IPFS Chunk Storage"
                />
                <MetricCard 
                  title="Earnings (24h)" 
                  value="14.50 LBGO" 
                  icon={<Wallet className="text-emerald-600" size={20} />} 
                  subtitle="Proof-of-Contribution"
                />
              </div>

              {/* Charts */}
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>Real-time compute and network allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                            itemStyle={{ color: '#0f172a' }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                        <Area type="monotone" dataKey="network" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNetwork)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Active Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                 <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Active Task Queue</CardTitle>
                        <CardDescription>Currently executing distributed workloads</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <TaskRow 
                                id="0x4a9...2bc" 
                                type="AI Inference" 
                                framework="ONNX Runtime"
                                status="Running"
                                progress={68}
                            />
                            <TaskRow 
                                id="0x11f...90e" 
                                type="Video Transcoding" 
                                framework="WASM Sandbox"
                                status="Running"
                                progress={32}
                            />
                            <TaskRow 
                                id="0x8ce...1f2" 
                                type="Data Verification" 
                                framework="Libp2p DHT"
                                status="Completed"
                                progress={100}
                            />
                        </div>
                    </CardContent>
                 </Card>
                 <div className="space-y-8">
                   <div className="bg-indigo-900 rounded-2xl p-6 text-white h-48 relative overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">System Status</span>
                        <h2 className="text-3xl font-bold mt-1 tracking-tight">Optimal</h2>
                        <p className="text-indigo-200 text-sm mt-4 leading-relaxed">Hardware isolated WASM boundaries enforced. Ready for arbitrary workloads.</p>
                      </div>
                      <div className="absolute -right-12 -bottom-12 w-48 h-48 border-[20px] border-white/5 rounded-full"></div>
                   </div>

                   <Card className="rounded-2xl border border-slate-200 shadow-sm">
                      <CardHeader>
                          <CardTitle>Node Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                          <div className="flex justify-between items-center pb-2">
                              <span className="text-slate-500 font-medium">Client</span>
                              <span className="font-mono text-slate-900 border border-slate-200 px-2 py-1 rounded-md text-xs bg-slate-50">LBGO-Rust-v1.0.4</span>
                          </div>
                          <div className="flex justify-between items-center pb-2">
                              <span className="text-slate-500 font-medium">Scheduler</span>
                              <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded">User Idle Mode</span>
                          </div>
                          <div className="flex justify-between items-center pb-2">
                              <span className="text-slate-500 font-medium">Hardware</span>
                              <span className="font-mono text-slate-900">M2, 16GB, 1TB</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Security</span>
                              <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded">Secure Enclave</span>
                          </div>
                      </CardContent>
                   </Card>
                 </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
             <div className="flex items-center justify-center h-64 text-slate-500">
                <p className="text-lg">Module "{activeTab}" is running in background processing mode.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 text-sm font-medium transition-colors ${
        active 
          ? 'text-indigo-600' 
          : 'text-slate-400 hover:text-indigo-600'
      }`}
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${active ? 'bg-indigo-100 text-indigo-600' : 'border border-slate-200'}`}>
        {icon}
      </div>
      <span className={active ? 'font-bold' : ''}>{label}</span>
    </button>
  );
}

function MetricCard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
        <div className="flex justify-between items-start">
            <div className="font-bold text-xs text-slate-500 uppercase tracking-widest">{title}</div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">{icon}</div>
        </div>
        <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskRow({ id, type, framework, status, progress }: { id: string, type: string, framework: string, status: string, progress: number }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 shadow-sm gap-4">
            <div className="flex flex-col w-full md:w-1/3">
                <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{id}</div>
                <div>
                    <div className="font-bold text-sm text-slate-900">{type}</div>
                    <div className="text-xs font-semibold text-slate-500">{framework}</div>
                </div>
            </div>
            
            <div className="flex-1 w-full flex flex-col justify-center">
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{status === 'Completed' ? 'Done' : 'Processing'}</span>
                    <span>{progress}%</span>
                </div>
            </div>
            
            <div className="md:w-24 text-right flex justify-end">
                {status === 'Completed' ? (
                    <span className="flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                        <CheckCircle2 size={12} className="mr-1" />
                        Done
                    </span>
                ) : (
                    <span className="flex items-center text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">
                        <Clock size={12} className="mr-1" />
                        {status}
                    </span>
                )}
            </div>
        </div>
    )
}
