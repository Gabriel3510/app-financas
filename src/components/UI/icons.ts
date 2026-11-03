import {
  Baby, Banknote, BookOpen, Briefcase, Bus, Car, Coffee, CreditCard, Dumbbell, Film, Fuel, Gamepad2, Gem, Gift,
  GraduationCap, Heart, Home, Laptop, LifeBuoy, Lightbulb, Music, Package, PawPrint, Pill, PiggyBank, Plane,
  Shirt, ShoppingCart, Smartphone, Star, Target, TreePalm, TrendingUp, Trophy, Utensils, Wifi, Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils, car: Car, home: Home, pill: Pill, gamepad: Gamepad2, book: BookOpen, shirt: Shirt,
  lightbulb: Lightbulb, 'credit-card': CreditCard, 'shopping-cart': ShoppingCart, plane: Plane, paw: PawPrint,
  gift: Gift, package: Package, briefcase: Briefcase, laptop: Laptop, 'trending-up': TrendingUp, banknote: Banknote,
  target: Target, 'life-buoy': LifeBuoy, 'graduation-cap': GraduationCap, gem: Gem, baby: Baby, palm: TreePalm,
  smartphone: Smartphone, 'piggy-bank': PiggyBank, dumbbell: Dumbbell, music: Music, coffee: Coffee, wrench: Wrench,
  star: Star, trophy: Trophy, wifi: Wifi, bus: Bus, fuel: Fuel, heart: Heart, film: Film,
};

// Categories and goals saved by older versions still hold emoji
export const LEGACY: Record<string, string> = {
  '🍔': 'utensils', '🍕': 'utensils', '🚗': 'car', '🏠': 'home', '💊': 'pill', '🎮': 'gamepad', '📚': 'book',
  '👗': 'shirt', '💡': 'lightbulb', '💳': 'credit-card', '🛒': 'shopping-cart', '✈️': 'plane', '🐾': 'paw',
  '🎁': 'gift', '📦': 'package', '💼': 'briefcase', '💰': 'banknote', '📈': 'trending-up', '💵': 'banknote',
  '🎯': 'target', '🛟': 'life-buoy', '🎓': 'graduation-cap', '💍': 'gem', '👶': 'baby', '🏖️': 'palm',
  '📱': 'smartphone', '💻': 'laptop', '🏋️': 'dumbbell', '🎸': 'music', '🍺': 'coffee', '🔧': 'wrench',
  '🌟': 'star', '🏆': 'trophy', '🎪': 'star',
};

export const CATEGORY_ICON_CHOICES = [
  'package', 'utensils', 'coffee', 'car', 'bus', 'fuel', 'home', 'lightbulb', 'wifi', 'pill', 'heart', 'dumbbell',
  'book', 'graduation-cap', 'gamepad', 'film', 'music', 'shirt', 'shopping-cart', 'gift', 'plane', 'paw',
  'smartphone', 'laptop', 'wrench', 'credit-card', 'briefcase', 'banknote', 'trending-up', 'star',
];

export const GOAL_ICON_CHOICES = [
  'target', 'life-buoy', 'plane', 'car', 'home', 'laptop', 'graduation-cap', 'gem', 'baby', 'palm', 'smartphone',
  'piggy-bank', 'trophy',
];
