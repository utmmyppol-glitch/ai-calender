import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/app_provider.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/common_widgets.dart';

class PlacesScreen extends StatefulWidget {
  const PlacesScreen({super.key});

  @override
  State<PlacesScreen> createState() => _PlacesScreenState();
}

class _PlacesScreenState extends State<PlacesScreen> {
  void _showAddPlaceSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const _AddPlaceSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, _) {
        return RefreshIndicator(
          onRefresh: () => provider.fetchPlaces(),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('장소 관리', style: Theme.of(context).textTheme.headlineLarge),
                      const SizedBox(height: 4),
                      Text(
                        '등록된 장소에 도착하면 자동 모드 전환',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  FilledButton.icon(
                    onPressed: _showAddPlaceSheet,
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('추가'),
                    style: FilledButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                  ),
                ],
              ).animate().fadeIn().moveY(begin: -8, end: 0),

              const SizedBox(height: 24),

              // Places list
              if (provider.places.isEmpty)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(40),
                    child: Column(
                      children: [
                        Text('🗺️', style: const TextStyle(fontSize: 48)),
                        const SizedBox(height: 12),
                        Text('등록된 장소가 없습니다', style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 6),
                        Text(
                          '장소를 추가하면 AI가 자동으로\n모드를 전환합니다',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const SizedBox(height: 20),
                        FilledButton.icon(
                          onPressed: _showAddPlaceSheet,
                          icon: const Icon(Icons.add, size: 18),
                          label: const Text('첫 장소 등록'),
                          style: FilledButton.styleFrom(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 100.ms)
              else
                ...provider.places.asMap().entries.map((entry) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: PlaceCard(place: entry.value),
                  ).animate().fadeIn(delay: (80 * entry.key).ms).moveY(begin: 8, end: 0);
                }),

              const SizedBox(height: 40),
            ],
          ),
        );
      },
    );
  }
}

// ── Add Place Bottom Sheet ──
class _AddPlaceSheet extends StatefulWidget {
  const _AddPlaceSheet();

  @override
  State<_AddPlaceSheet> createState() => _AddPlaceSheetState();
}

class _AddPlaceSheetState extends State<_AddPlaceSheet> {
  final _nameController = TextEditingController();
  String _type = 'CUSTOM';
  String? _linkedMode;
  double _lat = 37.5665;
  double _lng = 126.978;
  int _radius = 100;
  bool _saving = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_nameController.text.trim().isEmpty) return;
    setState(() => _saving = true);

    final provider = context.read<AppProvider>();
    final success = await provider.addPlace(Place(
      name: _nameController.text.trim(),
      type: _type,
      latitude: _lat,
      longitude: _lng,
      radiusMeters: _radius,
      linkedMode: _linkedMode,
    ));

    if (mounted) {
      setState(() => _saving = false);
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('장소가 등록되었습니다'),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? AppColors.surface1Dark : AppColors.surface1Light,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(isDark ? 0.04 : 0.06)),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Center(
              child: Container(
                width: 36, height: 4,
                decoration: BoxDecoration(
                  color: (isDark ? AppColors.textMutedDark : AppColors.textMutedLight).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),

            Text('새 장소 등록', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 24),

            // Name
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: '장소 이름',
                hintText: '예: 우리 회사, 단골 카페',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                filled: true,
                fillColor: isDark ? AppColors.surface2Dark : AppColors.surface2Light,
              ),
            ),
            const SizedBox(height: 20),

            // Type selector
            Text('장소 유형', style: Theme.of(context).textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w700, letterSpacing: 1.5, fontSize: 10,
            )),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: PlaceTypeConfig.all.entries.map((e) {
                final selected = _type == e.key;
                return ChoiceChip(
                  label: Text('${e.value.emoji} ${e.value.label}'),
                  selected: selected,
                  onSelected: (_) => setState(() => _type = e.key),
                  selectedColor: AppColors.accent.withOpacity(0.15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                );
              }).toList(),
            ),

            const SizedBox(height: 20),

            // Radius slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('감지 반경', style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w700, letterSpacing: 1.5, fontSize: 10,
                )),
                Text('${_radius}m', style: Theme.of(context).textTheme.labelSmall),
              ],
            ),
            Slider(
              value: _radius.toDouble(),
              min: 30, max: 500,
              divisions: 47,
              label: '${_radius}m',
              onChanged: (v) => setState(() => _radius = v.round()),
            ),

            const SizedBox(height: 16),

            // Linked mode
            Text('연결 모드 (선택)', style: Theme.of(context).textTheme.bodySmall?.copyWith(
              fontWeight: FontWeight.w700, letterSpacing: 1.5, fontSize: 10,
            )),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: ModeConfig.all.entries.map((e) {
                final selected = _linkedMode == e.key;
                return ChoiceChip(
                  label: Text('${e.value.emoji} ${e.value.label}'),
                  selected: selected,
                  onSelected: (_) => setState(() => _linkedMode = selected ? null : e.key),
                  selectedColor: e.value.color.withOpacity(0.15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                );
              }).toList(),
            ),

            const SizedBox(height: 28),

            // Save button
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: _saving ? null : _save,
                icon: _saving
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.save_rounded, size: 18),
                label: Text(_saving ? '저장 중...' : '장소 등록'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                ),
              ),
            ),

            // Safe area bottom
            SizedBox(height: MediaQuery.of(context).viewInsets.bottom + 8),
          ],
        ),
      ),
    );
  }
}
