import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        final theme = Theme.of(context);
        final isDark = theme.brightness == Brightness.dark;

        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('설정', style: theme.textTheme.headlineLarge),
            const SizedBox(height: 24),

            // Server status
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.dns_rounded, size: 18, color: theme.textTheme.bodySmall?.color),
                        const SizedBox(width: 8),
                        Text('서버 상태', style: theme.textTheme.titleMedium),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _StatusRow(
                      label: 'Spring Boot (8081)',
                      online: provider.serverOnline,
                    ),
                    const SizedBox(height: 10),
                    _StatusRow(
                      label: 'GPS 추적',
                      online: provider.isTracking,
                      onlineText: '추적 중',
                      offlineText: '중지',
                    ),
                    const SizedBox(height: 10),
                    _StatusRow(
                      label: '현재 위치',
                      online: provider.lastPosition != null,
                      onlineText: provider.lastPosition != null
                          ? '${provider.lastPosition!.latitude.toStringAsFixed(4)}, ${provider.lastPosition!.longitude.toStringAsFixed(4)}'
                          : '',
                      offlineText: '미수신',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Tracking control
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.gps_fixed_rounded, size: 18, color: theme.textTheme.bodySmall?.color),
                        const SizedBox(width: 8),
                        Text('GPS 위치 추적', style: theme.textTheme.titleMedium),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '60초 간격으로 서버에 위치를 전송합니다',
                      style: theme.textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: provider.isTracking
                          ? OutlinedButton.icon(
                              onPressed: () => provider.stopTracking(),
                              icon: const Icon(Icons.stop_rounded, size: 18),
                              label: const Text('추적 중지'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.modeExercise,
                                side: const BorderSide(color: AppColors.modeExercise),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                            )
                          : FilledButton.icon(
                              onPressed: () async {
                                final ok = await provider.startTracking();
                                if (!ok && context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: const Text('위치 권한이 필요합니다'),
                                      behavior: SnackBarBehavior.floating,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    ),
                                  );
                                }
                              },
                              icon: const Icon(Icons.play_arrow_rounded, size: 18),
                              label: const Text('추적 시작'),
                              style: FilledButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Quick test locations
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.science_rounded, size: 18, color: theme.textTheme.bodySmall?.color),
                        const SizedBox(width: 8),
                        Text('테스트 위치 전송', style: theme.textTheme.titleMedium),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _QuickLocation(label: '🏙️ 강남역', lat: 37.4979, lng: 127.0276),
                        _QuickLocation(label: '🚉 서울역', lat: 37.5547, lng: 126.9707),
                        _QuickLocation(label: '🎶 홍대입구', lat: 37.5563, lng: 126.9240),
                        _QuickLocation(label: '🏟️ 잠실', lat: 37.5133, lng: 127.1001),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // About
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.info_outline_rounded, size: 18, color: theme.textTheme.bodySmall?.color),
                        const SizedBox(width: 8),
                        Text('정보', style: theme.textTheme.titleMedium),
                      ],
                    ),
                    const SizedBox(height: 14),
                    _InfoRow(label: '프로젝트', value: 'AI Location Agent'),
                    _InfoRow(label: '백엔드', value: 'Spring Boot 3 + Java 21'),
                    _InfoRow(label: '모바일', value: 'Flutter + Dart'),
                    _InfoRow(label: 'AI', value: 'OpenAI GPT-4o-mini'),
                    _InfoRow(label: '작성자', value: '김보민'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),
          ],
        );
      },
    );
  }
}

class _StatusRow extends StatelessWidget {
  final String label;
  final bool online;
  final String onlineText;
  final String offlineText;

  const _StatusRow({
    required this.label,
    required this.online,
    this.onlineText = 'Online',
    this.offlineText = 'Offline',
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
        const Spacer(),
        Container(
          width: 8, height: 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: online ? AppColors.modeRest : AppColors.modeExercise,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          online ? onlineText : offlineText,
          style: Theme.of(context).textTheme.labelSmall,
        ),
      ],
    );
  }
}

class _QuickLocation extends StatelessWidget {
  final String label;
  final double lat;
  final double lng;

  const _QuickLocation({required this.label, required this.lat, required this.lng});

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 12)),
      onPressed: () {
        context.read<AppProvider>().sendManualLocation(lat, lng);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$label 위치 전송됨'),
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 2),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      },
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600)),
          const Spacer(),
          Text(value, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
