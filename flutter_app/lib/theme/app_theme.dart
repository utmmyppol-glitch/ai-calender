import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ─── Color Palette ───
class AppColors {
  // Surface
  static const surface0Light = Color(0xFFFAFAF8);
  static const surface1Light = Color(0xFFFFFFFF);
  static const surface2Light = Color(0xFFF5F5F0);
  static const surface3Light = Color(0xFFEEEEE9);

  static const surface0Dark = Color(0xFF0F0F0E);
  static const surface1Dark = Color(0xFF1A1A18);
  static const surface2Dark = Color(0xFF232320);
  static const surface3Dark = Color(0xFF2D2D28);

  // Accent
  static const accent = Color(0xFF6C63FF);
  static const accentDark = Color(0xFF8B83FF);

  // Text
  static const textPrimaryLight = Color(0xFF1A1A18);
  static const textSecondaryLight = Color(0xFF5E5C50);
  static const textMutedLight = Color(0xFF94927C);

  static const textPrimaryDark = Color(0xFFEEEEE9);
  static const textSecondaryDark = Color(0xFFA8A793);
  static const textMutedDark = Color(0xFF716E5F);

  // Modes
  static const modeWork = Color(0xFFE8A838);
  static const modeFocus = Color(0xFF6C63FF);
  static const modeRest = Color(0xFF43B581);
  static const modeExercise = Color(0xFFFF6B6B);
  static const modeCommute = Color(0xFF4FC3F7);
  static const modeMeeting = Color(0xFFFF8A65);
  static const modeDefault = Color(0xFF90A4AE);

  static Color modeColor(String mode) {
    switch (mode) {
      case 'WORK': return modeWork;
      case 'FOCUS': return modeFocus;
      case 'REST': return modeRest;
      case 'EXERCISE': return modeExercise;
      case 'COMMUTE': return modeCommute;
      case 'MEETING': return modeMeeting;
      default: return modeDefault;
    }
  }
}

// ─── Mode Config ───
class ModeConfig {
  final String label;
  final String emoji;
  final Color color;
  final List<Color> gradient;

  const ModeConfig({
    required this.label,
    required this.emoji,
    required this.color,
    required this.gradient,
  });

  static const Map<String, ModeConfig> all = {
    'WORK': ModeConfig(label: '출근', emoji: '🏢', color: AppColors.modeWork, gradient: [Color(0xFFFBBF24), Color(0xFFF97316)]),
    'FOCUS': ModeConfig(label: '집중', emoji: '☕', color: AppColors.modeFocus, gradient: [Color(0xFF8B5CF6), Color(0xFF4F46E5)]),
    'REST': ModeConfig(label: '휴식', emoji: '🏠', color: AppColors.modeRest, gradient: [Color(0xFF34D399), Color(0xFF16A34A)]),
    'EXERCISE': ModeConfig(label: '운동', emoji: '🏋️', color: AppColors.modeExercise, gradient: [Color(0xFFF87171), Color(0xFFE11D48)]),
    'COMMUTE': ModeConfig(label: '이동', emoji: '🚶', color: AppColors.modeCommute, gradient: [Color(0xFF38BDF8), Color(0xFF06B6D4)]),
    'MEETING': ModeConfig(label: '약속', emoji: '🤝', color: AppColors.modeMeeting, gradient: [Color(0xFFFB923C), Color(0xFFD97706)]),
    'DEFAULT': ModeConfig(label: '기본', emoji: '✨', color: AppColors.modeDefault, gradient: [Color(0xFF94A3B8), Color(0xFF6B7280)]),
  };

  static ModeConfig get(String mode) => all[mode] ?? all['DEFAULT']!;
}

// ─── Place Types ───
class PlaceTypeConfig {
  final String label;
  final String emoji;
  final IconData icon;

  const PlaceTypeConfig({required this.label, required this.emoji, required this.icon});

