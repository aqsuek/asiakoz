import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Eye,
  Gauge,
  Globe2,
  HeartPulse,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Plus,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  ArrowRight,
  Zap,
} from "lucide-react";

const ICONS = {
  eye: Eye,
  scan: ScanEye,
  sparkles: Sparkles,
  zap: Zap,
  activity: Activity,
  shield: ShieldCheck,
  globe: Globe2,
  users: Users,
  gauge: Gauge,
  heart: HeartPulse,
  clipboard: ClipboardList,
  plus: Plus,
  arrow: ArrowRight,
  chevron: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  menu: Menu,
  close: X,
  instagram: Instagram,
  map: MapPin,
  phone: Phone,
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.75 }) {
  const Component = ICONS[name] || Eye;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden />;
}
