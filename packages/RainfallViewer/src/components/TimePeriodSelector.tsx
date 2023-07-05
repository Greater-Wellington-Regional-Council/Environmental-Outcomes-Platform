import { type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import addHours from 'date-fns/addHours';
import { formatDate } from '../lib/dateHelpers';
import Button, { buttonClasses } from '@/components/Button';
import {
  HourOptions,
  serializeViewParams,
  serializeViewParamsWithHours,
} from '../lib/viewParams';

type Props = {
  viewParams: ViewParams;
  updateViewParams: (updatedViewParams: Partial<ViewParams>) => void;
  resetMapView: () => void;
  accumOffset: number;
  setAccumOffset: Dispatch<SetStateAction<number>>;
};

export default function TimePeriodSelector({
  viewParams,
  updateViewParams,
  resetMapView,
  accumOffset,
  setAccumOffset,
}: Props) {
  return (
    <>
      <h2 className="mb-2">Options:</h2>
      <div className="mb-4">
        <div className="grid grid-cols-5 gap-2">
          {[...HourOptions.keys()].map((hours) => (
            <Link
              key={HourOptions.get(hours)}
              href={serializeViewParams({
                ...viewParams,
                hours,
                showAccumulation:
                  hours === 1 ? false : viewParams.showAccumulation,
              })}
              className={buttonClasses({
                size: 'xs',
                color: hours === viewParams.hours ? 'primary' : 'secondary',
              })}
            >
              {HourOptions.get(hours)}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <input
            checked={viewParams.showTotals}
            id="show-totals"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-dye focus:ring-indigo-dye"
            onChange={() =>
              updateViewParams({ showTotals: !viewParams.showTotals })
            }
          />
          <label htmlFor="show-totals" className="ml-3 text-sm text-gray-900">
            Show totals
          </label>
        </div>
        {viewParams.hours !== 1 && (
          <div className="text-right">
            <input
              checked={viewParams.showAccumulation}
              id="show-accumulation"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-dye focus:ring-indigo-dye"
              onChange={() =>
                updateViewParams({
                  showAccumulation: !viewParams.showAccumulation,
                })
              }
            />
            <label
              htmlFor="show-accumulation"
              className="ml-3 text-sm  text-gray-900"
            >
              Show accumulation
            </label>
          </div>
        )}
      </div>

      {viewParams.showAccumulation && (
        <div className="mb-4">
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setAccumOffset((accumOffset: number) =>
                  Math.max(accumOffset - 1, 0)
                )
              }
              className={clsx(
                buttonClasses({ size: 'xs', color: 'secondary' })
              )}
            >
              &larr;
            </Button>
            <input
              className="grow"
              readOnly
              type="range"
              min="0"
              max={viewParams.hours - 1}
              step="1"
              value={accumOffset}
              onChange={(event) => setAccumOffset(parseInt(event.target.value))}
            />
            <Button
              onClick={() =>
                setAccumOffset((accumOffset: number) =>
                  Math.min(accumOffset + 1, viewParams.hours - 1)
                )
              }
              className={clsx(
                buttonClasses({ size: 'xs', color: 'secondary' })
              )}
            >
              &rarr;
            </Button>
          </div>
          <div className="flex items-center">
            <div className="text-center flex-grow text-sm">
              {accumOffset + 1} hour{accumOffset === 0 ? '' : 's'} to{' '}
              {formatDate(addHours(viewParams.from, accumOffset + 1))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-2">Show data for:</h2>

        <div className="grid grid-cols-4 gap-3 mb-2">
          <Link
            href={serializeViewParamsWithHours(viewParams, -24)}
            className={clsx(buttonClasses({ size: 'xs', color: 'secondary' }))}
          >
            24h Earlier
          </Link>

          <Link
            href={serializeViewParamsWithHours(viewParams, -1)}
            className={clsx(buttonClasses({ size: 'xs', color: 'secondary' }))}
          >
            1h Earlier
          </Link>

          <Link
            href={serializeViewParamsWithHours(viewParams, 1)}
            className={buttonClasses({
              disabled: viewParams.canShow1HrLater,
              size: 'xs',
              color: 'secondary',
            })}
          >
            1h Later
          </Link>

          <Link
            href={serializeViewParamsWithHours(viewParams, 24)}
            className={buttonClasses({
              disabled: viewParams.canShow24HrLater,
              size: 'xs',
              color: 'secondary',
            })}
          >
            24h Later
          </Link>
        </div>
        <div className="grid">
          <Link
            href={serializeViewParams({
              ...viewParams,
              to: null,
            })}
            className={buttonClasses({
              size: 'xs',
              color: 'secondary',
            })}
          >
            Latest Time
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          onClick={() => resetMapView()}
          className={buttonClasses({
            size: 'xs',
            color: 'secondary',
          })}
        >
          Reset Map Location
        </Button>
      </div>
    </>
  );
}
