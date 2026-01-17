
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Waves, 
  MapPin, 
  ArrowDownToLine, 
  Thermometer, 
  Eye, 
  Wind, 
  User, 
  Zap, 
  Camera, 
  Facebook, 
  Instagram, 
  Star,
  Loader2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { fetchDiveData } from './services/sheetService';
import { DiveEntry } from './types';

const App: React.FC = () => {
  const [dives, setDives] = useState<DiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDiveData();
        setDives(data);
        if (data.length > 0) {
          setSelectedDate(data[0].date);
        }
      } catch (err) {
        console.error("Failed to load dive data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const uniqueDates = useMemo(() => {
    return Array.from(new Set(dives.map(d => d.date)));
  }, [dives]);

  const filteredDives = useMemo(() => {
    return dives.filter(d => d.date === selectedDate);
  }, [dives, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50/30">
        <Loader2 className="w-12 h-12 text-[#004aad] animate-spin mb-4" />
        <p className="text-[#004aad] font-black uppercase tracking-widest text-xs">Syncing Log Book...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header Section - Logo Removed */}
        <header className="flex flex-col items-center gap-8 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-4">
            <a 
              href="https://drive.google.com/drive/u/2/folders/1n55bjqy4aFcz3E6YFatHNHfQkhn10Of4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#004aad] hover:bg-[#003580] text-white px-8 py-4 rounded-2xl transition-all font-black uppercase tracking-tighter text-sm shadow-xl shadow-[#004aad]/20 active:scale-95"
            >
              <Camera size={20} />
              <span>Get Your Dive Photos</span>
            </a>
            <a 
              href="https://maps.app.goo.gl/3rdLVh5X9kat7wEA7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#38b6ff] hover:bg-[#20a4f5] text-white px-8 py-4 rounded-2xl transition-all font-black uppercase tracking-tighter text-sm shadow-xl shadow-[#38b6ff]/20 active:scale-95"
            >
              <Star size={20} fill="currentColor" />
              <span>Write a Review</span>
            </a>
          </div>
        </header>

        {/* Date Selector */}
        <section className="mb-12">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-50">
            <label className="block text-[10px] font-black text-[#004aad] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Calendar size={14} className="text-[#38b6ff]" />
              Choose Dive Session
            </label>
            <div className="relative">
              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full appearance-none bg-blue-50/50 border-2 border-transparent hover:border-[#38b6ff]/30 text-[#004aad] py-5 px-8 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#38b6ff]/10 focus:bg-white font-black text-2xl cursor-pointer transition-all"
              >
                {uniqueDates.length > 0 ? (
                  uniqueDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))
                ) : (
                  <option>No Dives Found</option>
                )}
              </select>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#38b6ff]">
                <ChevronDown size={32} />
              </div>
            </div>
          </div>
        </section>

        {/* Dive Entries */}
        <main className="space-y-12">
          {filteredDives.map((dive, idx) => (
            <article key={idx} className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#004aad]/5 border border-slate-100 overflow-hidden">
              <div className="bg-[#004aad] p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#38b6ff] font-black text-[10px] uppercase tracking-widest mb-3">
                    <MapPin size={14} fill="currentColor" stroke="none" />
                    Pacific Coast Costa Rica
                  </div>
                  <h3 className="text-4xl font-oswald text-white uppercase tracking-tight">{dive.diveSite}</h3>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl text-center border border-white/10">
                    <span className="block text-[9px] text-[#38b6ff] font-black uppercase tracking-widest mb-1">Depth (Max)</span>
                    <span className="text-white font-black text-2xl">{dive.maxDepth || '---'}</span>
                  </div>
                  <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl text-center border border-white/10">
                    <span className="block text-[9px] text-[#38b6ff] font-black uppercase tracking-widest mb-1">Bottom Time</span>
                    <span className="text-white font-black text-2xl">{dive.totalTime || '---'}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                <DetailItem icon={<ArrowDownToLine size={24} className="text-[#004aad]" />} label="Avg Depth" value={dive.avgDepth} />
                <DetailItem icon={<Thermometer size={24} className="text-orange-500" />} label="Water Temp" value={dive.waterTemp} />
                <DetailItem icon={<Eye size={24} className="text-emerald-500" />} label="Visibility" value={dive.visibility} />
                <DetailItem icon={<Wind size={24} className="text-indigo-500" />} label="Current" value={dive.current} />
                <DetailItem icon={<Waves size={24} className="text-[#38b6ff]" />} label="Wave Action" value={dive.waves} />
                <DetailItem icon={<User size={24} className="text-amber-500" />} label="Dive Guide" value={dive.guide} />
                <DetailItem icon={<Zap size={24} className="text-purple-500" />} label="Gas Mix" value={dive.typeOfAir} />
                <DetailItem icon={<Calendar size={24} className="text-slate-400" />} label="Log Date" value={dive.date} />
              </div>
            </article>
          ))}

          {filteredDives.length === 0 && !loading && (
            <div className="text-center py-32 bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200">
              <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AnchorIcon className="text-slate-400" />
              </div>
              <h4 className="text-[#004aad] font-black text-xl mb-2">No Dive Log Data</h4>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Please check your internet connection or verify the selected date.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-24 pb-16">
          <div className="flex flex-col items-center gap-12">
            <div className="text-center">
              <h2 className="text-2xl font-oswald font-black text-[#004aad] mb-4 uppercase tracking-[0.4em]">Follow the Buddies</h2>
              <div className="h-1.5 w-16 bg-[#38b6ff] mx-auto rounded-full"></div>
            </div>
            
            <div className="flex gap-8">
              <a 
                href="https://www.facebook.com/crdivebuddies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#004aad] hover:bg-[#004aad] hover:text-white transition-all shadow-xl shadow-blue-900/5 border border-slate-100 hover:-translate-y-2"
              >
                <Facebook size={32} fill="currentColor" stroke="none" />
              </a>
              <a 
                href="https://www.instagram.com/crdivebuddies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#d62976] hover:bg-gradient-to-tr hover:from-[#feda75] hover:via-[#d62976] hover:to-[#4f5bd5] hover:text-white transition-all shadow-xl shadow-blue-900/5 border border-slate-100 hover:-translate-y-2"
              >
                <Instagram size={32} />
              </a>
            </div>

            <div className="flex flex-col items-center gap-3 mt-12 opacity-50">
              <p className="text-[#004aad] text-[10px] font-black uppercase tracking-[0.5em]">
                © {new Date().getFullYear()} CR DIVE BUDDIES COSTA RICA
              </p>
              <div className="flex items-center gap-2 text-[#38b6ff] text-[8px] font-black uppercase tracking-[0.3em]">
                <span>Log Book v2.0</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Verified Data</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-5">
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="pt-1.5">
      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</span>
      <span className="block text-[#004aad] font-black text-xl leading-tight">{value || '---'}</span>
    </div>
  </div>
);

const AnchorIcon = (props: any) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/>
  </svg>
);

export default App;
