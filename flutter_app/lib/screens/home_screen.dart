import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/mode_orb.dart';
import '../widgets/ai_insight_widget.dart';
import '../widgets/common_widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 6) return '새벽이에요 🌙';
    if (h < 12) return '좋은 아침이에요 ☀️';
    if (h < 18) return '좋은 오후에요 🌤️';
    return '좋은 저녁이에요 🌙';
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        return RefreshIndicator(
          onRefresh: () async {
            await provider.init();
          },
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // ── Header ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_greeting(), style: Theme.of(context).textTheme.headlineLarge),
                      const SizedBox(height: 4),
                      Text(
                        'AI가 당신의 위치를 분석합니다',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  // Tracking toggle
                  GestureDetector(
                    onTap: () {
                      if (provider.isTracking) {
                        provider.stopTracking();
                      } else {
                        provider.startTracking();
                      }
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: provider.isTracking
                            ? AppColors.modeRest.withOpacity(0.12)
                            : (Theme.of(context).brightness == Brightness.dark
                                ? AppColors.surface2Dark
                                : AppColors.surface2Light),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: provider.isTracking
                              ? AppColors.modeRest.withOpacity(0.3)
                              : Colors.transparent,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8, height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: provider.isTracking ? AppColors.modeRest : AppColors.modeDefault,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            provider.isTracking ? 'GPS 추적 중' : 'GPS 꺼짐',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: provider.isTracking
                                  ? AppColors.modeRest
                                  : Theme.of(context).textTheme.bodySmall?.color,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ).animate().fadeIn(duration: 400.ms).moveY(begin: -8, end: 0),

              const SizedBox(height: 24),

              // ── Stats Row ──
              Row(
                children: [
                  Expanded(
                    child: StatCard(
                      label: '장소',
                      value: '${provider.places.length}',
                      suffix: '곳',
                      emoji: '📍',
                      accentColor: AppColors.modeFocus,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: StatCard(
                      label: '패턴',
                      value: '${provider.patterns.length}',
                      suffix: '개',
                      emoji: '🧠',
                      accentColor: AppColors.modeRest,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: StatCard(
                      label: '서버',
                      value: provider.serverOnline ? 'ON' : 'OFF',
                      emoji: provider.serverOnline ? '🟢' : '🔴',
                      accentColor: provider.serverOnline ? AppColors.modeRest : AppColors.modeExercise,
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 100.ms, duration: 400.ms).moveY(begin: 12, end: 0),

              const SizedBox(height: 20),

              // ── Mode Orb ──
              ModeOrbWidget(
                mode: provider.currentMode,
                placeName: provider.currentPlace,
              ).animate().fadeIn(delay: 200.ms, duration: 500.ms).scale(begin: const Offset(0.95, 0.95)),

              const SizedBox(height: 20),

              // ── AI Insight ──
              AiInsightWidget(
                insight: provider.parsedInsight,
                actions: provider.parsedActions,
                mode: provider.currentMode,
              ).animate().fadeIn(delay: 300.ms, duration: 400.ms).moveY(begin: 12, end: 0),

              const SizedBox(height: 20),

              // ── Mode History ──
              if (provider.modeHistory.isNotEmpty)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.history, size: 18, color: Theme.of(context).textTheme.bodySmall?.color),
                            const SizedBox(width: 8),
                            Text('모드 전환 기록', style: Theme.of(context).textTheme.titleMedium),
                          ],
                        ),
                        const SizedBox(height: 14),
                        ...provider.modeHistory.take(5).map((event) {
                          final fromCfg = ModeConfig.get(event.previousMode);
                          final toCfg = ModeConfig.get(event.currentMode);
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Row(
                              children: [
                                Text(fromCfg.emoji, style: const TextStyle(fontSize: 16)),
                                const SizedBox(width: 6),
                                Text(fromCfg.label, style: Theme.of(context).textTheme.bodySmall),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 8),
                                  child: Icon(Icons.arrow_forward, size: 14, color: Theme.of(context).textTheme.bodySmall?.color),
                                ),
                                Text(toCfg.emoji, style: const TextStyle(fontSize: 16)),
                                const SizedBox(width: 6),
                                Text(
                                  toCfg.label,
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: toCfg.color),
                                ),
                                const Spacer(),
                                Text(
                                  event.placeName,
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 400.ms, duration: 400.ms),

              const SizedBox(height: 40),
            ],
          ),
        );
      },
    );
  }
}