  static const Map<String, PlaceTypeConfig> all = {
    'HOME': PlaceTypeConfig(label: '집', emoji: '🏠', icon: Icons.home_rounded),
    'OFFICE': PlaceTypeConfig(label: '회사', emoji: '🏢', icon: Icons.business_rounded),
    'CAFE': PlaceTypeConfig(label: '카페', emoji: '☕', icon: Icons.coffee_rounded),
    'GYM': PlaceTypeConfig(label: '헬스장', emoji: '🏋️', icon: Icons.fitness_center_rounded),
    'RESTAURANT': PlaceTypeConfig(label: '식당', emoji: '🍽️', icon: Icons.restaurant_rounded),
    'SCHOOL': PlaceTypeConfig(label: '학교', emoji: '📚', icon: Icons.school_rounded),
    'CUSTOM': PlaceTypeConfig(label: '기타', emoji: '📍', icon: Icons.place_rounded),
  };

  static PlaceTypeConfig get(String type) => all[type] ?? all['CUSTOM']!;
}

// ─── Theme ───
class AppTheme {
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.surface0Light,
      colorScheme: ColorScheme.light(
        primary: AppColors.accent,
        surface: AppColors.surface1Light,
        onSurface: AppColors.textPrimaryLight,
      ),
      textTheme: GoogleFonts.notoSansKrTextTheme().copyWith(
        headlineLarge: GoogleFonts.playfairDisplay(
          fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.textPrimaryLight,
        ),
        titleLarge: GoogleFonts.dmSans(
          fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textPrimaryLight,
        ),
        titleMedium: GoogleFonts.dmSans(
          fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimaryLight,
        ),
        bodyLarge: GoogleFonts.notoSansKr(
          fontSize: 15, color: AppColors.textPrimaryLight,
        ),
        bodyMedium: GoogleFonts.notoSansKr(
          fontSize: 14, color: AppColors.textSecondaryLight,
        ),
        bodySmall: GoogleFonts.notoSansKr(
          fontSize: 12, color: AppColors.textMutedLight,
        ),
        labelSmall: GoogleFonts.jetBrainsMono(
          fontSize: 11, color: AppColors.textMutedLight,
        ),
      ),
      cardTheme: CardTheme(
        color: AppColors.surface1Light,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: Colors.black.withOpacity(0.04)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface0Light,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textPrimaryLight,
        ),
        iconTheme: const IconThemeData(color: AppColors.textSecondaryLight),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface1Light,
        selectedItemColor: AppColors.accent,
        unselectedItemColor: AppColors.textMutedLight,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: GoogleFonts.dmSans(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.dmSans(fontSize: 11),
      ),
    );
  }

  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.surface0Dark,
      colorScheme: ColorScheme.dark(
        primary: AppColors.accentDark,
        surface: AppColors.surface1Dark,
        onSurface: AppColors.textPrimaryDark,
      ),
      textTheme: GoogleFonts.notoSansKrTextTheme(ThemeData.dark().textTheme).copyWith(
        headlineLarge: GoogleFonts.playfairDisplay(
          fontSize: 28, fontWeight: FontWeight.w600, color: AppColors.textPrimaryDark,
        ),
        titleLarge: GoogleFonts.dmSans(
          fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.textPrimaryDark,
        ),
        titleMedium: GoogleFonts.dmSans(
          fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimaryDark,
        ),
        bodyLarge: GoogleFonts.notoSansKr(
          fontSize: 15, color: AppColors.textPrimaryDark,
        ),
        bodyMedium: GoogleFonts.notoSansKr(
          fontSize: 14, color: AppColors.textSecondaryDark,
        ),
        bodySmall: GoogleFonts.notoSansKr(
          fontSize: 12, color: AppColors.textMutedDark,
        ),
        labelSmall: GoogleFonts.jetBrainsMono(
          fontSize: 11, color: AppColors.textMutedDark,
        ),
      ),
      cardTheme: CardTheme(
        color: AppColors.surface1Dark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: Colors.white.withOpacity(0.04)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface0Dark,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textPrimaryDark,
        ),
        iconTheme: const IconThemeData(color: AppColors.textSecondaryDark),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface1Dark,
        selectedItemColor: AppColors.accentDark,
        unselectedItemColor: AppColors.textMutedDark,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: GoogleFonts.dmSans(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.dmSans(fontSize: 11),
      ),
    );
  }
}
