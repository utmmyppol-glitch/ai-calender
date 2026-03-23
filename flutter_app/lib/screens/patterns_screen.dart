import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class PatternsScreen extends StatelessWidget {
  const PatternsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        final theme = Theme.of(context);

        return RefreshIndicator(
          onRefresh: () => provider.fetchPatterns(),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Header
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('패턴 분석', style: theme.textTheme.headlineLarge),
                  const SizedBox(height: 4),
                  Text('AI가 학습한 생활 패턴', style: theme.textTheme.bodySmall),
                ],
              ).animate().fadeIn().moveY(begin: -8, end: 0),

              const SizedBox(height: 24),

              // Stats
              Row(
                children: [
                  _StatChip(label: '패턴', value: '${provider.patterns.length}', emoji: '🧠'),
                  const SizedBox(width: 10),
                  _StatChip(
                    label: '총 방문',
                    value: '${provider.patterns.fold(0, (sum, p) => sum + p.visitCount)}',
                    emoji: '📊',
                  ),
                  const SizedBox(width: 10),
                  _StatChip(label: '전환', value: '${provider.modeHistory.length}', emoji: '🔄'),
                ],
              ).animate().fadeIn(delay: 100.ms),

              const SizedBox(height: 24),

              // Bar Chart
              if (provider.patterns.isNotEmpty) ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.bar_chart_rounded, size: 18, color: theme.textTheme.bodySmall?.color),
                            const SizedBox(width: 8),
                            Text('장소별 방문 빈도', style: theme.textTheme.titleMedium),
                          ],
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          height: 220,
                          child: BarChart(
                            BarChartData(
                              alignment: BarChartAlignment.spaceAround,
                              maxY: (provider.patterns.map((p) => p.visitCount.toDouble()).reduce((a, b) => a > b ? a : b)) * 1.2,
                              barGroups: provider.patterns.asMap().entries.map((e) {
                                final colors = [
                                  AppColors.modeFocus, AppColors.modeWork, AppColors.modeRest,
                                  AppColors.modeExercise, AppColors.modeCommute, AppColors.modeMeeting,
                                  AppColors.modeDefault,
                                ];
                                return BarChartGroupData(
                                  x: e.key,
                                  barRods: [
                                    BarChartRodData(
                                      toY: e.value.visitCount.toDouble(),
                                      color: colors[e.key % colors.length],
                                      width: 28,
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                    ),
                                  ],
                                );
                              }).toList(),
                              titlesData: FlTitlesData(
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 28,
                                    getTitlesWidget: (v, _) => Text(
                                      v.toInt().toString(),
                                      style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                                    ),
                                  ),
                                ),
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 32,
                                    getTitlesWidget: (v, _) {
                                      final idx = v.toInt();
                                      if (idx >= provider.patterns.length) return const SizedBox();
                                      final name = provider.patterns[idx].placeName;
                                      return Padding(
                                        padding: const EdgeInsets.only(top: 8),
                                        child: Text(
                                          name.length > 4 ? '${name.substring(0, 4)}…' : name,
                                          style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                              gridData: FlGridData(
                                drawVerticalLine: false,
                                getDrawingHorizontalLine: (v) => FlLine(
                                  color: (theme.brightness == Brightness.dark ? Colors.white : Colors.black).withOpacity(0.05),
                                  strokeWidth: 1,
                                ),
                              ),
                              borderData: FlBorderData(show: false),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 200.ms).moveY(begin: 12, end: 0),

                const SizedBox(height: 20),
              ],

              // Patterns list
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('패턴 상세', style: theme.textTheme.titleMedium),
                      const SizedBox(height: 14),
                      if (provider.patterns.isEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Center(
                            child: Text(
                              '위치 데이터가 쌓이면 패턴이 자동 분석됩니다',
                              style: theme.textTheme.bodySmall,
                            ),
                          ),
                        )
                      else
                        ...provider.patterns.asMap().entries.map((entry) {
                          final p = entry.value;
                          final modeCfg = p.usualMode != null ? ModeConfig.get(p.usualMode!) : null;
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Row(
                              children: [
                                Container(
                                  width: 40, height: 40,
                                  decoration: BoxDecoration(
                                    color: (theme.brightness == Brightness.dark
                                        ? AppColors.surface2Dark
                                        : AppColors.surface2Light),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Center(child: Text('📍', style: TextStyle(fontSize: 18))),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(p.placeName, style: theme.textTheme.titleMedium?.copyWith(fontSize: 14)),
                                      if (p.usualArrivalTime != null || p.dayOfWeek != null)
                                        Text(
                                          [p.usualArrivalTime, p.dayOfWeek].whereType<String>().join(' · '),
                                          style: theme.textTheme.bodySmall,
                                        ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '${p.visitCount}',
                                      style: theme.textTheme.headlineLarge?.copyWith(fontSize: 20),
                                    ),
                                    Text('방문', style: theme.textTheme.bodySmall?.copyWith(fontSize: 10)),
                                  ],
                                ),
                                if (modeCfg != null) ...[
                                  const SizedBox(width: 10),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: modeCfg.color.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      '${modeCfg.emoji} ${modeCfg.label}',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: modeCfg.color),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ).animate().fadeIn(delay: (80 * entry.key).ms);
                        }),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: 300.ms),

              const SizedBox(height: 40),
            ],
          ),
        );
      },
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final String value;
  final String emoji;

  const _StatChip({required this.label, required this.value, required this.emoji});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surface1Dark : AppColors.surface1Light,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.white.withOpacity(isDark ? 0.04 : 0.06)),
        ),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16)),
                Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 10)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
