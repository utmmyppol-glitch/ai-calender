import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';

class ModeOrbWidget extends StatelessWidget {
  final String mode;
  final String? placeName;

  const ModeOrbWidget({super.key, required this.mode, this.placeName});

  @override
  Widget build(BuildContext context) {
    final cfg = ModeConfig.get(mode);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          children: [
            // Orb
            Stack(
              alignment: Alignment.center,
              children: [
                // Outer pulse ring
                Container(
                  width: 140, height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: cfg.color.withOpacity(0.15), width: 1.5),
                  ),
                )
                    .animate(onPlay: (c) => c.repeat())
                    .scale(begin: const Offset(1, 1), end: const Offset(1.15, 1.15), duration: 3.seconds, curve: Curves.easeInOut)
                    .fadeOut(begin: 0.3, duration: 3.seconds),

                // Second pulse
                Container(
                  width: 160, height: 160,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: cfg.color.withOpacity(0.08), width: 1),
                  ),
                )
                    .animate(onPlay: (c) => c.repeat())
                    .scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2), duration: 3.seconds, curve: Curves.easeInOut, delay: 500.ms)
                    .fadeOut(begin: 0.15, duration: 3.seconds),

                // Main orb
                Container(
                  width: 110, height: 110,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: cfg.gradient,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: cfg.color.withOpacity(0.35),
                        blurRadius: 32,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(cfg.emoji, style: const TextStyle(fontSize: 40)),
                  ),
                )
                    .animate()
                    .scale(begin: const Offset(0.8, 0.8), end: const Offset(1, 1), duration: 600.ms, curve: Curves.easeOutBack),
              ],
            ),

            const SizedBox(height: 24),

            // Mode label
            Text(
              '${cfg.label} 모드',
              style: Theme.of(context).textTheme.headlineLarge,
            ).animate().fadeIn(duration: 400.ms).moveY(begin: 8, end: 0),

            const SizedBox(height: 6),

            Text(
              placeName?.isNotEmpty == true ? placeName! : '위치 대기 중...',
              style: Theme.of(context).textTheme.bodySmall,
            ).animate().fadeIn(delay: 200.ms),

            const SizedBox(height: 20),

            // Mode dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: ModeConfig.all.entries.map((e) {
                final isActive = e.key == mode;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isActive ? e.value.color : e.value.color.withOpacity(0.25),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
