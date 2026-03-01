import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Users, Trophy, Flame, ThumbsUp, MessageCircle,
  ArrowLeft, TrendingUp, Zap, Award, Star, Send, Globe, Calendar
} from 'lucide-react';

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: 'producer' | 'consumer' | 'investor';
  title: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  tags: string[];
  liked: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  wallet: string;
  energyTraded: number;
  reputation: number;
  badge: string;
}

const MOCK_POSTS: ForumPost[] = [
  {
    id: '1', author: 'SolarMaxx', avatar: '☀️', role: 'producer',
    title: 'Optimized my panel output by 40% using tilt tracking',
    content: 'Just deployed a new tilt-tracking algorithm on my solar array. Seeing a consistent 40% uplift in kWh generation. Happy to share the config for anyone running similar setups.',
    likes: 47, replies: 12, timestamp: '2h ago', tags: ['Solar', 'Optimization'], liked: false,
  },
  {
    id: '2', author: 'WindRunner', avatar: '🌊', role: 'producer',
    title: 'New offshore wind farm coming online next month',
    content: 'Our offshore turbines passed final inspection. Expecting 2,000 RET/day once fully operational. Looking for bulk buyers interested in long-term contracts.',
    likes: 89, replies: 34, timestamp: '5h ago', tags: ['Wind', 'Announcement'], liked: true,
  },
  {
    id: '3', author: 'GreenInvestor', avatar: '📊', role: 'investor',
    title: 'Q4 ROI analysis: Renewable tokens outperforming traditional',
    content: 'Compiled data across 200+ token transactions. RET holders saw an average 18.4% return this quarter compared to 6.2% in traditional green bonds. Full analysis in the thread.',
    likes: 156, replies: 67, timestamp: '1d ago', tags: ['Analytics', 'ROI'], liked: false,
  },
  {
    id: '4', author: 'EcoConsumer', avatar: '🌱', role: 'consumer',
    title: 'How I powered my entire home with marketplace tokens',
    content: 'Switched to 100% marketplace-sourced energy 3 months ago. Cost savings are real — paying ~15% less than my old utility. Here\'s my setup and buying strategy.',
    likes: 213, replies: 89, timestamp: '2d ago', tags: ['Guide', 'Consumer'], liked: true,
  },
  {
    id: '5', author: 'BlockValidator', avatar: '⛓️', role: 'investor',
    title: 'Proposal: Community governance for energy pricing',
    content: 'Submitting a proposal for DAO-style governance over marketplace pricing tiers. Would love community input before the snapshot vote next week.',
    likes: 72, replies: 45, timestamp: '3d ago', tags: ['Governance', 'DAO'], liked: false,
  },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'SolarMaxx', wallet: '0xAb3...f12', energyTraded: 12450, reputation: 98, badge: '🏆' },
  { rank: 2, name: 'WindRunner', wallet: '0xCd5...a89', energyTraded: 9800, reputation: 95, badge: '🥈' },
  { rank: 3, name: 'HydroGen', wallet: '0xEf7...b34', energyTraded: 7200, reputation: 92, badge: '🥉' },
  { rank: 4, name: 'GreenInvestor', wallet: '0x1a2...c56', energyTraded: 5600, reputation: 89, badge: '⭐' },
  { rank: 5, name: 'EcoConsumer', wallet: '0x3b4...d78', energyTraded: 4100, reputation: 86, badge: '⭐' },
  { rank: 6, name: 'TurbineKing', wallet: '0x5c6...e90', energyTraded: 3300, reputation: 82, badge: '🔋' },
  { rank: 7, name: 'SunChaser', wallet: '0x7d8...f12', energyTraded: 2100, reputation: 78, badge: '🔋' },
];

const EVENTS = [
  { title: 'Community AMA: Scaling Renewable Tokenization', date: 'Mar 5, 2026', time: '18:00 UTC', attendees: 234 },
  { title: 'Hackathon: Build on EnergyChain', date: 'Mar 12, 2026', time: '10:00 UTC', attendees: 891 },
  { title: 'Governance Vote #7: Fee Reduction Proposal', date: 'Mar 15, 2026', time: '00:00 UTC', attendees: 1203 },
];

type Tab = 'forum' | 'leaderboard' | 'events';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('forum');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newComment, setNewComment] = useState('');

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  const roleColor = (role: string) => {
    switch (role) {
      case 'producer': return 'bg-primary/20 text-primary';
      case 'consumer': return 'bg-secondary/20 text-secondary';
      case 'investor': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            <span className="neon-text-green">3,482</span> members online
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground bg-muted/30'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="community-tab"
                  className="absolute inset-0 rounded-lg btn-energy"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posts */}
            <div className="lg:col-span-2 space-y-4">
              {/* Compose */}
              <motion.div
                className="glass-card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg flex-shrink-0">⚡</div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Share something with the community..."
                      className="w-full bg-muted/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        {['Solar', 'Wind', 'Discussion'].map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button className="btn-energy text-xs px-4 py-1.5 flex items-center gap-1.5">
                        <Send className="w-3 h-3" /> Post
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Post List */}
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="glass-card p-5 hover:border-primary/20 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{post.author}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${roleColor(post.role)}`}>
                          {post.role}
                        </span>
                        <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>

                      <div className="flex items-center gap-3 mt-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            post.liked ? 'neon-text-green' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Community Stats */}
              <motion.div
                className="glass-card-blue p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" /> Community Stats
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Total Members', value: '12,847', icon: Users },
                    { label: 'Energy Traded', value: '1.2M kWh', icon: Zap },
                    { label: 'Active Producers', value: '2,341', icon: Flame },
                    { label: 'Posts This Week', value: '847', icon: MessageSquare },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                      </span>
                      <span className="font-mono font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Contributors */}
              <motion.div
                className="glass-card-purple p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" /> Top Contributors
                </h3>
                <div className="space-y-2.5">
                  {LEADERBOARD.slice(0, 5).map(entry => (
                    <div key={entry.rank} className="flex items-center gap-2 text-sm">
                      <span className="text-base">{entry.badge}</span>
                      <span className="font-medium flex-1">{entry.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{entry.reputation}★</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trending Tags */}
              <motion.div
                className="glass-card p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-semibold mb-3">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Solar', 'Wind', 'ROI', 'Governance', 'DAO', 'Carbon', 'DeFi', 'Staking', 'Tokenomics'].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors border border-border/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-5 border-b border-border/50">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" /> Energy Trading Leaderboard
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Top producers and traders ranked by volume and reputation</p>
            </div>
            <div className="divide-y divide-border/30">
              {LEADERBOARD.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-2xl w-8 text-center">{entry.badge}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{entry.wallet}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> {entry.energyTraded.toLocaleString()} kWh</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" /> {entry.reputation} rep</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono neon-text-green">{entry.energyTraded.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">RET traded</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.title}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-4 h-4" /> {event.date}
                      </span>
                      <span className="font-mono">{event.time}</span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> {event.attendees} attending
                      </span>
                    </div>
                  </div>
                  <button className="btn-web3 text-sm px-4 py-2">RSVP</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
