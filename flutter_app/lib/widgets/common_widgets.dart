import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';

class PlaceCard extends StatelessWidget {
  final Place place;
  final VoidCallback? onTap;

  const PlaceCard({super.key, required this.place, this.onTap});

  @override
  Widget build(BuildContext context) {
    final typeCfg = PlaceTypeConfig.get(place.type);
    final modeCfg = place.linkedMode != null ? ModeConfig.get(place.linkedMode!) : null;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surface2Dark : AppColors.surface2Light,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          children: [
            // Icon
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: isDark ? AppColors.surface3Dark : AppColors.surface3Light,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Center(child: Text(typeCfg.emoji, style: const TextStyle(fontSize: 20))),
            ),
            const SizedBox(width: 12),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(place.name, style: theme.textTheme.titleMedium?.copyWith(fontSize: 14)),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(typeCfg.label, style: theme.textTheme.bodySmall),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6),
                        child: Text('·', style: theme.textTheme.bodySmall),
                      ),
                      Icon(Icons.radar, size: 11, color: theme.textTheme.bodySmall?.color),
                      const SizedBox(width: 2),
                      Text('${place.radiusMeters}m', style: theme.textTheme.bodySmall),
                    ],
                  ),
                ],
              ),
            ),

            // Mode badge
            if (modeCfg != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: modeCfg.color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(modeCfg.emoji, style: const TextStyle(fontSize: 12)),
                    const SizedBox(width: 4),
                    Text(
                      modeCfg.label,
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: modeCfg.color),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ── Stat Card ──
class StatCard extends StatelessWidget {
  final String label;
  final String value;
  final String? suffix;
  final String emoji;
  final Color accentColor;

  const StatCard({
    super.key,
    required this.label,
    required this.value,
    this.suffix,
    required this.emoji,
    required this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label.toUpperCase(),
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.2,
                    fontSize: 10,
                  ),
                ),
                Text(emoji, style: const TextStyle(fontSize: 18)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  value,
                  style: theme.textTheme.headlineLarge?.copyWith(fontSize: 24),
                ),
                if (suffix != null) ...[
                  const SizedBox(width: 4),
                  Text(suffix!, style: theme.textTheme.bodySmall),
                ],
              ],
            ),
            const SizedBox(height: 8),
            Container(
              height: 2,
              width: 32,
              decoration: BoxDecoration(
                color: accentColor.withOpacity(0.4),
                borderRadius: BorderRadius.circular(1),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
