import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';

class AiInsightWidget extends StatelessWidget {
  final String insight;
  final List<String> actions;
  final String mode;

  const AiInsightWidget({
    super.key,
    required this.insight,
    required this.actions,
    required this.mode,
  });

  @override
  Widget build(BuildContext context) {
    final cfg = ModeConfig.get(mode);
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.auto_awesome, size: 18, color: theme.colorScheme.primary),
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('AI 인사이트', style: theme.textTheme.titleMedium),
                    Text('Powered by GPT-4o', style: theme.textTheme.labelSmall),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Insight text
            Text(
              insight,
              style: theme.textTheme.bodyMedium?.copyWith(height: 1.5),
            ).animate().fadeIn(duration: 400.ms),

            if (actions.isNotEmpty) ...[
              const SizedBox(height: 20),
              Row(
                children: [
                  Icon(Icons.lightbulb_outline, size: 14, color: theme.textTheme.bodySmall?.color),
                  const SizedBox(width: 4),
                  Text('추천 행동', style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5,
                    fontSize: 10,
                  )),
                ],
              ),
              const SizedBox(height: 10),
              ...actions.asMap().entries.map((entry) {
                final i = entry.key;
                final action = entry.value;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 22, height: 22,
                        decoration: BoxDecoration(
                          color: cfg.color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: Center(
                          child: Text(
                            '${i + 1}',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: cfg.color,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          action,
                          style: theme.textTheme.bodyMedium?.copyWith(height: 1.4),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: (100 * i).ms).moveX(begin: -8, end: 0);
              }),
            ],

            if (actions.isEmpty && insight.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: Column(
                    children: [
                      Icon(Icons.auto_awesome, size: 32, color: theme.textTheme.bodySmall?.color?.withOpacity(0.3)),
                      const SizedBox(height: 8),
                      Text('위치 이동 시 AI가 맥락을 분석합니다', style: theme.textTheme.bodySmall),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
