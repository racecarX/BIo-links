'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Github, Twitter, Mail, Instagram } from 'lucide-react';

interface SpotifyData {
  track_id: string;
  song: string;
  artist: string;
  album_art_url: string;
}

export default function BioSite() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const discordId = '1456460012460445779';
    let ws: WebSocket;
    let heartbeatInterval: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket('wss://api.lanyard.rest/socket');

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        
        if (msg.op === 1) {
          // Start heartbeating
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, msg.d.heartbeat_interval);
          
          // Subscribe to user
          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: discordId }
          }));
        } else if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
          const user = msg.d?.discord_user;
          if (user && user.avatar) {
            const isGif = user.avatar.startsWith('a_');
            setAvatarUrl(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isGif ? 'gif' : 'png'}?size=512`);
          }
          
          if (msg.d?.spotify) {
            setSpotify((prev) => 
              prev?.track_id === msg.d.spotify.track_id ? prev : msg.d.spotify
            );
          } else {
            setSpotify(null);
          }
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        // Try to reconnect after a delay
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearInterval(heartbeatInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-white selection:text-[#0a0a0a]">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#222222] via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

      {/* Top Right Time */}
      <div className="absolute top-8 right-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
        <span className="text-white/40 text-xs font-mono tracking-widest uppercase">{time}</span>
      </div>

      {/* Bottom Left Watermark */}
      <div className="absolute bottom-8 left-8 opacity-0 animate-fade-in-up hidden sm:block" style={{ animationDelay: '1.0s' }}>
        <span className="text-white/20 text-xs font-mono tracking-widest uppercase">RC // {new Date().getFullYear()}</span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 py-12">
        {/* Avatar / Central Node */}
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#222222] text-5xl font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-8 relative overflow-hidden">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Discord Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            "RC"
          )}
        </div>

        <h1 
          className="text-5xl font-black text-white mb-4 tracking-tighter opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          racecar.cc
        </h1>

        <p 
          className="text-white/60 text-center italic text-sm max-w-sm mb-12 leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          &quot;You have to decide who you are and force the world to deal with you, not the other way around.&quot;
        </p>

        {/* Links */}
        <div className="flex flex-row flex-wrap justify-center gap-6 w-full">
          {[
            { 
              name: 'Discord', 
              href: 'https://discord.com/users/1456460012460445779',
              icon: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            },
            { 
              name: 'Telegram', 
              href: 'https://t.me/racecarX',
              icon: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            },
            { 
              name: 'Twitter / X', 
              href: 'https://x.com/xx_racecar_xx',
              icon: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            }
          ].map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className="group flex items-center justify-center w-16 h-16 bg-[#2a2a2a] border border-white/10 rounded-full hover:bg-white hover:text-[#222222] transition-all duration-300 text-white opacity-0 animate-fade-in-up hover:scale-[1.1] active:scale-[0.95]"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <link.icon className="w-7 h-7" />
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Spotify Player */}
        {spotify && (
          <div className="mt-12 w-full max-w-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-[#2a2a2a] border border-white/10 rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#333333]">
              <div className="flex items-center gap-3 mb-3 px-2">
                <svg className="w-5 h-5 text-[#1DB954] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.42.18.6.78.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Currently Listening</span>
              </div>
              <iframe 
                style={{ borderRadius: '12px' }} 
                src={`https://open.spotify.com/embed/track/${spotify.track_id}?utm_source=generator&theme=0`} 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
