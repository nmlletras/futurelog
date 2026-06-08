import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Activity, CheckCircle, XCircle, Clock, Database, Terminal, Play, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Helmet } from 'react-helmet-async';

interface Incident {
  id: number;
  date: string;
  status: string;
  title: string;
  description: string;
}

interface ApiStatusData {
  uptimeSeconds: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastError: string | null;
  status: string;
  incidents: Incident[];
}

export function ApiStatus() {
  const [statusData, setStatusData] = useState<ApiStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  // Latency data for the line chart
  const [latencyData, setLatencyData] = useState<any[]>(() => {
    const data = [];
    const now = Date.now();
    // Pre-fill with recent history (30s intervals) so the chart isn't empty on load
    for (let i = 20; i > 0; i--) {
      data.push({
        time: new Date(now - i * 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ms: Math.floor(Math.random() * 15) + 15 // Mock baseline latency before load
      });
    }
    return data;
  });

  // Calculate live session reliability based on requests tracked since boot
  const sessionReliability = statusData && statusData.totalRequests > 0 
    ? ((statusData.successfulRequests / statusData.totalRequests) * 100).toFixed(2) + '%'
    : '100.00%';

  const incidents = statusData?.incidents || [];

  const fetchStatus = async () => {
    const start = performance.now();
    setLastChecked(new Date());
    try {
      const response = await fetch('/api/v1/status');
      const data = await response.json();
      const end = performance.now();
      const latency = Math.round(end - start);

      setStatusData(data);

      setLatencyData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          ms: latency
        }];
        return newData;
      });
    } catch (error) {
      console.error('Failed to fetch API status', error);
      setStatusData(prev => prev ? { ...prev, status: 'offline' } : null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusData && prevStatusRef.current !== null && prevStatusRef.current !== statusData.status) {
      if (statusData.status === 'online') {
        toast.success("API Status changed to Operational");
      } else {
        toast.error(`API Status changed to ${statusData.status}`);
      }
    }
    if (statusData) {
      prevStatusRef.current = statusData.status;
    }
  }, [statusData?.status]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Auto-update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !statusData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <Helmet>
        <title>API Status & Systems Performance - Futurelog</title>
        <meta name="description" content="Track real-time API status, live metrics, and response latency for the Futurelog open blog embed API. View historical incidents and uptime reports." />
        <meta property="og:title" content="API Status & Systems Performance - Futurelog" />
        <meta property="og:description" content="Track real-time API status, live metrics, and response latency for the Futurelog open blog embed API." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://futurelog-delta.vercel.app/api" />
      </Helmet>

      <header className="mb-12 text-center">
        <Server className="w-16 h-16 mx-auto mb-6 text-neon-blue" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-muted tracking-tight mb-4">
          API Status Overview
        </h1>
        <p className="text-text-muted text-lg mb-4">
          Real-time metrics for our open blog embed API.
        </p>
        {lastChecked && (
          <p className="text-sm font-mono text-neon-blue">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </header>

      {statusData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" aria-live="polite">
          {/* Status Card */}
          <div className="bg-bg-card border border-border-strong rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
               statusData.status === 'online' ? 'bg-emerald-500/10 border border-emerald-500/20' : 
               statusData.status === 'degraded' ? 'bg-amber-500/10 border border-amber-500/20' : 
               'bg-red-500/10 border border-red-500/20'
             }`}>
               {statusData.status === 'online' ? (
                 <Activity className="w-6 h-6 text-emerald-400" />
               ) : statusData.status === 'degraded' ? (
                 <AlertTriangle className="w-6 h-6 text-amber-400" />
               ) : (
                 <XCircle className="w-6 h-6 text-red-500" />
               )}
             </div>
             <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-1">Status</p>
             <p className={`text-2xl font-bold uppercase tracking-wide ${
               statusData.status === 'online' ? 'text-emerald-400' : 
               statusData.status === 'degraded' ? 'text-amber-400' : 
               'text-red-500'
             }`}>
               {statusData.status === 'online' ? 'Operational' : statusData.status}
             </p>
          </div>

          {/* Session Reliability Card */}
          <div className="bg-bg-card border border-border-strong rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-border-subtle border border-border-strong flex items-center justify-center mb-4">
               <ShieldCheck className="w-6 h-6 text-neon-blue" />
             </div>
             <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-1">Session Reliability</p>
             <p className="text-2xl font-bold text-text-main">
               {sessionReliability}
             </p>
          </div>

          {/* Current Uptime Card */}
          <div className="bg-bg-card border border-border-strong rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-border-subtle border border-border-strong flex items-center justify-center mb-4">
               <Clock className="w-6 h-6 text-neon-pink" />
             </div>
             <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-1">Current Uptime</p>
             <p className="text-2xl font-bold text-text-main">
               {formatUptime(statusData.uptimeSeconds)}
             </p>
          </div>

           {/* Metrics */}
          <div className="bg-bg-card border border-border-strong rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-border-subtle border border-border-strong flex items-center justify-center mb-4">
               <CheckCircle className="w-6 h-6 text-green-400" />
             </div>
             <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-1">Requests</p>
             <div className="flex gap-4">
               <p className="text-xl font-bold text-text-main" title="Success">
                 <span className="text-green-400 mr-2">✓</span>{statusData.successfulRequests}
               </p>
               <p className="text-xl font-bold text-text-main" title="Failed">
                 <span className="text-neon-pink mr-2">✗</span>{statusData.failedRequests}
               </p>
             </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-bg-card rounded-2xl border border-border-strong">
           <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
           <p className="text-text-muted">Unable to load status data.</p>
        </div>
      )}

      {/* Latency Chart */}
      <div className="mb-12 bg-bg-card border border-border-strong rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-text-main mb-6">Live Response Latency</h2>
        <div className="h-[300px] w-full min-w-[300px] mt-4" role="region" aria-label="Live response latency chart tracking milliseconds over 30 second intervals">
          <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart data={latencyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} aria-label="Latency over time">
              <defs>
                <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="time" stroke="#888" tick={{fontSize: 12}} tickMargin={10} minTickGap={20} />
              <YAxis stroke="#888" tick={{fontSize: 12}} unit="ms" tickMargin={10} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1a1f2e', borderColor: '#2d3348', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
               />
              <Area type="monotone" dataKey="ms" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMs)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident History */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-text-main mb-8 px-4 md:px-0">Incident History</h2>
        <div className="bg-bg-card border border-border-strong rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 relative">
          
          {incidents.length === 0 ? (
            <div className="text-center py-8">
               <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-text-main mb-2">No Incidents Reported</h3>
               <p className="text-text-muted">All systems have been fully operational during this session.</p>
            </div>
          ) : (
            <>
              <div className="absolute left-10 md:left-14 top-12 bottom-12 w-0.5 bg-border-strong" />
              <div className="space-y-12 relative">
                {incidents.map((incident) => (
                  <div key={incident.id} className="flex gap-6 md:gap-8">
                    <div className="mt-1 shrink-0 bg-bg-card z-10 w-8 h-8 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-main mb-1 tracking-tight">{incident.title}</h3>
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="text-text-muted">{incident.date}</span>
                        <span className="text-border-strong">•</span>
                        <span className="text-red-400 uppercase tracking-wider text-[11px] font-bold border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded">
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-text-muted leading-relaxed">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Docs Section */}
      <div className="mt-16 bg-bg-card border border-border-strong rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-pink" />
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-neon-pink" />
              <h2 className="text-3xl font-black text-text-main">
                API Endpoints
              </h2>
            </div>
            <p className="text-text-muted text-lg mb-8">
              Available standard routes you can use in your projects to fetch blog data dynamically. Try them out right here:
            </p>

            <div className="space-y-6">
              <EndpointCard 
                method="GET" 
                path="/api/v1/posts" 
                description="Fetches all posts. Optional pagination via ?page=1&limit=10"
              />
              <EndpointCard 
                method="GET" 
                path="/api/v1/posts?page=1&limit=2" 
                description="Fetches posts with pagination."
              />
              <EndpointCard 
                method="GET" 
                path="/api/v1/posts/recent" 
                description="Fetches the most recent posts. Optional ?limit=5"
              />
              <EndpointCard 
                method="GET" 
                path="/api/v1/status" 
                description="API health and monitoring metrics."
              />
            </div>
        </div>
      </div>
    </motion.div>
  );
}

function EndpointCard({ method, path, description }: { method: string, path: string, description: string }) {
  const [response, setResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<number | null>(null);

  const handleTest = async () => {
    if (testing) return;
    
    // Toggle off if already showing
    if (response) {
      setResponse(null);
      setStatus(null);
      return;
    }

    setTesting(true);
    setStatus(null);
    try {
      const start = performance.now();
      const res = await fetch(path);
      const data = await res.json();
      setStatus(res.status);
      
      const end = performance.now();
      // Add a slight artificial delay if it's too fast so the loading state is visible
      if (end - start < 300) {
        await new Promise(r => setTimeout(r, 300));
      }
      
      setResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setStatus(500);
      setResponse(JSON.stringify({ error: 'Failed to fetch', details: String(e) }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-border-subtle rounded-xl border border-border-strong overflow-hidden hover:border-text-muted transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 font-mono text-sm font-bold bg-green-500/20 text-green-400 rounded shrink-0">
            {method}
          </span>
          <code className="font-mono text-sm text-neon-blue break-words">{path}</code>
        </div>
        <div className="text-text-muted text-sm md:ml-auto">
          {description}
        </div>
        <button 
          onClick={handleTest}
          disabled={testing}
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-card hover:bg-border-strong border border-border-strong text-text-main transition-colors text-sm font-medium ml-auto md:ml-0 min-w-[100px]"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin text-neon-blue" />
          ) : (
            <>
              {response ? 'Close' : 'Test'}
              {!response && <Play className="w-3.5 h-3.5" />}
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {response && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border-strong bg-[#0d1117] overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between border-b border-border-strong/50">
              <span className="text-xs font-mono text-text-muted">Response</span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-text-muted">Status:</span>
                <span className={status === 200 ? 'text-green-400' : 'text-red-400'}>
                  {status} {status === 200 ? 'OK' : 'Error'}
                </span>
              </div>
            </div>
            <pre className="p-4 text-sm font-mono text-[13px] text-gray-300 overflow-x-auto max-h-[400px] overflow-y-auto">
              {response}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
