import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { RecordEntry } from '../../types/game';
import { Folder, CheckCircle, ShieldAlert } from 'lucide-react';

interface RecordDrawerProps {
  record: RecordEntry[];
  penaltyMultiplier: number;
}

export const RecordDrawer: React.FC<RecordDrawerProps> = ({
  record,
  penaltyMultiplier,
}) => {
  const { t } = useI18n();

  const activeCount = record.filter((r) => r.status === 'active').length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="bg-surface border border-surfacelight rounded-lg p-4 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-surfacelight pb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-xs font-bold text-bone">
            <Folder className="w-4 h-4 text-warninggold" />
            <span>{t('yourRecordTitle')}</span>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse font-mono text-xs">
            <span className="text-bone/60">{t('remainingRecords')}:</span>
            <span className={`font-bold ${activeCount > 0 ? 'text-crimson' : 'text-warninggold'}`}>
              {activeCount}
            </span>
          </div>
        </div>

        {/* Record Entries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
          {record.map((item) => {
            const isResolved = item.status === 'resolved';

            return (
              <div
                key={item.id}
                className={`p-3 rounded border transition-all ${
                  isResolved
                    ? 'bg-obsidian/40 border-surfacelight/40 opacity-50 line-through'
                    : 'bg-surfacelight/50 border-crimson/40 text-bone'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {t('dayLabel')} 0{item.dayNumber}
                  </span>

                  {isResolved ? (
                    <span className="flex items-center space-x-1 rtl:space-x-reverse text-warninggold text-[10px]">
                      <CheckCircle className="w-3 h-3" />
                      <span>{t('resolvedStatus')}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 rtl:space-x-reverse text-crimson text-[10px] font-bold">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{t('activeStatus')}</span>
                    </span>
                  )}
                </div>

                <div className="mt-2 text-[11px] text-bone/60 flex justify-between">
                  <span>
                    {item.outcome ? item.outcome : isResolved ? 'ESCAPED' : 'PENDING'}
                  </span>
                  <span>×{item.multiplierWhenClosed || penaltyMultiplier}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
