
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
  ChevronDown,
  Anchor
} from 'lucide-react';
import { fetchDiveData } from './services/sheetService';
import { DiveEntry } from './types';

// Placeholder Logo Component
const Logo: React.FC = () => (
  <div className="flex items-center gap-3 cursor-pointer group">
    <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
      <Anchor size={32} />
    </div>
    <div>
      <h1 className="text-2xl font-oswald font-bold text-blue-900 tracking-tight leading-none">CR DIVE</h1>
      <p className="text-sm font-medium text-blue-500 uppercase tracking-widest leading-none mt-1">Buddies</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [dives, setDives] = useState<DiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDiveData();
      setDives(data);
      if (data.length > 0) {
        setSelectedDate(data[0].date);
      }
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-blue-900 font-medium">Loading your dive adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <Logo />
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-blue-100">
          <a 
            href="https://drive.google.com/drive/u/2/folders/1n55bjqy4aFcz3E6YFatHNHfQkhn10Of4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all font-semibold shadow-md shadow-blue-200"
          >
            <Camera size={20} />
            <span>Dive Photos</span>
          </a>
          <a 
            href="https://maps.app.goo.gl/3rdLVh5X9kat7wEA7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl transition-all font-semibold shadow-md shadow-amber-200"
          >
            <Star size={20} />
            <span>Review Us</span>
          </a>
        </div>
      </header>

      {/* Date Filter */}
      <section className="mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-blue-100">
          <label className="block text-sm font-bold text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Select Dive Date
          </label>
          <div className="relative">
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none bg-blue-50 border-2 border-blue-100 text-blue-900 py-4 px-6 rounded-2xl focus:outline-none focus:border-blue-400 font-medium text-lg cursor-pointer transition-colors"
            >
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Dive Log Content */}
      <main className="space-y-8">
        {filteredDives.map((dive, idx) => (
          <article key={idx} className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden transform hover:scale-[1.01] transition-transform">
            <div className="bg-blue-900 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-widest mb-1">
                  <MapPin size={14} />
                  Dive Site
                </div>
                <h3 className="text-2xl font-oswald text-white uppercase">{dive.diveSite}</h3>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-800/50 px-4 py-2 rounded-xl text-center">
                  <span className="block text-[10px] text-blue-300 font-bold uppercase tracking-tighter">Depth</span>
                  <span className="text-white font-bold">{dive.maxDepth}</span>
                </div>
                <div className="bg-blue-800/50 px-4 py-2 rounded-xl text-center">
                  <span className="block text-[10px] text-blue-300 font-bold uppercase tracking-tighter">Time</span>
                  <span className="text-white font-bold">{dive.totalTime}</span>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
              <DetailItem icon={<ArrowDownToLine className="text-blue-500" />} label="Avg Depth" value={dive.avgDepth} />
              <DetailItem icon={<Thermometer className="text-red-400" />} label="Water Temp" value={dive.waterTemp} />
              <DetailItem icon={<Eye className="text-teal-400" />} label="Visibility" value={dive.visibility} />
              <DetailItem icon={<Wind className="text-indigo-400" />} label="Current" value={dive.current} />
              <DetailItem icon={<Waves className="text-cyan-400" />} label="Waves" value={dive.waves} />
              <DetailItem icon={<User className="text-amber-500" />} label="Guide" value={dive.guide} />
              <DetailItem icon={<Zap className="text-purple-400" />} label="Air Type" value={dive.typeOfAir} />
              <DetailItem icon={<Calendar className="text-blue-400" />} label="Date" value={dive.date} />
            </div>
          </article>
        ))}

        {filteredDives.length === 0 && (
          <div className="text-center py-20 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200">
            <p className="text-blue-400 font-medium">No dives found for this date.</p>
          </div>
        )}
      </main>

      {/* Footer / Follow Us */}
      <footer className="mt-20 pt-10 border-t border-blue-100">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-oswald font-bold text-blue-900 mb-2">FOLLOW US</h2>
            <p className="text-blue-500 font-medium">Join our community and stay connected</p>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/crdivebuddies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-900/5 border border-blue-50"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/crdivebuddies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-lg shadow-blue-900/5 border border-blue-50"
            >
              <Instagram size={24} />
            </a>
          </div>

          <div className="text-center text-blue-400 text-sm font-medium mt-4">
            © {new Date().getFullYear()} CR Dive Buddies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm">
      {icon}
    </div>
    <div>
      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
      <span className="block text-gray-900 font-bold text-lg leading-none">{value || 'N/A'}</span>
    </div>
  </div>
);

export default App;
